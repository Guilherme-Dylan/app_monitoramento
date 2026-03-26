import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockRequests = [
  {
    id: 1,
    userId: 1,
    name: "Teste",
    email: "teste@example.com",
    phone: null,
    department: "Seguranca",
    position: null,
    description: "Solicitacao para validacao",
    status: "pending" as const,
    createdAt: new Date(),
  },
];

vi.mock("./db", () => ({
  createSearchRequest: vi.fn(),
  getAllSearchRequests: vi.fn(async () => mockRequests),
  getUserSearchRequests: vi.fn(async () => mockRequests),
  updateSearchRequestStatus: vi.fn(async (id: number, status: "pending" | "approved" | "rejected") => {
    const req = mockRequests.find((r) => r.id === id);
    if (req) req.status = status;
  }),
  createAnonymousReport: vi.fn(),
  getAllAnonymousReports: vi.fn(async () => []),
  updateAnonymousReportStatus: vi.fn(),
  createVisitSchedule: vi.fn(),
  getUserVisits: vi.fn(async () => []),
  getAllVisits: vi.fn(async () => []),
  updateVisitStatus: vi.fn(),
  getVisitsByDateRange: vi.fn(async () => []),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-openid",
      email: "admin@example.com",
      nome: "Admin",
      loginMethod: "email",
      tipo_de_user: "admin",
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

describe("Admin Approval Flow", () => {
  it("should get all search requests as admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const requests = await caller.searchRequests.getAllRequests();

    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });

  it("should have correct request properties", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const requests = await caller.searchRequests.getAllRequests();
    const request = requests[0];

    expect(request).toHaveProperty("id");
    expect(request).toHaveProperty("name");
    expect(request).toHaveProperty("email");
    expect(request).toHaveProperty("department");
    expect(request).toHaveProperty("description");
    expect(request).toHaveProperty("status");
    expect(request).toHaveProperty("createdAt");
  });

  it("should update request status to approved", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.searchRequests.updateStatus({
      id: 1,
      status: "approved",
    });

    expect(result).toEqual({ success: true });
    expect(mockRequests[0]?.status).toBe("approved");
  });

  it("should update request status to rejected", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.searchRequests.updateStatus({
      id: 1,
      status: "rejected",
    });

    expect(result).toEqual({ success: true });
    expect(mockRequests[0]?.status).toBe("rejected");
  });

  it("should update request status back to pending", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.searchRequests.updateStatus({
      id: 1,
      status: "pending",
    });

    expect(result).toEqual({ success: true });
    expect(mockRequests[0]?.status).toBe("pending");
  });
});
