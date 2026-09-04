import React from 'react';
import {interpolate} from 'remotion';
import type {DualMetricRow, MetricConfig} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';

export interface DualMetricInfoPanelProps {
  row: DualMetricRow;
  primaryMetric: MetricConfig;
  secondaryMetric: MetricConfig;
  /** Frame count since this prefecture became the current one (0-based). */
  localFrame: number;
  progress: {index: number; total: number};
}

const MetricBlock: React.FC<{
  label: string;
  formattedValue: string;
  rank: number;
  accentColor: string;
}> = ({label, formattedValue, rank, accentColor}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: 'rgba(255, 255, 255, 0.05)',
      border: `1px solid ${accentColor}55`,
      borderTop: `3px solid ${accentColor}`,
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{fontSize: 18, fontWeight: 700, color: accentColor}}>{label}</div>
    <div
      style={{
        fontSize: 40,
        fontWeight: 900,
        color: COLORS.textPrimary,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.05,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {formattedValue}
    </div>
    <div
      style={{
        alignSelf: 'flex-start',
        background: rank === 1 ? COLORS.accent : COLORS.rankBadge,
        color: rank === 1 ? '#2a1c02' : '#2a0d0d',
        fontWeight: 900,
        fontSize: 20,
        padding: '3px 12px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      全国{rank}位
    </div>
  </div>
);

/**
 * The name / dual-metric readout for whichever prefecture is currently in
 * the spotlight, overlaid on the bottom edge of the map. Two separate,
 * distinctly-colored blocks -- one per metric -- so the two numbers and
 * their two independent rankings are never visually confused with each
 * other, per the theme's own labeling and accent colors (never hardcoded
 * per-theme wording here).
 */
export const DualMetricInfoPanel: React.FC<DualMetricInfoPanelProps> = ({
  row,
  primaryMetric,
  secondaryMetric,
  localFrame,
  progress,
}) => {
  const inOpacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const inTranslateY = interpolate(localFrame, [0, 4], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const primaryFormatted = formatValue(primaryMetric.valueFormatterId, row.primaryValue, primaryMetric.unit);
  const secondaryFormatted = formatValue(
    secondaryMetric.valueFormatterId,
    row.secondaryValue,
    secondaryMetric.unit,
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        opacity: inOpacity,
        transform: `translateY(${inTranslateY}px)`,
        background:
          'linear-gradient(to top, rgba(6, 10, 20, 0.92) 0%, rgba(6, 10, 20, 0.82) 55%, rgba(6, 10, 20, 0) 100%)',
        padding: '48px 24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontSize: 72, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1}}>
          {row.prefecture}
        </div>
        <div style={{fontSize: 20, color: COLORS.textSecondary, fontVariantNumeric: 'tabular-nums'}}>
          {progress.index} / {progress.total}
        </div>
      </div>

      <div style={{display: 'flex', gap: 12}}>
        <MetricBlock
          label={primaryMetric.label}
          formattedValue={primaryFormatted}
          rank={row.primaryRank}
          accentColor={primaryMetric.accentColor}
        />
        <MetricBlock
          label={secondaryMetric.label}
          formattedValue={secondaryFormatted}
          rank={row.secondaryRank}
          accentColor={secondaryMetric.accentColor}
        />
      </div>
    </div>
  );
};
