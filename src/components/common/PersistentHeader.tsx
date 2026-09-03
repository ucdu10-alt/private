import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY, SAFE_AREA} from '../../config/theme';

export interface PersistentHeaderProps {
  fishName: string;
  title: string;
  /** Local frame (within whichever <Sequence> renders this) at which the header starts fading in. */
  appearFrame: number;
}

/** Small pinned title, shown once the intro hands off to the graph/map so context never gets lost. */
export const PersistentHeader: React.FC<PersistentHeaderProps> = ({fishName, title, appearFrame}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
      }}
    >
      <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 34, fontWeight: 800, color: COLORS.textPrimary}}>
        {fishName}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.textSecondary,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {title}
      </div>
    </div>
  );
};
