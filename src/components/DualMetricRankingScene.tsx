import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {DualMetricRow, DualMetricThemeMeta} from '../data/types';
import {JapanMap} from './JapanMap';
import {DualMetricInfoPanel} from './DualMetricInfoPanel';
import {ProgressRail} from './ProgressRail';

export interface DualMetricRankingSceneProps {
  theme: DualMetricThemeMeta;
  rows: DualMetricRow[];
  perPrefectureFrames: number;
}

const EMPTY_COLOR_MAP = new Map<string, string>();

/**
 * The main north->south sweep for dual-metric themes. Deliberately simpler
 * than RankingScene: fixed geographic order (no rank-based pacing or
 * reactions), a flat per-prefecture duration, and no choropleth coloring or
 * provisional-leaderboard strip -- there's no single "value" to color the
 * map by when two independently-ranked metrics are both on screen, and this
 * template variant doesn't call for a running leaderboard (see
 * DualMetricTopThreeScreen for the two closing top-3 lists instead). That
 * also frees up more vertical space, so the map -- reused as-is from
 * JapanMap, just fed a flat "shown" color instead of a choropleth scale --
 * reads as even more of the focal point.
 */
export const DualMetricRankingScene: React.FC<DualMetricRankingSceneProps> = ({
  theme,
  rows,
  perPrefectureFrames,
}) => {
  const frame = useCurrentFrame();
  const currentIndex = Math.min(Math.floor(frame / perPrefectureFrames), rows.length - 1);
  const localFrame = frame - currentIndex * perPrefectureFrames;
  const currentRow = rows[currentIndex];
  const previousRow = currentIndex > 0 ? rows[currentIndex - 1] : undefined;

  const revealedNames = new Set(rows.slice(0, currentIndex + 1).map((r) => r.prefecture));
  const progressFraction = rows.length > 1 ? currentIndex / (rows.length - 1) : 0;

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', padding: '92px 24px 20px'}}>
      <div style={{display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, gap: 6}}>
        <div style={{position: 'relative', flex: 1, minWidth: 0}}>
          <JapanMap
            currentPrefectureName={currentRow.prefecture}
            previousPrefectureName={previousRow?.prefecture}
            revealedNames={revealedNames}
            colorByName={EMPTY_COLOR_MAP}
            localFrame={localFrame}
            durationInFrames={perPrefectureFrames}
          />

          <DualMetricInfoPanel
            row={currentRow}
            primaryMetric={theme.primaryMetric}
            secondaryMetric={theme.secondaryMetric}
            localFrame={localFrame}
            progress={{index: currentIndex + 1, total: rows.length}}
          />
        </div>

        <ProgressRail progressFraction={progressFraction} />
      </div>
    </AbsoluteFill>
  );
};
