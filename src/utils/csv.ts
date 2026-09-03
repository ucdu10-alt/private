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
