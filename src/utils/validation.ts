import type {CsvRow} from './csv';
import type {PrefectureRow, TimeseriesRow} from '../data/types';
import {isValidPrefectureName} from '../data/prefectures';

export interface ValidationIssue {
  line: number;
  message: string;
}

/**
 * Thrown when a fish's CSV has hard errors (bad year, unknown prefecture,
 * duplicate rows, non-numeric values, ...). Lists every offending line so
 * whoever is fixing the CSV can find each problem in one pass instead of
 * re-running validation repeatedly.
 */
export class DataValidationError extends Error {
  issues: ValidationIssue[];

  constructor(context: string, issues: ValidationIssue[]) {
    const detail = issues.map((issue) => `  行${issue.line}: ${issue.message}`).join('\n');
    super(`${context}: ${issues.length}件の問題があります\n${detail}`);
    this.name = 'DataValidationError';
    this.issues = issues;
  }
}

const parseNumericCell = (raw: string): {value: number | null; invalid: boolean} => {
  if (raw.trim().length === 0) return {value: null, invalid: false};
  const value = Number(raw);
  if (Number.isNaN(value)) return {value: null, invalid: true};
  return {value, invalid: false};
};

/**
 * Parses+validates a timeseries.csv (`year,catch_tons`). Hard errors: a
 * non-numeric/missing year, a non-numeric (but non-blank) catch_tons, or a
 * duplicate year. A blank catch_tons is treated as a genuine missing value
 * (欠損値) -- kept as `null` rather than rejected, so the chart can render
 * a gap for that year instead of the whole file failing to load.
 */
export const validateAndParseTimeseries = (rows: CsvRow[], context: string): TimeseriesRow[] => {
  const issues: ValidationIssue[] = [];
  const seenYears = new Map<number, number>(); // year -> first line seen on
  const parsed: TimeseriesRow[] = [];

  rows.forEach((row) => {
    const yearRaw = row.cells.year;
    const year = Number(yearRaw);
    if (!yearRaw || Number.isNaN(year) || !Number.isInteger(year)) {
      issues.push({line: row.lineNumber, message: `year が数値ではありません: "${yearRaw ?? ''}"`});
      return;
    }

    const existingLine = seenYears.get(year);
    if (existingLine !== undefined) {
      issues.push({line: row.lineNumber, message: `year ${year} が行${existingLine}と重複しています`});
      return;
    }
    seenYears.set(year, row.lineNumber);

    const {value, invalid} = parseNumericCell(row.cells.catch_tons ?? '');
    if (invalid) {
      issues.push({
        line: row.lineNumber,
        message: `catch_tons が数値ではありません: "${row.cells.catch_tons}"`,
      });
      return;
    }

    parsed.push({year, catchTons: value});
  });

  if (issues.length > 0) {
    throw new DataValidationError(context, issues);
  }

  return [...parsed].sort((a, b) => a.year - b.year);
};

/**
 * Parses+validates a prefecture.csv (`prefecture,catch_tons`). Hard errors:
 * an unknown prefecture name (not one of the 47), a duplicate prefecture,
 * or a non-numeric (but non-blank) catch_tons. A blank catch_tons is a
 * genuine missing value (欠損値) -- kept as `null` so it's simply excluded
 * from the ranking rather than failing the whole file.
 */
export const validateAndParsePrefecture = (rows: CsvRow[], context: string): PrefectureRow[] => {
  const issues: ValidationIssue[] = [];
  const seenPrefectures = new Map<string, number>();
  const parsed: PrefectureRow[] = [];

  rows.forEach((row) => {
    const prefecture = row.cells.prefecture?.trim() ?? '';
    if (!prefecture) {
      issues.push({line: row.lineNumber, message: 'prefecture が空です'});
      return;
    }
    if (!isValidPrefectureName(prefecture)) {
      issues.push({line: row.lineNumber, message: `未知の都道府県名です: "${prefecture}"`});
      return;
    }
    const existingLine = seenPrefectures.get(prefecture);
    if (existingLine !== undefined) {
      issues.push({line: row.lineNumber, message: `"${prefecture}" が行${existingLine}と重複しています`});
      return;
    }
    seenPrefectures.set(prefecture, row.lineNumber);

    const {value, invalid} = parseNumericCell(row.cells.catch_tons ?? '');
    if (invalid) {
      issues.push({
        line: row.lineNumber,
        message: `catch_tons が数値ではありません: "${row.cells.catch_tons}"`,
      });
      return;
    }

    parsed.push({prefecture, catchTons: value});
  });

  if (issues.length > 0) {
    throw new DataValidationError(context, issues);
  }

  return parsed;
};
