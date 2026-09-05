import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "champs_comptoir";

function pin(): string {
  return process.env.COMPTOIR_PIN ?? "2580";
}

function secret(): string {
  return process.env.COMPTOIR_SECRET ?? "champs-local-secret";
}

function token(): string {
  return createHmac("sha256", secret()).update("comptoir-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isValidPin(value: string): boolean {
  return safeEqual(value, pin());
}

export function sessionCookie(): { name: string; value: string; options: {
  httpOnly: true;
  sameSite: "lax";
  path: string;
  maxAge: number;
  secure: boolean;
} } {
  return {
    name: COOKIE,
    value: token(),
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    },
  };
}

export async function hasComptoirSession(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  return Boolean(value && safeEqual(value, token()));
}
