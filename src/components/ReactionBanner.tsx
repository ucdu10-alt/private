import React from 'react';
import {interpolate} from 'remotion';
import {COLORS} from '../config/theme';

export interface ReactionBannerProps {
  text: string;
  /** Frames elapsed since this prefecture became current. */
  localFrame: number;
}

/**
 * An extra-prominent callout for a specific, theme-authored reaction line
 * (e.g. "海なし県なのに、こんな上位！？"). Purely data-driven -- the
 * template itself never generates this text; it only knows how to display
 * whatever line the theme config supplies for the current prefecture.
 * Positioned in the upper part of the map so it doesn't collide with the
 * legend/inset corner or the bottom name/value/rank caption.
 */
export const ReactionBanner: React.FC<ReactionBannerProps> = ({text, localFrame}) => {
  const opacity = interpolate(localFrame, [2, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(localFrame, [2, 10], [-14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 96,
        left: 16,
        right: 16,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          background: COLORS.accent,
          color: '#231702',
          fontWeight: 900,
          fontSize: 34,
          lineHeight: 1.3,
          textAlign: 'center',
          padding: '14px 26px',
          borderRadius: 18,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
