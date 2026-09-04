import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {computeItemDurations, computeTimelinePosition} from '../utils/timeline';
import {JapanMap} from './JapanMap';
import {BigRankBadge} from './BigRankBadge';
import {BigNumberInfoPanel} from './BigNumberInfoPanel';

export interface BigRankingSceneProps {
  theme: ResolvedTheme;
  orderedRows: RankedPrefecture[];
  perPrefectureFrames: number;
}

const EMPTY_COLOR_MAP = new Map<string, string>();

/**
 * Readability-first alternative to RankingScene: rank, prefecture name, and
 * value are each their own fixed, non-overlapping block -- never overlaid
 * on the map -- so none of them can get lost against busy map colors. Rank
 * sits in the same spot every single frame, directly under the header,
 * before the map even enters the eye's path; name and value follow in a
 * single large block below the map. The map itself shrinks to a supporting
 * strip in the middle rather than the dominant element, since here reading
 * the numbers matters more than watching the map animate.
 */
export const BigRankingScene: React.FC<BigRankingSceneProps> = ({theme, orderedRows, perPrefectureFrames}) => {
  const frame = useCurrentFrame();

  const itemDurations = useMemo(
    () => computeItemDurations(orderedRows, theme, perPrefectureFrames),
    [orderedRows, theme, perPrefectureFrames],
  );
  const {index: currentIndex, localFrame} = computeTimelinePosition(frame, itemDurations);
  const currentRow = orderedRows[currentIndex];
  const previousRow = currentIndex > 0 ? orderedRows[currentIndex - 1] : undefined;
  const currentDurationInFrames = itemDurations[currentIndex];

  const revealedNames = useMemo(
    () => new Set(orderedRows.slice(0, currentIndex + 1).map((r) => r.prefecture)),
    [orderedRows, currentIndex],
  );

  return (
    <AbsoluteFill style={{display: 'flex', flexDirection: 'column', padding: '96px 24px 32px'}}>
      <div style={{flexShrink: 0, padding: '4px 0 18px'}}>
        <BigRankBadge rank={currentRow.rank} localFrame={localFrame} />
      </div>

      <div style={{position: 'relative', flex: 1, minHeight: 0}}>
        <JapanMap
          currentPrefectureName={currentRow.prefecture}
          previousPrefectureName={previousRow?.prefecture}
          revealedNames={revealedNames}
          colorByName={EMPTY_COLOR_MAP}
          localFrame={localFrame}
          durationInFrames={currentDurationInFrames}
        />
      </div>

      <div style={{flexShrink: 0, padding: '18px 0 0'}}>
        <BigNumberInfoPanel
          row={currentRow}
          theme={theme}
          localFrame={localFrame}
          durationInFrames={currentDurationInFrames}
        />
      </div>
    </AbsoluteFill>
  );
};
