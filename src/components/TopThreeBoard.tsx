import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';
import {RankPill} from './RankPill';

export interface TopThreeBoardProps {
  /** Provisional top 3 before the current prefecture was revealed. */
  previousTop3: RankedPrefecture[];
  /** Provisional top 3 including the current prefecture. */
  currentTop3: RankedPrefecture[];
  theme: ResolvedTheme;
  localFrame: number;
  durationInFrames: number;
}

const ROW_HEIGHT = 58;

/**
 * "暫定TOP3" -- the leaderboard among prefectures shown so far. Every time a
 * new prefecture enters or reshuffles the top 3, its row slides to its new
 * slot instead of just popping there, so the reorder reads as a reorder.
 */
export const TopThreeBoard: React.FC<TopThreeBoardProps> = ({
  previousTop3,
  currentTop3,
  theme,
  localFrame,
  durationInFrames,
}) => {
  const {fps} = useVideoConfig();
  const animDuration = Math.max(4, Math.min(16, durationInFrames));

  const slotProgress = spring({
    frame: localFrame,
    fps,
    config: {damping: 16, stiffness: 120, mass: 0.6},
    durationInFrames: animDuration,
  });

  return (
    <div
      style={{
        background: COLORS.panelBackground,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: 20,
        padding: '14px 20px 16px',
      }}
    >
      <div style={{fontSize: 22, color: COLORS.textSecondary, marginBottom: 8, fontWeight: 700}}>
        暫定TOP3
      </div>
      <div style={{position: 'relative', height: ROW_HEIGHT * 3}}>
        {currentTop3.map((entry, slotIndex) => {
          const previousSlotIndex = previousTop3.findIndex((p) => p.prefecture === entry.prefecture);
          const isNewEntry = previousSlotIndex === -1;
          const fromSlot = isNewEntry ? 3 : previousSlotIndex;
          const slot = fromSlot + (slotIndex - fromSlot) * slotProgress;
          const opacity = isNewEntry ? Math.min(1, slotProgress + 0.15) : 1;

          return (
            <div
              key={entry.prefecture}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: ROW_HEIGHT,
                transform: `translateY(${slot * ROW_HEIGHT}px)`,
                opacity,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <RankPill rank={slotIndex + 1} size={36} />
              <div style={{fontSize: 26, fontWeight: 700, color: COLORS.textPrimary, flex: 1}}>
                {entry.prefecture}
              </div>
              <div style={{fontSize: 24, fontWeight: 700, color: COLORS.accent, fontVariantNumeric: 'tabular-nums'}}>
                {formatValue(theme.valueFormatterId, entry.value, theme.unit)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
