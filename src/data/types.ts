import type {ColorScale} from '../utils/colorScale';

/**
 * A single point-change annotation a fish config can supply, e.g.
 * `{year: 2010, text: "ここから急減"}`. Purely data-driven -- the template
 * never invents its own commentary.
 */
export interface Annotation {
  year: number;
  text: string;
}

/** `compareFrom` in a fish's timeseries config: which year to compare the latest year against. */
export type CompareFrom = 'first' | 'peak' | number;

export interface TimeseriesConfig {
  enabled: boolean;
  /** Shown during the intro, e.g. "サンマは昔、どれくらい獲れていた？" */
  title: string;
  introDuration: number;
  timelineDuration: number;
  endingDuration: number;
  compareFrom: CompareFrom;
  annotations: Annotation[];
}

/** `rankCount` in a fish's prefectureRanking config: 'auto' or an explicit override. */
export type RankCountConfig = 'auto' | number;

export interface PrefectureRankingConfig {
  enabled: boolean;
  /** Shown during the intro, e.g. "サンマが一番獲れる県は？" */
  title: string;
  rankCount: RankCountConfig;
  secondsPerRank: number;
  zeroValuesIncluded: boolean;
}

export interface FishSource {
  name: string;
  year: string;
  url: string;
}

/**
 * One fish species, loaded from `public/data/fish/<id>/config.json`. This is
 * the ONLY place fish-specific wording/numbers should live -- components
 * never hardcode a species name, title, or duration.
 */
export interface FishConfig {
  id: string;
  name: string;
  /** Path under /public, e.g. "/fish/sanma.png". */
  image: string;
  unit: string;
  timeseries?: TimeseriesConfig;
  prefectureRanking?: PrefectureRankingConfig;
  source: FishSource;
}

/** One row of `public/data/fish/<id>/timeseries.csv` after parsing/validation. */
export interface TimeseriesRow {
  year: number;
  /** null when the source CSV left this year's value blank (欠損値). */
  catchTons: number | null;
}

/** A timeseries row that has an actual value -- what the chart/animation walks through. */
export interface ValidTimeseriesRow {
  year: number;
  catchTons: number;
}

export interface TimeseriesComparison {
  fromYear: number;
  fromValue: number;
  toYear: number;
  toValue: number;
  changePercent: number;
}

/** A fish's timeseries data, fully loaded/validated/derived -- ready to render. */
export interface ResolvedTimeseries {
  rows: ValidTimeseriesRow[];
  minYear: number;
  maxYear: number;
  minValue: number;
  maxValue: number;
  peak: ValidTimeseriesRow;
  peakIndex: number;
  latest: ValidTimeseriesRow;
  comparison: TimeseriesComparison;
}

/** One row of `public/data/fish/<id>/prefecture.csv` after parsing/validation. */
export interface PrefectureRow {
  prefecture: string;
  /** null when the source CSV left this prefecture's value blank (欠損値). */
  catchTons: number | null;
}

/** A prefecture row that made it into the ranking (has a usable value). */
export interface RankedPrefectureRow {
  prefecture: string;
  catchTons: number;
  rank: number;
}

/** A fish's prefecture-ranking data, fully loaded/validated/derived -- ready to render. */
export interface ResolvedPrefectureRanking {
  /** rank 1 -> rankCount, best first. */
  ranked: RankedPrefectureRow[];
  rankCount: number;
  colorScale: ColorScale;
}
