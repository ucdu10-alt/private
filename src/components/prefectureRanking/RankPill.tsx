import React from 'react';
import {COLORS, FONT_FAMILY_DISPLAY} from '../../config/theme';

/** Shared round rank badge, e.g. "3". Used both in the per-rank reveal and the closing TOP3 list. */
export const RankPill: React.FC<{rank: number; size?: number}> = ({rank, size = 64}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: COLORS.rankBadge,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_FAMILY_DISPLAY,
      fontWeight: 800,
      fontSize: size * 0.42,
      color: '#ffffff',
      boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
      flexShrink: 0,
    }}
  >
    {rank}
  </div>
);
