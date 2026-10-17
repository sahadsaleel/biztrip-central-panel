/**
 * Format Indian Rupees with symbol
 */
export function inr(value: number): string {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

/**
 * Format Lakhs representation
 */
export function fmtL(value: number): string {
  return `₹${Number(value || 0).toFixed(1)} L`;
}

/**
 * Download arbitrary tabular data as a clean CSV file
 */
export function downloadCsv(name: string, rows: Record<string, unknown>[]): void {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate sequential IDs given an existing array of IDs with prefix
 * E.g., nextId("ENQ", ["ENQ-1001", "ENQ-1002"]) => "ENQ-1003"
 */
export function nextId(prefix: string, existingIds: string[]): string {
  const max = Math.max(
    0,
    ...existingIds.map((id) => {
      const parts = id.split("-");
      const numPart = parts[parts.length - 1];
      const parsed = parseInt(numPart ?? "0", 10);
      return isNaN(parsed) ? 0 : parsed;
    }),
  );
  return `${prefix}-${max + 1}`;
}

/**
 * Safe date formatter
 */
export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
