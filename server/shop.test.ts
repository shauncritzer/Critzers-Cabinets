import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return ctx;
}

describe("shop.getProducts", () => {
  it("returns product list with total count", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({});

    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.products)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("accepts search parameter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({
      search: "knob",
    });

    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.products)).toBe(true);
  });

  it("accepts category filter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({
      category: "Knobs",
    });

    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
  });

  it("accepts finish filter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({
      finish: "Polished Nickel",
    });

    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
  });

  it("respects limit parameter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({
      limit: 10,
    });

    expect(result.products.length).toBeLessThanOrEqual(10);
  });

  it("supports pagination with offset", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shop.getProducts({
      limit: 5,
      offset: 0,
    });

    expect(result).toHaveProperty("products");
    expect(result).toHaveProperty("total");
  });
});
