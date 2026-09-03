import React from 'react';
import {COLORS} from '../config/theme';

export interface ProgressRailProps {
  /** 0 at the very start, 1 at the very end. */
  progressFraction: number;
  /** Label at the top of the track. Defaults to '北' (north). */
  topLabel?: string;
  /** Label at the bottom of the track. Defaults to '南' (south). */
  bottomLabel?: string;
}

/**
 * A thin top -> bottom progress track along the map's edge. The map's own
 * pan/zoom camera makes local detail clear but, once it's zoomed into one
 * region, it stops showing overall progress through the sweep -- this rail
 * is the constant, always-visible answer to that. Labels default to
 * north/south (the geographic sweep) but can be overridden -- e.g. to a
 * rank countdown when the theme orders prefectures worst-to-best instead.
 */
export const ProgressRail: React.FC<ProgressRailProps> = ({
  progressFraction,
  topLabel = '北',
  bottomLabel = '南',
}) => {
  const clamped = Math.min(1, Math.max(0, progressFraction));

  return (
    <div
      style={{
        width: 40,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{fontSize: 13, fontWeight: 800, color: COLORS.textSecondary, whiteSpace: 'nowrap'}}>
        {topLabel}
      </div>
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: 5,
          margin: '6px 0',
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.15)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${clamped * 100}%`,
            borderRadius: 3,
            background: COLORS.mapRevealed,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `${clamped * 100}%`,
            width: 16,
            height: 16,
            borderRadius: 8,
            background: COLORS.mapCurrent,
            border: `2px solid ${COLORS.background}`,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 8px ${COLORS.mapCurrent}`,
          }}
        />
      </div>
      <div style={{fontSize: 13, fontWeight: 800, color: COLORS.textSecondary, whiteSpace: 'nowrap'}}>
        {bottomLabel}
      </div>
    </div>
  );
};
