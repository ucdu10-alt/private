import React from 'react';
import type {ColorScale} from '../utils/colorScale';
import {formatValue} from '../utils/formatters';
import type {ValueFormatterId} from '../data/types';
import {COLORS} from '../config/theme';

export interface MapLegendProps {
  colorScale: ColorScale;
  valueFormatterId: ValueFormatterId;
  unit: string;
}

/**
 * Small "少ない -> 多い" color key so the choropleth coloring on the map is
 * actually readable, not just decorative. Deliberately compact and tucked
 * into a corner -- it's a supporting legend, not a focal point, and now
 * sits as an overlay directly on the map so it carries its own translucent
 * backing to stay legible over whatever color is behind it.
 */
export const MapLegend: React.FC<MapLegendProps> = ({colorScale, valueFormatterId, unit}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
        background: 'rgba(6, 10, 20, 0.6)',
        borderRadius: 8,
        padding: '6px 8px',
      }}
    >
      <div style={{display: 'flex', gap: 2}}>
        {colorScale.colors.map((color, i) => (
          <div
            key={color}
            style={{
              width: 18,
              height: 8,
              background: color,
              borderRadius: i === 0 ? '4px 0 0 4px' : i === colorScale.colors.length - 1 ? '0 4px 4px 0' : 0,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 18 * colorScale.colors.length + 2 * (colorScale.colors.length - 1),
          fontSize: 11,
          color: COLORS.textSecondary,
        }}
      >
        <span>{formatValue(valueFormatterId, colorScale.min, unit)}</span>
        <span>{formatValue(valueFormatterId, colorScale.max, unit)}</span>
      </div>
    </div>
  );
};
