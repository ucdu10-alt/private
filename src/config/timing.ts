/**
 * All pacing lives here (plus the per-fish overrides in each fish's
 * config.json). Change these numbers to retime the whole series without
 * touching any component.
 */
export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const secondsToFrames = (seconds: number): number => Math.round(seconds * FPS);

/** Fallbacks used when a fish's config.json omits a duration field. */
export const TIMESERIES_DEFAULTS = {
  introDuration: 1.8,
  timelineDuration: 24,
  endingDuration: 3,
};

/** How long the current-year marker holds on the final (latest) year before the comparison card appears. */
export const TIMESERIES_FINAL_YEAR_HOLD_SECONDS = 1.1;
/** How long a peak/annotation callout stays visible once triggered. */
export const TIMESERIES_PEAK_BADGE_SECONDS = 1.1;
export const TIMESERIES_ANNOTATION_SECONDS = 1.6;

export const RANKING_DEFAULTS = {
  secondsPerRank: 1.3,
};
export const RANKING_INTRO_DURATION_SECONDS = 1.8;
/** Extra hold time (on top of secondsPerRank) for the #1 reveal. */
export const RANKING_FINAL_RANK_EXTRA_SECONDS = 1.0;
export const RANKING_FINAL_TOP_THREE_SECONDS = 3.2;
