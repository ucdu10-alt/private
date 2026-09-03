import React from 'react';
import {COLORS, FONT_FAMILY, RADIUS} from '../../config/theme';

export interface AnnotationCalloutProps {
  text: string;
  /** 0..1 -- fades in/out without unmounting so position math stays simple. */
  opacity: number;
  leftPercent: number;
  topPercent: number;
}

/** A config-supplied callout (e.g. "ここから急減") anchored to its year's point on the chart. */
export const AnnotationCallout: React.FC<AnnotationCalloutProps> = ({text, opacity, leftPercent, topPercent}) => {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: `translate(-50%, -145%) scale(${0.9 + 0.1 * opacity})`,
        opacity,
        background: COLORS.annotationBackground,
        border: `1.5px solid ${COLORS.annotationBorder}`,
        color: COLORS.textPrimary,
        borderRadius: RADIUS.sm,
        padding: '10px 18px',
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: 24,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      }}
    >
      {text}
    </div>
  );
};
