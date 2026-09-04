import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../config/theme';
import {RankPill} from './RankPill';

export interface RankedListRow {
  prefecture: string;
  rank: number;
  formattedValue: string;
}

export interface RankedListPanelProps {
  title: string;
  rows: RankedListRow[];
  /** Color for each row's value text. Defaults to COLORS.accent. */
  accentColor?: string;
}

/**
 * A titled, staggered-entrance list of ranked rows (rank pill + prefecture
 * name + a pre-formatted value) -- the shared visual guts behind the
 * closing "全国TOP5" screen and the dual-metric themes' two closing TOP3
 * screens. Deliberately takes already-formatted value strings rather than
 * raw numbers/a formatter id, so it has no opinion on units or which
 * metric it's showing -- callers own that.
 *
 * Assumes it's mounted at the start of its own timeline (e.g. inside a
 * <Series.Sequence>), since its entrance animation reads useCurrentFrame()
 * directly rather than taking a localFrame prop.
 */
export const RankedListPanel: React.FC<RankedListPanelProps> = ({title, rows, accentColor = COLORS.accent}) => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: COLORS.textSecondary,
          marginBottom: 28,
          opacity: headerOpacity,
          textAlign: 'center',
        }}
      >
        {title}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: '100%'}}>
        {rows.map((row, i) => {
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
                  color: accentColor,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {row.formattedValue}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/** Shared entrance-timing helper so a caller's own closing line can line up with the last row's animation finishing. */
export const rankedListClosingLineDelay = (rowCount: number): number => 10 + rowCount * 6 + 6;
