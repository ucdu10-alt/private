import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  MAIN_MAP_BBOX,
  OKINAWA_INSET_VIEWBOX,
  PREFECTURE_PATHS,
} from '../data/geo/japanPaths';
import {COLORS} from '../config/theme';
import {
  cameraRectForBBox,
  cameraRectToViewBox,
  fullMapCameraRect,
  lerpCameraRect,
} from '../utils/mapCamera';

export interface JapanMapProps {
  /** Prefecture currently in the spotlight -- rendered highlighted/glowing. */
  currentPrefectureName: string;
  /** The prefecture shown immediately before this one, if any (undefined for the very first). */
  previousPrefectureName?: string;
  /** Prefectures already shown (including the current one) -- eligible for choropleth coloring. */
  revealedNames: Set<string>;
  /** nameJa -> choropleth color, for every prefecture in the dataset. */
  colorByName: Map<string, string>;
  /** Frames elapsed since `currentPrefectureName` became current. */
  localFrame: number;
  /** How many frames the current prefecture stays on screen for. */
  durationInFrames: number;
}

const PATH_BY_NAME = new Map(PREFECTURE_PATHS.map((p) => [p.nameJa, p]));

/**
 * Renders all 47 prefectures as individually-controllable SVG paths, colors
 * revealed ones by their value (choropleth), and pans/zooms the camera to
 * frame whichever prefecture is current -- so the map visibly "travels"
 * north to south instead of just recoloring a static silhouette.
 *
 * The current prefecture needs to read as "the one" at a single glance, even
 * sitting among a field of already-colored neighbors, so it gets three
 * reinforcing cues: everything else is dimmed slightly, it alone gets a
 * bright outline + glow, and a pulsing ring marks its center.
 *
 * Okinawa lives in a separate inset box (see japanPaths.ts for why); while
 * it's the current prefecture the main map camera zooms back out to a full
 * view and the inset box itself pops up larger instead.
 */
export const JapanMap: React.FC<JapanMapProps> = ({
  currentPrefectureName,
  previousPrefectureName,
  revealedNames,
  colorByName,
  localFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pulse = 0.65 + 0.35 * Math.sin(frame / 6);
  // A second, slower pulse purely for the current-prefecture marker ring,
  // so it visibly breathes rather than just sitting there.
  const ringPulse = (Math.sin(frame / 10) + 1) / 2; // 0..1

  const currentEntry = PATH_BY_NAME.get(currentPrefectureName);
  const previousEntry = previousPrefectureName ? PATH_BY_NAME.get(previousPrefectureName) : undefined;
  const isCurrentInset = currentEntry?.inset ?? false;

  const targetRect =
    isCurrentInset || !currentEntry
      ? fullMapCameraRect(MAIN_MAP_BBOX)
      : cameraRectForBBox(currentEntry.bbox, MAIN_MAP_BBOX);
  const fromRect =
    previousEntry && !previousEntry.inset
      ? cameraRectForBBox(previousEntry.bbox, MAIN_MAP_BBOX)
      : fullMapCameraRect(MAIN_MAP_BBOX);

  const cameraProgress = spring({
    frame: localFrame,
    fps,
    config: {damping: 22, stiffness: 90, mass: 0.9},
    durationInFrames: Math.max(6, Math.min(16, durationInFrames)),
  });
  const cameraRect = lerpCameraRect(fromRect, targetRect, cameraProgress);

  const insetScale = isCurrentInset ? 1 + 0.4 * cameraProgress : 1;

  const mainPaths = PREFECTURE_PATHS.filter((p) => !p.inset);
  const insetPaths = PREFECTURE_PATHS.filter((p) => p.inset);

  const fillFor = (nameJa: string): string => {
    if (!revealedNames.has(nameJa)) return COLORS.mapNotYet;
    return colorByName.get(nameJa) ?? COLORS.mapRevealed;
  };

  // Revealed-but-not-current prefectures are dimmed so the current one pops
  // by contrast even though it shares the same choropleth coloring style.
  const fillOpacityFor = (nameJa: string, isCurrent: boolean): number => {
    if (isCurrent) return 1;
    if (revealedNames.has(nameJa)) return 0.5;
    return 1;
  };

  const currentRingMarker = currentEntry ? (
    <g style={{pointerEvents: 'none'}}>
      <circle
        cx={(currentEntry.bbox[0] + currentEntry.bbox[2]) / 2}
        cy={(currentEntry.bbox[1] + currentEntry.bbox[3]) / 2}
        r={10 + ringPulse * 6}
        fill="none"
        stroke={COLORS.mapCurrent}
        strokeWidth={2}
        opacity={0.9 - ringPulse * 0.5}
      />
    </g>
  ) : null;

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg
        viewBox={cameraRectToViewBox(cameraRect)}
        width="100%"
        height="100%"
        style={{display: 'block', overflow: 'visible'}}
      >
        {mainPaths.map((p) => {
          const isCurrent = p.nameJa === currentPrefectureName;
          return (
            <path
              key={p.jisCode}
              d={p.path}
              fill={fillFor(p.nameJa)}
              fillOpacity={fillOpacityFor(p.nameJa, isCurrent)}
              stroke={isCurrent ? '#ffffff' : COLORS.mapStroke}
              strokeWidth={isCurrent ? 4 : 1}
              style={
                isCurrent
                  ? {filter: `drop-shadow(0 0 ${14 + pulse * 14}px ${COLORS.mapCurrent})`}
                  : undefined
              }
            />
          );
        })}
        {!isCurrentInset ? currentRingMarker : null}
      </svg>

      <div
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          width: 108,
          height: 82,
          background: 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 10,
          padding: '3px 4px',
          transform: `scale(${insetScale})`,
          transformOrigin: 'top right',
        }}
      >
        <div style={{fontSize: 11, color: COLORS.textSecondary, lineHeight: 1}}>沖縄</div>
        <svg viewBox={OKINAWA_INSET_VIEWBOX} width="100%" height="100%" style={{display: 'block'}}>
          {insetPaths.map((p) => {
            const isCurrent = p.nameJa === currentPrefectureName;
            return (
              <path
                key={p.jisCode}
                d={p.path}
                fill={fillFor(p.nameJa)}
                fillOpacity={fillOpacityFor(p.nameJa, isCurrent)}
                stroke={isCurrent ? '#ffffff' : COLORS.mapStroke}
                strokeWidth={isCurrent ? 1.4 : 0.6}
                style={
                  isCurrent
                    ? {filter: `drop-shadow(0 0 ${4 + pulse * 4}px ${COLORS.mapCurrent})`}
                    : undefined
                }
              />
            );
          })}
          {isCurrentInset ? currentRingMarker : null}
        </svg>
      </div>
    </div>
  );
};
