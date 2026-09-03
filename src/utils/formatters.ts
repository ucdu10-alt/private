/** "312400" -> "312,400" */
export const formatInteger = (value: number): string => Math.round(value).toLocaleString('ja-JP');

/** "312400", "t" -> "312,400t" */
export const formatWithUnit = (value: number, unit: string): string => `${formatInteger(value)}${unit}`;

/** 1987 -> "1987年" */
export const formatYear = (year: number): string => `${year}年`;

/**
 * "約88%減" / "約12%増" -- the phrasing timeseries comparisons use. Takes a
 * signed percent change (negative = decrease) and always renders the
 * magnitude with an explicit 増/減 suffix rather than a +/- sign, since
 * that's the more natural Japanese reading for "before vs after".
 */
export const formatChangeLabel = (percentChange: number): string => {
  const magnitude = Math.round(Math.abs(percentChange));
  const direction = percentChange < 0 ? '減' : '増';
  return `約${magnitude}%${direction}`;
};
