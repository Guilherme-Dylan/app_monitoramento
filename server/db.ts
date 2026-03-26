import { eq, and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertSearchRequest, searchRequests, InsertAnonymousReport, anonymousReports, InsertVisitSchedule, visitSchedules } from "../drizzle/schema";
import { ENV } from './_core/env';

mockDb.users.push({
  id: 1,
  email: "test@test.com",
  password: "123456",
});

const mockDb = {
  users: [],
  searchRequests: [],
  anonymousReports: [],
  visitSchedules: [],
};

let idCounter = 1;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (process.env.NODE_ENV === "test") {
    return "mock";
  }

  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  return _db;
}
export async function createSearchRequest(request: InsertSearchRequest) {
  const db = await getDb();

  if (db === "mock") {
    const newItem = { id: idCounter++, ...request };
    mockDb.searchRequests.push(newItem);
    return newItem;
  }

  if (!db) throw new Error("Database not available");

  return await db.insert(searchRequests).values(request);
}

export async function getAllSearchRequests() {
  const db = await getDb();

  if (db === "mock") {
    return mockDb.searchRequests;
  }

  if (!db) return [];

  return await db.select().from(searchRequests);
}

export async function updateSearchRequestStatus(id: number, status: any) {
  const db = await getDb();

  if (db === "mock") {
    const item = mockDb.searchRequests.find(r => r.id === id);
    if (item) item.status = status;
    return;
  }

  if (!db) throw new Error("Database not available");

  await db.update(searchRequests).set({ status }).where(eq(searchRequests.id, id));
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["nome", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.tipo_de_user !== undefined) {
      values.tipo_de_user = user.tipo_de_user;
      updateSet.tipo_de_user = user.tipo_de_user;
    } else if (user.openId === ENV.ownerOpenId) {
      values.tipo_de_user = 'admin';
      updateSet.tipo_de_user = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignedIn(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  try {
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update user lastSignedIn:", error);
    throw error;
  }
}

export async function createSearchRequest(request: InsertSearchRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(searchRequests).values(request);
  return result;
}

export async function getAllSearchRequests() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(searchRequests);
}

export async function getUserSearchRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(searchRequests).where(eq(searchRequests.userId, userId));
}

export async function updateSearchRequestStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(searchRequests).set({ status }).where(eq(searchRequests.id, id));
}

export async function createAnonymousReport(report: InsertAnonymousReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(anonymousReports).values(report);
  return result;
}

export async function getAllAnonymousReports() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(anonymousReports);
}

export async function updateAnonymousReportStatus(id: number, status: "pending" | "under_review" | "resolved" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(anonymousReports).set({ status }).where(eq(anonymousReports.id, id));
}

// Funções para agendamentos de visita
export async function createVisitSchedule(visit: InsertVisitSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(visitSchedules).values(visit);
  return result;
}

export async function getUserVisits(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(visitSchedules).where(eq(visitSchedules.userId, userId));
}

export async function getAllVisits() {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: visitSchedules.id,
    userId: visitSchedules.userId,
    requestId: visitSchedules.requestId,
    scheduledDate: visitSchedules.scheduledDate,
    reason: visitSchedules.reason,
    status: visitSchedules.status,
    adminNotes: visitSchedules.adminNotes,
    createdAt: visitSchedules.createdAt,
    updatedAt: visitSchedules.updatedAt,
    userName: users.nome,
    userEmail: users.email,
  }).from(visitSchedules).leftJoin(users, eq(visitSchedules.userId, users.id));
}

export async function updateVisitStatus(visitId: number, status: "pending" | "approved" | "rejected" | "completed", adminNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  await db.update(visitSchedules).set(updateData).where(eq(visitSchedules.id, visitId));
}

export async function getVisitsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(visitSchedules).where(
    and(
      gte(visitSchedules.scheduledDate, startDate),
      lte(visitSchedules.scheduledDate, endDate)
    )
  );
}
