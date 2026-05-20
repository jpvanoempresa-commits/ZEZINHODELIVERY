import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { generatePixQRCode, checkPixPaymentStatus } from "./nbpay";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ RESTAURANTS ============
  restaurants: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        phone: z.string().min(1),
        email: z.string().email(),
        address: z.string().min(1),
        city: z.string().min(1),
        zipCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        image: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'restaurant' && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only restaurants can create restaurants' });
        }
        
        const restaurant = await db.createRestaurant({
          userId: ctx.user.id,
          ...input,
        });
        
        return restaurant;
      }),

    getByCity: publicProcedure
      .input(z.object({ city: z.string() }))
      .query(async ({ input }) => {
        return db.getRestaurantsByCity(input.city);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getRestaurantById(input.id);
      }),

    getByUserId: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getRestaurantByUserId(ctx.user.id);
      }),
  }),

  // ============ PRODUCTS ============
  products: router({
    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        image: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify restaurant ownership
        const restaurant = await db.getRestaurantById(input.restaurantId);
        if (!restaurant || restaurant.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this restaurant' });
        }

        return db.createProduct({
          restaurantId: input.restaurantId,
          name: input.name,
          description: input.description,
          price: input.price,
          image: input.image,
          category: input.category,
        });
      }),

    getByRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getProductsByRestaurant(input.restaurantId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProductById(input.id);
      }),
  }),

  // ============ ORDERS ============
  orders: router({
    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })),
        deliveryAddress: z.string().min(1),
        customerNotes: z.string().optional(),
        paymentMethod: z.enum(['pix', 'credit_card', 'debit_card']),
        couponCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Calculate order total
        let subtotal = 0;
        const orderItems = [];

        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: `Product ${item.productId} not found` });
          }

          const itemSubtotal = parseFloat(product.price) * item.quantity;
          subtotal += itemSubtotal;
          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            subtotal: itemSubtotal.toFixed(2),
          });
        }

        // Apply coupon if provided
        let discount = 0;
        if (input.couponCode) {
          const coupon = await db.getCouponByCode(input.couponCode);
          if (coupon && coupon.active) {
            if (coupon.discountType === 'percentage') {
              discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
            } else {
              discount = parseFloat(coupon.discountValue);
            }
          }
        }

        // Fixed R$10 commission
        const commission = 10;
        const deliveryFee = 5; // Fixed delivery fee
        const total = subtotal + deliveryFee - discount;
        const restaurantReceives = total - commission;

        // Create order
        const orderResult = await db.createOrder({
          customerId: ctx.user.id,
          restaurantId: input.restaurantId,
          subtotal: subtotal.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          discount: discount.toFixed(2),
          commission: commission.toFixed(2),
          total: total.toFixed(2),
          restaurantReceives: restaurantReceives.toFixed(2),
          paymentMethod: input.paymentMethod,
          deliveryAddress: input.deliveryAddress,
          customerNotes: input.customerNotes,
        });

        // Get the created order ID
        const orderId = (orderResult as any).insertId;

        // Create order items
        for (const item of orderItems) {
          await db.createOrderItem({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          });
        }

        // Create payment record
        await db.createPayment({
          orderId,
          amount: total.toFixed(2),
          method: input.paymentMethod,
        });

        // Create commission record
        await db.createCommission({
          orderId,
          restaurantId: input.restaurantId,
          amount: commission.toFixed(2),
        });

        return { orderId, total: total.toFixed(2), commission: commission.toFixed(2) };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getOrderById(input.id);
      }),

    getByCustomer: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getOrdersByCustomer(ctx.user.id);
      }),

    getByRestaurant: protectedProcedure
      .query(async ({ ctx }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        return db.getOrdersByRestaurant(restaurant.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'on_delivery', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant || restaurant.id !== order.restaurantId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this order' });
        }

        return db.updateOrderStatus(input.orderId, input.status);
      }),
  }),

  // ============ PAYMENTS ============
  payments: router({
    getByOrder: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return db.getPaymentByOrderId(input.orderId);
      }),

    generatePixQRCode: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        amount: z.number().positive(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const qrCodeData = await generatePixQRCode(
            input.amount,
            input.orderId,
            input.description || `Pedido #${input.orderId}`
          );
          
          await db.createPayment({
            orderId: input.orderId,
            amount: input.amount.toString(),
            method: 'pix',
            externalId: qrCodeData.transactionId,
            pixKey: qrCodeData.qrCode,
          });
          
          return qrCodeData;
        } catch (error: any) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
      }),

    checkPixStatus: protectedProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await checkPixPaymentStatus(input.transactionId);
        } catch (error: any) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
      }),

    confirmPayment: protectedProcedure
      .input(z.object({
        paymentId: z.number(),
        webhookData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updatePaymentStatus(input.paymentId, 'confirmed', input.webhookData);
      }),
  }),

  // ============ COMMISSIONS ============
  commissions: router({
    getByRestaurant: protectedProcedure
      .query(async ({ ctx }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        return db.getCommissionsByRestaurant(restaurant.id);
      }),

    getTotal: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view total commissions' });
        }
        return db.getTotalCommissions();
      }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    getAll: publicProcedure
      .query(async () => {
        return db.getAllCategories();
      }),
  }),

  // ============ DELIVERIES ============
  deliveries: router({
    getAvailable: publicProcedure.query(async () => db.getAvailableDeliveries()),
    getActive: protectedProcedure.query(async ({ ctx }) => db.getActiveDeliveries(ctx.user.id)),
    getCompleted: protectedProcedure.query(async ({ ctx }) => db.getCompletedDeliveries(ctx.user.id)),
  }),

  // ============ ADMIN ============
  admin: router({
    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getAllOrders();
    }),
    getAllCommissions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getAllCommissions();
    }),
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getAllUsers();
    }),
    getAllRestaurants: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getAllRestaurants();
    }),
  }),

  // ============ RATINGS ============
  ratings: router({
    create: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        restaurantId: z.number(),
        deliveryId: z.number().optional(),
        restaurantRating: z.number().min(1).max(5).optional(),
        deliveryRating: z.number().min(1).max(5).optional(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order || order.customerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You did not place this order' });
        }

        return db.createRating({
          orderId: input.orderId,
          customerId: ctx.user.id,
          restaurantId: input.restaurantId,
          deliveryId: input.deliveryId,
          restaurantRating: input.restaurantRating,
          deliveryRating: input.deliveryRating,
          comment: input.comment,
        });
      }),

    getByRestaurant: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        return db.getRatingsByRestaurant(input.restaurantId);
      }),
  }),

  // ============ PAYOUTS (SAQUES) ============
  payouts: router({
    requestWithdrawal: protectedProcedure
      .input(z.object({
        amount: z.number().positive(),
        bankAccount: z.string().min(1),
        bankCode: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'restaurant') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only restaurants can request withdrawals' });
        }
        
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        
        return db.createPayout({
          restaurantId: restaurant.id,
          amount: input.amount.toString(),
          status: 'pending',
          bankAccount: input.bankAccount,
          bankCode: input.bankCode,
        });
      }),

    getMyPayouts: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'restaurant') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only restaurants can view payouts' });
        }
        
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        
        return db.getPayoutsByRestaurant(restaurant.id);
      }),

    getAllPayouts: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view all payouts' });
        }
        return db.getAllPayouts();
      }),

    approvePayout: protectedProcedure
      .input(z.object({ payoutId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can approve payouts' });
        }
        
        return db.updatePayoutStatus(input.payoutId, 'approved');
      }),

    completePayout: protectedProcedure
      .input(z.object({ payoutId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can complete payouts' });
        }
        
        return db.updatePayoutStatus(input.payoutId, 'completed');
      }),
  }),
});

export type AppRouter = typeof appRouter;
