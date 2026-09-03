import type {ColorScale} from '../utils/colorScale';

/** One row of raw input data: a prefecture name and its measured value. */
export interface PrefectureDataRow {
  /** Full Japanese prefecture name, e.g. "鹿児島県", "北海道". Must match data/prefectureOrder.ts exactly. */
  prefecture: string;
  value: number;
}

/** A row after national ranking has been computed from `value`. */
export interface RankedPrefecture extends PrefectureDataRow {
  /** 1 = top of the ranking, per the theme's rankDirection. */
  rank: number;
}

/** Whether a bigger `value` or a smaller `value` counts as "rank 1". */
export type RankDirection = 'higherIsBetter' | 'lowerIsBetter';

/**
 * How prefectures are ordered on screen. 'northToSouth' (the default) is
 * the geographic sweep from data/prefectureOrder.ts; 'rankAscending' is a
 * countdown from the worst rank up to #1, independent of geography.
 */
export type DisplayOrderMode = 'northToSouth' | 'rankAscending';

/** Registry of formatters a theme can pick from without embedding functions in props. */
export type ValueFormatterId = 'hoursMinutes' | 'decimal1' | 'integer' | 'percent1';

/**
 * One band of a rank-based pacing curve: prefectures ranked between
 * `fromRank` and `toRank` (inclusive, `fromRank` is the worse/larger
 * number) get a duration linearly interpolated between `fromSeconds` and
 * `toSeconds`. Adjacent bands are expected to share a boundary value so the
 * pacing feels continuous within the "climb", with an intentional jump
 * allowed between bands (e.g. a top-3 "climax" band that's deliberately
 * slower than the band right before it).
 */
export interface RankPacingTier {
  fromRank: number;
  toRank: number;
  fromSeconds: number;
  toSeconds: number;
}

/**
 * Everything about a theme that is plain, serializable JSON. This is what
 * lives in the theme registry and what survives being passed as a Remotion
 * composition prop (functions can't cross the render/props-serialization
 * boundary, so formatting is looked up by id instead of stored directly).
 */
export interface ThemeMeta {
  id: string;
  /** Shown for ~1.2s at the very start, e.g. "日本で一番寝ている県は？" */
  title: string;
  /** Optional second line under the title, e.g. "あなたの県は何位？" */
  subtitle?: string;
  /** Raw unit label used by some formatters, e.g. "分", "店舗", "%" */
  unit: string;
  valueFormatterId: ValueFormatterId;
  rankDirection: RankDirection;
  /** Small print shown on the final summary screen, e.g. data source / disclaimer */
  sourceText?: string;
  /** Path to the CSV inside public/, passed to Remotion's staticFile() */
  csvPath: string;

  /** Defaults to 'northToSouth' if omitted. */
  displayOrder?: DisplayOrderMode;
  /** Optional short teaser shown once, before the sweep starts (skipped entirely if omitted). */
  hookText?: string;
  /**
   * Prefecture name -> a short reaction line. When that prefecture is
   * current, the line is shown as an extra-prominent banner and the
   * prefecture gets extra hold time. Purely data-driven -- the template
   * never invents its own commentary.
   */
  reactions?: Record<string, string>;
  /** Give the very last prefecture in the sweep extra hold time. Defaults to false. Ignored when `pacingByRank` is set. */
  emphasizeFinalItem?: boolean;
  /**
   * Per-rank duration curve (see RankPacingTier). When set, this is the
   * sole source of each prefecture's on-screen time -- `reactions` and
   * `emphasizeFinalItem` no longer scale duration, since the curve is
   * expected to already budget enough time to read a reaction line where
   * one exists (e.g. a slower top-3 band). Falls back to a flat duration
   * when omitted, same as before.
   */
  pacingByRank?: RankPacingTier[];
  /** Heading for the closing ranked list. Defaults to "全国TOP5" if omitted. */
  finalListTitle?: string;
  /** Optional line shown under the closing ranked list. */
  closingLine?: string;
  /** Overrides how long the closing ranked-list screen stays up. Defaults to timing.ts's FINAL_TOP_FIVE_FRAMES (3s) if omitted. */
  finalScreenSeconds?: number;
}

/** A theme with its CSV loaded and rankings computed, ready to render. */
export interface ResolvedTheme extends ThemeMeta {
  data: PrefectureDataRow[];
  /** All 47 rows sorted best-to-worst per rankDirection. */
  ranked: RankedPrefecture[];
  /** Fast lookup from prefecture name -> its national ranking row. */
  rankByPrefecture: Record<string, RankedPrefecture>;
  /** Choropleth color scale (low -> high) derived from this theme's own data. */
  colorScale: ColorScale;
}
