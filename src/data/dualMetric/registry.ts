import type {DualMetricThemeMeta} from '../types';
import {COLORS} from '../../config/theme';

/**
 * Dual-metric themes: same idea as THEME_REGISTRY (src/data/themes/registry.ts)
 * but for the "two independently-ranked numbers per prefecture, shown in
 * geographic order" template variant. Root.tsx generates one Composition per
 * entry here too, so adding a theme is enough -- no component changes needed.
 */
export const DUAL_METRIC_THEME_REGISTRY: Record<string, DualMetricThemeMeta> = {
  'sushi-shops-by-prefecture': {
    id: 'sushi-shops-by-prefecture',
    title: '都道府県別 寿司店数',
    subtitle: '店舗数 / 人口10万人あたり',
    csvPath: 'data/sushi-shops-by-prefecture.csv',
    displayOrderColumn: 'display_order',
    sourceText: '出典：経済センサス（2021年6月調査）',
    primaryMetric: {
      csvColumn: 'store_count',
      label: '店舗数',
      unit: '店舗',
      valueFormatterId: 'integer',
      rankDirection: 'higherIsBetter',
      accentColor: COLORS.storeCountAccent,
    },
    secondaryMetric: {
      csvColumn: 'stores_per_100k',
      label: '人口10万人あたり',
      unit: '店 / 10万人',
      valueFormatterId: 'decimal1',
      rankDirection: 'higherIsBetter',
      accentColor: COLORS.perCapitaAccent,
    },
  },
};
