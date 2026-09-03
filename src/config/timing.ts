/**
 * All pacing for the video lives here. Change these numbers to retime the
 * whole video without touching any component.
 */
export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const TIMING_SECONDS = {
  /** Opening title card ("日本で一番寝ている県は？" etc.) */
  intro: 1.2,
  /** How long each prefecture stays on screen while the map sweeps north -> south */
  perPrefecture: 0.55,
  /** Closing "全国TOP5" summary screen */
  finalTopFive: 3,
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const INTRO_FRAMES = secondsToFrames(TIMING_SECONDS.intro);
export const PER_PREFECTURE_FRAMES = secondsToFrames(TIMING_SECONDS.perPrefecture);
export const FINAL_TOP_FIVE_FRAMES = secondsToFrames(TIMING_SECONDS.finalTopFive);

export const computeTotalDurationInFrames = (prefectureCount: number): number =>
  INTRO_FRAMES + prefectureCount * PER_PREFECTURE_FRAMES + FINAL_TOP_FIVE_FRAMES;
