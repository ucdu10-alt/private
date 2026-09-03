import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MAIN_MAP_VIEWBOX, OKINAWA_INSET_VIEWBOX, PREFECTURE_PATHS} from '../data/geo/japanPaths';
import {COLORS} from '../config/theme';

export interface JapanMapProps {
  /** Prefecture currently in the spotlight -- rendered highlighted/glowing. */
  currentPrefectureName: string;
  /** Prefectures already shown (including the current one) -- rendered "visited". */
  revealedNames: Set<string>;
}

type PrefectureStatus = 'upcoming' | 'revealed' | 'current';

const statusOf = (
  nameJa: string,
  currentPrefectureName: string,
  revealedNames: Set<string>,
): PrefectureStatus => {
  if (nameJa === currentPrefectureName) return 'current';
  if (revealedNames.has(nameJa)) return 'revealed';
  return 'upcoming';
};

const fillFor = (status: PrefectureStatus): string => {
  if (status === 'current') return COLORS.mapCurrent;
  if (status === 'revealed') return COLORS.mapRevealed;
  return COLORS.mapNotYet;
};

/**
 * Renders all 47 prefectures as individually-controllable SVG paths, each
 * colored by whether it's upcoming / already revealed / the current
 * spotlight. Okinawa is projected separately into a small inset box (it's
 * geographically far south-west of the mainland; showing it at true scale
 * and position would either shrink the mainland or push Okinawa off
 * screen -- a small inset is the standard treatment for Japan maps).
 *
 * This component only needs a "current" name and a "revealed" set, so a
 * future map implementation (a different projection, an animated SVG
 * library, etc.) can be swapped in behind the same two props.
 */
export const JapanMap: React.FC<JapanMapProps> = ({currentPrefectureName, revealedNames}) => {
  const frame = useCurrentFrame();
  // Subtle continuous pulse on the current prefecture's glow -- a gentle
  // "this one, right here" cue rather than a flashy effect.
  const pulse = 0.65 + 0.35 * Math.sin(frame / 6);

  const mainPaths = PREFECTURE_PATHS.filter((p) => !p.inset);
  const insetPaths = PREFECTURE_PATHS.filter((p) => p.inset);

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg viewBox={MAIN_MAP_VIEWBOX} width="100%" height="100%" style={{overflow: 'visible'}}>
        {mainPaths.map((p) => {
          const status = statusOf(p.nameJa, currentPrefectureName, revealedNames);
          const isCurrent = status === 'current';
          return (
            <path
              key={p.jisCode}
              d={p.path}
              fill={fillFor(status)}
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
        }}
      >
        <div style={{fontSize: 11, color: COLORS.textSecondary, lineHeight: 1}}>沖縄</div>
        <svg viewBox={OKINAWA_INSET_VIEWBOX} width="100%" height="100%">
          {insetPaths.map((p) => {
            const status = statusOf(p.nameJa, currentPrefectureName, revealedNames);
            const isCurrent = status === 'current';
            return (
              <path
                key={p.jisCode}
                d={p.path}
                fill={fillFor(status)}
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
