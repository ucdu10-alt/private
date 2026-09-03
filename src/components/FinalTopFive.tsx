import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ResolvedTheme} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';
import {RankPill} from './RankPill';

export interface FinalTopFiveProps {
  theme: ResolvedTheme;
}

/**
 * Closing summary: the true national top 5, shown for the whole video's
 * last ~2-3s. Unlike the "暫定TOP3" board during the main sweep, this list
 * is final -- it's just `theme.ranked`, not derived from reveal order.
 */
export const FinalTopFive: React.FC<FinalTopFiveProps> = ({theme}) => {
  const frame = useCurrentFrame();
  const top5 = theme.ranked.slice(0, 5);

  const headerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 56px'}}>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: COLORS.textSecondary,
          marginBottom: 28,
          opacity: headerOpacity,
        }}
      >
        全国TOP5
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: '100%'}}>
        {top5.map((row, i) => {
          const delay = 10 + i * 6;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const translateY = interpolate(frame, [delay, delay + 12], [24, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={row.prefecture}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: COLORS.panelBackground,
                border: `1px solid ${COLORS.panelBorder}`,
                borderRadius: 18,
                padding: '14px 22px',
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              <RankPill rank={row.rank} size={48} />
              <div style={{fontSize: 34, fontWeight: 800, color: COLORS.textPrimary, flex: 1}}>
                {row.prefecture}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: COLORS.accent,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatValue(theme.valueFormatterId, row.value, theme.unit)}
              </div>
            </div>
          );
        })}
      </div>
      {theme.sourceText ? (
        <div style={{marginTop: 32, fontSize: 18, color: COLORS.textSecondary, opacity: 0.8}}>
          {theme.sourceText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
