import type {ValueFormatterId} from '../data/types';

const hoursMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes - hours * 60);
  if (hours <= 0) return `${minutes}分`;
  if (minutes === 0) return `${hours}時間`;
  return `${hours}時間${minutes}分`;
};

/**
 * Registry of value formatters, looked up by id. Themes reference a
 * formatter by `valueFormatterId` instead of embedding a function directly,
 * because theme configs travel through Remotion's composition props
 * (calculateMetadata / renderMedia), which requires plain, serializable
 * data -- functions can't survive that trip.
 *
 * Add a new formatter here (and to `ValueFormatterId` in data/types.ts) to
 * support a new kind of number, e.g. "455分" -> "7時間35分".
 */
export const VALUE_FORMATTERS: Record<ValueFormatterId, (value: number, unit: string) => string> = {
  hoursMinutes: (value) => hoursMinutes(value),
  decimal1: (value, unit) => `${value.toFixed(1)}${unit}`,
  integer: (value, unit) => `${Math.round(value)}${unit}`,
  percent1: (value) => `${value.toFixed(1)}%`,
};

export const formatValue = (
  formatterId: ValueFormatterId,
  value: number,
  unit: string,
): string => VALUE_FORMATTERS[formatterId](value, unit);
