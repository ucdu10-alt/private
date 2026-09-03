/**
 * Shared visual design tokens for the whole "日本の魚をデータで見る" series.
 * Deliberately a plain constants object (not a CSS-in-JS theme provider) so
 * every component just imports what it needs. Change values here to
 * re-skin every fish/every video at once -- nothing fish-specific belongs
 * in this file.
 */
export const COLORS = {
  background: '#12100d',
  backgroundGradientEnd: '#1c1712',
  surface: 'rgba(28, 24, 19, 0.72)',
  surfaceBorder: 'rgba(255, 244, 224, 0.12)',

  textPrimary: '#f8f2e6',
  textSecondary: '#c9bda6',
  textMuted: '#8f8371',

  accent: '#ff8a3d', // warm coral/amber -- avoids the generic "all blue = ocean" look
  accentSoft: 'rgba(255, 138, 61, 0.22)',
  accentStrong: '#ffb347',

  positive: '#7bd88f',
  negative: '#ff6b6b',

  chartLine: '#ffb347',
  chartAreaFrom: 'rgba(255, 179, 71, 0.35)',
  chartAreaTo: 'rgba(255, 179, 71, 0)',
  chartGrid: 'rgba(248, 242, 230, 0.14)',
  chartAxisLabel: 'rgba(248, 242, 230, 0.55)',

  peakBadgeBackground: '#ffb347',
  peakBadgeText: '#241a0d',
  annotationBackground: 'rgba(18, 16, 13, 0.92)',
  annotationBorder: 'rgba(255, 179, 71, 0.6)',

  // Map tokens (consumed by JapanMap.tsx, reused from the prefecture-map
  // engine this project builds on).
  mapNotYet: 'rgba(201, 189, 166, 0.22)',
  mapRevealed: '#3d6fa8',
  mapCurrent: '#ffb347',
  mapStroke: 'rgba(18, 16, 13, 0.9)',

  panelBackground: 'rgba(24, 20, 16, 0.88)',
  panelBorder: 'rgba(255, 244, 224, 0.1)',
  rankBadge: '#ff6b6b',
};

export const FONT_FAMILY =
  "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', system-ui, sans-serif";

/** Extra-bold face used only for the very large hero numbers/titles. */
export const FONT_FAMILY_DISPLAY = FONT_FAMILY;

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 28,
};

/**
 * Rough safe margins so titles/numbers never sit under a platform's own UI
 * chrome (profile bar, caption area, share/like rail) on IG Reels / TikTok
 * / YouTube Shorts.
 */
export const SAFE_AREA = {
  top: 180,
  bottom: 260,
  side: 56,
};

/** Small series wordmark shown consistently across every fish/every mode. */
export const SERIES_TAG = '日本の魚をデータで見る';
