import { NextResponse } from "next/server";
import { createSessionToken, isValidPin, sessionCookie } from "@/lib/comptoir-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`comptoir:login:${ip}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "locked" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const pin =
    body && typeof body === "object" && typeof (body as { pin?: unknown }).pin === "string"
      ? (body as { pin: string }).pin.trim()
      : "";

  if (!(await isValidPin(pin))) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = createSessionToken();
  const cookie = sessionCookie(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
