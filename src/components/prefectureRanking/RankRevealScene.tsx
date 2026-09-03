import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY, SAFE_AREA} from '../../config/theme';
import {formatWithUnit} from '../../utils/formatters';
import type {ColorScale} from '../../utils/colorScale';
import {JapanMap} from '../JapanMap';
import {MapLegend} from '../MapLegend';
import {RankPill} from './RankPill';

export interface RankRevealSceneProps {
  rank: number;
  prefecture: string;
  catchTons: number;
  unit: string;
  previousPrefecture?: string;
  revealedNames: Set<string>;
  colorByName: Map<string, string>;
  colorScale: ColorScale;
  /** Frames elapsed since this rank became current. */
  localFrame: number;
  durationInFrames: number;
}

/**
 * One slot of the rank-N -> rank-1 countdown: rank badge, prefecture name,
 * value, and the prefecture highlighted on the Japan map (with everything
 * already-revealed left lightly colored in, per the shared JapanMap
 * component built for the pan/zoom "current prefecture" treatment).
 */
export const RankRevealScene: React.FC<RankRevealSceneProps> = ({
  rank,
  prefecture,
  catchTons,
  unit,
  previousPrefecture,
  revealedNames,
  colorByName,
  colorScale,
  localFrame,
  durationInFrames,
}) => {
  const {fps} = useVideoConfig();
  const entrance = spring({frame: localFrame, fps, config: {damping: 16, stiffness: 170, mass: 0.6}});

  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          transform: `scale(${0.9 + 0.1 * entrance})`,
          opacity: entrance,
        }}
      >
        <RankPill rank={rank} size={84} />
        <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 64, fontWeight: 800, color: COLORS.textPrimary, marginTop: 6}}>
          {prefecture}
        </div>
        <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 50, fontWeight: 800, color: COLORS.accentStrong}}>
          {formatWithUnit(catchTons, unit)}
        </div>
      </div>

      <div style={{position: 'absolute', top: 520, left: SAFE_AREA.side, right: SAFE_AREA.side, bottom: 320, overflow: 'hidden', borderRadius: 12}}>
        <JapanMap
          currentPrefectureName={prefecture}
          previousPrefectureName={previousPrefecture}
          revealedNames={revealedNames}
          colorByName={colorByName}
          localFrame={localFrame}
          durationInFrames={durationInFrames}
        />
        <div style={{position: 'absolute', left: 8, top: 8}}>
          <MapLegend colorScale={colorScale} formatValue={(value) => formatWithUnit(value, unit)} />
        </div>
      </div>
    </div>
  );
};
