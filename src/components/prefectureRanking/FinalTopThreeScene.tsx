import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY, RADIUS} from '../../config/theme';
import {formatWithUnit} from '../../utils/formatters';
import type {RankedPrefectureRow} from '../../data/types';
import {RankPill} from './RankPill';

export interface FinalTopThreeSceneProps {
  top3: RankedPrefectureRow[];
  unit: string;
  fishName: string;
}

/** Closing recap: TOP3 stacked together, held a beat longer than any single rank slot. */
export const FinalTopThreeScene: React.FC<FinalTopThreeSceneProps> = ({top3, unit, fishName}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 32, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 6}}>
          {fishName} 漁獲量 TOP3
        </div>
        {top3.map((row) => (
          <div
            key={row.prefecture}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              background: COLORS.panelBackground,
              border: `1px solid ${COLORS.panelBorder}`,
              borderRadius: RADIUS.lg,
              padding: '16px 32px',
              minWidth: 660,
            }}
          >
            <RankPill rank={row.rank} size={64} />
            <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 44, fontWeight: 800, color: COLORS.textPrimary, flex: 1}}>
              {row.prefecture}
            </div>
            <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 38, fontWeight: 800, color: COLORS.accentStrong}}>
              {formatWithUnit(row.catchTons, unit)}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
