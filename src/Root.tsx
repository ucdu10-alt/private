import React from 'react';
import {Composition} from 'remotion';
import {FishTimeseriesVideo, FishTimeseriesVideoProps} from './components/timeseries/FishTimeseriesVideo';
import {
  FishPrefectureRankingVideo,
  FishPrefectureRankingVideoProps,
} from './components/prefectureRanking/FishPrefectureRankingVideo';
import {
  FPS,
  RANKING_DEFAULTS,
  RANKING_FINAL_TOP_THREE_SECONDS,
  RANKING_INTRO_DURATION_SECONDS,
  TIMESERIES_DEFAULTS,
  TIMESERIES_FINAL_YEAR_HOLD_SECONDS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  secondsToFrames,
} from './config/timing';
import {FISH_IDS} from './data/fish/registry';
import {
  checkStaticFileExists,
  loadFishConfig,
  loadResolvedPrefectureRanking,
  loadResolvedTimeseries,
  toStaticPath,
} from './data/fish/loadFish';
import {computeRankSlotDurations, sumDurations} from './utils/timelineFrames';

// Rough placeholder used only until calculateMetadata resolves the real
// fish config/data (Remotion requires a durationInFrames up front even
// though this gets immediately overridden).
const PLACEHOLDER_DURATION = FPS * 10;

/**
 * Two Compositions per fish in FISH_IDS -- "Fish-Timeseries-<id>" and
 * "Fish-PrefectureRanking-<id>" -- generated from `data/fish/registry.ts`
 * plus each fish's own `public/data/fish/<id>/config.json`. Adding a fish
 * species only ever means: drop in its image/config/CSVs and add its id to
 * the registry -- nothing in this file (or any component) needs to change.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {FISH_IDS.map((fishId) => (
        <React.Fragment key={fishId}>
          <Composition<any, FishTimeseriesVideoProps>
            id={`Fish-Timeseries-${fishId}`}
            component={FishTimeseriesVideo}
            fps={FPS}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            durationInFrames={PLACEHOLDER_DURATION}
            defaultProps={{config: null as any, fishImageAvailable: false, resolved: null}}
            calculateMetadata={async () => {
              const config = await loadFishConfig(fishId);
              const fishImageAvailable = await checkStaticFileExists(toStaticPath(config.image));

              if (!config.timeseries?.enabled) {
                return {
                  durationInFrames: secondsToFrames(2),
                  props: {config, fishImageAvailable, resolved: null},
                };
              }

              const resolved = await loadResolvedTimeseries(fishId, config.timeseries);
              const introFrames = secondsToFrames(config.timeseries.introDuration ?? TIMESERIES_DEFAULTS.introDuration);
              const timelineFrames = secondsToFrames(
                config.timeseries.timelineDuration ?? TIMESERIES_DEFAULTS.timelineDuration,
              );
              const finalHoldFrames = secondsToFrames(TIMESERIES_FINAL_YEAR_HOLD_SECONDS);
              const endingFrames = secondsToFrames(config.timeseries.endingDuration ?? TIMESERIES_DEFAULTS.endingDuration);
              const durationInFrames = introFrames + timelineFrames + finalHoldFrames + endingFrames;

              return {durationInFrames, props: {config, fishImageAvailable, resolved}};
            }}
          />

          <Composition<any, FishPrefectureRankingVideoProps>
            id={`Fish-PrefectureRanking-${fishId}`}
            component={FishPrefectureRankingVideo}
            fps={FPS}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            durationInFrames={PLACEHOLDER_DURATION}
            defaultProps={{config: null as any, fishImageAvailable: false, resolved: null}}
            calculateMetadata={async () => {
              const config = await loadFishConfig(fishId);
              const fishImageAvailable = await checkStaticFileExists(toStaticPath(config.image));

              if (!config.prefectureRanking?.enabled) {
                return {
                  durationInFrames: secondsToFrames(2),
                  props: {config, fishImageAvailable, resolved: null},
                };
              }

              const resolved = await loadResolvedPrefectureRanking(fishId, config.prefectureRanking);
              const introFrames = secondsToFrames(RANKING_INTRO_DURATION_SECONDS);
              const slotDurations = computeRankSlotDurations(
                resolved.rankCount,
                config.prefectureRanking.secondsPerRank ?? RANKING_DEFAULTS.secondsPerRank,
              );
              const countdownFrames = sumDurations(slotDurations);
              const finalTopThreeFrames = secondsToFrames(RANKING_FINAL_TOP_THREE_SECONDS);
              const durationInFrames = introFrames + countdownFrames + finalTopThreeFrames;

              return {durationInFrames, props: {config, fishImageAvailable, resolved}};
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
