import { CafeApp } from "@/components/cafe-app";
import { ScanTableGate } from "@/components/scan-table-gate";
import { firstParam, resolveTableFromQr } from "@/lib/table";

type HomeProps = {
  searchParams: Promise<{ table?: string | string[]; t?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const fromQr = firstParam(params.table) ?? firstParam(params.t);
  const table = resolveTableFromQr(fromQr);

  if (!table) {
    return <ScanTableGate />;
  }

  return <CafeApp table={table} />;
}
