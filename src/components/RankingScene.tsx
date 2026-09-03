import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {computeProvisionalTopN} from '../utils/ranking';
import {colorForValue} from '../utils/colorScale';
import {JapanMap} from './JapanMap';
import {CurrentPrefecturePanel} from './CurrentPrefecturePanel';
import {TopThreeBoard} from './TopThreeBoard';
import {MapLegend} from './MapLegend';
import {ProgressRail} from './ProgressRail';

export interface RankingSceneProps {
  theme: ResolvedTheme;
  orderedRows: RankedPrefecture[];
  perPrefectureFrames: number;
}

/**
 * The main north -> south sweep: map + current prefecture readout +
 * provisional top 3, all driven off a single frame counter. This is the
 * one place that turns "elapsed frames" into "which prefecture is current
 * right now", so every child component just receives the row it needs to
 * show instead of re-deriving it from the frame.
 *
 * Layout is deliberately map-first: the map fills essentially all of the
 * space below the title, and the name/value/rank readout, the color
 * legend, and the north-south progress rail are all overlaid directly on
 * top of it (zero eye travel between "where" and "what"). Only the
 * provisional top-3 leaderboard gets its own slim strip below the map, kept
 * small and muted so it never competes with the map for attention.
 */
export const RankingScene: React.FC<RankingSceneProps> = ({theme, orderedRows, perPrefectureFrames}) => {
  const frame = useCurrentFrame();
  const currentIndex = Math.min(Math.floor(frame / perPrefectureFrames), orderedRows.length - 1);
  const localFrame = frame - currentIndex * perPrefectureFrames;
  const currentRow = orderedRows[currentIndex];
  const previousRow = currentIndex > 0 ? orderedRows[currentIndex - 1] : undefined;

  const revealedNames = useMemo(
    () => new Set(orderedRows.slice(0, currentIndex + 1).map((r) => r.prefecture)),
    [orderedRows, currentIndex],
  );

  const colorByName = useMemo(
    () => new Map(theme.data.map((row) => [row.prefecture, colorForValue(row.value, theme.colorScale)])),
    [theme.data, theme.colorScale],
  );

  const previousTop3 = useMemo(
    () => computeProvisionalTopN(orderedRows.slice(0, currentIndex), theme.rankDirection, 3),
    [orderedRows, currentIndex, theme.rankDirection],
  );
  const currentTop3 = useMemo(
    () => computeProvisionalTopN(orderedRows.slice(0, currentIndex + 1), theme.rankDirection, 3),
    [orderedRows, currentIndex, theme.rankDirection],
  );

  const progressFraction = orderedRows.length > 1 ? currentIndex / (orderedRows.length - 1) : 0;

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', padding: '188px 24px 20px'}}>
      <div style={{display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, gap: 6}}>
        <div style={{position: 'relative', flex: 1, minWidth: 0}}>
          <JapanMap
            currentPrefectureName={currentRow.prefecture}
            previousPrefectureName={previousRow?.prefecture}
            revealedNames={revealedNames}
            colorByName={colorByName}
            localFrame={localFrame}
            durationInFrames={perPrefectureFrames}
          />

          <div style={{position: 'absolute', top: 4, left: 4}}>
            <MapLegend colorScale={theme.colorScale} valueFormatterId={theme.valueFormatterId} unit={theme.unit} />
          </div>

          <CurrentPrefecturePanel
            row={currentRow}
            theme={theme}
            localFrame={localFrame}
            durationInFrames={perPrefectureFrames}
            progress={{index: currentIndex + 1, total: orderedRows.length}}
          />
        </div>

        <ProgressRail progressFraction={progressFraction} />
      </div>

      <div style={{marginTop: 10, flexShrink: 0}}>
        <TopThreeBoard
          previousTop3={previousTop3}
          currentTop3={currentTop3}
          theme={theme}
          localFrame={localFrame}
          durationInFrames={perPrefectureFrames}
        />
      </div>
    </AbsoluteFill>
  );
};
