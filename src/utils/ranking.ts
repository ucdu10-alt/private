import type {PrefectureDataRow, RankDirection, RankedPrefecture} from '../data/types';

const compareByDirection = (direction: RankDirection) => (a: PrefectureDataRow, b: PrefectureDataRow) =>
  direction === 'higherIsBetter' ? b.value - a.value : a.value - b.value;

/**
 * Computes the full national ranking (1..N) from raw values. This is the
 * ONLY place rank numbers come from -- they are always derived from data,
 * never entered by hand.
 */
export const computeRankings = (
  data: PrefectureDataRow[],
  direction: RankDirection,
): RankedPrefecture[] => {
  return [...data]
    .sort(compareByDirection(direction))
    .map((row, index) => ({...row, rank: index + 1}));
};

/**
 * Computes the "top so far" leaderboard from only the prefectures that have
 * been revealed up to this point in the video (display order, not ranking
 * order). Positions here are relative to what's been shown so far, so they
 * can (and should) keep shifting until the true national top N has aired.
 */
export const computeProvisionalTopN = (
  revealedRows: PrefectureDataRow[],
  direction: RankDirection,
  n: number,
): RankedPrefecture[] => {
  return [...revealedRows]
    .sort(compareByDirection(direction))
    .slice(0, n)
    .map((row, index) => ({...row, rank: index + 1}));
};
