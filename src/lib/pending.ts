const PENDING_MARKERS = new Set([
  "INFORMATION COMING SOON",
  "PHENOTYPE DATA PENDING",
  "GROW DATA PENDING",
]);

export function isPendingCopy(value?: string): boolean {
  if (!value) return true;
  return PENDING_MARKERS.has(value.trim().toUpperCase());
}
