const TICKER_PATTERN = /^[A-Z0-9]{4,6}$/;

export function sanitizeTickers(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length > 0 && TICKER_PATTERN.test(t.replace(/\d+$/, '').replace(/1$/, '1')));
}
