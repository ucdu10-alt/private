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
    displayOrder: 'rankAscending',
    reactions: {
      福井県: '北陸勢、強い…！',
      石川県: '石川も20店超え！',
      // Yamanashi is landlocked yet #1 in this dataset -- that's the twist.
      山梨県: '1位、まさかの海なし県！',
    },
    // Ranks 47->21 run quick, easing down through the mid-pack, then the
    // top 3 deliberately slow down as the ranking's climax.
    pacingByRank: [
      {fromRank: 47, toRank: 21, fromSeconds: 1.0, toSeconds: 1.2},
      {fromRank: 20, toRank: 11, fromSeconds: 1.2, toSeconds: 1.4},
      {fromRank: 10, toRank: 4, fromSeconds: 1.4, toSeconds: 1.6},
      {fromRank: 3, toRank: 1, fromSeconds: 2.0, toSeconds: 2.5},
    ],
    finalListTitle: '人口10万人あたりの寿司店数 TOP5',
    closingLine: 'あなたの県は何位だった？',
    finalScreenSeconds: 5,
  },
};
