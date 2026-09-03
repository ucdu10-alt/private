import type {ThemeMeta} from '../types';

/**
 * All available themes. To add a new one:
 *
 *   1. Drop a `prefecture,value` CSV into public/data/<your-theme>.csv
 *   2. Add an entry here describing how to title/format/rank it
 *   3. Point Root.tsx's defaultProps at its id (or pass themeId as an
 *      input prop when rendering)
 *
 * No component code needs to change -- everything theme-specific
 * (wording, units, formatting, better-is-higher-or-lower) lives here.
 */
export const THEME_REGISTRY: Record<string, ThemeMeta> = {
  'sleep-time': {
    id: 'sleep-time',
    title: '日本で一番寝ている県は？',
    subtitle: 'あなたの県は何位？',
    unit: '分',
    valueFormatterId: 'hoursMinutes',
    rankDirection: 'higherIsBetter',
    sourceText: 'サンプルデータ（デモ用の架空の数値です）',
    csvPath: 'data/sleep-time.csv',
  },
};

export const DEFAULT_THEME_ID = 'sleep-time';
