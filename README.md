# 都道府県ランキング動画テンプレート

Remotion + React + TypeScript で作る、Instagram Reels / TikTok 向け 9:16 縦型動画の自動生成テンプレートです。

47都道府県を **北海道から沖縄へ地理的な順番** で1つずつ紹介しながら、日本地図上でハイライトし、各都道府県の **全国順位はデータから自動算出** して表示します。CSVを差し替えるだけで、睡眠時間・通勤時間・飲食店数など別テーマの動画を同じ構造で量産できます。

## 動画仕様

- 解像度: 1080×1920（9:16 縦型）
- フレームレート: 30fps
- 尺: `sleep-time` は約39秒。`sushi-shops` はランキング上位ほどゆっくり見せる速度カーブと長めのTOP5画面のため約66秒（`src/config/timing.ts` の定数や各テーマの `pacingByRank` / `finalScreenSeconds` で調整可能）
- 表示順: 北→南の固定順（`src/data/prefectureOrder.ts`）がデフォルト。テーマ側で `displayOrder: 'rankAscending'` を指定すると、ワースト（最下位）→1位のランキング順（カウントダウン形式）に切り替え可能
- 順位: CSVの `value` から自動計算（手入力しない）
- タイトル（テーマの問いかけ文）は動画冒頭だけでなく **常に画面上部に表示**
- レイアウトは **地図が主役**：タイトル直下から画面下部の暫定TOP3ストリップまで、ほぼ全面を地図が占める
- 地図は都道府県が切り替わるたびに、その都道府県へ **パン&ズーム** する（沖縄は本土から離れているため、専用インセット枠が拡大して強調される）
- 地図は「まだ登場していない県（グレー）」「登場済みの県（値に応じた5段階の色分け、少ない=青 〜 多い=赤、少し暗め）」「現在の県（白いアウトライン＋発光＋パルスするリングマーカーで一目瞭然）」の3状態＋色分けの凡例付き
- 県名・値・全国順位は地図下端に重ねた1枚のキャプションにまとめ、視線移動なしで読めるようにした（文字サイズも大きく、表示直後からほぼフル表示）
- 画面右端に北→南の進行状況を示す縦バー（現在地マーカー付き）
- 暫定TOP3は画面最下部の細い帯に縮小し、地図より目立たないよう配慮
- テーマ側の設定で、任意で追加できる演出（すべて省略可・データ駆動、テンプレート側で文言を生成することはない）:
  - `hookText`: 本編開始前に一度だけ表示する短いテロップ
  - `pacingByRank`: 順位帯ごとに表示時間を変える速度カーブ（例: 下位はテンポよく、上位・TOP3ほどゆっくり）。省略時は全県一律 `perPrefecture`（既定0.75秒）
  - `reactions`: 特定の都道府県名 → リアクション文言。地図とも県名/数値のキャプションとも重ならない専用の固定エリア（画面中央よりやや上）に、県の情報が表示されてから少し遅れてバナー表示される
  - `emphasizeFinalItem` / 通常の表示時間延長: `pacingByRank` を指定しない場合のみ有効な簡易版（最後の1件やリアクション対象県の表示時間を一律で数倍にする）
  - `finalListTitle` / `closingLine` / `finalScreenSeconds`: 終盤のランキング一覧の見出し・締めの一言・表示時間

## 2つ目のテンプレート：デュアル指標（実数＋人口あたり）動画

上記は「1つの数値を北→南、またはランキング順に見せる」テンプレートですが、`sushi-shops-by-prefecture` Compositionはこれとは別の第2のテンプレート系統です。**都道府県ごとに独立して算出した2つの順位（例: 実店舗数の順位／人口10万人あたりの順位）を、北→南の地理順で同時に見せる**動画で、ランキング演出（フック・リアクション・速度カーブ）は使いません。

