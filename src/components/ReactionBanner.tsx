import React from 'react';
import {interpolate} from 'remotion';
import {COLORS} from '../config/theme';

export interface ReactionBannerProps {
  text: string;
  /** Frames elapsed since this prefecture became current. */
  localFrame: number;
  /** How many frames this prefecture stays on screen for. */
  durationInFrames: number;
}

/**
 * A theme-authored reaction line (e.g. "北陸勢、強い…！"), shown in its own
 * fixed zone -- always the same position, center-upper, clearly separate
 * from the map's current-prefecture graphics and from the name/value/rank
 * caption at the bottom. Purely data-driven: the template only knows how
 * to display whatever line the theme config supplies for the current
 * prefecture, never generates the commentary itself.
 *
 * Deliberately appears a beat AFTER the prefecture's rank/name/value have
 * had time to register (a fraction of the slot's own duration, so it scales
 * with however long that prefecture is on screen) rather than all at once,
 * so it reads as a second, separate piece of information rather than
 * noise competing with the ranking readout.
 */
export const ReactionBanner: React.FC<ReactionBannerProps> = ({text, localFrame, durationInFrames}) => {
  const revealAt = Math.round(durationInFrames * 0.32);
  const opacity = interpolate(localFrame, [revealAt, revealAt + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(localFrame, [revealAt, revealAt + 10], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '36%',
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(8, 12, 22, 0.88)',
          border: `1px solid ${COLORS.panelBorder}`,
          borderLeft: `5px solid ${COLORS.accent}`,
          color: COLORS.textPrimary,
          fontWeight: 800,
          fontSize: 38,
          lineHeight: 1.3,
          textAlign: 'center',
          padding: '16px 28px',
          borderRadius: 14,
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
