import { cookies } from "next/headers"
import crypto from "crypto"
import { createAdminClient } from "@/utils/supabase/admin"

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

interface SessionData {
  email: string
  id: string
  exp: number
}

/**
 * Hash password using PBKDF2
 */
function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Encode session data as a base64 JSON string.
 */
function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64")
}

function decodeSession(token: string): SessionData | null {
  try {
    const data = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
    if (data.exp && Date.now() < data.exp) {
      return data as SessionData
    }
    return null
  } catch {
    return null
  }
}

/**
 * Verify admin credentials against the admin_users table.
 */
export async function verifyAdmin(email: string, password: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, password_hash")
    .eq("email", email)
    .single()

  if (error || !data) return null

  // Password hash format is "salt:hash"
  const [salt, storedHash] = data.password_hash.split(":")
  if (!salt || !storedHash) return null

  const hash = hashPassword(password, salt)
  if (hash !== storedHash) return null

  return { id: data.id, email: data.email }
}

/**
 * Create a session cookie for the admin user.
 */
export async function createSession(id: string, email: string) {
  const cookieStore = await cookies()
  const sessionData: SessionData = {
    id,
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  }
  const token = encodeSession(sessionData)

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

/**
 * Get the current admin session from cookies.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return decodeSession(token)
}

/**
 * Destroy the admin session cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Decode session from a raw cookie string value (for middleware use).
 */
export function decodeSessionFromValue(value: string): SessionData | null {
  return decodeSession(value)
}
