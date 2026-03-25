import { describe, it, expect, beforeAll } from "vitest";
import { getAllSearchRequests, updateSearchRequestStatus } from "./db";

describe("Admin Approval Flow", () => {
  let testRequestId: number;

  beforeAll(async () => {
    // Usar uma solicitação existente
    const requests = await getAllSearchRequests();
    if (requests.length > 0) {
      testRequestId = requests[0].id;
    }
  });

  it("should get all search requests as admin", async () => {
    const requests = await getAllSearchRequests();
    
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });

  it("should have correct request properties", async () => {
    const requests = await getAllSearchRequests();
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
    if (!testRequestId) {
      expect(testRequestId).toBeGreaterThan(0);
      return;
    }

    await updateSearchRequestStatus(testRequestId, "approved");
    
    const requests = await getAllSearchRequests();
    const updatedRequest = requests.find(r => r.id === testRequestId);
    
    expect(updatedRequest?.status).toBe("approved");
  });

  it("should update request status to rejected", async () => {
    if (!testRequestId) {
      expect(testRequestId).toBeGreaterThan(0);
      return;
    }

    await updateSearchRequestStatus(testRequestId, "rejected");
    
    const requests = await getAllSearchRequests();
    const updatedRequest = requests.find(r => r.id === testRequestId);
    
    expect(updatedRequest?.status).toBe("rejected");
  });

  it("should update request status back to pending", async () => {
    if (!testRequestId) {
      expect(testRequestId).toBeGreaterThan(0);
      return;
    }

    await updateSearchRequestStatus(testRequestId, "pending");
    
    const requests = await getAllSearchRequests();
    const updatedRequest = requests.find(r => r.id === testRequestId);
    
    expect(updatedRequest?.status).toBe("pending");
  });
});
