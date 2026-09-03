import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SeriesBackdrop} from '../common/SeriesBackdrop';
import {IntroTitleScene} from '../common/IntroTitleScene';
import {PersistentHeader} from '../common/PersistentHeader';
import {SourceCredit} from '../common/SourceCredit';
import {LineChartScene} from './LineChartScene';
import {ComparisonEnding} from './ComparisonEnding';
import {secondsToFrames, TIMESERIES_FINAL_YEAR_HOLD_SECONDS} from '../../config/timing';
import {DisabledModeNotice} from '../common/DisabledModeNotice';
import type {FishConfig, ResolvedTimeseries} from '../../data/types';

export type FishTimeseriesVideoProps = {
  config: FishConfig;
  fishImageAvailable: boolean;
  /** null when config.timeseries.enabled is false (nothing was loaded/computed). */
  resolved: ResolvedTimeseries | null;
};

/**
 * Mode 1: 1魚種の全国漁獲量の長期推移. Wires the intro, the growing line
 * chart, and the from->latest comparison ending into one Composition using
 * only the fish's config.json (durations, title, annotations, compareFrom)
 * -- nothing fish-specific is hardcoded here.
 */
export const FishTimeseriesVideo: React.FC<FishTimeseriesVideoProps> = ({config, fishImageAvailable, resolved}) => {
  const timeseries = config.timeseries;
  if (!timeseries || !timeseries.enabled || !resolved) {
    return <DisabledModeNotice fishName={config.name} mode="timeseries" />;
  }

  const introFrames = secondsToFrames(timeseries.introDuration);
  const timelineFrames = secondsToFrames(timeseries.timelineDuration);
  const finalHoldFrames = secondsToFrames(TIMESERIES_FINAL_YEAR_HOLD_SECONDS);
  const endingFrames = secondsToFrames(timeseries.endingDuration);

  return (
    <AbsoluteFill>
      <SeriesBackdrop />

      <Sequence from={0} durationInFrames={introFrames}>
        <IntroTitleScene
          fishName={config.name}
          fishImageSrc={config.image}
          fishImageAvailable={fishImageAvailable}
          title={timeseries.title}
        />
      </Sequence>

      <Sequence from={introFrames} durationInFrames={timelineFrames + finalHoldFrames + endingFrames}>
        <PersistentHeader fishName={config.name} title={timeseries.title} appearFrame={0} />
      </Sequence>

      <Sequence from={introFrames} durationInFrames={timelineFrames}>
        <LineChartScene
          rows={resolved.rows}
          maxValue={resolved.maxValue}
          unit={config.unit}
          peakIndex={resolved.peakIndex}
          annotations={timeseries.annotations}
          durationInFrames={timelineFrames}
        />
      </Sequence>

      <Sequence from={introFrames + timelineFrames} durationInFrames={finalHoldFrames + endingFrames}>
        <ComparisonEnding comparison={resolved.comparison} unit={config.unit} finalHoldFrames={finalHoldFrames} />
      </Sequence>

      <SourceCredit source={config.source} />
    </AbsoluteFill>
  );
};
