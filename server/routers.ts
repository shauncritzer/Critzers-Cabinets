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

    importProducts: publicProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        // Import products from the Excel file
        const fs = await import('fs/promises');
        const path = await import('path');
        const xlsx = await import('xlsx');

        const filePath = path.join(process.cwd(), 'TopKnobsJanuary2026PriceList.xlsx');

        // Check if file exists
        try {
          await fs.access(filePath);
        } catch (error) {
          throw new Error(`Excel file not found at: ${filePath}`);
        }

        const fileBuffer = await fs.readFile(filePath);
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Found ${data.length} rows in Excel file`);
        if (data.length > 0) {
          console.log('Available columns:', Object.keys(data[0]));
        }

        let imported = 0;
        let skipped = 0;
        let discontinued = 0;
        let noPricing = 0;

        for (const row of data) {
          // Try multiple column name variations
          const sku = row['Item Number'] || row['SKU'] || row['Item #'] || row['Part Number'] || '';
          const name = row['Item Description'] || row['Description'] || row['Product Name'] || '';
          const retailPrice = row['Retail Price'] || row['List Price'] || row['Price'] || null;

          // Skip if no SKU or name
          if (!sku && !name) {
            skipped++;
            continue;
          }

          // FILTER OUT DISCONTINUED PRODUCTS
          if (name && (
            name.toUpperCase().includes('DISCONTINUED') ||
            name.toUpperCase().includes('DEMO') ||
            name.toUpperCase().includes('LIMITED AVAILABILITY')
          )) {
            discontinued++;
            continue;
          }

          // FILTER OUT PRODUCTS WITH NO VALID PRICING
          const priceNum = retailPrice ? parseFloat(String(retailPrice).replace(/[$,]/g, '')) : 0;
          if (!priceNum || priceNum <= 0) {
            noPricing++;
            continue;
          }

          try {
            await db.insert(products).values({
              sku: String(sku).trim(),
              name: String(name).trim() || String(sku).trim(),
              collection: row['Collection'] || row['Series'] || null,
              finish: row['Finish'] || row['Color'] || null,
              retailPrice: String(priceNum.toFixed(2)),
              category: row['Category'] || 'Hardware',
              inStock: 'yes', // Default to in stock, can be updated later
            });
            imported++;
          } catch (error) {
            // Skip duplicates or errors
            skipped++;
          }
        }

        console.log(`Import complete:`);
        console.log(`  - Imported: ${imported} products`);
        console.log(`  - Skipped (discontinued): ${discontinued}`);
        console.log(`  - Skipped (no pricing): ${noPricing}`);
        console.log(`  - Skipped (other): ${skipped}`);
        console.log(`  - Total processed: ${data.length}`);

        return {
          count: imported,
          skipped: skipped + discontinued + noPricing,
          discontinued,
          noPricing,
          total: data.length
        };
      }),

    importGallery: publicProcedure
      .mutation(async () => {
        const db = await getDb();
        if (!db) throw new Error('Database connection failed');

        // Using actual image filenames from client/public/images/gallery/
        const galleryData = [
          {
            title: 'Modern White Kitchen Transformation',
            description: 'Complete kitchen remodel featuring clean white cabinetry with modern hardware and sleek countertops',
            afterImageUrl: '/images/gallery/3HrP0H3BuW7m.jpg',
            roomType: 'Kitchen',
            style: 'modern',
            cabinetType: 'full_kitchen',
            featured: 1,
            displayOrder: 1,
          },
          {
            title: 'Elegant Gray Kitchen Design',
            description: 'Sophisticated gray cabinet installation with professional-grade finishes and contemporary styling',
            afterImageUrl: '/images/gallery/53H0NAM0eSvE.webp',
            roomType: 'Kitchen',
            style: 'contemporary',
            cabinetType: 'full_kitchen',
            featured: 1,
            displayOrder: 2,
          },
          {
            title: 'Custom Kitchen Island',
            description: 'Beautiful custom island with extensive storage, seating area, and coordinating cabinetry',
            afterImageUrl: '/images/gallery/7nAUkEFBXEaf.jpg',
            roomType: 'Kitchen',
            style: 'transitional',
            cabinetType: 'island',
            featured: 1,
            displayOrder: 3,
          },
          {
            title: 'Traditional Wood Kitchen',
            description: 'Classic wood cabinetry with traditional styling and timeless appeal',
            afterImageUrl: '/images/gallery/FbkkkCWXInZS.jpg',
            roomType: 'Kitchen',
            style: 'traditional',
            cabinetType: 'full_kitchen',
            featured: 0,
            displayOrder: 4,
          },
          {
            title: 'Contemporary Open Kitchen',
            description: 'Open-concept kitchen with modern cabinetry and integrated appliances',
            afterImageUrl: '/images/gallery/KL9ldeZDUcbT.jpg',
            roomType: 'Kitchen',
            style: 'modern',
            cabinetType: 'full_kitchen',
            featured: 0,
            displayOrder: 5,
          },
          {
            title: 'Luxury Kitchen Remodel',
            description: 'High-end kitchen featuring premium cabinetry, custom finishes, and designer hardware',
            afterImageUrl: '/images/gallery/RHHoKWmplcBC.jpg',
            roomType: 'Kitchen',
            style: 'luxury',
            cabinetType: 'full_kitchen',
            featured: 1,
            displayOrder: 6,
          },
          {
            title: 'Farmhouse Style Kitchen',
            description: 'Charming farmhouse-style kitchen with rustic elements and practical design',
            afterImageUrl: '/images/gallery/bt6Vi4lpCf4B.jpg',
            roomType: 'Kitchen',
            style: 'farmhouse',
            cabinetType: 'full_kitchen',
            featured: 0,
            displayOrder: 7,
          },
          {
            title: 'Transitional Kitchen Design',
            description: 'Perfectly balanced transitional design blending classic and contemporary elements',
            afterImageUrl: '/images/gallery/ubBFg9QkproG.jpg',
            roomType: 'Kitchen',
            style: 'transitional',
            cabinetType: 'full_kitchen',
            featured: 0,
            displayOrder: 8,
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
