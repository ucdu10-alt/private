import {FINAL_ITEM_DURATION_MULTIPLIER, FPS, REACTION_DURATION_MULTIPLIER} from '../config/timing';
import type {RankedPrefecture, RankPacingTier, ThemeMeta} from '../data/types';

const framesForRankPacing = (rank: number, tiers: RankPacingTier[], fallbackFrames: number): number => {
  for (const tier of tiers) {
    const lo = Math.min(tier.fromRank, tier.toRank);
    const hi = Math.max(tier.fromRank, tier.toRank);
    if (rank < lo || rank > hi) continue;
    const span = tier.fromRank - tier.toRank;
    const t = span === 0 ? 0 : (tier.fromRank - rank) / span;
    const seconds = tier.fromSeconds + (tier.toSeconds - tier.fromSeconds) * t;
    return Math.round(seconds * FPS);
  }
  return fallbackFrames;
};

/**
 * How long each item in the sweep stays on screen.
 *
 * When the theme supplies `pacingByRank`, that curve is the sole source of
 * truth -- each prefecture's duration comes from linearly interpolating
 * within whichever band its rank falls into (see RankPacingTier), which is
 * expected to already budget enough time for a reaction line where one
 * exists (e.g. a deliberately slower top-3 "climax" band).
 *
 * Otherwise, every item gets the same flat `basePerItemFrames`, except: a
 * prefecture with a `reactions` line gets extra time to read it, and (if
 * the theme opts in via `emphasizeFinalItem`) the very last item gets extra
 * time too. When both apply to the same prefecture, the longer of the two
 * wins rather than stacking.
 *
 * This is the single source of truth for per-item timing -- both the total
 * duration calculation (Root.tsx) and the frame-to-item lookup during
 * playback (RankingScene) call this so they can never drift apart.
 */
export const computeItemDurations = (
  orderedRows: RankedPrefecture[],
  theme: Pick<ThemeMeta, 'reactions' | 'emphasizeFinalItem' | 'pacingByRank'>,
  basePerItemFrames: number,
): number[] => {
  if (theme.pacingByRank) {
    const tiers = theme.pacingByRank;
    return orderedRows.map((row) => framesForRankPacing(row.rank, tiers, basePerItemFrames));
  }

  return orderedRows.map((row, index) => {
    const isLast = index === orderedRows.length - 1;
    let multiplier = 1;
    if (theme.reactions?.[row.prefecture]) {
      multiplier = Math.max(multiplier, REACTION_DURATION_MULTIPLIER);
    }
    if (theme.emphasizeFinalItem && isLast) {
      multiplier = Math.max(multiplier, FINAL_ITEM_DURATION_MULTIPLIER);
    }
    return Math.round(basePerItemFrames * multiplier);
  });
};

export const sumDurations = (durations: number[]): number =>
  durations.reduce((total, duration) => total + duration, 0);

export interface TimelinePosition {
  index: number;
  /** Frames elapsed since this item became current (0-based). */
  localFrame: number;
}

/**
 * Maps an elapsed frame count to "which item is current, and how far into
 * its own slot are we" given a list of (possibly unequal) per-item
 * durations. Frames past the end clamp to the last item, matching how
 * Math.floor-based division used to clamp for the uniform-duration case.
 */
export const computeTimelinePosition = (frame: number, durations: number[]): TimelinePosition => {
  let elapsed = 0;
  for (let index = 0; index < durations.length; index += 1) {
    const duration = durations[index];
    const isLastItem = index === durations.length - 1;
    if (frame < elapsed + duration || isLastItem) {
      return {index, localFrame: frame - elapsed};
    }
    elapsed += duration;
  }
  return {index: 0, localFrame: frame};
};
