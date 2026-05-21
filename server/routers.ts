import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { generatePixQRCode, checkPixPaymentStatus } from "./nbpay";
import { transferPixNexano, validatePixKey } from "./nexano";

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

    getMyRestaurant: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getRestaurantByUserId(ctx.user.id);
      }),

    getBalance: protectedProcedure
      .query(async ({ ctx }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        const balance = await db.getRestaurantBalance(restaurant.id);
        return { balance: balance || 0 };
      }),

    getMyOrders: protectedProcedure
      .query(async ({ ctx }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }
        return db.getOrdersByRestaurant(restaurant.id);
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
  }),

  // ============ ORDERS ============
  orders: router({
    create: protectedProcedure
      .input(z.object({
        restaurantId: z.number(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.string(),
        })),
        total: z.string(),
        deliveryAddress: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createOrder({
        userId: ctx.user.id,
          
          restaurantId: input.restaurantId,
          items: input.items,
          total: input.total,
          deliveryAddress: input.deliveryAddress,
        status: 'pending',
          
        });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getOrderById(input.id);
      }),

    getMyOrders: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getOrdersByUserId(ctx.user.id);
      }),
  }),

  // ============ PAYMENTS ============
  payments: router({
    generatePixQRCode: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const qrCode = 'test-qr-code'; // TODO: Implement real QR code generation
        
        await db.createPayment({
          orderId: input.orderId,
          
          amount: input.amount,
          method: 'pix',
          
          
        });

        return { qrCode };
      }),

    checkPixStatus: protectedProcedure
      .input(z.object({ paymentId: z.number() }))
      .query(async ({ input }) => {
        const payment = await db.getPaymentById(input.paymentId);
        if (!payment) throw new TRPCError({ code: 'NOT_FOUND' });
        
        const status = await checkPixPaymentStatus(qrCode);
        return { status };
      }),
  }),

  // ============ PAYOUTS (SAQUES) ============
  payouts: router({
    requestWithdrawal: protectedProcedure
      .input(z.object({
        amount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const restaurant = await db.getRestaurantByUserId(ctx.user.id);
        if (!restaurant) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
        }

        const balance = await db.getRestaurantBalance(restaurant.id);
        if (balance < input.amount) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' });
        }

        const payout = await db.createPayout({
          restaurantId: restaurant.id,
          amount: input.amount.toString(),
          
          status: 'pending', bankAccount: '', bankCode: '', pixKey: '',
        });

        return payout;
      }),

    getMyPayouts: protectedProcedure
      .query(async ({ ctx }) => {
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
        
        return db.updatePayoutStatus(input.payoutId, 'processing');
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

  // ============ ADMIN ============
  admin: router({
    getAllOrders: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view all orders' });
        }
        return db.getAllOrders();
      }),

    getAllCommissions: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view commissions' });
        }
        return db.getAllCommissions();
      }),

    getAllUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view users' });
        }
        return db.getAllUsers();
      }),

    getAllRestaurants: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view restaurants' });
        }
        return db.getAllRestaurants();
      }),
  }),
});

export type AppRouter = typeof appRouter;
