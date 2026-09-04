const HASH_MAX = 128;
const HASH_PATTERN = /^[A-Za-z0-9]+$/;

export function sanitizeTransactionHash(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > HASH_MAX) return null;
  if (!HASH_PATTERN.test(trimmed)) return null;
  return trimmed;
}

export function cryptoStatusForHash(hash: string | null) {
  return {
    status: hash ? ("payment_submitted" as const) : ("pending_payment" as const),
    paymentStatus: "unpaid" as const,
  };
}
