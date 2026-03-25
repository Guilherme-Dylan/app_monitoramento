import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, datetime } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  nome: text("nome"),
  email: varchar("email", { length: 320 }).unique(),
  senha: text("senha"), // Hash de senha para login local
  loginMethod: varchar("loginMethod", { length: 64 }),
  tipo_de_user: mysqlEnum("tipo_de_user", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Solicitações de busca feitas por usuários autenticados
 */
export const searchRequests = mysqlTable("search_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchRequest = typeof searchRequests.$inferSelect;
export type InsertSearchRequest = typeof searchRequests.$inferInsert;

/**
 * Denúncias anônimas - não requer autenticação
 */
export const anonymousReports = mysqlTable("anonymous_reports", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  status: mysqlEnum("status", ["pending", "under_review", "resolved", "closed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnonymousReport = typeof anonymousReports.$inferSelect;
export type InsertAnonymousReport = typeof anonymousReports.$inferInsert;

/**
 * Agendamentos de visitas para solicitações de busca
 */
export const visitSchedules = mysqlTable("visit_schedules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  requestId: int("requestId").notNull().references(() => searchRequests.id),
  scheduledDate: datetime("scheduledDate").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VisitSchedule = typeof visitSchedules.$inferSelect;
export type InsertVisitSchedule = typeof visitSchedules.$inferInsert;