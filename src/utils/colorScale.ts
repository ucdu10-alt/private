/**
 * Choropleth color scale: buckets raw values into 5 classes (low -> high)
 * so the map communicates magnitude directly, independent of whether a
 * "high" value is good or bad for the theme (that's `rankDirection`'s job,
 * used only for the ranking/leaderboards -- the map coloring here is
 * always "more of the raw number = warmer color").
 *
 * Thresholds are computed from the theme's own data (quantiles), so every
 * theme gets a scale that fits its actual value spread instead of assuming
 * sleep-time-shaped numbers.
 */
export interface ColorScale {
  /** 4 ascending breakpoints splitting the data into 5 classes. */
  thresholds: [number, number, number, number];
  /** 5 colors, low -> high, matching the 5 classes. */
  colors: [string, string, string, string, string];
  min: number;
  max: number;
}

const SEQUENTIAL_COLORS: [string, string, string, string, string] = [
  '#3d6fa8', // low - cool blue
  '#4f9d8f', // teal
  '#e0c341', // yellow (mid)
  '#e2823a', // orange
  '#e0473f', // high - red
];

const quantile = (sortedValues: number[], p: number): number => {
  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.round(p * (sortedValues.length - 1))));
  return sortedValues[index];
};

export const buildColorScale = (values: number[]): ColorScale => {
  const sorted = [...values].sort((a, b) => a - b);
  const thresholds: [number, number, number, number] = [
    quantile(sorted, 0.2),
    quantile(sorted, 0.4),
    quantile(sorted, 0.6),
    quantile(sorted, 0.8),
  ];
  return {
    thresholds,
    colors: SEQUENTIAL_COLORS,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
};

export const colorForValue = (value: number, scale: ColorScale): string => {
  const {thresholds, colors} = scale;
  let classIndex = 0;
  while (classIndex < thresholds.length && value > thresholds[classIndex]) {
    classIndex += 1;
  }
  return colors[classIndex];
};
