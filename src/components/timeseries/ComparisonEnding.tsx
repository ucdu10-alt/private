import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY} from '../../config/theme';
import {formatChangeLabel, formatWithUnit, formatYear} from '../../utils/formatters';
import type {TimeseriesComparison} from '../../data/types';
import {BigStat} from '../common/BigStat';

export interface ComparisonEndingProps {
  comparison: TimeseriesComparison;
  unit: string;
  /** How long (in frames, from this scene's start) to hold on the latest year alone before the comparison appears. */
  finalHoldFrames: number;
}

/**
 * Closes out timeseries mode: a short hold on the latest year's number
 * (step 9 in the spec), then a from -> to comparison card with the
 * program-computed % change (step 10/11). `compareFrom` decides whether
 * "from" is the first year, the peak year, or a specific year -- this
 * component just renders whatever `computeComparison` resolved.
 */
export const ComparisonEnding: React.FC<ComparisonEndingProps> = ({comparison, unit, finalHoldFrames}) => {
  const frame = useCurrentFrame();

  const holdOpacity = interpolate(frame, [finalHoldFrames - 12, finalHoldFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const compareLocalFrame = Math.max(0, frame - finalHoldFrames);
  const compareOpacity = interpolate(compareLocalFrame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const changeOpacity = interpolate(compareLocalFrame, [22, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isDecrease = comparison.changePercent < 0;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {holdOpacity > 0 ? (
        <div style={{position: 'absolute', opacity: holdOpacity}}>
          <BigStat
            label={formatYear(comparison.toYear)}
            value={formatWithUnit(comparison.toValue, unit)}
            valueFontSize={112}
            labelFontSize={38}
            color={COLORS.accentStrong}
          />
        </div>
      ) : null}

      <div style={{opacity: compareOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <BigStat
          label={formatYear(comparison.fromYear)}
          value={formatWithUnit(comparison.fromValue, unit)}
          valueFontSize={72}
          labelFontSize={28}
          color={COLORS.textSecondary}
        />
        <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 56, color: COLORS.textMuted}}>↓</div>
        <BigStat
          label={formatYear(comparison.toYear)}
          value={formatWithUnit(comparison.toValue, unit)}
          valueFontSize={92}
          labelFontSize={30}
          color={COLORS.textPrimary}
        />
        <div
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontSize: 60,
            fontWeight: 800,
            color: isDecrease ? COLORS.negative : COLORS.positive,
            marginTop: 6,
            opacity: changeOpacity,
          }}
        >
          {formatChangeLabel(comparison.changePercent)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
