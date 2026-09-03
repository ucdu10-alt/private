import {staticFile} from 'remotion';
import {parsePrefectureCsv} from '../utils/csv';
import {computeRankings} from '../utils/ranking';
import {THEME_REGISTRY} from './themes/registry';
import type {ResolvedTheme} from './types';

/**
 * Loads a theme's CSV (from public/) and computes its national rankings.
 * Runs inside a Composition's `calculateMetadata`, so it happens once
 * before the video starts rendering/playing -- components downstream just
 * receive the already-resolved theme.
 */
export const loadTheme = async (themeId: string): Promise<ResolvedTheme> => {
  const meta = THEME_REGISTRY[themeId];
  if (!meta) {
    const known = Object.keys(THEME_REGISTRY).join(', ');
    throw new Error(`Unknown themeId "${themeId}". Known themes: ${known}`);
  }

  const response = await fetch(staticFile(meta.csvPath));
  if (!response.ok) {
    throw new Error(`Failed to load theme CSV at ${meta.csvPath}: ${response.status}`);
  }
  const csvText = await response.text();
  const data = parsePrefectureCsv(csvText);
  const ranked = computeRankings(data, meta.rankDirection);
  const rankByPrefecture = Object.fromEntries(ranked.map((row) => [row.prefecture, row]));

  return {...meta, data, ranked, rankByPrefecture};
};
