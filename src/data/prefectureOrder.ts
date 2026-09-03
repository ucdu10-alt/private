/**
 * Fixed north -> south display order for all 47 prefectures.
 *
 * This is intentionally NOT the ranking order (see utils/ranking.ts for
 * that) -- it is a geographic tour of Japan, chosen so that consecutive
 * prefectures are (almost always) actual neighbors, so the highlighted
 * region on the map sweeps smoothly instead of jumping around.
 *
 * A few transitions cross water (Hokkaido <-> Aomori via the Seikan
 * Tunnel/strait, Yamaguchi <-> Fukuoka via the Kanmon Strait, Kagoshima ->
 * Okinawa across the Ryukyu chain) -- these are unavoidable and match how
 * people actually think of traveling the length of Japan.
 */
export const PREFECTURE_ORDER_NORTH_TO_SOUTH: string[] = [
  // Hokkaido
  '北海道',
  // Tohoku
  '青森県',
  '岩手県',
  '秋田県',
  '宮城県',
  '山形県',
  '福島県',
  // Kanto
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  // Chubu
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
  // Kinki / Kansai
  '滋賀県',
  '京都府',
  '奈良県',
  '和歌山県',
  '大阪府',
  '兵庫県',
  // Shikoku (entered via the Akashi-Kaikyo/Naruto bridges from Hyogo)
  '徳島県',
  '高知県',
  '愛媛県',
  '香川県',
  // Chugoku (re-entered via the Seto-Ohashi bridge from Kagawa)
  '岡山県',
  '鳥取県',
  '島根県',
  '広島県',
  '山口県',
  // Kyushu
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  // Okinawa
  '沖縄県',
];
