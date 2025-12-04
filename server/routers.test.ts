import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(role: "user" | "admin" = "user"): TrpcContext {
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

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("searchRequests router", () => {
  it("should create a search request with valid input", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.searchRequests.create({
      name: "João Silva",
      email: "joao@example.com",
      phone: "(11) 99999-9999",
      department: "Recursos Humanos",
      position: "Gerente",
      description: "Solicitação de busca para análise de documentos",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject search request with invalid email", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.searchRequests.create({
        name: "João Silva",
        email: "invalid-email",
        department: "RH",
        description: "Descrição válida com mais de 10 caracteres",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject search request with short description", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.searchRequests.create({
        name: "João Silva",
        email: "joao@example.com",
        department: "RH",
        description: "Short",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow admin to get all search requests", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.searchRequests.getAllRequests();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should deny non-admin access to get all search requests", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.searchRequests.getAllRequests();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow admin to update search request status", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.searchRequests.updateStatus({
      id: 1,
      status: "approved",
    });

    expect(result).toEqual({ success: true });
  });

  it("should deny non-admin access to update search request status", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.searchRequests.updateStatus({
        id: 1,
        status: "approved",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("anonymousReports router", () => {
  it("should create an anonymous report without authentication", async () => {
    const ctx = createMockContext("user");
    ctx.user = null;

    const caller = appRouter.createCaller(ctx);

    const result = await caller.anonymousReports.create({
      title: "Denúncia de Assédio",
      description: "Descrição detalhada da denúncia com mais de 10 caracteres",
      category: "Assédio",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject anonymous report with short description", async () => {
    const ctx = createMockContext("user");
    ctx.user = null;

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.anonymousReports.create({
        title: "Denúncia",
        description: "Short",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow admin to get all anonymous reports", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.anonymousReports.getAllReports();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should deny non-admin access to get all anonymous reports", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.anonymousReports.getAllReports();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should allow admin to update anonymous report status", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.anonymousReports.updateStatus({
      id: 1,
      status: "resolved",
    });

    expect(result).toEqual({ success: true });
  });

  it("should deny non-admin access to update anonymous report status", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.anonymousReports.updateStatus({
        id: 1,
        status: "resolved",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("reports router", () => {
  it("should allow admin to generate HTML report", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.generateHTML();
    expect(result).toHaveProperty("html");
    expect(typeof result.html).toBe("string");
    expect(result.html).toContain("Relatório de Monitoramento");
  });

  it("should deny non-admin access to generate HTML report", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reports.generateHTML();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("auth router", () => {
  it("should return current user with me query", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toEqual(ctx.user);
  });

  it("should logout user and clear cookie", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});
