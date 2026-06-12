import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for hardware store (Top Knobs catalog)
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  collection: varchar("collection", { length: 255 }),
  finish: varchar("finish", { length: 255 }),
  category: varchar("category", { length: 100 }),
  listPrice: varchar("list_price", { length: 20 }),
  dealerPrice: varchar("dealer_price", { length: 20 }),
  retailPrice: varchar("retail_price", { length: 20 }),
  dimensions: text("dimensions"),
  weight: varchar("weight", { length: 50 }),
  upc: varchar("upc", { length: 50 }),
  imageUrl: text("image_url"),
  inStock: mysqlEnum("in_stock", ["yes", "no", "unknown"]).default("unknown"),
  featured: mysqlEnum("featured", ["yes", "no"]).default("no"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Shopping cart items
 */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  productId: int("product_id").notNull().references(() => products.id),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 320 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: text("shipping_address"),
  shippingCity: varchar("shipping_city", { length: 100 }),
  shippingState: varchar("shipping_state", { length: 50 }),
  shippingZip: varchar("shipping_zip", { length: 20 }),
  shippingMethod: varchar("shipping_method", { length: 100 }),
  subtotal: varchar("subtotal", { length: 20 }),
  shipping: varchar("shipping", { length: 20 }),
  tax: varchar("tax", { length: 20 }),
  total: varchar("total", { length: 20 }),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid", "failed", "refunded"]).default("pending"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("order_id").notNull().references(() => orders.id),
  productId: int("product_id").notNull().references(() => products.id),
  sku: varchar("sku", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 500 }).notNull(),
  quantity: int("quantity").notNull(),
  price: varchar("price", { length: 20 }).notNull(),
  subtotal: varchar("subtotal", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Stores all cabinet quote requests
 */
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  
  // Project details
  roomType: varchar("roomType", { length: 100 }), // Kitchen, Bathroom, Office, etc.
  projectDescription: text("projectDescription"),
  
  // Dimensions
  roomLength: varchar("roomLength", { length: 50 }),
  roomWidth: varchar("roomWidth", { length: 50 }),
  roomHeight: varchar("roomHeight", { length: 50 }),
  
  // Cabinet specifications
  cabinetType: varchar("cabinetType", { length: 100 }), // Base, Wall, Tall, Island
  cabinetStyle: varchar("cabinetStyle", { length: 100 }), // Shaker, Modern, Traditional
  woodType: varchar("woodType", { length: 100 }), // Oak, Maple, Cherry, etc.
  finish: varchar("finish", { length: 100 }), // Stain, Paint, Natural
  finishColor: varchar("finishColor", { length: 100 }),
  
  // Hardware
  hardwareStyle: varchar("hardwareStyle", { length: 100 }),
  hardwareFinish: varchar("hardwareFinish", { length: 100 }),
  
  // Pricing
  estimatedCost: varchar("estimatedCost", { length: 50 }),
  materialsCost: varchar("materialsCost", { length: 50 }),
  laborCost: varchar("laborCost", { length: 50 }),
  hardwareCost: varchar("hardwareCost", { length: 50 }),
  
  // Status
  status: mysqlEnum("status", ["draft", "pending", "reviewed", "approved", "declined", "converted"]).default("pending").notNull(),
  
  // CRM Integration
  crmLeadId: varchar("crmLeadId", { length: 255 }),
  sentToCrm: int("sentToCrm").default(0).notNull(), // Boolean: 0 or 1
  
  // Conversation data (JSON)
  conversationData: text("conversationData"), // Stores full AI chat history
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Projects table - tracks active cabinet projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").references(() => quotes.id),
  userId: int("userId").references(() => users.id),
  
  projectName: varchar("projectName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["design", "approved", "ordered", "manufacturing", "delivery", "installation", "completed"]).default("design").notNull(),
  
  // Timeline
  estimatedStartDate: timestamp("estimatedStartDate"),
  estimatedCompletionDate: timestamp("estimatedCompletionDate"),
  actualStartDate: timestamp("actualStartDate"),
  actualCompletionDate: timestamp("actualCompletionDate"),
  
  // Financial
  finalPrice: varchar("finalPrice", { length: 50 }),
  depositPaid: varchar("depositPaid", { length: 50 }),
  balanceDue: varchar("balanceDue", { length: 50 }),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Gallery table - before/after photos of completed projects
 */
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").references(() => projects.id),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Images
  beforeImageUrl: text("beforeImageUrl"),
  afterImageUrl: text("afterImageUrl").notNull(),
  
  // Categorization
  cabinetType: varchar("cabinetType", { length: 100 }),
  style: varchar("style", { length: 100 }),
  roomType: varchar("roomType", { length: 100 }),
  
  featured: int("featured").default(0).notNull(), // Boolean: 0 or 1
  displayOrder: int("displayOrder").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = typeof gallery.$inferInsert;

/**
 * Pricing formulas table - configurable pricing rules
 */
export const pricingFormulas = mysqlTable("pricingFormulas", {
  id: int("id").autoincrement().primaryKey(),
  
  category: varchar("category", { length: 100 }).notNull(), // material, labor, hardware
  itemName: varchar("itemName", { length: 255 }).notNull(),
  basePrice: varchar("basePrice", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 50 }), // per_linear_foot, per_sq_ft, per_unit
  
  active: int("active").default(1).notNull(), // Boolean: 0 or 1
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingFormula = typeof pricingFormulas.$inferSelect;
export type InsertPricingFormula = typeof pricingFormulas.$inferInsert;

/**
 * Customer uploads table - inspiration photos and references
 */
export const customerUploads = mysqlTable("customerUploads", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").references(() => quotes.id),
  userId: int("userId").references(() => users.id),
  
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileType: varchar("fileType", { length: 100 }),
  fileSize: int("fileSize"),
  
  description: text("description"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerUpload = typeof customerUploads.$inferSelect;
export type InsertCustomerUpload = typeof customerUploads.$inferInsert;