- 表示順は常に地理順（`display_order` 列がCSVにあればそれを使用。無ければ `prefectureOrder.ts` にフォールバック）で、ランキング順とは完全に独立
- 各都道府県で「店舗数」ブロック（水色系）と「人口10万人あたり」ブロック（ピンク系）を色分けして同時表示、順位バッジもそれぞれ別々
- 地図は主役として最大化。値による色分け（choropleth）はせず、「未登場＝ニュートラル」「登場済み＝薄い単色」「現在＝強調」の3状態のみ
- 実際の店舗位置データが無いため、地図上に店舗ピンは一切表示しない（架空の位置を作らない）
- 冒頭のイントロ画面なし。フレーム0から即座に本編（北海道の数値）を表示し、常時表示の小さなヘッダーのみ
- 本編終了後に「店舗数 TOP3」→「人口10万人あたり TOP3」を順番に表示（各ブロックが自身の色でそのまま反映）
- 1県あたりの表示時間は `src/config/timing.ts` の `SECONDS_PER_PREFECTURE`（既定1.0秒）1つで全県一律

新しいデュアル指標テーマを追加する場合は `src/data/dualMetric/registry.ts` にエントリを足すだけで、`Root.tsx` は自動的に同名のCompositionを生成します（`src/data/dualMetric/loadDualMetricTheme.ts` がCSVを読み込み、両方の指標の順位を独立に計算し、CSVに `store_rank`/`per_100k_rank` のような参照用の順位列があっても検証目的のみで使い、表示用の順位は必ずプログラム側で再計算した値を使用します）。

## プロジェクト構造

```
public/
  data/
    sleep-time.csv                 # サンプルテーマのデータ（架空の数値、prefecture,value）
    sushi-shops.csv                # 実データテーマ（人口10万人あたり寿司店数、e-Stat 2021年6月調査）
    sushi-shops-by-prefecture.csv  # デュアル指標テーマ用（display_order,prefecture,store_count,store_rank,stores_per_100k,per_100k_rank）

scripts/
  build-map-paths.py        # 地図GeoJSON -> SVGパス変換スクリプト（再生成用）
  japan.simplified.geojson  # 変換元の簡略化済み地図データ

src/
  index.ts                  # Remotionのエントリーポイント
  Root.tsx                  # テーマごとに1つCompositionを自動生成（尺の計算・データ読み込み込み）

  config/
    timing.ts               # 解像度・fps・各パートの長さ（秒）
    theme.ts                 # 色・フォントなどのデザイントークン

  data/
    types.ts                # ThemeMeta / ResolvedTheme と DualMetricThemeMeta / ResolvedDualMetricTheme の型定義
    prefectureOrder.ts       # 北→南の固定表示順（47件）
    loadTheme.ts             # CSVを読み込んで順位・配色スケールを計算するローダー（単一指標テーマ用）
    themes/
      registry.ts            # 単一指標テーマ一覧（タイトル・単位・フォーマット等）
    dualMetric/
      registry.ts             # デュアル指標テーマ一覧
      loadDualMetricTheme.ts  # CSVを読み込んで2指標分の順位を独立に計算・検証するローダー
    geo/
      japanPaths.ts          # 都道府県ごとのSVGパス＋バウンディングボックス（自動生成、手編集禁止）

  utils/
    csv.ts                   # prefecture,value 形式のCSVパーサー
    ranking.ts                # 全国順位 / 暫定TOP3の計算ロジック
    formatters.ts             # 数値の表示形式（分→時間分、小数、% など）
    colorScale.ts             # 値に応じた5段階の色分け（少ない=青 〜 多い=赤）
    mapCamera.ts              # 都道府県の位置へ地図カメラをパン&ズームさせる計算
    timeline.ts               # 1件あたりの尺の計算（pacingByRank による順位帯別ペース配分、または簡易延長ロジック）

  components/
    # --- 単一指標テンプレート ---
    PrefectureRankingVideo.tsx # 全体の時間割（フック→本編→TOP5、常時ヘッダー表示）
    HookIntro.tsx                # 本編開始前の短いテロップ（theme.hookText、省略可）
    RankingScene.tsx              # 本編：フレーム→現在の都道府県を算出する中枢、地図中心のレイアウト
    ReactionBanner.tsx             # 特定県だけのリアクションバナー。画面中央よりやや上の固定位置、県情報より少し遅れて表示（theme.reactions、省略可）
    CurrentPrefecturePanel.tsx      # 県名・数値・全国順位（地図下端に重ねるキャプション）
    TopThreeBoard.tsx                # 暫定TOP3（画面最下部の細い帯、順位入れ替えアニメーション付き）
    FinalTopFive.tsx                  # 終盤のランキング一覧＋締めの一言
    MapLegend.tsx                      # 地図の色分け凡例（choropleth、地図左上のオーバーレイ）

    # --- デュアル指標テンプレート ---
    DualMetricRankingVideo.tsx  # 全体の時間割（本編→TOP3×2）。イントロなし、フレーム0から本編開始
    DualMetricRankingScene.tsx   # 本編：地図＋2指標パネル。choropleth無し、暫定TOP3なし
    DualMetricInfoPanel.tsx       # 県名＋「店舗数」「人口10万人あたり」の2ブロック（色で区別、順位も別々）
    DualMetricTopThreeScreen.tsx   # 終盤の「指標名 TOP3」画面（店舗数用／人口あたり用を2回使う）

    # --- 共通パーツ ---
    PersistentHeader.tsx     # 常に画面上部に表示されるタイトル（オプションでサブタイトル・小型表示・瞬間表示に対応）
    JapanMap.tsx               # 都道府県ごとに色分け・カメラがパン&ズームする日本地図（両テンプレート共用）
    ProgressRail.tsx             # 地図右端の進行状況バー（北→南、またはランキング順なら順位）
    RankedListPanel.tsx            # ランキング一覧の見た目（見出し＋順位付きリスト）。FinalTopFiveとDualMetricTopThreeScreenが共用
    RankPill.tsx                     # 順位の丸バッジ（共通パーツ）
```

