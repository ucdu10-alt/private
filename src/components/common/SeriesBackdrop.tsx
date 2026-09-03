import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../../config/theme';

/**
 * Shared full-bleed background for every fish/every mode. This -- not any
 * per-fish setting -- is what makes two different species' videos read as
 * "the same series" at a glance. Deliberately not ocean-blue: a warm
 * ink/amber palette so the fish photo itself supplies the "water" mood
 * instead of a generic blue wash.
 */
export const SeriesBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 0%, ${COLORS.backgroundGradientEnd} 0%, ${COLORS.background} 62%)`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          'repeating-linear-gradient(180deg, rgba(255,244,224,0.035) 0px, rgba(255,244,224,0.035) 1px, transparent 1px, transparent 64px)',
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 105%, ${COLORS.accentSoft} 0%, transparent 55%)`,
        opacity: 0.6,
      }}
    />
  </AbsoluteFill>
);
