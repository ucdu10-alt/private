import React from 'react';
import {COLORS} from '../config/theme';

export const RankPill: React.FC<{rank: number; size?: number}> = ({rank, size = 40}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: rank === 1 ? COLORS.accent : COLORS.rankBadge,
      color: '#1a1206',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: size * 0.46,
      flexShrink: 0,
    }}
  >
    {rank}
  </div>
);
