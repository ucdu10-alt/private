import type {CompareFrom, TimeseriesComparison, ValidTimeseriesRow} from '../data/types';

/**
 * Resolves `compareFrom` ('first' | 'peak' | an explicit year) to an actual
 * row, then computes the % change to the latest year. This is the only
 * place the increase/decrease percentage is computed -- it is always
 * derived from data, never entered by hand in a config.
 */
export const computeComparison = (
  rows: ValidTimeseriesRow[],
  peak: ValidTimeseriesRow,
  compareFrom: CompareFrom,
): TimeseriesComparison => {
  const latest = rows[rows.length - 1];

  let fromRow: ValidTimeseriesRow;
  if (compareFrom === 'first') {
    fromRow = rows[0];
  } else if (compareFrom === 'peak') {
    fromRow = peak;
  } else {
    const match = rows.find((row) => row.year === compareFrom);
    if (!match) {
      throw new Error(
        `compareFrom で指定された年 ${compareFrom} のデータが timeseries.csv にありません`,
      );
    }
    fromRow = match;
  }

  const changePercent = ((latest.catchTons - fromRow.catchTons) / fromRow.catchTons) * 100;

  return {
    fromYear: fromRow.year,
    fromValue: fromRow.catchTons,
    toYear: latest.year,
    toValue: latest.catchTons,
    changePercent,
  };
};
