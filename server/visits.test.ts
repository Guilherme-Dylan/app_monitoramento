import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createVisitSchedule, getUserVisits, updateVisitStatus, getAllVisits } from "./db";
import { getDb } from "./db";

describe("Visit Scheduling", () => {
  let testUserId: number;
  let testVisitId: number;

  beforeAll(async () => {
    // Usar um usuário de teste existente
    testUserId = 1; // admin@anml.com tem ID 1
  });

  it("should create a visit schedule", async () => {
    const result = await createVisitSchedule({
      userId: testUserId,
      requestId: 1,
      scheduledDate: new Date("2026-04-15T10:00:00"),
      reason: "Inspeção de segurança",
      status: "pending",
    });

    expect(result).toBeDefined();
    // Drizzle retorna um array com a inserção, então pegamos o ID da primeira linha
    const visits = await getUserVisits(testUserId);
    expect(visits.length).toBeGreaterThan(0);
    testVisitId = visits[visits.length - 1].id;
  });

  it("should get user visits", async () => {
    const visits = await getUserVisits(testUserId);
    
    expect(Array.isArray(visits)).toBe(true);
    if (visits.length > 0) {
      expect(visits[0].userId).toBe(testUserId);
    }
  });

  it("should update visit status", async () => {
    if (!testVisitId) {
      // Se o teste anterior falhou, pular este
      expect(testVisitId).toBeGreaterThan(0);
      return;
    }
    
    await updateVisitStatus(testVisitId, "approved", "Visita aprovada pela administração");
    
    const visits = await getUserVisits(testUserId);
    const updatedVisit = visits.find(v => v.id === testVisitId);
    
    expect(updatedVisit?.status).toBe("approved");
    expect(updatedVisit?.adminNotes).toBe("Visita aprovada pela administração");
  });

  it("should get all visits", async () => {
    const allVisits = await getAllVisits();
    
    expect(Array.isArray(allVisits)).toBe(true);
    // Pode ser que não haja visitas ainda, então apenas verificamos que é um array
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
