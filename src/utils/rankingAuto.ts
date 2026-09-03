import type {PrefectureRow, RankCountConfig, RankedPrefectureRow} from '../data/types';

/**
 * How many ranks to show, given how many prefectures actually have usable
 * data. An explicit numeric override always wins (clamped to what's
 * actually available); otherwise: 10+ valid -> TOP10, 5-9 -> TOP5, 1-4 ->
 * show everything valid.
 */
export const selectRankCount = (validCount: number, override: RankCountConfig): number => {
  if (typeof override === 'number') {
    return Math.max(0, Math.min(override, validCount));
  }
  if (validCount >= 10) return 10;
  if (validCount >= 5) return 5;
  return validCount;
};

/**
 * Builds the ranked list (rank 1 = most caught) from raw prefecture rows.
 * A row is eligible when it has a non-missing value, and (unless
 * `zeroValuesIncluded`) that value is greater than zero -- 0 usually means
 * "not fished there" rather than a real measured catch.
 */
export const buildEligibleRows = (
  rows: PrefectureRow[],
  zeroValuesIncluded: boolean,
): {prefecture: string; catchTons: number}[] => {
  return rows
    .filter((row): row is {prefecture: string; catchTons: number} => row.catchTons !== null)
    .filter((row) => zeroValuesIncluded || row.catchTons > 0);
};

export const buildRanking = (
  eligibleRows: {prefecture: string; catchTons: number}[],
  rankCount: number,
): RankedPrefectureRow[] => {
  return [...eligibleRows]
    .sort((a, b) => b.catchTons - a.catchTons)
    .slice(0, rankCount)
    .map((row, index) => ({...row, rank: index + 1}));
};
