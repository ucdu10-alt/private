import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {SeriesBackdrop} from '../common/SeriesBackdrop';
import {IntroTitleScene} from '../common/IntroTitleScene';
import {PersistentHeader} from '../common/PersistentHeader';
import {SourceCredit} from '../common/SourceCredit';
import {DisabledModeNotice} from '../common/DisabledModeNotice';
import {RankRevealScene} from './RankRevealScene';
import {FinalTopThreeScene} from './FinalTopThreeScene';
import {RANKING_FINAL_TOP_THREE_SECONDS, RANKING_INTRO_DURATION_SECONDS, secondsToFrames} from '../../config/timing';
import {computeRankSlotDurations, computeTimelinePosition, sumDurations} from '../../utils/timelineFrames';
import {colorForValue, type ColorScale} from '../../utils/colorScale';
import type {FishConfig, RankedPrefectureRow, ResolvedPrefectureRanking} from '../../data/types';

export type FishPrefectureRankingVideoProps = {
  config: FishConfig;
  fishImageAvailable: boolean;
  resolved: ResolvedPrefectureRanking | null;
};

/**
 * Mode 2: 魚種ごとの都道府県別漁獲量ランキング. Counts down from the
 * worst shown rank to #1, highlighting each prefecture on the shared Japan
 * map and dimly retaining every prefecture already revealed.
 */
export const FishPrefectureRankingVideo: React.FC<FishPrefectureRankingVideoProps> = ({
  config,
  fishImageAvailable,
  resolved,
}) => {
  const ranking = config.prefectureRanking;
  if (!ranking || !ranking.enabled || !resolved) {
    return <DisabledModeNotice fishName={config.name} mode="prefecture-ranking" />;
  }

  const introFrames = secondsToFrames(RANKING_INTRO_DURATION_SECONDS);
  const finalTopThreeFrames = secondsToFrames(RANKING_FINAL_TOP_THREE_SECONDS);

  // Countdown order: the worst rank shown appears first, #1 appears last.
  const displayOrder = [...resolved.ranked].reverse();
  const slotDurations = computeRankSlotDurations(displayOrder.length, ranking.secondsPerRank);
  const countdownFrames = sumDurations(slotDurations);

  return (
    <AbsoluteFill>
      <SeriesBackdrop />

      <Sequence from={0} durationInFrames={introFrames}>
        <IntroTitleScene
          fishName={config.name}
          fishImageSrc={config.image}
          fishImageAvailable={fishImageAvailable}
          title={ranking.title}
        />
      </Sequence>

      <Sequence from={introFrames} durationInFrames={countdownFrames + finalTopThreeFrames}>
        <PersistentHeader fishName={config.name} title={ranking.title} appearFrame={0} />
      </Sequence>

      <Sequence from={introFrames} durationInFrames={countdownFrames}>
        <RankingSweep displayOrder={displayOrder} slotDurations={slotDurations} colorScale={resolved.colorScale} unit={config.unit} />
      </Sequence>

      <Sequence from={introFrames + countdownFrames} durationInFrames={finalTopThreeFrames}>
        <FinalTopThreeScene top3={resolved.ranked.slice(0, 3)} unit={config.unit} fishName={config.name} />
      </Sequence>

      <SourceCredit source={ranking.source ?? config.source} />
    </AbsoluteFill>
  );
};

const RankingSweep: React.FC<{
  displayOrder: RankedPrefectureRow[];
  slotDurations: number[];
  colorScale: ColorScale;
  unit: string;
}> = ({displayOrder, slotDurations, colorScale, unit}) => {
  const frame = useCurrentFrame();
  const {index, localFrame} = computeTimelinePosition(frame, slotDurations);
  const current = displayOrder[index];
  const previous = index > 0 ? displayOrder[index - 1].prefecture : undefined;
  const revealedNames = new Set(displayOrder.slice(0, index + 1).map((row) => row.prefecture));
  const colorByName = new Map(displayOrder.map((row) => [row.prefecture, colorForValue(row.catchTons, colorScale)]));

  return (
    <RankRevealScene
      rank={current.rank}
      prefecture={current.prefecture}
      catchTons={current.catchTons}
      unit={unit}
      previousPrefecture={previous}
      revealedNames={revealedNames}
      colorByName={colorByName}
      colorScale={colorScale}
      localFrame={localFrame}
      durationInFrames={slotDurations[index]}
    />
  );
};
