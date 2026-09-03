import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../config/theme';

export interface HookIntroProps {
  text: string;
  durationInFrames: number;
}

/**
 * A one-time teaser line shown before the sweep starts (theme.hookText),
 * e.g. "寿司屋が多い県、海沿いが強いと思ってない？". Distinct from the
 * persistent header (which keeps showing the theme's actual title/question
 * throughout) -- this is a short hook meant to disappear immediately once
 * the countdown begins, so it's kept intentionally brief with no extra
 * explanation.
 */
export const HookIntro: React.FC<HookIntroProps> = ({text, durationInFrames}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const scale = interpolate(frame, [0, 10], [0.94, 1], {
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
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 52,
          fontWeight: 900,
          color: COLORS.textPrimary,
          lineHeight: 1.4,
          textShadow: '0 3px 10px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.8)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