## 動かし方

```bash
npm install
npm start          # Remotion Studio が起動（ブラウザでプレビュー・スクラブ再生）
```

Studio左のCompositions一覧に、テーマごとに `sleep-time` / `sushi-shops` / `sushi-shops-by-prefecture` のようにテーマIDそのものの名前で並びます（単一指標テーマは `src/data/themes/registry.ts`、デュアル指標テーマは `src/data/dualMetric/registry.ts` にエントリを足すだけで一覧に増えます）。

書き出す場合はComposition名を指定してレンダリングします:

```bash
npx remotion render sleep-time out/sleep-time.mp4
npx remotion render sushi-shops out/sushi-shops.mp4
npx remotion render sushi-shops-by-prefecture out/sushi-shops-by-prefecture.mp4
```

`npm run build`（sleep-time）/ `npm run build:sushi-shops` でも同じことができます。

### このサンドボックス環境について

このサンドボックスは Remotion 標準の Headless Chrome ダウンロード先 (`remotion.media`) への通信がブロックされているため、代わりに Playwright 同梱の Chromium を使うように `remotion.config.ts` で `REMOTION_BROWSER_EXECUTABLE` 環境変数を見るようにしてあります。通常の開発マシンでは何も設定せずに `npm start` / `npm run build` がそのまま動きます。

## データの差し替え方（別テーマを作る）

新しいテーマ（例: 通勤時間、飲食店数など）を追加する手順:

1. `public/data/<テーマ名>.csv` を作成し、`prefecture,value` の2列で47行分のデータを入れる

   ```csv
   prefecture,value
   北海道,455
   青森県,478
   ...
   ```

   - `prefecture` は `src/data/prefectureOrder.ts` の表記（例: `鹿児島県`, `北海道`）と完全一致させること
   - `value` は数値。順位はここから自動計算されるので手入力しない

2. `src/data/themes/registry.ts` にエントリを追加

   ```ts
   'commute-time': {
     id: 'commute-time',
     title: '通勤時間が一番長い県は？',
     subtitle: 'あなたの県は何位？',
     unit: '分',
     valueFormatterId: 'hoursMinutes',   // 455 -> "7時間35分" のような変換
     rankDirection: 'higherIsBetter',    // 値が大きいほど1位なら higherIsBetter
     sourceText: '出典: ○○調査（20XX年）',
     csvPath: 'data/commute-time.csv',
   },
   ```

これだけで `sleep-time` / `sushi-shops` と同様に `commute-time` という名前のComposition（`npx remotion render commute-time ...`）としてStudioにも一覧にも現れます。`Root.tsx` を編集する必要はありません。数値のフォーマットが既存の4種（`hoursMinutes` / `decimal1` / `integer` / `percent1`）で足りない場合のみ、`src/utils/formatters.ts` に関数を1つ追加し、`ValueFormatterId`（`src/data/types.ts`）にIDを足してください。

