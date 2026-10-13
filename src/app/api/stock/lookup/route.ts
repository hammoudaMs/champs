import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { findProductByBarcode } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireComptoir();
  if (denied) return denied;
  const barcode = new URL(request.url).searchParams.get("barcode")?.trim() ?? "";
  if (!barcode) {
    return NextResponse.json({ error: "barcode_required" }, { status: 400 });
  }
  const product = await findProductByBarcode(barcode);
  return NextResponse.json({ product, barcode });
}
