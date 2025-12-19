import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
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
});

export type AppRouter = typeof appRouter;
