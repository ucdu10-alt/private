import type {ValidTimeseriesRow} from '../data/types';

/** The single highest-value row (first one, if there's an exact tie), plus its index in `rows`. */
export const findPeak = (rows: ValidTimeseriesRow[]): {row: ValidTimeseriesRow; index: number} => {
  let bestIndex = 0;
  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i].catchTons > rows[bestIndex].catchTons) bestIndex = i;
  }
  return {row: rows[bestIndex], index: bestIndex};
};
