import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const visitStore = [
  {
    id: 1,
    userId: 1,
    requestId: 1,
    scheduledDate: new Date("2026-04-15T10:00:00"),
    reason: "Inspecao de seguranca",
    status: "pending" as const,
    adminNotes: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userName: "Admin",
    userEmail: "admin@example.com",
  },
];

vi.mock("./db", () => ({
  createSearchRequest: vi.fn(),
  getAllSearchRequests: vi.fn(async () => []),
  getUserSearchRequests: vi.fn(async () => []),
  updateSearchRequestStatus: vi.fn(),
  createAnonymousReport: vi.fn(),
  getAllAnonymousReports: vi.fn(async () => []),
  updateAnonymousReportStatus: vi.fn(),
  createVisitSchedule: vi.fn(async (visit: any) => {
    const id = visitStore.length + 1;
    visitStore.push({
      id,
      userId: visit.userId,
      requestId: visit.requestId,
      scheduledDate: visit.scheduledDate,
      reason: visit.reason ?? null,
      status: visit.status,
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userName: "Admin",
      userEmail: "admin@example.com",
    });
    return { insertId: id };
  }),
  getUserVisits: vi.fn(async (userId: number) => visitStore.filter((v) => v.userId === userId)),
  getAllVisits: vi.fn(async () => visitStore),
  updateVisitStatus: vi.fn(async (visitId: number, status: "pending" | "approved" | "rejected" | "completed", adminNotes?: string) => {
    const visit = visitStore.find((v) => v.id === visitId);
    if (visit) {
      visit.status = status;
      visit.adminNotes = adminNotes ?? null;
    }
  }),
  getVisitsByDateRange: vi.fn(async () => visitStore),
}));

function createContext(tipo_de_user: "user" | "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "mock-openid",
      email: "admin@example.com",
      nome: "Admin",
      loginMethod: "email",
      tipo_de_user,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Visit Scheduling", () => {
  it("should create a visit schedule", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    const result = await caller.visits.create({
      requestId: 2,
      scheduledDate: new Date("2026-05-01T14:00:00"),
      reason: "Visita de validacao",
    });

    expect(result).toEqual({ success: true });
    expect(visitStore.length).toBeGreaterThan(1);
  });

  it("should get user visits", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    const visits = await caller.visits.getUserVisits();

    expect(Array.isArray(visits)).toBe(true);
    expect(visits.length).toBeGreaterThan(0);
    expect(visits[0]?.userId).toBe(1);
  });

  it("should update visit status", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const result = await caller.visits.updateStatus({
      visitId: 1,
      status: "approved",
      adminNotes: "Visita aprovada pela administracao",
    });

    expect(result).toEqual({ success: true });
    expect(visitStore[0]?.status).toBe("approved");
    expect(visitStore[0]?.adminNotes).toBe("Visita aprovada pela administracao");
  });

  it("should get all visits", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const allVisits = await caller.visits.getAll();

    expect(Array.isArray(allVisits)).toBe(true);
    expect(allVisits.length).toBeGreaterThan(0);
  });

  it("should return visit with user information", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const allVisits = await caller.visits.getAll();
    const visit = allVisits[0];

    expect(visit).toHaveProperty("userName");
    expect(visit).toHaveProperty("userEmail");
  });

  it("should include all required fields in visit response", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const allVisits = await caller.visits.getAll();
    const visit = allVisits[0];

    expect(visit).toHaveProperty("id");
    expect(visit).toHaveProperty("userId");
    expect(visit).toHaveProperty("requestId");
    expect(visit).toHaveProperty("scheduledDate");
    expect(visit).toHaveProperty("reason");
    expect(visit).toHaveProperty("status");
    expect(visit).toHaveProperty("adminNotes");
    expect(visit).toHaveProperty("createdAt");
    expect(visit).toHaveProperty("updatedAt");
    expect(visit).toHaveProperty("userName");
    expect(visit).toHaveProperty("userEmail");
  });

  it("should have correct visit properties", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    const visits = await caller.visits.getUserVisits();
    const visit = visits[0];

    expect(visit).toHaveProperty("id");
    expect(visit).toHaveProperty("userId");
    expect(visit).toHaveProperty("requestId");
    expect(visit).toHaveProperty("scheduledDate");
    expect(visit).toHaveProperty("status");
    expect(visit).toHaveProperty("createdAt");
  });
});
