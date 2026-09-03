import React from 'react';
import {Composition} from 'remotion';
import {PrefectureRankingVideo, PrefectureRankingVideoProps} from './components/PrefectureRankingVideo';
import {computeTotalDurationInFrames, FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from './config/timing';
import {loadTheme} from './data/loadTheme';
import {PREFECTURE_ORDER_NORTH_TO_SOUTH} from './data/prefectureOrder';
import {DEFAULT_THEME_ID} from './data/themes/registry';

const defaultProps: PrefectureRankingVideoProps = {
  themeId: DEFAULT_THEME_ID,
  theme: null,
  orderedRows: [],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<any, PrefectureRankingVideoProps>
        id="PrefectureRanking"
        component={PrefectureRankingVideo}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        durationInFrames={computeTotalDurationInFrames(PREFECTURE_ORDER_NORTH_TO_SOUTH.length)}
        defaultProps={defaultProps}
        calculateMetadata={async ({props}) => {
          const theme = await loadTheme(props.themeId);

          // Display order is always the fixed north->south list; a theme's
          // CSV is expected to cover all 47, but if it's ever a subset
          // (e.g. while iterating on new data), skip missing rows instead
          // of crashing.
          const orderedRows = PREFECTURE_ORDER_NORTH_TO_SOUTH.map(
            (name) => theme.rankByPrefecture[name],
          ).filter((row): row is NonNullable<typeof row> => Boolean(row));

          return {
            durationInFrames: computeTotalDurationInFrames(orderedRows.length),
            props: {...props, theme, orderedRows},
          };
        }}
      />
    </>
  );
};
