import { describe, it, expect, beforeAll } from "vitest";
import { createVisitSchedule, getUserVisits, updateVisitStatus, getAllVisits } from "./db";

describe("Visit Scheduling", () => {
  let testUserId: number;
  let testVisitId: number;

  beforeAll(async () => {
    // Usar um usuário de teste existente
    testUserId = 1; // admin@anml.com tem ID 1

    // Criar uma visita antes de rodar os testes
    const result = await createVisitSchedule({
      userId: testUserId,
      requestId: 1,
      scheduledDate: new Date("2026-04-15T10:00:00"),
      reason: "Inspeção de segurança",
      status: "pending",
    });

    expect(result).toBeDefined();

    // Buscar as visitas para pegar o ID da que acabamos de criar
    const visits = await getUserVisits(testUserId);
    expect(visits.length).toBeGreaterThan(0);

    testVisitId = visits[visits.length - 1].id;
    expect(testVisitId).toBeGreaterThan(0);
  });

  it("should create a visit schedule", async () => {
    // Só verificamos que o testVisitId foi criado no beforeAll
    expect(testVisitId).toBeDefined();
  });

  it("should get user visits", async () => {
    const visits = await getUserVisits(testUserId);
    expect(Array.isArray(visits)).toBe(true);
    if (visits.length > 0) {
      expect(visits[0].userId).toBe(testUserId);
    }
  });

  it("should update visit status", async () => {
    // Garantir que o ID exista (redundante, mas seguro)
    expect(testVisitId).toBeDefined();
    expect(testVisitId).toBeGreaterThan(0);

    await updateVisitStatus(testVisitId, "approved", "Visita aprovada pela administração");

    const visits = await getUserVisits(testUserId);
    const updatedVisit = visits.find(v => v.id === testVisitId);

    expect(updatedVisit?.status).toBe("approved");
    expect(updatedVisit?.adminNotes).toBe("Visita aprovada pela administração");
  });

  it("should get all visits", async () => {
    const allVisits = await getAllVisits();
    expect(Array.isArray(allVisits)).toBe(true);
  });

  it("should return visit with user information", async () => {
    const allVisits = await getAllVisits();
    if (allVisits.length > 0) {
      const visit = allVisits[0];
      expect(visit).toHaveProperty("userName");
      expect(visit).toHaveProperty("userEmail");
    }
  });

  it("should include all required fields in visit response", async () => {
    const allVisits = await getAllVisits();
    if (allVisits.length > 0) {
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
    }
  });

  it("should have correct visit properties", async () => {
    const visits = await getUserVisits(testUserId);
    expect(visits.length).toBeGreaterThan(0);

    const visit = visits[0];
    expect(visit).toHaveProperty("id");
    expect(visit).toHaveProperty("userId");
    expect(visit).toHaveProperty("requestId");
    expect(visit).toHaveProperty("scheduledDate");
    expect(visit).toHaveProperty("status");
    expect(visit).toHaveProperty("createdAt");
  });
});
