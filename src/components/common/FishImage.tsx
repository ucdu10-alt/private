import React from 'react';
import {Img, staticFile} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY} from '../../config/theme';
import {toStaticPath} from '../../data/fish/loadFish';

export interface FishImageProps {
  src: string;
  /**
   * Whether `src` actually exists under public/ (checked once up front via
   * calculateMetadata, not at render time) -- lets the fallback be a plain
   * deterministic branch instead of an <img onError> handler, which is
   * unreliable during headless rendering.
   */
  available: boolean;
  name: string;
  width?: number;
  style?: React.CSSProperties;
}

/**
 * Renders a fish species' hero image, or -- if the artwork hasn't been
 * generated/dropped in yet -- a plain name-only fallback card so a missing
 * PNG never breaks a render.
 */
export const FishImage: React.FC<FishImageProps> = ({src, available, name, width = 760, style}) => {
  if (!available) {
    return (
      <div
        style={{
          width,
          height: width * 0.42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 24,
          border: `2px dashed ${COLORS.surfaceBorder}`,
          background: COLORS.surface,
          color: COLORS.textSecondary,
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: 2,
          textAlign: 'center',
          ...style,
        }}
      >
        {name}
      </div>
    );
  }

  return (
    <Img
      src={staticFile(toStaticPath(src))}
      style={{width, height: 'auto', maxHeight: width * 0.6, objectFit: 'contain', display: 'block', ...style}}
    />
  );
};
