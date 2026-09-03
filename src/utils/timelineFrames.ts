import {FPS, RANKING_FINAL_RANK_EXTRA_SECONDS} from '../config/timing';

export interface TimelinePosition {
  index: number;
  /** Frames elapsed since this slot became current (0-based). */
  localFrame: number;
}

/**
 * Per-slot durations for the rank countdown (rankCount -> 1). Every slot is
 * `secondsPerRank` long except the very last one shown (rank #1), which
 * gets extra hold time so the "winner" lands with more weight.
 */
export const computeRankSlotDurations = (rankCount: number, secondsPerRank: number): number[] => {
  const base = Math.round(secondsPerRank * FPS);
  const extra = Math.round(RANKING_FINAL_RANK_EXTRA_SECONDS * FPS);
  return Array.from({length: rankCount}, (_, index) => (index === rankCount - 1 ? base + extra : base));
};

export const sumDurations = (durations: number[]): number =>
  durations.reduce((total, duration) => total + duration, 0);

/**
 * Maps an elapsed frame count to "which slot is current, and how far into
 * its own duration are we" given a list of (possibly unequal) per-slot
 * durations. Frames past the end clamp to the last slot.
 */
export const computeTimelinePosition = (frame: number, durations: number[]): TimelinePosition => {
  let elapsed = 0;
  for (let index = 0; index < durations.length; index += 1) {
    const duration = durations[index];
    const isLast = index === durations.length - 1;
    if (frame < elapsed + duration || isLast) {
      return {index, localFrame: frame - elapsed};
    }
    elapsed += duration;
  }
  return {index: 0, localFrame: frame};
};
