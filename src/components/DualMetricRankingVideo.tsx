import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import type {DualMetricRow, ResolvedDualMetricTheme} from '../data/types';
import {DUAL_METRIC_TOP3_SCREEN_FRAMES, FRAMES_PER_PREFECTURE_DUAL_METRIC} from '../config/timing';
import {COLORS, FONT_FAMILY} from '../config/theme';
import {PersistentHeader} from './PersistentHeader';
import {DualMetricRankingScene} from './DualMetricRankingScene';
import {DualMetricTopThreeScreen} from './DualMetricTopThreeScreen';

export type DualMetricRankingVideoProps = {
  themeId: string;
  theme: ResolvedDualMetricTheme | null;
  rows: DualMetricRow[];
};

/**
 * Top-level composition for "dual-metric" videos: two independently-ranked
 * numbers per prefecture (e.g. a raw count and a per-capita rate), shown in
 * fixed geographic order rather than ranking order. No intro/hook phase --
 * content starts at frame 0 so the first prefecture's numbers are legible
 * almost immediately, per the brief's priority on getting into the content
 * over any kind of title card.
 */
export const DualMetricRankingVideo: React.FC<DualMetricRankingVideoProps> = ({theme, rows}) => {
  if (!theme || rows.length === 0) {
    // calculateMetadata always resolves these before the composition
    // actually renders/plays; this guard only exists to satisfy the type.
    return null;
  }

  const sweepFrames = rows.length * FRAMES_PER_PREFECTURE_DUAL_METRIC;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, fontFamily: FONT_FAMILY}}>
      <PersistentHeader title={theme.title} subtitle={theme.subtitle} compact introFrames={0} />

      <Series>
        <Series.Sequence durationInFrames={sweepFrames}>
          <DualMetricRankingScene theme={theme} rows={rows} perPrefectureFrames={FRAMES_PER_PREFECTURE_DUAL_METRIC} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DUAL_METRIC_TOP3_SCREEN_FRAMES}>
          <DualMetricTopThreeScreen
            metric={theme.primaryMetric}
            top3={theme.primaryTop3}
            valueOf={(row) => row.primaryValue}
            rankOf={(row) => row.primaryRank}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DUAL_METRIC_TOP3_SCREEN_FRAMES}>
          <DualMetricTopThreeScreen
            metric={theme.secondaryMetric}
            top3={theme.secondaryTop3}
            valueOf={(row) => row.secondaryValue}
            rankOf={(row) => row.secondaryRank}
            sourceText={theme.sourceText}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
