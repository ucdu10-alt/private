import React from 'react';
import {interpolate} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';

export interface BigNumberInfoPanelProps {
  row: RankedPrefecture;
  theme: ResolvedTheme;
  /** Frame count since this prefecture became the current one (0-based). */
  localFrame: number;
  durationInFrames: number;
}

/**
 * Prefecture name + the value, stacked as their own oversized block below
 * the map (not overlaid on it) -- the second and third things a viewer
 * reads, right after the fixed rank badge above the map. The value in
 * particular gets a near-opaque backing panel and a very large, bold,
 * high-contrast number so it reads instantly regardless of what's visually
 * busy elsewhere on screen.
 */
export const BigNumberInfoPanel: React.FC<BigNumberInfoPanelProps> = ({row, theme, localFrame, durationInFrames}) => {
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(localFrame, [0, 5], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Count-up stays short relative to the slot so the number spends most of
  // its time on screen fully settled and readable, not mid-animation.
  const countEnd = Math.max(2, Math.min(8, durationInFrames - 14));
  const countProgress = interpolate(localFrame, [0, countEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const formattedValue = formatValue(theme.valueFormatterId, row.value * countProgress, theme.unit);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          color: COLORS.textPrimary,
          lineHeight: 1,
          textShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        {row.prefecture}
      </div>
      <div
        style={{
          background: 'rgba(6, 10, 20, 0.85)',
          border: `2px solid ${COLORS.accent}66`,
          borderRadius: 24,
          padding: '14px 44px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{fontSize: 26, fontWeight: 700, color: COLORS.textSecondary}}>{theme.valueLabel ?? theme.unit}</div>
        <div
          style={{
            fontSize: 138,
            fontWeight: 900,
            color: COLORS.accent,
            lineHeight: 1.05,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.6)',
            whiteSpace: 'nowrap',
          }}
        >
          {formattedValue}
        </div>
      </div>
    </div>
  );
};
