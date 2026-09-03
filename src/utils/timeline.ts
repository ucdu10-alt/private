import {FINAL_ITEM_DURATION_MULTIPLIER, REACTION_DURATION_MULTIPLIER} from '../config/timing';
import type {RankedPrefecture, ThemeMeta} from '../data/types';

/**
 * How long each item in the sweep stays on screen. Almost always the same
 * flat `basePerItemFrames`, except: a prefecture with a `reactions` line
 * gets extra time to read it, and (if the theme opts in via
 * `emphasizeFinalItem`) the very last item gets extra time too. When both
 * apply to the same prefecture (as happens whenever the reaction-flagged
 * prefecture is also the actual #1 in rank-ascending order), the longer of
 * the two wins rather than stacking.
 *
 * This is the single source of truth for per-item timing -- both the total
 * duration calculation (Root.tsx) and the frame-to-item lookup during
 * playback (RankingScene) call this so they can never drift apart.
 */
export const computeItemDurations = (
  orderedRows: RankedPrefecture[],
  theme: Pick<ThemeMeta, 'reactions' | 'emphasizeFinalItem'>,
  basePerItemFrames: number,
): number[] => {
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
