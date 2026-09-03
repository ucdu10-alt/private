/**
 * All pacing for the video lives here. Change these numbers to retime the
 * whole video without touching any component.
 */
export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const TIMING_SECONDS = {
  /**
   * How long the title header takes to animate in at the very start. The
   * title itself stays visible for the whole video after that (it's a
   * persistent header, not a one-time splash screen) -- this only controls
   * the entrance animation's length.
   */
  headerIntro: 0.6,
  /** How long each prefecture stays on screen while the map sweeps north -> south */
  perPrefecture: 0.75,
  /** Closing "全国TOP5" summary screen */
  finalTopFive: 3,
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const HEADER_INTRO_FRAMES = secondsToFrames(TIMING_SECONDS.headerIntro);
export const PER_PREFECTURE_FRAMES = secondsToFrames(TIMING_SECONDS.perPrefecture);
export const FINAL_TOP_FIVE_FRAMES = secondsToFrames(TIMING_SECONDS.finalTopFive);

export const computeTotalDurationInFrames = (prefectureCount: number): number =>
  prefectureCount * PER_PREFECTURE_FRAMES + FINAL_TOP_FIVE_FRAMES;
