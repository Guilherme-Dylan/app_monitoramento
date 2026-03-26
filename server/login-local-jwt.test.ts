import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import { sdk } from "./_core/sdk";

vi.hoisted(() => {
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.VITE_APP_ID = "test-app-id";
});

const { mockUser } = vi.hoisted(() => ({
  mockUser: {
    id: 42,
    email: "jwt-test@example.com",
    nome: "JWT Test User",
    tipo_de_user: "user" as const,
  },
}));

vi.mock("./auth-local", () => ({
  createUserWithPassword: vi.fn().mockResolvedValue({
    email: mockUser.email,
    nome: mockUser.nome,
    tipo_de_user: mockUser.tipo_de_user,
  }),
  validateCredentials: vi.fn(async (email: string, password: string) => {
    if (email === mockUser.email && password === "TestPassword123") {
      return {
        ...mockUser,
        senha: "$2a$10$mock",
      };
    }
    return null;
  }),
}));

vi.mock("./db", () => ({
  getUserByEmail: vi.fn(async (email: string) => {
    if (email === mockUser.email) return mockUser;
    return undefined;
  }),
  getUserById: vi.fn(async (id: number) => {
    if (id === mockUser.id) return mockUser;
    return undefined;
  }),
}));

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createPublicContext(): { ctx: TrpcContext; cookies: CookieCall[] } {
  const cookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: () => {},
    } as any,
  };

  return { ctx, cookies };
}

describe("auth.loginLocal - JWT com userId", () => {
  const testUserId = mockUser.id;
  const testEmail = mockUser.email;
  const testPassword = "TestPassword123";
  const testName = mockUser.nome;

  it("should create JWT with userId for local authentication", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.loginLocal({
      email: testEmail,
      password: testPassword,
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.nome).toBe(testName);

    expect(cookies.length).toBeGreaterThan(0);
    const sessionCookie = cookies.find((c) => c.name === COOKIE_NAME);
    expect(sessionCookie).toBeDefined();

    if (sessionCookie) {
      const verifiedSession = await sdk.verifySession(sessionCookie.value);
      expect(verifiedSession).toBeDefined();
      expect(verifiedSession?.userId).toBeDefined();
      expect(verifiedSession?.userId).toBe(testUserId.toString());
      expect(verifiedSession?.name).toBe(testName);
      expect(verifiedSession?.appId).toBeDefined();
    }
  });

  it("should fail login with wrong password", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.loginLocal({
        email: testEmail,
        password: "WrongPassword123",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha");
    }
  });

  it("should fail login with non-existent email", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.loginLocal({
        email: "nonexistent@example.com",
        password: testPassword,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should verify JWT userId matches user ID", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.loginLocal({
      email: testEmail,
      password: testPassword,
    });

    const sessionCookie = cookies.find((c) => c.name === COOKIE_NAME);
    expect(sessionCookie).toBeDefined();

    if (sessionCookie) {
      const verifiedSession = await sdk.verifySession(sessionCookie.value);
      const userId = parseInt(verifiedSession?.userId || "0", 10);
      expect(userId).toBe(testUserId);

      const user = await db.getUserById(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testEmail);
    }
  });
});
