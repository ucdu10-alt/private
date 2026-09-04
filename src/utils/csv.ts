import type {PrefectureDataRow} from '../data/types';

/**
 * Minimal parser for the theme data format:
 *
 *   prefecture,value
 *   北海道,455
 *   青森県,478
 *
 * Deliberately not a general-purpose CSV parser (no quoted-field support) --
 * the data files this project reads only ever have two plain numeric/text
 * columns.
 */
export const parsePrefectureCsv = (csvText: string): PrefectureDataRow[] => {
  const lines = csvText.trim().split(/\r?\n/);
  const [, ...rows] = lines; // drop header row

  return rows
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [prefecture, rawValue] = line.split(',');
      const value = Number(rawValue);
      if (!prefecture || Number.isNaN(value)) {
        throw new Error(`Invalid CSV row: "${line}"`);
      }
      return {prefecture: prefecture.trim(), value};
    });
};

/** One CSV row as a plain string-keyed record, keyed by its header column names. */
export type CsvRecord = Record<string, string>;

/**
 * General-purpose (but still simple -- no quoted-field support) CSV parser
 * for data files with more than two columns, e.g. a dual-metric theme's
 * `display_order,prefecture,store_count,...` CSV. Values come back as raw
 * strings; callers convert whichever columns they need with Number(...).
 */
export const parseNamedCsv = (csvText: string): CsvRecord[] => {
  const lines = csvText.trim().split(/\r?\n/);
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(',').map((header) => header.trim());

  return rows
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const fields = line.split(',');
      const record: CsvRecord = {};
      headers.forEach((header, index) => {
        record[header] = (fields[index] ?? '').trim();
      });
      return record;
    });
};
