import React from 'react';
import {interpolate, useVideoConfig} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';

export interface CurrentPrefecturePanelProps {
  row: RankedPrefecture;
  theme: ResolvedTheme;
  /** Frame count since this prefecture became the current one (0-based). */
  localFrame: number;
  /** How many frames this prefecture stays on screen for. */
  durationInFrames: number;
  progress: {index: number; total: number};
}

/**
 * The name / value / national-rank readout for whichever prefecture is
 * currently in the spotlight. Animates in on each prefecture change: a
 * quick fade+slide for the name, a short count-up for the value, and a
 * slightly delayed fade for the rank badge.
 */
export const CurrentPrefecturePanel: React.FC<CurrentPrefecturePanelProps> = ({
  row,
  theme,
  localFrame,
  durationInFrames,
  progress,
}) => {
  useVideoConfig();

  const nameOpacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nameTranslateY = interpolate(localFrame, [0, 6], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Keep the count-up/rank-reveal short relative to how long the
  // prefecture stays on screen, so most of its time on screen is spent
  // holding still and readable rather than mid-animation.
  const countEnd = Math.max(2, Math.min(8, durationInFrames - 10));
  const countProgress = interpolate(localFrame, [0, countEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayedValue = row.value * countProgress;
  const formattedValue = formatValue(theme.valueFormatterId, displayedValue, theme.unit);

  const rankOpacity = interpolate(localFrame, [countEnd, countEnd + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '18px 0 10px',
      }}
    >
      <div style={{fontSize: 20, color: COLORS.textSecondary}}>
        {progress.index} / {progress.total}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.textPrimary,
          opacity: nameOpacity,
          transform: `translateY(${nameTranslateY}px)`,
        }}
      >
        {row.prefecture}
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          color: COLORS.accent,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
        }}
      >
        {formattedValue}
      </div>
      <div
        style={{
          opacity: rankOpacity,
          background: COLORS.rankBadge,
          color: '#2a0d0d',
          fontWeight: 800,
          fontSize: 30,
          padding: '6px 22px',
          borderRadius: 999,
        }}
      >
        全国{row.rank}位
      </div>
    </div>
  );
};
