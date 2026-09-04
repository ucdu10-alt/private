import {staticFile} from 'remotion';
import {parseNamedCsv} from '../../utils/csv';
import {computeRankings} from '../../utils/ranking';
import {PREFECTURE_ORDER_NORTH_TO_SOUTH} from '../prefectureOrder';
import {DUAL_METRIC_THEME_REGISTRY} from './registry';
import type {DualMetricRow, ResolvedDualMetricTheme} from '../types';

/**
 * Loads a dual-metric theme's CSV and computes BOTH metrics' rankings
 * independently from their raw values -- exactly like loadTheme.ts does for
 * single-metric themes, just twice. Any rank-looking columns in the source
 * CSV (e.g. this project's own `store_rank` / `per_100k_rank`) are treated
 * as human-supplied reference data only; they are never read here, so the
 * displayed ranks are always freshly computed, never trusted blindly.
 */
export const loadDualMetricTheme = async (themeId: string): Promise<ResolvedDualMetricTheme> => {
  const meta = DUAL_METRIC_THEME_REGISTRY[themeId];
  if (!meta) {
    const known = Object.keys(DUAL_METRIC_THEME_REGISTRY).join(', ');
    throw new Error(`Unknown dual-metric themeId "${themeId}". Known themes: ${known}`);
  }

  const response = await fetch(staticFile(meta.csvPath));
  if (!response.ok) {
    throw new Error(`Failed to load theme CSV at ${meta.csvPath}: ${response.status}`);
  }
  const csvText = await response.text();
  const records = parseNamedCsv(csvText);

  if (records.length !== 47) {
    throw new Error(`Expected 47 prefecture rows in ${meta.csvPath}, found ${records.length}`);
  }

  const seenPrefectures = new Set<string>();
  for (const record of records) {
    const prefecture = record.prefecture;
    if (!prefecture) {
      throw new Error(`Row missing "prefecture" in ${meta.csvPath}: ${JSON.stringify(record)}`);
    }
    if (seenPrefectures.has(prefecture)) {
      throw new Error(`Duplicate prefecture "${prefecture}" in ${meta.csvPath}`);
    }
    seenPrefectures.add(prefecture);
  }
  const missingFromCsv = PREFECTURE_ORDER_NORTH_TO_SOUTH.filter((name) => !seenPrefectures.has(name));
  if (missingFromCsv.length > 0) {
    throw new Error(`${meta.csvPath} is missing prefectures: ${missingFromCsv.join(', ')}`);
  }

  const readMetricValue = (record: Record<string, string>, column: string): number => {
    const raw = record[column];
    const value = Number(raw);
    if (raw === undefined || raw === '' || Number.isNaN(value)) {
      throw new Error(`Invalid "${column}" value for ${record.prefecture} in ${meta.csvPath}: "${raw}"`);
    }
    return value;
  };

  const primaryRanked = computeRankings(
    records.map((record) => ({
      prefecture: record.prefecture,
      value: readMetricValue(record, meta.primaryMetric.csvColumn),
    })),
    meta.primaryMetric.rankDirection,
  );
  const secondaryRanked = computeRankings(
    records.map((record) => ({
      prefecture: record.prefecture,
      value: readMetricValue(record, meta.secondaryMetric.csvColumn),
    })),
    meta.secondaryMetric.rankDirection,
  );
  const primaryByName = new Map(primaryRanked.map((row) => [row.prefecture, row]));
  const secondaryByName = new Map(secondaryRanked.map((row) => [row.prefecture, row]));

  const rows: DualMetricRow[] = records.map((record) => {
    const prefecture = record.prefecture;
    const primary = primaryByName.get(prefecture);
    const secondary = secondaryByName.get(prefecture);
    if (!primary || !secondary) {
      // Unreachable given the completeness checks above; keeps TS satisfied.
      throw new Error(`Failed to rank prefecture "${prefecture}"`);
    }

    const displayOrderRaw = record[meta.displayOrderColumn];
    const parsedDisplayOrder = Number(displayOrderRaw);
    const fallbackDisplayOrder = PREFECTURE_ORDER_NORTH_TO_SOUTH.indexOf(prefecture) + 1;
    const displayOrder =
      displayOrderRaw && !Number.isNaN(parsedDisplayOrder) ? parsedDisplayOrder : fallbackDisplayOrder;

    return {
      prefecture,
      displayOrder,
      primaryValue: primary.value,
      primaryRank: primary.rank,
      secondaryValue: secondary.value,
      secondaryRank: secondary.rank,
    };
  });

  rows.sort((a, b) => a.displayOrder - b.displayOrder);

  const primaryTop3: DualMetricRow[] = primaryRanked
    .slice(0, 3)
    .map((row) => rows.find((r) => r.prefecture === row.prefecture)!);
  const secondaryTop3: DualMetricRow[] = secondaryRanked
    .slice(0, 3)
    .map((row) => rows.find((r) => r.prefecture === row.prefecture)!);

  return {...meta, rows, primaryTop3, secondaryTop3};
};
