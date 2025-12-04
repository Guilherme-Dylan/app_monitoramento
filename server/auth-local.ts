import bcryptjs from "bcryptjs";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Hash de senha com bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Comparar senha com hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Buscar usuário por email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Criar usuário com email e senha
 */
export async function createUserWithPassword(
  email: string,
  password: string,
  name: string,
  role: "user" | "admin" = "user"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Verificar se usuário já existe
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email já cadastrado");
  }

  // Hash da senha
  const hashedPassword = await hashPassword(password);

  // Gerar um openId único para manter compatibilidade
  const openId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Inserir usuário
  await db.insert(users).values({
    openId,
    email,
    password: hashedPassword,
    name,
    loginMethod: "email",
    role,
    lastSignedIn: new Date(),
  });

  return { email, name, role };
}

/**
 * Validar credenciais de login
 */
export async function validateCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}
