import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {DualMetricRow, MetricConfig} from '../data/types';
import {formatValue} from '../utils/formatters';
import {COLORS} from '../config/theme';
import {RankedListPanel} from './RankedListPanel';

export interface DualMetricTopThreeScreenProps {
  metric: MetricConfig;
  top3: DualMetricRow[];
  /** Whichever of primaryValue/secondaryValue this metric's top3 rows were ranked by. */
  valueOf: (row: DualMetricRow) => number;
  rankOf: (row: DualMetricRow) => number;
  sourceText?: string;
}

/**
 * One of the two closing "TOP3" screens for a dual-metric theme (e.g.
 * "店舗数 TOP3" then "人口10万人あたり TOP3"), shown back to back as two
 * separate Series.Sequences. Reuses RankedListPanel -- the same list visuals
 * as the single-metric FinalTopFive -- just tinted with this metric's own
 * accent color so it's visually obvious which of the two rankings is on
 * screen.
 */
export const DualMetricTopThreeScreen: React.FC<DualMetricTopThreeScreenProps> = ({
  metric,
  top3,
  valueOf,
  rankOf,
  sourceText,
}) => {
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 56px'}}>
      <RankedListPanel
        title={`${metric.label} TOP3`}
        accentColor={metric.accentColor}
        rows={top3.map((row) => ({
          prefecture: row.prefecture,
          rank: rankOf(row),
          formattedValue: formatValue(metric.valueFormatterId, valueOf(row), metric.unit),
        }))}
      />
      {sourceText ? (
        <div style={{marginTop: 20, fontSize: 18, color: COLORS.textSecondary, opacity: 0.8}}>{sourceText}</div>
      ) : null}
    </AbsoluteFill>
  );
};
