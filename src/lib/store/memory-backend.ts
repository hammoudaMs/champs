import type { DatabaseSnapshot } from "@/lib/store/types";
import { emptySnapshot } from "@/lib/store/types";

type MemoryBag = {
  snapshot: DatabaseSnapshot;
};

function bag(): MemoryBag {
  const globalRef = globalThis as typeof globalThis & { __champsDb?: MemoryBag };
  if (!globalRef.__champsDb) {
    globalRef.__champsDb = { snapshot: emptySnapshot() };
  }
  return globalRef.__champsDb;
}

export function withMemoryStore<T>(
  work: (snapshot: DatabaseSnapshot) => T | Promise<T>,
): Promise<T> {
  const store = bag();
  return Promise.resolve(work(store.snapshot));
}

export function readMemoryStore<T>(work: (snapshot: DatabaseSnapshot) => T | Promise<T>): Promise<T> {
  return withMemoryStore(work);
}
