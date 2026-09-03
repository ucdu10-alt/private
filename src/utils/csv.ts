/** One parsed CSV data row plus its 1-based line number in the source file (for error messages). */
export interface CsvRow {
  /** Line number in the original file (header is line 1), so validation errors can point at it. */
  lineNumber: number;
  cells: Record<string, string>;
}

/**
 * Minimal header-based CSV parser: first line is the header, every column
 * after that is looked up by header name. No quoted-field support -- the
 * data this project reads is always plain numeric/name columns (years,
 * tonnages, prefecture names), so a full RFC4180 parser would be
 * unneeded complexity.
 */
export const parseCsv = (csvText: string): CsvRow[] => {
  const lines = csvText.replace(/^﻿/, '').split(/\r?\n/);
  const headerLine = lines[0] ?? '';
  const headers = headerLine.split(',').map((h) => h.trim());

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const raw = lines[i];
    if (raw === undefined || raw.trim().length === 0) continue;
    const cellValues = raw.split(',');
    const cells: Record<string, string> = {};
    headers.forEach((header, index) => {
      cells[header] = (cellValues[index] ?? '').trim();
    });
    rows.push({lineNumber: i + 1, cells});
  }
  return rows;
};
