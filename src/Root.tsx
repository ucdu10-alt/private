import React from 'react';
import {Composition} from 'remotion';
import {PrefectureRankingVideo, PrefectureRankingVideoProps} from './components/PrefectureRankingVideo';
import {
  FINAL_TOP_FIVE_FRAMES,
  FPS,
  HOOK_FRAMES,
  PER_PREFECTURE_FRAMES,
  resolveFinalTopFiveFrames,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './config/timing';
import {loadTheme} from './data/loadTheme';
import {PREFECTURE_ORDER_NORTH_TO_SOUTH, resolveDisplayOrder} from './data/prefectureOrder';
import {THEME_REGISTRY} from './data/themes/registry';
import {computeItemDurations, sumDurations} from './utils/timeline';

// Rough placeholder used only until calculateMetadata resolves the real
// theme (ignores hook/reaction timing, which need the loaded CSV) --
// Remotion requires a durationInFrames up front even though this one gets
// immediately overridden.
const PLACEHOLDER_DURATION =
  PREFECTURE_ORDER_NORTH_TO_SOUTH.length * PER_PREFECTURE_FRAMES + FINAL_TOP_FIVE_FRAMES;

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
    </>
  );
};