地図の色分け（少ない=青 〜 多い=赤の5段階）は `src/utils/colorScale.ts` がCSVの実データから分位点（20/40/60/80パーセンタイル）を自動計算するので、テーマごとに設定する必要はありません。

CSVには `prefecture,value` の2列以降に検証用の列（例: `sushi-shops.csv` の `store_count`, `population_estimate`）を自由に追加できます。パーサー（`src/utils/csv.ts`）は先頭2列しか読まないので、3列目以降は動画には出ず、データの裏取り用に保持できます。

### ランキング形式（ワースト→1位）・速度カーブ・フック・リアクション演出

`sushi-shops` テーマ（`src/data/themes/registry.ts`）が実例です:

```ts
'sushi-shops': {
  ...
  displayOrder: 'rankAscending',   // 47位→1位のカウントダウン表示に切り替え
  hookText: '寿司屋が多い県、海沿いが強いと思ってない？',
  reactions: {
    福井県: '北陸勢、強い…！',
    石川県: '石川も20店超え！',
    山梨県: '1位、まさかの海なし県！',   // 該当県の情報が表示された少し後にバナーで表示
  },
  // 下位はテンポよく、上位に近づくほど少しずつ、TOP3はさらにゆっくり
  pacingByRank: [
    {fromRank: 47, toRank: 21, fromSeconds: 1.0, toSeconds: 1.2},
    {fromRank: 20, toRank: 11, fromSeconds: 1.2, toSeconds: 1.4},
    {fromRank: 10, toRank: 4, fromSeconds: 1.4, toSeconds: 1.6},
    {fromRank: 3, toRank: 1, fromSeconds: 2.0, toSeconds: 2.5},
  ],
  finalListTitle: '人口10万人あたりの寿司店数 TOP5',
  closingLine: 'あなたの県は何位だった？',
  finalScreenSeconds: 5,   // 通常の3秒より長めに確保
},
```

いずれも省略可能で、指定しなければ `sleep-time` と同じ挙動（北→南固定順、全県一律0.75秒、フックなし、リアクションなし、"全国TOP5"を3秒）のままです。`reactions` の文言・対象県、`pacingByRank` の秒数は必ずテーマ側（人間）が指定するものとして扱ってください -- テンプレート自身が「〜だから多い」のような理由付けや、演出のための数値を生成することはありません。

## 日本地図データについて

`src/data/geo/japanPaths.ts` は手編集しないでください。元データは [dataofjapan/land](https://github.com/dataofjapan/land) の GeoJSON を [mapshaper](https://github.com/mbloch/mapshaper) で簡略化し、`scripts/build-map-paths.py` で SVG パスへ投影・変換したものです。各都道府県のバウンディングボックスもここで一緒に計算され、`JapanMap.tsx` のパン&ズームカメラ（`src/utils/mapCamera.ts`）がそれを使って各都道府県にフレーミングします。沖縄は本土から地理的に離れているため、本土とは別の小さな枠（インセット）に個別投影し、表示中はそのインセット自体が拡大されます。地図を再生成する場合:

```bash
cd scripts
python3 build-map-paths.py
```

## 次に改善すべき点

- **デザインの作り込み**: 現状は視認性優先の仮デザイン。フォント・余白・配色の最終調整、ロゴ/クレジット表示など
- **地図の見せ方**: 「まだ登場していない県」の濃淡や、地方ブロック単位のラベル表示など、地図単体でも状況が伝わる工夫
- **暫定TOP3が3県に満たない序盤の挙動**: 現状は1〜2件でもそのまま表示されるが、専用の見せ方（スロットを埋める演出など）を検討してもよい
- **BGM・効果音**: `@remotion/media` などで都道府県切り替え時の軽いSE、TOP3更新時のSEを追加
- **複数テーマの一括レンダリング**: 現状はComposition名ごとに1コマンドずつ実行が必要。`THEME_REGISTRY` を読んで全テーマを順にレンダリングするスクリプト化
- **sleep-time のデータ差し替え**: `sleep-time.csv` は仮の架空データのまま（`sourceText` で明記済み）。`sushi-shops.csv`（e-Stat 2021年6月調査）と同じ要領で実データに差し替え可能
- **アクセシビリティ的な補助**: 色覚多様性を考慮した配色チェック（現在の黄色/青/グレーの組み合わせは概ね安全だが再確認推奨）
