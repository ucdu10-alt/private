import React from 'react';
import type {ColorScale} from '../utils/colorScale';
import {COLORS} from '../config/theme';

export interface MapLegendProps {
  colorScale: ColorScale;
  formatValue: (value: number) => string;
}

/**
 * Small "少ない -> 多い" color key so the choropleth coloring on the map is
 * actually readable, not just decorative. Compact and tucked into a
 * corner, sitting directly on the map with its own translucent backing.
 */
export const MapLegend: React.FC<MapLegendProps> = ({colorScale, formatValue}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5,
        background: 'rgba(6, 10, 20, 0.6)',
        borderRadius: 10,
        padding: '10px 12px',
      }}
    >
      <div style={{display: 'flex', gap: 3}}>
        {colorScale.colors.map((color, i) => (
          <div
            key={color}
            style={{
              width: 26,
              height: 14,
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
          width: 26 * colorScale.colors.length + 3 * (colorScale.colors.length - 1),
          fontSize: 18,
          fontWeight: 600,
          color: COLORS.textSecondary,
        }}
      >
        <span>{formatValue(colorScale.min)}</span>
        <span>{formatValue(colorScale.max)}</span>
      </div>
    </div>
  );
};
