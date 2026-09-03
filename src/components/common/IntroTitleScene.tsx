import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY, SAFE_AREA, SERIES_TAG} from '../../config/theme';
import {FishImage} from './FishImage';

export interface IntroTitleSceneProps {
  fishName: string;
  fishImageSrc: string;
  fishImageAvailable: boolean;
  title: string;
}

/**
 * The first ~1.5-2s of every video, in both modes: this is what has to work
 * as a scroll-stopping SNS thumbnail on its own. Fish image, species name,
 * and title always land in the same three spots regardless of species, so
 * the series reads as one show. The graph/map takes over right after this.
 */
export const IntroTitleScene: React.FC<IntroTitleSceneProps> = ({
  fishName,
  fishImageSrc,
  fishImageAvailable,
  title,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 18, stiffness: 140, mass: 0.7}});
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: SAFE_AREA.top}}>
      <div
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
          color: COLORS.accentStrong,
          opacity: fadeIn,
          marginBottom: 18,
        }}
      >
        {SERIES_TAG}
      </div>

      <div
        style={{
          transform: `translateY(${(1 - entrance) * 40}px) scale(${0.9 + 0.1 * entrance})`,
          opacity: entrance,
        }}
      >
        <FishImage src={fishImageSrc} available={fishImageAvailable} name={fishName} width={720} />
      </div>

      <div
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 76,
          fontWeight: 800,
          color: COLORS.textPrimary,
          marginTop: 28,
          opacity: fadeIn,
        }}
      >
        {fishName}
      </div>

      <div
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 80,
          fontWeight: 700,
          color: COLORS.textSecondary,
          marginTop: 24,
          textAlign: 'center',
          maxWidth: 940,
          lineHeight: 1.3,
          opacity: fadeIn,
          paddingLeft: SAFE_AREA.side,
          paddingRight: SAFE_AREA.side,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
