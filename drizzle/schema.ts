import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with roles for customer, restaurant, delivery, and admin.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["customer", "restaurant", "delivery", "admin"]).default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Password Credentials table (for email/password login)
 */
export const passwordCredentials = mysqlTable("passwordCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PasswordCredential = typeof passwordCredentials.$inferSelect;
export type InsertPasswordCredential = typeof passwordCredentials.$inferInsert;

/**
 * Login History table (for tracking login attempts)
 */
export const loginHistory = mysqlTable("loginHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }).notNull(),
  success: boolean("success").default(false).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoginHistoryRecord = typeof loginHistory.$inferSelect;
export type InsertLoginHistoryRecord = typeof loginHistory.$inferInsert;

/**
 * Sessions table (for managing user sessions)
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 512 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Password Reset Tokens table (for password recovery)
 */
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Restaurants table
 */
export const restaurants = mysqlTable("restaurants", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Reference to users table (restaurant owner)
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zipCode: varchar("zipCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  image: text("image"), // URL to restaurant image
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["active", "inactive", "closed"]).default("active").notNull(),
  isOpen: boolean("isOpen").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

/**
 * Categories table (food types)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: text("icon"), // URL or emoji
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Restaurant Categories (many-to-many)
 */
export const restaurantCategories = mysqlTable("restaurantCategories", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  categoryId: int("categoryId").notNull(),
});

export type RestaurantCategory = typeof restaurantCategories.$inferSelect;
export type InsertRestaurantCategory = typeof restaurantCategories.$inferInsert;

/**
 * Products (menu items)
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"), // URL to product image
  category: varchar("category", { length: 100 }),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  restaurantId: int("restaurantId").notNull(),
  deliveryId: int("deliveryId"), // Assigned delivery person
  status: mysqlEnum("status", ["pending", "confirmed", "preparing", "ready", "on_delivery", "delivered", "cancelled"]).default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  commission: decimal("commission", { precision: 10, scale: 2 }).default("10"), // R$10 platform commission
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  restaurantReceives: decimal("restaurantReceives", { precision: 10, scale: 2 }).notNull(), // total - commission
  paymentMethod: mysqlEnum("paymentMethod", ["pix", "credit_card", "debit_card"]).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "confirmed", "failed", "refunded"]).default("pending").notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  customerNotes: text("customerNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order Items (products in an order)
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Payments table (tracks all payment transactions)
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["pix", "credit_card", "debit_card"]).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "failed", "refunded"]).default("pending").notNull(),
  pixKey: varchar("pixKey", { length: 255 }), // For Pix payments
  externalId: varchar("externalId", { length: 255 }), // NBPay transaction ID
  webhookData: json("webhookData"), // Store webhook response from NBPay
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Commissions table (tracks platform commissions per order)
 */
export const commissions = mysqlTable("commissions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  restaurantId: int("restaurantId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // R$10 per order
  status: mysqlEnum("status", ["pending", "paid", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

/**
 * Payouts table (tracks payments to restaurants)
 */
export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  pixKey: varchar("pixKey", { length: 255 }), // Restaurant's Pix key
  externalId: varchar("externalId", { length: 255 }), // NBPay payout ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  notes: text("notes"),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;

/**
 * Coupons table
 */
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  maxUses: int("maxUses"),
  currentUses: int("currentUses").default(0),
  expiresAt: timestamp("expiresAt"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

/**
 * Ratings table
 */
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  customerId: int("customerId").notNull(),
  restaurantId: int("restaurantId").notNull(),
  deliveryId: int("deliveryId"),
  restaurantRating: int("restaurantRating"), // 1-5
  deliveryRating: int("deliveryRating"), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

/**
 * Delivery assignments table
 */
export const deliveryAssignments = mysqlTable("deliveryAssignments", {
  id: int("id").autoincrement().primaryKey(),
  deliveryId: int("deliveryId").notNull(),
  orderId: int("orderId").notNull(),
  status: mysqlEnum("status", ["accepted", "in_transit", "delivered", "cancelled"]).default("accepted").notNull(),
  pickupTime: timestamp("pickupTime"),
  deliveryTime: timestamp("deliveryTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DeliveryAssignment = typeof deliveryAssignments.$inferSelect;
export type InsertDeliveryAssignment = typeof deliveryAssignments.$inferInsert;
