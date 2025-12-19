import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
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

import { quotes, projects, gallery, pricingFormulas, customerUploads, InsertQuote, InsertProject, InsertGalleryItem, InsertPricingFormula, InsertCustomerUpload } from "../drizzle/schema";
import { desc, and } from "drizzle-orm";

// ============================================
// QUOTES
// ============================================

export async function createQuote(quote: InsertQuote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(quotes).values(quote);
  return result[0].insertId;
}

export async function getQuoteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  return result[0];
}

export async function getQuotesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quotes).where(eq(quotes.userId, userId)).orderBy(desc(quotes.createdAt));
}

export async function getAllQuotes() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quotes).orderBy(desc(quotes.createdAt));
}

export async function updateQuote(id: number, updates: Partial<InsertQuote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(quotes).set(updates).where(eq(quotes.id, id));
}

export async function deleteQuote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(quotes).where(eq(quotes.id, id));
}

// ============================================
// PROJECTS
// ============================================

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values(project);
  return result[0].insertId;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function updateProject(id: number, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(updates).where(eq(projects.id, id));
}

// ============================================
// GALLERY
// ============================================

export async function createGalleryItem(item: InsertGalleryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(gallery).values(item);
  return result[0].insertId;
}

export async function getAllGalleryItems() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(gallery).orderBy(gallery.displayOrder, desc(gallery.createdAt));
}

export async function getFeaturedGalleryItems() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(gallery).where(eq(gallery.featured, 1)).orderBy(gallery.displayOrder);
}

export async function updateGalleryItem(id: number, updates: Partial<InsertGalleryItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(gallery).set(updates).where(eq(gallery.id, id));
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(gallery).where(eq(gallery.id, id));
}

// ============================================
// PRICING FORMULAS
// ============================================

export async function createPricingFormula(formula: InsertPricingFormula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(pricingFormulas).values(formula);
  return result[0].insertId;
}

export async function getAllPricingFormulas() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(pricingFormulas).where(eq(pricingFormulas.active, 1));
}

export async function updatePricingFormula(id: number, updates: Partial<InsertPricingFormula>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(pricingFormulas).set(updates).where(eq(pricingFormulas.id, id));
}

// ============================================
// CUSTOMER UPLOADS
// ============================================

export async function createCustomerUpload(upload: InsertCustomerUpload) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customerUploads).values(upload);
  return result[0].insertId;
}

export async function getUploadsByQuoteId(quoteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(customerUploads).where(eq(customerUploads.quoteId, quoteId)).orderBy(desc(customerUploads.createdAt));
}
