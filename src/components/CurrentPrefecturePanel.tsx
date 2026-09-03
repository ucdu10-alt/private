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
 * currently in the spotlight, overlaid directly on the bottom edge of the
 * map (a "lower third") so a viewer's eyes never have to leave the map
 * area to read it. Text reaches full size/opacity almost immediately on
 * each prefecture change -- even a half-second glance should be enough to
 * read the name and rank -- then just holds still.
 */
export const CurrentPrefecturePanel: React.FC<CurrentPrefecturePanelProps> = ({
  row,
  theme,
  localFrame,
  durationInFrames,
  progress,
}) => {
  useVideoConfig();

  const inOpacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const inTranslateY = interpolate(localFrame, [0, 4], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Keep the count-up short relative to how long the prefecture stays on
  // screen, so most of its time on screen is spent holding still.
  const countEnd = Math.max(2, Math.min(6, durationInFrames - 12));
  const countProgress = interpolate(localFrame, [0, countEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayedValue = row.value * countProgress;
  const formattedValue = formatValue(theme.valueFormatterId, displayedValue, theme.unit);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        opacity: inOpacity,
        transform: `translateY(${inTranslateY}px)`,
        background:
          'linear-gradient(to top, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.82) 55%, rgba(6, 10, 20, 0) 100%)',
        padding: '54px 30px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontSize: 88, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1}}>
          {row.prefecture}
        </div>
        <div style={{fontSize: 22, color: COLORS.textSecondary, fontVariantNumeric: 'tabular-nums'}}>
          {progress.index} / {progress.total}
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: COLORS.accent,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {formattedValue}
        </div>
        <div
          style={{
            flexShrink: 0,
            background: COLORS.rankBadge,
            color: '#2a0d0d',
            fontWeight: 900,
            fontSize: 46,
            padding: '8px 26px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          全国{row.rank}位
        </div>
      </div>
    </div>
  );
};
