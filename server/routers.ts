import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { like, or, and, eq, sql } from "drizzle-orm";
import { products, cartItems, gallery } from "../drizzle/schema";
import { getDb } from "./db";
import {
  createQuote,
  getQuoteById,
  getQuotesByUserId,
  getAllQuotes,
  updateQuote,
  deleteQuote,
  createProject,
  getProjectById,
  getProjectsByUserId,
  getAllProjects,
  updateProject,
  createGalleryItem,
  getAllGalleryItems,
  getFeaturedGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  createPricingFormula,
  getAllPricingFormulas,
  updatePricingFormula,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  // Quote management
  quotes: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        roomType: z.string().optional(),
        projectDescription: z.string().optional(),
        conversationData: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const quoteId = await createQuote({
          ...input,
          userId: ctx.user?.id,
        });
        return { quoteId };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getQuoteById(input.id);
      }),
    
    getMyQuotes: protectedProcedure
      .query(async ({ ctx }) => {
        return await getQuotesByUserId(ctx.user.id);
      }),
    
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        // Only admins can see all quotes
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await getAllQuotes();
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        updates: z.object({
          status: z.enum(["draft", "pending", "reviewed", "approved", "declined", "converted"]).optional(),
          estimatedCost: z.string().optional(),
          materialsCost: z.string().optional(),
          laborCost: z.string().optional(),
          hardwareCost: z.string().optional(),
          crmLeadId: z.string().optional(),
          sentToCrm: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await updateQuote(input.id, input.updates);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await deleteQuote(input.id);
        return { success: true };
      }),
  }),
  
  // AI Chat consultation
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        })),
        quoteId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a helpful cabinet consultation assistant for Critzer's Cabinet Creations, a family-owned business with 40 years of experience. Your role is to:

1. Ask friendly, conversational questions to understand the customer's cabinet project
2. Gather key information: room type, dimensions, cabinet style preferences, wood types, finishes, hardware
3. Provide helpful suggestions based on their needs
4. Explain different options (wood types, finishes, cabinet styles) in simple terms
5. Build excitement about their project
6. Capture their contact information naturally in conversation

Be warm, professional, and knowledgeable. Ask one question at a time. Keep responses concise and conversational.

