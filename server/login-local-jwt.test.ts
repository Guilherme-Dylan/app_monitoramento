import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import { sdk } from "./_core/sdk";
import { createUserWithPassword, validateCredentials } from "./auth-local";

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
  let testUserId: number;
  const testEmail = "jwt-test@example.com";
  const testPassword = "TestPassword123";
  const testName = "JWT Test User";

  beforeAll(async () => {
    // Criar usuário de teste
    try {
      await createUserWithPassword(testEmail, testPassword, testName, "user");
      
      // Obter ID do usuário criado
      const user = await db.getUserByEmail(testEmail);
      if (user) {
        testUserId = user.id;
      }
    } catch (error) {
      // Usuário pode já existir de testes anteriores
      const user = await db.getUserByEmail(testEmail);
      if (user) {
        testUserId = user.id;
      }
    }
  });

  it("should create JWT with userId for local authentication", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.loginLocal({
      email: testEmail,
      password: testPassword,
    });

    // Verificar que login foi bem-sucedido
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.nome).toBe(testName);

    // Verificar que cookie foi definido
    expect(cookies.length).toBeGreaterThan(0);
    const sessionCookie = cookies.find((c) => c.name === COOKIE_NAME);
    expect(sessionCookie).toBeDefined();

    // Verificar que JWT contém userId
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
      
      // Verificar que userId no JWT corresponde ao ID do usuário
      expect(userId).toBe(testUserId);
      
      // Verificar que conseguimos buscar o usuário pelo ID
      const user = await db.getUserById(userId);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testEmail);
    }
  });
});
