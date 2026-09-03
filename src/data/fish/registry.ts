/**
 * Every fish species this project knows about. To add a new one:
 *
 *   1. Add `public/fish/<id>.png` (transparent, side profile, head left)
 *   2. Add `public/data/fish/<id>/config.json`
 *   3. Add `public/data/fish/<id>/timeseries.csv` and/or `prefecture.csv`
 *   4. Add the id to this list
 *
 * Root.tsx turns this list into `Fish-Timeseries-<id>` and
 * `Fish-PrefectureRanking-<id>` Compositions automatically -- no component
 * needs to change, and no existing id here should ever be removed/edited
 * when adding a new species (that would overwrite an existing fish's
 * Composition slot).
 */
export const FISH_IDS: string[] = ['sanma'];
