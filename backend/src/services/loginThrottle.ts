// =====================================================================
// Login brute-force throttle (in-memory)
//
// 5 failed attempts for the same email -> locked for 15 minutes.
// Registry is keyed by normalized email so attackers cannot bypass by
// alternating case/whitespace. In-memory by design: single-instance
// backend; a lock survives process restarts only if re-attempted.
// =====================================================================

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

interface LockEntry {
  fails: number;
  lockedUntil: number;
}

const store = new Map<string, LockEntry>();

const normalize = (email: string) => String(email || "").trim().toLowerCase();

export const isLocked = (email: string): boolean => {
  const key = normalize(email);
  const entry = store.get(key);
  if (!entry) return false;
  if (entry.lockedUntil > Date.now()) return true;
  // Only remove the entry when an actual LOCK (lockedUntil set) has
  // expired. A plain fail counter (lockedUntil === 0) must persist until
  // it reaches MAX_FAILS, otherwise the first check wipes it.
  if (entry.lockedUntil > 0) store.delete(key);
  return false;
};

export const remainingLockMs = (email: string): number => {
  const key = normalize(email);
  const entry = store.get(key);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return entry.lockedUntil - Date.now();
};

export const recordLoginFail = (email: string): void => {
  const key = normalize(email);
  const entry = store.get(key) || { fails: 0, lockedUntil: 0 };
  entry.fails += 1;
  if (entry.fails >= MAX_FAILS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
  }
  store.set(key, entry);
};

export const clearLoginFails = (email: string): void => {
  store.delete(normalize(email));
};

export const loginThrottle = {
  isLocked,
  remainingLockMs,
  recordLoginFail,
  clearLoginFails,
  MAX_FAILS,
};