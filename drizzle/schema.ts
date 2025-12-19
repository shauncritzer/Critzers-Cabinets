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
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Quotes table - stores all cabinet quote requests
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