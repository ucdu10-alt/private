import React from 'react';
import {Composition} from 'remotion';
import {PrefectureRankingVideo, PrefectureRankingVideoProps} from './components/PrefectureRankingVideo';
import {DualMetricRankingVideo, DualMetricRankingVideoProps} from './components/DualMetricRankingVideo';
import {
  DUAL_METRIC_TOP3_SCREEN_FRAMES,
  FINAL_TOP_FIVE_FRAMES,
  FPS,
  FRAMES_PER_PREFECTURE_DUAL_METRIC,
  HOOK_FRAMES,
  PER_PREFECTURE_FRAMES,
  resolveFinalTopFiveFrames,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './config/timing';
import {loadTheme} from './data/loadTheme';
import {PREFECTURE_ORDER_NORTH_TO_SOUTH, resolveDisplayOrder} from './data/prefectureOrder';
import {THEME_REGISTRY} from './data/themes/registry';
import {loadDualMetricTheme} from './data/dualMetric/loadDualMetricTheme';
import {DUAL_METRIC_THEME_REGISTRY} from './data/dualMetric/registry';
import {computeItemDurations, sumDurations} from './utils/timeline';

// Rough placeholders used only until calculateMetadata resolves the real
// theme (ignores hook/reaction timing, which need the loaded CSV) --
// Remotion requires a durationInFrames up front even though these get
// immediately overridden.
const PLACEHOLDER_DURATION =
  PREFECTURE_ORDER_NORTH_TO_SOUTH.length * PER_PREFECTURE_FRAMES + FINAL_TOP_FIVE_FRAMES;
const DUAL_METRIC_PLACEHOLDER_DURATION =
  PREFECTURE_ORDER_NORTH_TO_SOUTH.length * FRAMES_PER_PREFECTURE_DUAL_METRIC + DUAL_METRIC_TOP3_SCREEN_FRAMES * 2;

/**
 * One Composition per registered theme, named after the theme's id (e.g.
 * "sleep-time", "sushi-shops") so each is individually selectable in
 * Remotion Studio and individually renderable by id. Adding a theme to
 * `THEME_REGISTRY` is enough to get a new Composition here -- nothing in
 * this file needs to change.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {Object.keys(THEME_REGISTRY).map((themeId) => {
        const defaultProps: PrefectureRankingVideoProps = {
          themeId,
          theme: null,
          orderedRows: [],
        };

        return (
          <Composition<any, PrefectureRankingVideoProps>
            key={themeId}
            id={themeId}
            component={PrefectureRankingVideo}
            fps={FPS}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            durationInFrames={PLACEHOLDER_DURATION}
            defaultProps={defaultProps}
            calculateMetadata={async ({props}) => {
              const theme = await loadTheme(props.themeId);
              const orderedRows = resolveDisplayOrder(theme);

              const hookFrames = theme.hookText ? HOOK_FRAMES : 0;
              const itemDurations = computeItemDurations(orderedRows, theme, PER_PREFECTURE_FRAMES);
              const finalFrames = resolveFinalTopFiveFrames(theme.finalScreenSeconds);
              const durationInFrames = hookFrames + sumDurations(itemDurations) + finalFrames;

              return {
                durationInFrames,
                props: {...props, theme, orderedRows},
              };
            }}
          />
        );
      })}

      {Object.keys(DUAL_METRIC_THEME_REGISTRY).map((themeId) => {
        const defaultProps: DualMetricRankingVideoProps = {
          themeId,
          theme: null,
          rows: [],
        };

        return (
          <Composition<any, DualMetricRankingVideoProps>
            key={themeId}
            id={themeId}
            component={DualMetricRankingVideo}
            fps={FPS}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            durationInFrames={DUAL_METRIC_PLACEHOLDER_DURATION}
            defaultProps={defaultProps}
            calculateMetadata={async ({props}) => {
              const theme = await loadDualMetricTheme(props.themeId);
              const sweepFrames = theme.rows.length * FRAMES_PER_PREFECTURE_DUAL_METRIC;
              const durationInFrames = sweepFrames + DUAL_METRIC_TOP3_SCREEN_FRAMES * 2;

              return {
                durationInFrames,
                props: {...props, theme, rows: theme.rows},
              };
            }}
          />
        );
      })}
    </>
  );
};
