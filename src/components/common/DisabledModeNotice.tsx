import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONT_FAMILY_DISPLAY} from '../../config/theme';

/** Rendered instead of a mode's video when that mode is turned off in the fish's config.json. */
export const DisabledModeNotice: React.FC<{fishName: string; mode: string}> = ({fishName, mode}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: COLORS.background}}>
    <div style={{fontFamily: FONT_FAMILY_DISPLAY, fontSize: 40, color: COLORS.textSecondary, textAlign: 'center'}}>
      {fishName} は {mode} モードが config.json で無効化されています
    </div>
  </AbsoluteFill>
);
