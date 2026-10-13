import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE = "champs_comptoir";
const SESSION_TTL_SEC = 60 * 60 * 12;

function secret(): string {
  const value = process.env.COMPTOIR_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error("COMPTOIR_SECRET is required in production");
  }
  return "champs-local-dev-secret";
}

function pinHash(): string | null {
  const hash = process.env.COMPTOIR_PIN_HASH?.trim();
  return hash || null;
}

export async function isValidPin(value: string): Promise<boolean> {
  const hash = pinHash();
  if (!hash) {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return false;
    }
    const fallback = process.env.COMPTOIR_PIN;
    if (!fallback) return false;
    const left = Buffer.from(value);
    const right = Buffer.from(fallback);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  }
  return bcrypt.compare(value, hash);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  const nonce = randomBytes(16).toString("base64url");
  const body = `${exp}.${nonce}`;
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, nonce, sig] = parts;
  if (!expRaw || !nonce || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const body = `${expRaw}.${nonce}`;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sessionCookie(token: string): {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    sameSite: "lax";
    path: string;
    maxAge: number;
    secure: boolean;
  };
} {
  return {
    name: COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SEC,
      secure: process.env.NODE_ENV === "production",
    },
  };
}

export function clearSessionCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    sameSite: "lax";
    path: string;
    maxAge: number;
    secure: boolean;
  };
} {
  return {
    name: COOKIE,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    },
  };
}

export async function hasComptoirSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export { COOKIE as COMPTOIR_COOKIE };
