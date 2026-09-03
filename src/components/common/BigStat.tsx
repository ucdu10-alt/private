import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY} from '../../config/theme';

export interface BigStatProps {
  label?: string;
  value: string;
  valueFontSize?: number;
  labelFontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * The one visual language every "big number" moment in the series shares
 * (current year's catch, comparison values, ...): a small label over a
 * large bold number, with a light entrance pop. Numbers are the whole
 * point of these videos, so this is deliberately the largest/boldest text
 * treatment in the design system.
 */
export const BigStat: React.FC<BigStatProps> = ({
  label,
  value,
  valueFontSize = 96,
  labelFontSize = 32,
  color = COLORS.textPrimary,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 16, stiffness: 180, mass: 0.6}});
  const items = align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end';

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: items}}>
      {label ? (
        <div
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontSize: labelFontSize,
            fontWeight: 600,
            color: COLORS.textSecondary,
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: valueFontSize,
          fontWeight: 800,
          color,
          lineHeight: 1,
          transform: `scale(${0.85 + 0.15 * entrance})`,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
};
