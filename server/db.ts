import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, restaurants, products, orders, orderItems, 
  payments, commissions, payouts, categories, restaurantCategories, 
  coupons, ratings, deliveryAssignments 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ RESTAURANTS ============
export async function createRestaurant(data: {
  userId: number;
  name: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
  image?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(restaurants).values(data);
  return result;
}

export async function getRestaurantsByCity(city: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(restaurants)
    .where(and(eq(restaurants.city, city), eq(restaurants.status, 'active')));
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(restaurants)
    .where(eq(restaurants.id, id));
  return result[0];
}

export async function getRestaurantByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(restaurants)
    .where(eq(restaurants.userId, userId));
  return result[0];
}

// ============ PRODUCTS ============
export async function createProduct(data: {
  restaurantId: number;
  name: string;
  description?: string;
  price: string;
  image?: string;
  category?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(products).values(data);
}

export async function getProductsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(products)
    .where(eq(products.restaurantId, restaurantId));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(products)
    .where(eq(products.id, id));
  return result[0];
}

// ============ ORDERS ============
export async function createOrder(data: {
  customerId: number;
  restaurantId: number;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  commission: string;
  total: string;
  restaurantReceives: string;
  paymentMethod: 'pix' | 'credit_card' | 'debit_card';
  deliveryAddress: string;
  customerNotes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orders).values(data);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(orders)
    .where(eq(orders.id, id));
  return result[0];
}

export async function getOrdersByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrdersByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_delivery' | 'delivered' | 'cancelled') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));
}

export async function updateOrderPaymentStatus(orderId: number, paymentStatus: 'pending' | 'confirmed' | 'failed' | 'refunded') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(orders)
    .set({ paymentStatus })
    .where(eq(orders.id, orderId));
}

// ============ ORDER ITEMS ============
export async function createOrderItem(data: {
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  subtotal: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orderItems).values(data);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

// ============ PAYMENTS ============
export async function createPayment(data: {
  orderId: number;
  amount: string;
  method: 'pix' | 'credit_card' | 'debit_card';
  pixKey?: string;
  externalId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(payments).values(data);
}

export async function getPaymentByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(payments)
    .where(eq(payments.orderId, orderId));
  return result[0];
}

export async function updatePaymentStatus(paymentId: number, status: 'pending' | 'confirmed' | 'failed' | 'refunded', webhookData?: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    status,
    confirmedAt: status === 'confirmed' ? new Date() : undefined,
  };
  
  if (webhookData) {
    updateData.webhookData = webhookData;
  }
  
  return db.update(payments)
    .set(updateData)
    .where(eq(payments.id, paymentId));
}

// ============ COMMISSIONS ============
export async function createCommission(data: {
  orderId: number;
  restaurantId: number;
  amount: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(commissions).values(data);
}

export async function getCommissionsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(commissions)
    .where(eq(commissions.restaurantId, restaurantId))
    .orderBy(desc(commissions.createdAt));
}

export async function getTotalCommissions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({
    total: sql`SUM(amount)`,
  }).from(commissions)
    .where(eq(commissions.status, 'pending'));
  
  return result[0]?.total || 0;
}

// ============ PAYOUTS ============
export async function createPayout(data: {
  restaurantId: number;
  amount: string;
  status: string;
  bankAccount: string;
  bankCode: string;
  pixKey?: string;
  externalId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(payouts).values(data);
}

export async function getAllPayouts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(payouts)
    .orderBy(desc(payouts.createdAt));
}

export async function getPayoutsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(payouts)
    .where(eq(payouts.restaurantId, restaurantId))
    .orderBy(desc(payouts.createdAt));
}

export async function updatePayoutStatus(payoutId: number, status: 'pending' | 'processing' | 'completed' | 'failed') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    status,
    completedAt: status === 'completed' ? new Date() : undefined,
  };
  
  return db.update(payouts)
    .set(updateData)
    .where(eq(payouts.id, payoutId));
}

// ============ CATEGORIES ============
export async function getAllCategories() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(categories);
}

// ============ COUPONS ============
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(coupons)
    .where(eq(coupons.code, code));
  return result[0];
}

// ============ RATINGS ============
export async function createRating(data: {
  orderId: number;
  customerId: number;
  restaurantId: number;
  deliveryId?: number;
  restaurantRating?: number;
  deliveryRating?: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(ratings).values(data);
}

export async function getRatingsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(ratings)
    .where(eq(ratings.restaurantId, restaurantId))
    .orderBy(desc(ratings.createdAt));
}

// ============ DELIVERY ASSIGNMENTS ============
export async function createDeliveryAssignment(data: {
  deliveryId: number;
  orderId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(deliveryAssignments).values(data);
}

export async function getDeliveryAssignmentsByDelivery(deliveryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(deliveryAssignments)
    .where(eq(deliveryAssignments.deliveryId, deliveryId))
    .orderBy(desc(deliveryAssignments.createdAt));
}

export async function updateDeliveryAssignmentStatus(assignmentId: number, status: 'accepted' | 'in_transit' | 'delivered' | 'cancelled') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    status,
    deliveryTime: status === 'delivered' ? new Date() : undefined,
  };
  
  return db.update(deliveryAssignments)
    .set(updateData)
    .where(eq(deliveryAssignments.id, assignmentId));
}

// ============ NBPAY VALIDATION ============
export async function validateNBPayCredentials(): Promise<boolean> {
  const apiKey = process.env.NBPAY_API_KEY;
  const secretKey = process.env.NBPAY_SECRET_KEY;
  
  if (!apiKey || !secretKey) {
    console.error('[NBPay] Missing API credentials');
    return false;
  }
  
  // Validate format
  if (!apiKey.startsWith('nxp_')) {
    console.error('[NBPay] Invalid API key format');
    return false;
  }
  
  if (secretKey.length < 10) {
    console.error('[NBPay] Invalid secret key format');
    return false;
  }
  
  console.log('[NBPay] Credentials validated successfully');
  return true;
}

// ============ DELIVERIES - HELPERS ============
export async function getAvailableDeliveries() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(deliveryAssignments)
    .where(eq(deliveryAssignments.status, 'pending'))
    .limit(20);
}

export async function getActiveDeliveries(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(deliveryAssignments)
    .where(eq(deliveryAssignments.status, 'active'))
    .limit(10);
}

export async function getCompletedDeliveries(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(deliveryAssignments)
    .where(eq(deliveryAssignments.status, 'completed'))
    .orderBy(desc(deliveryAssignments.updatedAt))
    .limit(50);
}

// ============ ADMIN - HELPERS ============
export async function getAllOrders() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(100);
}

export async function getAllCommissions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(commissions)
    .orderBy(desc(commissions.createdAt))
    .limit(100);
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users)
    .orderBy(desc(users.createdAt))
    .limit(100);
}

export async function getAllRestaurants() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(restaurants)
    .orderBy(desc(restaurants.createdAt))
    .limit(100);
}

export async function updatePayout(payoutId: number, data: { status?: string; transactionId?: string }) {
  const db = await getDb();
  if (!db) return null;
  
  const updates: any = {};
  if (data.status) updates.status = data.status;
  if (data.transactionId) updates.transactionId = data.transactionId;
  updates.updatedAt = new Date();
  
  return db.update(payouts).set(updates).where(eq(payouts.id, payoutId));
}

export async function updateRestaurantBalance(restaurantId: number, amount: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(restaurants)
    .set({ balance: (restaurants.balance as any).add(amount) })
    .where(eq(restaurants.id, restaurantId));
}
