import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

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

describe("auth.registerLocal and loginLocal", () => {
  it("should register a new user and create a session", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "TestPassword123";
    const testName = "Test User";

    // Register new user
    const registerResult = await caller.auth.registerLocal({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    expect(registerResult.success).toBe(true);
    expect(cookies.length).toBeGreaterThan(0);

    // Check that session cookie was set
    const sessionCookie = cookies.find((c) => c.name === COOKIE_NAME);
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBeTruthy();
  });

  it("should login with registered credentials", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const testEmail = `test-login-${Date.now()}@example.com`;
    const testPassword = "LoginPassword123";
    const testName = "Login Test User";

    // Register first
    await caller.auth.registerLocal({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    // Clear cookies from registration
    cookies.length = 0;

    // Create new context for login
    const { ctx: loginCtx, cookies: loginCookies } = createPublicContext();
    const loginCaller = appRouter.createCaller(loginCtx);

    // Login with same credentials
    const loginResult = await loginCaller.auth.loginLocal({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResult.success).toBe(true);
    expect(loginResult.user?.email).toBe(testEmail);
    expect(loginResult.user?.name).toBe(testName);
    expect(loginCookies.length).toBeGreaterThan(0);

    // Check that session cookie was set
    const sessionCookie = loginCookies.find((c) => c.name === COOKIE_NAME);
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBeTruthy();
  });

  it("should fail login with wrong password", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const testEmail = `test-wrong-${Date.now()}@example.com`;
    const testPassword = "CorrectPassword123";
    const testName = "Wrong Password Test";

    // Register first
    await caller.auth.registerLocal({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    // Create new context for login attempt
    const { ctx: loginCtx } = createPublicContext();
    const loginCaller = appRouter.createCaller(loginCtx);

    // Try to login with wrong password
    try {
      await loginCaller.auth.loginLocal({
        email: testEmail,
        password: "WrongPassword123",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Email ou senha incorretos");
    }
  });

  it("should fail registration with duplicate email", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const testEmail = `test-duplicate-${Date.now()}@example.com`;
    const testPassword = "Password123";

    // Register first user
    await caller.auth.registerLocal({
      email: testEmail,
      password: testPassword,
      name: "First User",
    });

    // Try to register with same email
    const { ctx: ctx2 } = createPublicContext();
    const caller2 = appRouter.createCaller(ctx2);

    try {
      await caller2.auth.registerLocal({
        email: testEmail,
        password: "DifferentPassword123",
        name: "Second User",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("Email já cadastrado");
    }
  });
});
