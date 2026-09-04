import React from 'react';
import {interpolate} from 'remotion';
import {COLORS} from '../config/theme';

export interface BigRankBadgeProps {
  rank: number;
  /** Frames elapsed since this prefecture became current. */
  localFrame: number;
}

/**
 * The single most important number in the video, in a fixed spot every
 * single frame (its own row, above the map -- never overlaid on top of
 * changing map content) so a viewer always knows exactly where to look for
 * "what rank is this". Deliberately huge and opaque, not a subtle badge.
 */
export const BigRankBadge: React.FC<BigRankBadgeProps> = ({rank, localFrame}) => {
  const opacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(localFrame, [0, 6], [0.88, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isFirst = rank === 1;

  return (
    <div style={{display: 'flex', justifyContent: 'center', opacity, transform: `scale(${scale})`}}>
      <div
        style={{
          background: isFirst ? COLORS.accent : COLORS.rankBadge,
          color: isFirst ? '#2a1c02' : '#2a0d0d',
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1,
          padding: '20px 52px',
          borderRadius: 999,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
          whiteSpace: 'nowrap',
        }}
      >
        全国{rank}位
      </div>
    </div>
  );
};
