import {staticFile} from 'remotion';
import {parseCsv} from '../../utils/csv';
import {validateAndParsePrefecture, validateAndParseTimeseries} from '../../utils/validation';
import {findPeak} from '../../utils/peak';
import {computeComparison} from '../../utils/compare';
import {buildColorScale} from '../../utils/colorScale';
import {buildEligibleRows, buildRanking, selectRankCount} from '../../utils/rankingAuto';
import type {
  FishConfig,
  PrefectureRankingConfig,
  ResolvedPrefectureRanking,
  ResolvedTimeseries,
  TimeseriesConfig,
} from '../types';

export const fishConfigPath = (id: string): string => `data/fish/${id}/config.json`;
export const fishTimeseriesCsvPath = (id: string): string => `data/fish/${id}/timeseries.csv`;
export const fishPrefectureCsvPath = (id: string): string => `data/fish/${id}/prefecture.csv`;

/** Strips a leading "/" so a config's `image` field works with staticFile() either way it's written. */
export const toStaticPath = (path: string): string => path.replace(/^\/+/, '');

const REQUIRED_STRING_FIELDS: (keyof FishConfig)[] = ['id', 'name', 'image', 'unit'];

const validateConfigShape = (id: string, json: unknown): FishConfig => {
  if (typeof json !== 'object' || json === null) {
    throw new Error(`魚種設定 (${fishConfigPath(id)}) がオブジェクトではありません`);
  }
  const config = json as Record<string, unknown>;
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof config[field] !== 'string' || (config[field] as string).length === 0) {
      throw new Error(`魚種設定 (${fishConfigPath(id)}) に必須項目 "${field}" がありません`);
    }
  }
  if (!config.source || typeof config.source !== 'object') {
    throw new Error(`魚種設定 (${fishConfigPath(id)}) に "source" がありません`);
  }
  if (!config.timeseries && !config.prefectureRanking) {
    throw new Error(
      `魚種設定 (${fishConfigPath(id)}) は timeseries / prefectureRanking のどちらも定義していません`,
    );
  }
  return config as unknown as FishConfig;
};

/** Loads and shape-validates a fish's config.json from public/data/fish/<id>/config.json. */
export const loadFishConfig = async (id: string): Promise<FishConfig> => {
  const path = fishConfigPath(id);
  const response = await fetch(staticFile(path));
  if (!response.ok) {
    throw new Error(`魚種設定が見つかりません: ${path} (HTTP ${response.status})`);
  }
  const json: unknown = await response.json();
  const config = validateConfigShape(id, json);
  if (config.id !== id) {
    throw new Error(`魚種設定 (${path}) の id ("${config.id}") が登録名 ("${id}") と一致しません`);
  }
  return config;
};

/** HEAD-checks whether a static asset exists, without throwing -- used for the fish-image fallback. */
export const checkStaticFileExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(staticFile(path), {method: 'HEAD'});
    return response.ok;
  } catch {
    return false;
  }
};

export const loadResolvedTimeseries = async (
  id: string,
  timeseries: TimeseriesConfig,
): Promise<ResolvedTimeseries> => {
  const path = fishTimeseriesCsvPath(id);
  const response = await fetch(staticFile(path));
  if (!response.ok) {
    throw new Error(`timeseries.csv が見つかりません: ${path} (HTTP ${response.status})`);
  }
  const csvText = await response.text();
  const parsed = validateAndParseTimeseries(parseCsv(csvText), path);

  const rows = parsed
    .filter((row): row is {year: number; catchTons: number} => row.catchTons !== null)
    .sort((a, b) => a.year - b.year);

  if (rows.length < 2) {
    throw new Error(`${path}: 有効な年次データが2件未満です（グラフを描画できません）`);
  }

  const {row: peak, index: peakIndex} = findPeak(rows);
  const latest = rows[rows.length - 1];
  const comparison = computeComparison(rows, peak, timeseries.compareFrom);

  return {
    rows,
    minYear: rows[0].year,
    maxYear: latest.year,
    minValue: Math.min(...rows.map((r) => r.catchTons)),
    maxValue: Math.max(...rows.map((r) => r.catchTons)),
    peak,
    peakIndex,
    latest,
    comparison,
  };
};

export const loadResolvedPrefectureRanking = async (
  id: string,
  ranking: PrefectureRankingConfig,
): Promise<ResolvedPrefectureRanking> => {
  const path = fishPrefectureCsvPath(id);
  const response = await fetch(staticFile(path));
  if (!response.ok) {
    throw new Error(`prefecture.csv が見つかりません: ${path} (HTTP ${response.status})`);
  }
  const csvText = await response.text();
  const parsed = validateAndParsePrefecture(parseCsv(csvText), path);

  const eligible = buildEligibleRows(parsed, ranking.zeroValuesIncluded);
  if (eligible.length === 0) {
    throw new Error(`${path}: ランキング対象にできる都道府県データがありません`);
  }

  const rankCount = selectRankCount(eligible.length, ranking.rankCount);
  const ranked = buildRanking(eligible, rankCount);
  const colorScale = buildColorScale(ranked.map((row) => row.catchTons));

  return {ranked, rankCount, colorScale};
};
