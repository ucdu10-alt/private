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

/** Registry of formatters a theme can pick from without embedding functions in props. */
export type ValueFormatterId = 'hoursMinutes' | 'decimal1' | 'integer' | 'percent1';

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
}

/** A theme with its CSV loaded and rankings computed, ready to render. */
export interface ResolvedTheme extends ThemeMeta {
  data: PrefectureDataRow[];
  /** All 47 rows sorted best-to-worst per rankDirection. */
  ranked: RankedPrefecture[];
  /** Fast lookup from prefecture name -> its national ranking row. */
  rankByPrefecture: Record<string, RankedPrefecture>;
}
