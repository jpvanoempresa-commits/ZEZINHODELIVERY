import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, restaurants, products, orders, orderItems, 
  payments, commissions, payouts, categories, restaurantCategories, 
  coupons, ratings, deliveryAssignments, balances 
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
  
  const result = await db.insert(restaurants).values({
    userId: data.userId,
    name: data.name,
    description: data.description || null,
    phone: data.phone,
    email: data.email,
    address: data.address,
    city: data.city,
    zipCode: data.zipCode || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    image: data.image || null,
  });
  
  return result;
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return result[0] || null;
}

export async function getRestaurantsByCity(city: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(restaurants).where(eq(restaurants.city, city)).limit(50);
}

export async function getRestaurantByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurants).where(eq(restaurants.userId, userId)).limit(1);
  return result[0] || null;
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
  
  return db.insert(products).values({
    restaurantId: data.restaurantId,
    name: data.name,
    description: data.description || null,
    price: data.price,
    image: data.image || null,
    category: data.category || null,
  });
}

export async function getProductsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.restaurantId, restaurantId)).limit(100);
}

// ============ ORDERS ============
export async function createOrder(data: {
  userId: number;
  restaurantId: number;
  items: Array<{ productId: number; quantity: number; price: string }>;
  total: string;
  deliveryAddress: string;
  status: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values({
    customerId: data.userId,
    restaurantId: data.restaurantId,
    subtotal: data.total,
    total: data.total,
    restaurantReceives: data.total,
    deliveryAddress: data.deliveryAddress,
    paymentMethod: 'pix',
    status: data.status as any,
  });
  
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0] || null;
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.customerId, userId)).orderBy(desc(orders.createdAt)).limit(50);
}

export async function getOrdersByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt));
}

// ============ PAYMENTS ============
export async function createPayment(data: {
  orderId: number;
  amount: string;
  method: string;
  pixKey?: string;
  externalId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(payments).values({
    orderId: data.orderId,
    amount: data.amount,
    method: data.method as any,
    pixKey: data.pixKey || null,
    externalId: data.externalId || null,
  });
}

export async function getPaymentById(paymentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  return result[0] || null;
}

// ============ COMMISSIONS ============
export async function createCommission(data: {
  orderId: number;
  restaurantId: number;
  amount: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(commissions).values({
    orderId: data.orderId,
    restaurantId: data.restaurantId,
    amount: data.amount,
  });
}

// ============ PAYOUTS ============
export async function createPayout(data: {
  restaurantId: number;
  amount: string;
  status: string;
  pixKey?: string;
  externalId?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(payouts).values({
    restaurantId: data.restaurantId,
    amount: data.amount,
    status: data.status as any,
    pixKey: data.pixKey || null,
    externalId: data.externalId || null,
    notes: data.notes || null,
  });
}

export async function getPayoutsByRestaurant(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payouts).where(eq(payouts.restaurantId, restaurantId)).orderBy(desc(payouts.createdAt));
}

export async function getAllPayouts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(payouts).orderBy(desc(payouts.createdAt)).limit(100);
}

export async function updatePayoutStatus(payoutId: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  return db.update(payouts).set({ status: status as any }).where(eq(payouts.id, payoutId));
}

// ============ ADMIN ============
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

// ============ BALANCES ============
export async function getBalance(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(balances).where(eq(balances.userId, userId)).limit(1);
  return result.length > 0 ? parseFloat(result[0].amount.toString()) : 0;
}

export async function updateBalance(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await db.select().from(balances).where(eq(balances.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return db.update(balances)
      .set({ amount: amount.toString() })
      .where(eq(balances.userId, userId));
  } else {
    return db.insert(balances).values({
      userId,
      amount: amount.toString(),
    });
  }
}

export async function addBalance(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return null;
  
  const current = await getBalance(userId);
  return updateBalance(userId, current + amount);
}

export async function updateRestaurantBalance(restaurantId: number, amount: number) {
  const db = await getDb();
  if (!db) return null;
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) return null;
  return updateBalance(restaurant.userId, amount);
}

export async function getRestaurantBalance(restaurantId: number) {
  const db = await getDb();
  if (!db) return 0;
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) return 0;
  return getBalance(restaurant.userId);
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(data: {
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: 'customer' | 'restaurant' | 'delivery';
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(users).values({
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    openId: `email_${data.email}_${Date.now()}`,
    loginMethod: 'email',
    lastSignedIn: new Date(),
  });

  return result;
}
