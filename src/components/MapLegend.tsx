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
 * actually readable, not just decorative. Deliberately compact -- it's a
 * supporting legend, not a focal point.
 */
export const MapLegend: React.FC<MapLegendProps> = ({colorScale, valueFormatterId, unit}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
      <div style={{display: 'flex', gap: 3}}>
        {colorScale.colors.map((color, i) => (
          <div
            key={color}
            style={{
              width: 30,
              height: 12,
              background: color,
              borderRadius: i === 0 ? '6px 0 0 6px' : i === colorScale.colors.length - 1 ? '0 6px 6px 0' : 0,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 30 * colorScale.colors.length + 3 * (colorScale.colors.length - 1),
          fontSize: 15,
          color: COLORS.textSecondary,
        }}
      >
        <span>{formatValue(valueFormatterId, colorScale.min, unit)}</span>
        <span>{formatValue(valueFormatterId, colorScale.max, unit)}</span>
      </div>
    </div>
  );
};
