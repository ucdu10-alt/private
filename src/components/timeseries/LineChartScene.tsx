import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_FAMILY_DISPLAY, SAFE_AREA} from '../../config/theme';
import {formatWithUnit, formatYear} from '../../utils/formatters';
import type {Annotation, ValidTimeseriesRow} from '../../data/types';
import {BigStat} from '../common/BigStat';
import {PeakBadge} from './PeakBadge';
import {AnnotationCallout} from './AnnotationCallout';
import {
  TIMESERIES_ANNOTATION_SECONDS,
  TIMESERIES_PEAK_BADGE_SECONDS,
  secondsToFrames,
} from '../../config/timing';

export interface LineChartSceneProps {
  rows: ValidTimeseriesRow[];
  maxValue: number;
  unit: string;
  peakIndex: number;
  annotations: Annotation[];
  /** Total frames this scene animates the line across (config: timeseries.timelineDuration). */
  durationInFrames: number;
}

const CHART_WIDTH = 940;
const CHART_HEIGHT = 760;
const MARGIN = {top: 30, right: 16, bottom: 64, left: 16};
const PLOT = {
  x: MARGIN.left,
  y: MARGIN.top,
  width: CHART_WIDTH - MARGIN.left - MARGIN.right,
  height: CHART_HEIGHT - MARGIN.top - MARGIN.bottom,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const pickYearStep = (span: number): number => (span <= 30 ? 5 : 10);

const CHART_BOX_WIDTH = 1080 - SAFE_AREA.side * 2;
const CHART_BOX_HEIGHT = (CHART_HEIGHT / CHART_WIDTH) * CHART_BOX_WIDTH;

/**
 * The core visual of timeseries mode: an axis-labeled line chart that
 * grows year by year as the video plays, always driven by real data points
 * (no interpolated fake years) -- see FishTimeseriesVideo for how the
 * config's `timelineDuration` gets divided evenly across every year the
 * CSV actually has.
 */
export const LineChartScene: React.FC<LineChartSceneProps> = ({
  rows,
  maxValue,
  unit,
  peakIndex,
  annotations,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const lastIndex = rows.length - 1;

  const progress = Math.min(1, Math.max(0, frame / durationInFrames));
  const rawPosition = progress * lastIndex;
  const index = Math.min(lastIndex, Math.floor(rawPosition));
  const subT = rawPosition - index;
  const hasNext = index < lastIndex;

  const currentRow = rows[index];

  const minYear = rows[0].year;
  const maxYear = rows[lastIndex].year;
  const domainMax = maxValue * 1.15;

  const xForYear = (year: number) => PLOT.x + ((year - minYear) / (maxYear - minYear || 1)) * PLOT.width;
  const yForValue = (value: number) => PLOT.y + PLOT.height - (value / domainMax) * PLOT.height;

  const points = rows.map((row) => ({x: xForYear(row.year), y: yForValue(row.catchTons)}));
  const leadingPoint = hasNext ? {x: lerp(points[index].x, points[index + 1].x, subT), y: lerp(points[index].y, points[index + 1].y, subT)} : points[index];

  const visiblePoints = [...points.slice(0, index + 1), leadingPoint];
  const linePath = visiblePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const baselineY = PLOT.y + PLOT.height;
  const areaPath = `${linePath} L ${leadingPoint.x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;

  const yearStep = pickYearStep(maxYear - minYear);
  const ticks: number[] = [];
  for (let year = Math.ceil(minYear / yearStep) * yearStep; year <= maxYear; year += yearStep) {
    ticks.push(year);
  }
  if (ticks[0] !== minYear) ticks.unshift(minYear);
  if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);

  const peakFrame = (peakIndex / lastIndex) * durationInFrames;
  const peakBadgeFrames = secondsToFrames(TIMESERIES_PEAK_BADGE_SECONDS);
  const peakOpacity = interpolate(
    frame,
    [peakFrame - 2, peakFrame + 4, peakFrame + peakBadgeFrames - 10, peakFrame + peakBadgeFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const annotationFrames = secondsToFrames(TIMESERIES_ANNOTATION_SECONDS);

  const pulse = 0.6 + 0.4 * Math.sin(frame / 5);

  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <BigStat label={formatYear(currentRow.year)} value={formatWithUnit(currentRow.catchTons, unit)} valueFontSize={104} labelFontSize={34} color={COLORS.accentStrong} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 540,
          left: SAFE_AREA.side,
          right: SAFE_AREA.side,
          height: CHART_BOX_HEIGHT,
        }}
      >
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.chartAreaFrom} />
              <stop offset="100%" stopColor={COLORS.chartAreaTo} />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={PLOT.x}
              x2={PLOT.x + PLOT.width}
              y1={PLOT.y + PLOT.height * (1 - t)}
              y2={PLOT.y + PLOT.height * (1 - t)}
              stroke={COLORS.chartGrid}
              strokeWidth={1}
            />
          ))}

          <path d={areaPath} fill="url(#chartArea)" stroke="none" />
          <path d={linePath} fill="none" stroke={COLORS.chartLine} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />

          <circle cx={leadingPoint.x} cy={leadingPoint.y} r={9 + pulse * 4} fill="none" stroke={COLORS.chartLine} strokeWidth={2} opacity={0.7 - pulse * 0.3} />
          <circle cx={leadingPoint.x} cy={leadingPoint.y} r={9} fill={COLORS.chartLine} stroke={COLORS.background} strokeWidth={3} />

          {ticks.map((year) => (
            <text
              key={year}
              x={xForYear(year)}
              y={PLOT.y + PLOT.height + 40}
              textAnchor="middle"
              fontFamily={FONT_FAMILY}
              fontSize={30}
              fill={COLORS.chartAxisLabel}
            >
              {year}
            </text>
          ))}
        </svg>

        <PeakBadge
          opacity={peakOpacity}
          leftPercent={(points[peakIndex].x / CHART_WIDTH) * 100}
          topPercent={(points[peakIndex].y / CHART_HEIGHT) * 100}
        />

        {annotations.map((annotation) => {
          const annotationRowIndex = rows.findIndex((row) => row.year === annotation.year);
          if (annotationRowIndex === -1) return null;
          const annotationFrame = (annotationRowIndex / lastIndex) * durationInFrames;
          const opacity = interpolate(
            frame,
            [annotationFrame - 2, annotationFrame + 4, annotationFrame + annotationFrames - 10, annotationFrame + annotationFrames],
            [0, 1, 1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          return (
            <AnnotationCallout
              key={annotation.year}
              text={annotation.text}
              opacity={opacity}
              leftPercent={(points[annotationRowIndex].x / CHART_WIDTH) * 100}
              topPercent={(points[annotationRowIndex].y / CHART_HEIGHT) * 100}
            />
          );
        })}
      </div>
    </div>
  );
};
