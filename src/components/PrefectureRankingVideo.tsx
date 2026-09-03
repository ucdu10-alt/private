import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {FINAL_TOP_FIVE_FRAMES, PER_PREFECTURE_FRAMES} from '../config/timing';
import {COLORS, FONT_FAMILY} from '../config/theme';
import {PersistentHeader} from './PersistentHeader';
import {RankingScene} from './RankingScene';
import {FinalTopFive} from './FinalTopFive';

/**
 * Composition props. `themeId` is the only thing a caller needs to set;
 * `theme` and `orderedRows` are filled in by Root.tsx's `calculateMetadata`
 * (which loads the CSV and computes rankings before the video starts), and
 * are nullable here purely so the type matches the pre-resolution
 * defaultProps shape that Remotion's Composition API expects.
 */
export type PrefectureRankingVideoProps = {
  themeId: string;
  theme: ResolvedTheme | null;
  orderedRows: RankedPrefecture[];
};

export const PrefectureRankingVideo: React.FC<PrefectureRankingVideoProps> = ({theme, orderedRows}) => {
  if (!theme || orderedRows.length === 0) {
    // calculateMetadata always resolves these before the composition
    // actually renders/plays; this guard only exists to satisfy the type.
    return null;
  }

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, fontFamily: FONT_FAMILY}}>
      {/* Rendered outside the Series so it stays mounted (and thus visibly
          on screen) for the whole video instead of only during one phase. */}
      <PersistentHeader title={theme.title} />

      <Series>
        <Series.Sequence durationInFrames={orderedRows.length * PER_PREFECTURE_FRAMES}>
          <RankingScene theme={theme} orderedRows={orderedRows} perPrefectureFrames={PER_PREFECTURE_FRAMES} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FINAL_TOP_FIVE_FRAMES}>
          <FinalTopFive theme={theme} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
