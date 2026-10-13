import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DatabaseSnapshot } from "@/lib/store/types";
import { emptySnapshot } from "@/lib/store/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "champs-db.json");

let writeQueue: Promise<void> = Promise.resolve();

function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(work, work);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readSnapshot(): Promise<DatabaseSnapshot> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as DatabaseSnapshot;
    return { ...emptySnapshot(), ...parsed };
  } catch {
    return emptySnapshot();
  }
}

async function writeSnapshot(snapshot: DatabaseSnapshot): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(snapshot, null, 2), "utf8");
}

export function withFileStore<T>(work: (snapshot: DatabaseSnapshot) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const snapshot = await readSnapshot();
    const result = await work(snapshot);
    await writeSnapshot(snapshot);
    return result;
  });
}

export function readFileStore<T>(work: (snapshot: DatabaseSnapshot) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const snapshot = await readSnapshot();
    return work(snapshot);
  });
}
