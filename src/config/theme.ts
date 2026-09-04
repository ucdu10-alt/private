/**
 * Shared visual design tokens. Deliberately a plain constants object (not a
 * CSS-in-JS theme provider) so every component can just import what it
 * needs -- this is a first-pass design meant to be swapped out easily.
 */
export const COLORS = {
  background: '#0b1220',
  backgroundGradientEnd: '#111c30',
  textPrimary: '#f5f7fb',
  textSecondary: '#9fb0c9',
  accent: '#ffd23f',
  accentSoft: 'rgba(255, 210, 63, 0.25)',
  mapNotYet: 'rgba(148, 163, 184, 0.32)',
  mapRevealed: '#3d6fa8',
  mapCurrent: '#ffd23f',
  mapStroke: 'rgba(11, 18, 32, 0.9)',
  panelBackground: 'rgba(17, 28, 48, 0.88)',
  panelBorder: 'rgba(255, 255, 255, 0.08)',
  rankBadge: '#ff6b6b',
  /** Dual-metric themes: raw-count metric (e.g. "店舗数") accent -- light blue/cyan. */
  storeCountAccent: '#5fd4e8',
  /** Dual-metric themes: per-capita metric (e.g. "人口10万人あたり") accent -- pink/orange. */
  perCapitaAccent: '#ff8fa3',
};

export const FONT_FAMILY =
  "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', system-ui, sans-serif";
