import React from 'react';
import {COLORS} from '../config/theme';

export interface ProgressRailProps {
  /** 0 at the very start (Hokkaido), 1 at the very end (Okinawa). */
  progressFraction: number;
}

/**
 * A thin north(top) -> south(bottom) track along the map's edge. The map's
 * own pan/zoom camera makes local geography clear but, once it's zoomed
 * into one region, it stops showing where that region sits in the overall
 * Hokkaido-to-Okinawa journey -- this rail is the constant, always-visible
 * answer to that.
 */
export const ProgressRail: React.FC<ProgressRailProps> = ({progressFraction}) => {
  const clamped = Math.min(1, Math.max(0, progressFraction));

  return (
    <div
      style={{
        width: 30,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{fontSize: 15, fontWeight: 800, color: COLORS.textSecondary}}>北</div>
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
      <div style={{fontSize: 15, fontWeight: 800, color: COLORS.textSecondary}}>南</div>
    </div>
  );
};