When you have enough information, summarize what you've learned and offer to generate a preliminary quote.`,
            },
            ...input.messages,
          ],
        });
        
        const assistantMessage = response.choices[0]?.message.content || "I apologize, I'm having trouble responding. Please try again.";
        
        // If quoteId provided, update conversation data
        if (input.quoteId) {
          const quote = await getQuoteById(input.quoteId);
          if (quote) {
            const conversationData = JSON.parse(quote.conversationData || '[]');
            conversationData.push(...input.messages, {
              role: "assistant",
              content: assistantMessage,
            });
            await updateQuote(input.quoteId, {
              conversationData: JSON.stringify(conversationData),
            });
          }
        }
        
        return { message: assistantMessage };
      }),
  }),
  
  // Project management
  projects: router({
    create: protectedProcedure
      .input(z.object({
        quoteId: z.number().optional(),
        projectName: z.string(),
        status: z.enum(["design", "approved", "ordered", "manufacturing", "delivery", "installation", "completed"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const projectId = await createProject({
          ...input,
          userId: ctx.user.id,
        });
        return { projectId };
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProjectById(input.id);
      }),
    
    getMyProjects: protectedProcedure
      .query(async ({ ctx }) => {
        return await getProjectsByUserId(ctx.user.id);
      }),
    
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await getAllProjects();
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        updates: z.object({
          status: z.enum(["design", "approved", "ordered", "manufacturing", "delivery", "installation", "completed"]).optional(),
          projectName: z.string().optional(),
          finalPrice: z.string().optional(),
          depositPaid: z.string().optional(),
          balanceDue: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await updateProject(input.id, input.updates);
        return { success: true };
      }),
  }),
  
  // Gallery management
  gallery: router({
    getAll: publicProcedure
      .query(async () => {
        return await getAllGalleryItems();
      }),
    
    getFeatured: publicProcedure
      .query(async () => {
        return await getFeaturedGalleryItems();
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        beforeImageUrl: z.string().optional(),
        afterImageUrl: z.string(),
        cabinetType: z.string().optional(),
        style: z.string().optional(),
        roomType: z.string().optional(),
        featured: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const itemId = await createGalleryItem(input);
        return { itemId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        updates: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          featured: z.number().optional(),
          displayOrder: z.number().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await updateGalleryItem(input.id, input.updates);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await deleteGalleryItem(input.id);
        return { success: true };
      }),
  }),
  
  // Pricing formulas
  pricing: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await getAllPricingFormulas();
      }),
    
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        itemName: z.string(),
        basePrice: z.string(),
        unit: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const formulaId = await createPricingFormula(input);
        return { formulaId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        updates: z.object({
          basePrice: z.string().optional(),
          active: z.number().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await updatePricingFormula(input.id, input.updates);
        return { success: true };
      }),
  }),
  
  // Shop/Hardware Store
  shop: router({
    getProducts: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        finish: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { products: [], total: 0 };

        const conditions = [];
        
        if (input.search) {
          conditions.push(
            or(
              like(products.name, `%${input.search}%`),
              like(products.sku, `%${input.search}%`),
              like(products.description, `%${input.search}%`)
            )
          );
        }
        
        if (input.category) {
          conditions.push(eq(products.category, input.category));
        }
        
        if (input.finish) {
          conditions.push(eq(products.finish, input.finish));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        
        const [productsList, countResult] = await Promise.all([
          db.select().from(products)
            .where(whereClause)
            .limit(input.limit)
            .offset(input.offset),
          db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause)
        ]);

        return {
          products: productsList,
          total: countResult[0]?.count || 0,
        };
      }),
  }),

  // Shopping cart
  cart: router({
    addToCart: publicProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        const userId = ctx.user?.id;
        const sessionId = input.sessionId || `guest_${Date.now()}`;

        // Check if item already in cart
        const existing = await db.select().from(cartItems)
          .where(
            and(
              eq(cartItems.productId, input.productId),
              userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Update quantity
          await db.update(cartItems)
            .set({ quantity: existing[0].quantity + input.quantity })
            .where(eq(cartItems.id, existing[0].id));
          return { success: true, action: 'updated' };
        } else {
          // Add new item
          await db.insert(cartItems).values({
            productId: input.productId,
            quantity: input.quantity,
            userId: userId || null,
            sessionId: userId ? null : sessionId,
          });
          return { success: true, action: 'added' };
        }
      }),

    getCart: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };

        const userId = ctx.user?.id;
        const sessionId = input.sessionId;

        const items = await db.select({
          id: cartItems.id,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          productName: products.name,
          productSku: products.sku,
          retailPrice: products.retailPrice,
          imageUrl: products.imageUrl,
        })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .where(
            userId 
              ? eq(cartItems.userId, userId)
              : sessionId
                ? eq(cartItems.sessionId, sessionId)
                : sql`1=0`
          );

        const total = items.reduce((sum, item) => {
          const price = parseFloat(item.retailPrice || '0');
          return sum + (price * item.quantity);
        }, 0);

        return { items, total, count: items.length };
      }),

    updateQuantity: publicProcedure
      .input(z.object({
        cartItemId: z.number(),
        quantity: z.number().min(0),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        if (input.quantity === 0) {
          await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
          return { success: true, action: 'removed' };
        } else {
          await db.update(cartItems)
            .set({ quantity: input.quantity })
            .where(eq(cartItems.id, input.cartItemId));
          return { success: true, action: 'updated' };
        }
      }),

    removeItem: publicProcedure
      .input(z.object({
        cartItemId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
        return { success: true };
      }),

    clearCart: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        const userId = ctx.user?.id;
        const sessionId = input.sessionId;

        await db.delete(cartItems).where(
          userId
            ? eq(cartItems.userId, userId)
            : sessionId
              ? eq(cartItems.sessionId, sessionId)
              : sql`1=0`
        );

        return { success: true };
      }),
  }),

  // Admin tools
  admin: router({
    uploadProductImage: protectedProcedure
      .input(z.object({
        sku: z.string(),
        imageData: z.string(), // base64 encoded image
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        // Find product by SKU
        const product = await db.select()
          .from(products)
          .where(eq(products.sku, input.sku))
          .limit(1);

        if (product.length === 0) {
          return {
            success: false,
            matched: false,
            message: `No product found with SKU: ${input.sku}`,
          };
        }

        try {
          // Convert base64 to buffer
          const buffer = Buffer.from(input.imageData, 'base64');
          
          // Upload to S3
          const { storagePut } = await import('./storage');
          const fileExtension = input.mimeType.split('/')[1] || 'jpg';
          const fileKey = `products/${input.sku.toLowerCase()}.${fileExtension}`;
          
          const { url } = await storagePut(
            fileKey,
            buffer,
            input.mimeType
          );

          // Update product with image URL
          await db.update(products)
            .set({ imageUrl: url })
            .where(eq(products.id, product[0].id));

          return {
            success: true,
            matched: true,
            message: `Image uploaded for ${product[0].name}`,
            url,
          };
        } catch (error) {
          return {
            success: false,
            matched: true,
            message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          };
        }
      }),

    importProducts: protectedProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        // Import products from the Excel file
        const fs = await import('fs/promises');
        const path = await import('path');
        const xlsx = await import('xlsx');

        const filePath = path.join(process.cwd(), 'TopKnobsJanuary2026PriceList.xlsx');
        const fileBuffer = await fs.readFile(filePath);
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(worksheet);

        let imported = 0;
        for (const row of data) {
          try {
            await db.insert(products).values({
              sku: row['Item Number'] || '',
              name: row['Item Description'] || '',
              collection: row['Collection'] || null,
              finish: row['Finish'] || null,
              retailPrice: row['Retail Price'] || null,
              category: 'Hardware',
            });
            imported++;
          } catch (error) {
            // Skip duplicates
          }
        }

        return { count: imported };
      }),

    importGallery: protectedProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        const galleryData = [
          {
            title: 'Cherry Bathroom Vanity',
            description: 'Traditional cherry vanity with elegant details and custom storage solutions',
            afterImageUrl: '/images/gallery/omega-1.jpg',
            category: 'Bathroom',
            style: 'Traditional',
            cabinetType: 'Vanity',
            featured: 1,
          },
          {
            title: 'Classic White Kitchen with Island',
            description: 'Timeless white cabinetry featuring a spacious center island and premium finishes',
            afterImageUrl: '/images/gallery/omega-2.jpg',
            category: 'Kitchen',
            style: 'Traditional',
            cabinetType: 'Full Kitchen',
            featured: 1,
          },
          {
            title: 'Warm Cherry Kitchen',
            description: 'Rich cherry wood cabinets creating an inviting and sophisticated cooking space',
            afterImageUrl: '/images/gallery/omega-3.jpg',
            category: 'Kitchen',
            style: 'Traditional',
            cabinetType: 'Full Kitchen',
            featured: 1,
          },
          {
            title: 'Sophisticated White Kitchen',
            description: 'Modern white cabinetry with clean lines and functional design',
            afterImageUrl: '/images/gallery/omega-4.jpg',
            category: 'Kitchen',
            style: 'Contemporary',
            cabinetType: 'Full Kitchen',
            featured: 1,
          },
          {
            title: 'Modern Two-Tone Kitchen',
            description: 'Contemporary design featuring contrasting cabinet colors and sleek hardware',
            afterImageUrl: '/images/gallery/omega-5.jpg',
            category: 'Kitchen',
            style: 'Contemporary',
            cabinetType: 'Full Kitchen',
            featured: 1,
          },
          {
            title: 'Espresso Contemporary Kitchen',
            description: 'Dark espresso cabinets with modern styling and premium appliances',
            afterImageUrl: '/images/gallery/omega-6.jpg',
            category: 'Kitchen',
            style: 'Contemporary',
            cabinetType: 'Full Kitchen',
            featured: 0,
          },
          {
            title: 'Casual Modern Kitchen',
            description: 'Relaxed contemporary design with functional layout and stylish finishes',
            afterImageUrl: '/images/gallery/omega-7.jpg',
            category: 'Kitchen',
            style: 'Casual',
            cabinetType: 'Full Kitchen',
            featured: 0,
          },
          {
            title: 'Bold Blue Bathroom',
            description: 'Statement-making blue vanity with modern fixtures and ample storage',
            afterImageUrl: '/images/gallery/omega-8.jpg',
            category: 'Bathroom',
            style: 'Contemporary',
            cabinetType: 'Vanity',
            featured: 0,
          },
        ];

        let imported = 0;
        for (const item of galleryData) {
          try {
            await db.insert(gallery).values(item);
            imported++;
          } catch (error) {
            // Skip duplicates
          }
        }

        return { count: imported };
      }),
  }),
});

export type AppRouter = typeof appRouter;
