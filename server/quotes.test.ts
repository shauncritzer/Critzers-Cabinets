import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Quote System", () => {
  describe("quotes.create", () => {
    it("creates a new quote with customer information", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.quotes.create({
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "(555) 123-4567",
        conversationData: JSON.stringify([
          { role: "user", content: "I need kitchen cabinets" },
          { role: "assistant", content: "What style are you looking for?" },
        ]),
      });

      expect(result).toHaveProperty("quoteId");
      expect(typeof result.quoteId).toBe("number");
    });

    it("validates customer email format", async () => {  
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Test with invalid email format - should reject
      await expect(
        caller.quotes.create({
          customerName: "John Doe",
          customerEmail: "invalid-email",
          conversationData: "{}",
        })
      ).rejects.toThrow();
      
      // Test with valid email - should succeed
      const result = await caller.quotes.create({
        customerName: "John Doe",
        customerEmail: "john@example.com",
        conversationData: "{}",
      });
      expect(result).toHaveProperty("quoteId");
    });
  });

  describe("quotes.getMyQuotes", () => {
    it("returns quotes for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a quote first
      await caller.quotes.create({
        customerName: "Test User",
        customerEmail: "test@example.com",
        conversationData: "{}",
      });

      const quotes = await caller.quotes.getMyQuotes();
      expect(Array.isArray(quotes)).toBe(true);
    });
  });

  describe("quotes.getAll", () => {
    it("allows admin to view all quotes", async () => {
      const { ctx } = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const quotes = await caller.quotes.getAll();
      expect(Array.isArray(quotes)).toBe(true);
    });

    it("denies access to non-admin users", async () => {
      const { ctx } = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      await expect(caller.quotes.getAll()).rejects.toThrow();
    });
  });

  describe("quotes.update", () => {
    it("allows admin to update quote status", async () => {
      const { ctx } = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Create a quote first
      const created = await caller.quotes.create({
        customerName: "Test User",
        customerEmail: "test@example.com",
        conversationData: "{}",
      });

      const result = await caller.quotes.update({
        id: created.quoteId,
        updates: {
          status: "approved",
          estimatedCost: "5000",
        },
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("Chat System", () => {
  describe("chat.sendMessage", () => {
    it("generates AI response to user message", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        messages: [
          { role: "user", content: "I need kitchen cabinets" },
        ],
      });

      expect(result).toHaveProperty("message");
      expect(typeof result.message).toBe("string");
      expect(result.message.length).toBeGreaterThan(0);
    });

    it("maintains conversation context", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        messages: [
          { role: "user", content: "I need kitchen cabinets" },
          { role: "assistant", content: "What style are you looking for?" },
          { role: "user", content: "Modern style" },
        ],
      });

      expect(result).toHaveProperty("message");
      expect(typeof result.message).toBe("string");
    });
  });
});

describe("Gallery System", () => {
  describe("gallery.getAll", () => {
    it("returns all gallery items", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const items = await caller.gallery.getAll();
      expect(Array.isArray(items)).toBe(true);
    });
  });

  describe("gallery.getFeatured", () => {
    it("returns only featured gallery items", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const items = await caller.gallery.getFeatured();
      expect(Array.isArray(items)).toBe(true);
    });
  });
});

describe("Projects System", () => {
  describe("projects.getMyProjects", () => {
    it("returns projects for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const projects = await caller.projects.getMyProjects();
      expect(Array.isArray(projects)).toBe(true);
    });
  });

  describe("projects.getAll", () => {
    it("allows admin to view all projects", async () => {
      const { ctx } = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const projects = await caller.projects.getAll();
      expect(Array.isArray(projects)).toBe(true);
    });

    it("denies access to non-admin users", async () => {
      const { ctx } = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      await expect(caller.projects.getAll()).rejects.toThrow();
    });
  });
});
