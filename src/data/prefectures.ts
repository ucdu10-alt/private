/**
 * Canonical 47 prefecture names, north -> south. This is the single source
 * of truth used to (a) validate prefecture.csv rows against typos/unknown
 * names and (b) know a prefecture's geographic position for the map.
 */
export const PREFECTURES_NORTH_TO_SOUTH: string[] = [
  '北海道',
  '青森県',
  '岩手県',
  '秋田県',
  '宮城県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '山梨県',
  '静岡県',
  '長野県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '岐阜県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '奈良県',
  '和歌山県',
  '大阪府',
  '兵庫県',
  '徳島県',
  '高知県',
  '愛媛県',
  '香川県',
  '岡山県',
  '鳥取県',
  '島根県',
  '広島県',
  '山口県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export const VALID_PREFECTURE_NAMES = new Set(PREFECTURES_NORTH_TO_SOUTH);

export const isValidPrefectureName = (name: string): boolean => VALID_PREFECTURE_NAMES.has(name);
