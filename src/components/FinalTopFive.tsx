import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ResolvedTheme} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';
import {RankedListPanel, rankedListClosingLineDelay} from './RankedListPanel';

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
  const listTitle = theme.finalListTitle ?? '全国TOP5';

  const closingLineDelay = rankedListClosingLineDelay(top5.length);
  const closingLineOpacity = interpolate(frame, [closingLineDelay, closingLineDelay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 56px'}}>
      <RankedListPanel
        title={listTitle}
        rows={top5.map((row) => ({
          prefecture: row.prefecture,
          rank: row.rank,
          formattedValue: formatValue(theme.valueFormatterId, row.value, theme.unit),
        }))}
      />
      {theme.closingLine ? (
        <div
          style={{
            marginTop: 30,
            fontSize: 32,
            fontWeight: 800,
            color: COLORS.accent,
            opacity: closingLineOpacity,
            textAlign: 'center',
          }}
        >
          {theme.closingLine}
        </div>
      ) : null}
      {theme.sourceText ? (
        <div style={{marginTop: 20, fontSize: 18, color: COLORS.textSecondary, opacity: 0.8}}>
          {theme.sourceText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
