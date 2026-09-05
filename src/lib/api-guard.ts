import { NextResponse } from "next/server";
import { hasComptoirSession } from "@/lib/comptoir-auth";

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function requireComptoir(): Promise<NextResponse | null> {
  if (await hasComptoirSession()) return null;
  return unauthorized();
}
