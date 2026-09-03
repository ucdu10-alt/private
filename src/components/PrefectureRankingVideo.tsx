import React, {useMemo} from 'react';
import {AbsoluteFill, Series} from 'remotion';
import type {RankedPrefecture, ResolvedTheme} from '../data/types';
import {HOOK_FRAMES, PER_PREFECTURE_FRAMES, resolveFinalTopFiveFrames} from '../config/timing';
import {COLORS, FONT_FAMILY} from '../config/theme';
import {computeItemDurations, sumDurations} from '../utils/timeline';
import {PersistentHeader} from './PersistentHeader';
import {HookIntro} from './HookIntro';
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
  // itemDurations must stay identical to what Root.tsx used to size the
  // Composition -- both call the same pure function over the same inputs,
  // so they can never drift apart even though they run in different places.
  const itemDurations = useMemo(
    () => (theme ? computeItemDurations(orderedRows, theme, PER_PREFECTURE_FRAMES) : []),
    [theme, orderedRows],
  );

  if (!theme || orderedRows.length === 0) {
    // calculateMetadata always resolves these before the composition
    // actually renders/plays; this guard only exists to satisfy the type.
    return null;
  }

  const sweepFrames = sumDurations(itemDurations);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, fontFamily: FONT_FAMILY}}>
      {/* Rendered outside the Series so it stays mounted (and thus visibly
          on screen) for the whole video instead of only during one phase. */}
      <PersistentHeader title={theme.title} />

      <Series>
        {theme.hookText ? (
          <Series.Sequence durationInFrames={HOOK_FRAMES}>
            <HookIntro text={theme.hookText} durationInFrames={HOOK_FRAMES} />
          </Series.Sequence>
        ) : null}

        <Series.Sequence durationInFrames={sweepFrames}>
          <RankingScene theme={theme} orderedRows={orderedRows} perPrefectureFrames={PER_PREFECTURE_FRAMES} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={resolveFinalTopFiveFrames(theme.finalScreenSeconds)}>
          <FinalTopFive theme={theme} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
