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

const SLOT_WIDTH_PERCENT = 100 / 3;

/**
 * "暫定TOP3" -- the leaderboard among prefectures shown so far. Kept
 * deliberately low-key (a slim single-row strip, muted background, small
 * type) so the map stays the visual lead; a viewer notices it without it
 * competing for attention. Every time a new prefecture enters or reshuffles
 * the top 3, its chip slides to its new slot instead of just popping there.
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
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(10, 15, 27, 0.7)',
        borderRadius: 12,
        padding: '8px 14px',
      }}
    >
      <div style={{fontSize: 15, color: COLORS.textSecondary, fontWeight: 700, flexShrink: 0}}>
        暫定TOP3
      </div>
      <div style={{position: 'relative', flex: 1, height: 34}}>
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
                left: `${slot * SLOT_WIDTH_PERCENT}%`,
                width: `${SLOT_WIDTH_PERCENT}%`,
                height: '100%',
                opacity,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                paddingRight: 6,
              }}
            >
              <RankPill rank={slotIndex + 1} size={22} />
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.prefecture}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.accent,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatValue(theme.valueFormatterId, entry.value, theme.unit)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
