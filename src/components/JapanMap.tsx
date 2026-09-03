import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  MAIN_MAP_BBOX,
  MAIN_MAP_VIEWBOX,
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
              stroke={COLORS.mapStroke}
              strokeWidth={isCurrent ? 2.5 : 1}
              style={
                isCurrent
                  ? {filter: `drop-shadow(0 0 ${10 + pulse * 10}px ${COLORS.mapCurrent})`}
                  : undefined
              }
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 8,
          bottom: 8,
          width: 108,
          height: 82,
          background: 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 10,
          padding: '3px 4px',
          transform: `scale(${insetScale})`,
          transformOrigin: 'bottom left',
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
                stroke={COLORS.mapStroke}
                strokeWidth={0.6}
                style={
                  isCurrent
                    ? {filter: `drop-shadow(0 0 ${4 + pulse * 4}px ${COLORS.mapCurrent})`}
                    : undefined
                }
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
