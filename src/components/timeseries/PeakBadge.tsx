import React from 'react';
import {COLORS, FONT_FAMILY_DISPLAY, RADIUS} from '../../config/theme';

export interface PeakBadgeProps {
  /** 0..1 -- so the caller can fade this in/out around the peak frame without unmounting it. */
  opacity: number;
  /** Position as a percentage of the chart box, so it tracks the peak point regardless of chart size. */
  leftPercent: number;
  topPercent: number;
}

/** "過去最高 / ピーク" -- appears briefly right as the line animation crosses the peak year. */
export const PeakBadge: React.FC<PeakBadgeProps> = ({opacity, leftPercent, topPercent}) => {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: `translate(-50%, -130%) scale(${0.85 + 0.15 * opacity})`,
        opacity,
        background: COLORS.peakBadgeBackground,
        color: COLORS.peakBadgeText,
        borderRadius: RADIUS.md,
        padding: '10px 20px',
        fontFamily: FONT_FAMILY_DISPLAY,
        fontWeight: 800,
        fontSize: 26,
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      過去最高・ピーク
    </div>
  );
};
