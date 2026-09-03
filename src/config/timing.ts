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
  /** Optional one-time teaser screen before the sweep starts (theme.hookText). */
  hook: 1.3,
  /** How long each prefecture stays on screen while the sweep runs. */
  perPrefecture: 0.75,
  /** How much longer (relative to perPrefecture) a prefecture with a reaction line stays on screen. */
  reactionMultiplier: 2,
  /** How much longer (relative to perPrefecture) the very last prefecture stays on screen, when theme.emphasizeFinalItem is set. */
  finalItemMultiplier: 2.2,
  /** Closing ranked-list summary screen. */
  finalTopFive: 3,
};

const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const HEADER_INTRO_FRAMES = secondsToFrames(TIMING_SECONDS.headerIntro);
export const HOOK_FRAMES = secondsToFrames(TIMING_SECONDS.hook);
export const PER_PREFECTURE_FRAMES = secondsToFrames(TIMING_SECONDS.perPrefecture);
export const REACTION_DURATION_MULTIPLIER = TIMING_SECONDS.reactionMultiplier;
export const FINAL_ITEM_DURATION_MULTIPLIER = TIMING_SECONDS.finalItemMultiplier;
export const FINAL_TOP_FIVE_FRAMES = secondsToFrames(TIMING_SECONDS.finalTopFive);
