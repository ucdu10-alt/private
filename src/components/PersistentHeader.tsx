import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../config/theme';
import {HEADER_INTRO_FRAMES} from '../config/timing';

export interface PersistentHeaderProps {
  title: string;
  /** Optional second line under the title, always shown alongside it (unlike ThemeMeta.subtitle elsewhere, which isn't rendered). */
  subtitle?: string;
  /**
   * Smaller type + tighter padding, for videos where the header must stay
   * out of the way of information that needs to read instantly (no title
   * card, content starts at frame 0). Defaults to false (the original,
   * large single-line title treatment).
   */
  compact?: boolean;
  /** Frames for the entrance fade/slide. Defaults to HEADER_INTRO_FRAMES; pass 0 for an instant, no-animation appearance. */
  introFrames?: number;
}

/**
 * The theme's driving question (e.g. "日本で一番寝ている県は？"), pinned to
 * the top of the frame for the ENTIRE video -- it fades/settles in over the
 * first fraction of a second and then just stays there, so a viewer who
 * tunes in mid-sweep still knows what they're watching without waiting for
 * a rerun of an intro screen.
 */
export const PersistentHeader: React.FC<PersistentHeaderProps> = ({
  title,
  subtitle,
  compact = false,
  introFrames = HEADER_INTRO_FRAMES,
}) => {
  const frame = useCurrentFrame();

  const opacity =
    introFrames <= 0
      ? 1
      : interpolate(frame, [0, introFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const translateY =
    introFrames <= 0
      ? 0
      : interpolate(frame, [0, introFrames], [-14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: compact ? '14px 48px 8px' : '26px 48px 16px',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontSize: compact ? 30 : 68,
          fontWeight: 800,
          color: COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 1.3,
          textShadow: '0 3px 10px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.8)',
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: compact ? 18 : 32,
            fontWeight: 700,
            color: compact ? COLORS.textSecondary : COLORS.accent,
            textAlign: 'center',
            marginTop: compact ? 2 : 10,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
