import React from 'react';
import {COLORS, FONT_FAMILY} from '../../config/theme';
import type {FishSource} from '../../data/types';

/**
 * Small always-present credit line, e.g. "出典：農林水産省 漁業・養殖業生産統計（2024）".
 * The source URL is intentionally never shown on screen (kept only in the
 * data/config for provenance) -- only name+year render here.
 */
export const SourceCredit: React.FC<{source: FishSource}> = ({source}) => {
  if (!source?.name) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center'}}>
      <span style={{fontFamily: FONT_FAMILY, fontSize: 19, color: COLORS.textMuted}}>
        出典：{source.name}
        {source.year ? `（${source.year}）` : ''}
      </span>
    </div>
  );
};
