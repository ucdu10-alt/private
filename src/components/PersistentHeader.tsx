import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../config/theme';
import {HEADER_INTRO_FRAMES} from '../config/timing';

export interface PersistentHeaderProps {
  title: string;
}

/**
 * The theme's driving question (e.g. "日本で一番寝ている県は？"), pinned to
 * the top of the frame for the ENTIRE video -- it fades/settles in over the
 * first fraction of a second and then just stays there, so a viewer who
 * tunes in mid-sweep still knows what they're watching without waiting for
 * a rerun of an intro screen.
 */
export const PersistentHeader: React.FC<PersistentHeaderProps> = ({title}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, HEADER_INTRO_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, HEADER_INTRO_FRAMES], [-14, 0], {
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
        display: 'flex',
        justifyContent: 'center',
        padding: '30px 56px 14px',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
    </div>
  );
};
