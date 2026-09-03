import type {ThemeMeta} from '../types';

/**
 * All available themes. To add a new one:
 *
 *   1. Drop a `prefecture,value` CSV into public/data/<your-theme>.csv
 *   2. Add an entry here describing how to title/format/rank it
 *
 * That's it -- Root.tsx generates one Composition per registry entry
 * (named after its id), so the new theme is immediately selectable in
 * Remotion Studio and renderable by id. No component code needs to
 * change -- everything theme-specific (wording, units, formatting,
 * better-is-higher-or-lower) lives here.
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
  'sushi-shops': {
    id: 'sushi-shops',
    title: '人口10万人あたり 寿司屋が多い県はどこ？',
    subtitle: '人口10万人あたりの寿司店数',
    unit: '店 / 10万人',
    valueFormatterId: 'decimal1',
    rankDirection: 'higherIsBetter',
    sourceText: '出典: e-Stat 経済センサス（2021年6月調査）',
    csvPath: 'data/sushi-shops.csv',
  },
};
