import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../config/theme';

export interface TitleCardProps {
  title: string;
  subtitle?: string;
  durationInFrames: number;
}

/**
 * Opening title, on screen for ~1-1.5s. Content is entirely prop-driven
 * (title/subtitle come from the active theme's config) so a new theme never
 * requires touching this component.
 */
export const TitleCard: React.FC<TitleCardProps> = ({title, subtitle, durationInFrames}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const scale = interpolate(frame, [0, 10], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 64px',
      }}
    >
      <div style={{opacity, transform: `scale(${scale})`}}>
        <div style={{fontSize: 58, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1.35}}>
          {title}
        </div>
        {subtitle ? (
          <div style={{marginTop: 18, fontSize: 32, color: COLORS.accent, fontWeight: 700}}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
