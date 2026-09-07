/**
 * Temporary debug store: captures raw JSON bodies from Piped `streams`
 * and `channel` calls so they can be inspected on-screen.
 */
export interface DebugEntry {
  label: string;
  path: string;
  at: number;
  body: string;
}

let entries: DebugEntry[] = [];
const listeners = new Set<() => void>();

export function pushDebug(label: string, path: string, body: string) {
  entries = [{ label, path, at: Date.now(), body }, ...entries].slice(0, 8);
  listeners.forEach((l) => l());
}

export function getDebug(): DebugEntry[] {
  return entries;
}

export function clearDebug() {
  entries = [];
  listeners.forEach((l) => l());
}

export function subscribeDebug(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
