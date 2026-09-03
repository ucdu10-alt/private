import React from 'react';
import {Composition} from 'remotion';
import {PrefectureRankingVideo, PrefectureRankingVideoProps} from './components/PrefectureRankingVideo';
import {computeTotalDurationInFrames, FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from './config/timing';
import {loadTheme} from './data/loadTheme';
import {PREFECTURE_ORDER_NORTH_TO_SOUTH} from './data/prefectureOrder';
import {THEME_REGISTRY} from './data/themes/registry';

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
            durationInFrames={computeTotalDurationInFrames(PREFECTURE_ORDER_NORTH_TO_SOUTH.length)}
            defaultProps={defaultProps}
            calculateMetadata={async ({props}) => {
              const theme = await loadTheme(props.themeId);

              // Display order is always the fixed north->south list; a
              // theme's CSV is expected to cover all 47, but if it's ever a
              // subset (e.g. while iterating on new data), skip missing
              // rows instead of crashing.
              const orderedRows = PREFECTURE_ORDER_NORTH_TO_SOUTH.map(
                (name) => theme.rankByPrefecture[name],
              ).filter((row): row is NonNullable<typeof row> => Boolean(row));

              return {
                durationInFrames: computeTotalDurationInFrames(orderedRows.length),
                props: {...props, theme, orderedRows},
              };
            }}
          />
        );
      })}
    </>
  );
};
