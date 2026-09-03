# 日本の魚をデータで見る — 魚種別・漁獲量データ動画テンプレート

Remotion + React + TypeScript で作る、Instagram Reels / TikTok / YouTube Shorts 向け 9:16 縦型動画の量産テンプレートです。

魚種ごとに **画像・CSV・config.json を追加するだけ** で、同じ世界観・同じ構成の動画を何十種類でも作れるように設計しています。既存のReactコンポーネントは一切編集不要です。

## 実装済みの2モード

1. **timeseries**（`Fish-Timeseries-<魚種id>`）: 1魚種の全国漁獲量が、取得できる最古年〜最新年までどう変化したかを、伸びていく折れ線グラフで見せる
2. **prefecture-ranking**（`Fish-PrefectureRanking-<魚種id>`）: 1魚種の都道府県別漁獲量を、下位→1位のカウントダウン形式で見せる（TOP10 / TOP5 / 全件はデータ量から自動判定）

同じ魚種の同じデータセットから、この2本の動画が独立して作れます。

## 動画仕様

- 解像度: 1080×1920（9:16）/ 30fps
- 冒頭1.5〜2秒はグラフ・地図より魚画像とタイトルが主役（SNSサムネイルとして単体で成立する構図）
- シリーズ全体で色・フォント・余白・魚画像の置き方を統一（`src/config/theme.ts`）
- 魚固有の文言・数値はコンポーネントに一切ハードコードせず、すべて `config.json` / CSV から読む

## プロジェクト構造

```
public/
  fish/
    sanma.svg                     # 魚画像（プレースホルダー、後述）
  data/
    fish/
      sanma/
        config.json                # タイトル・尺・比較設定・出典など
        timeseries.csv              # year,catch_tons
        prefecture.csv               # prefecture,catch_tons

src/
  index.ts / Root.tsx              # FISH_IDS を読み、魚種×モードごとにCompositionを動的生成

  config/
    timing.ts                       # 解像度・fps・各パートのデフォルト秒数
    theme.ts                        # 色・フォント・安全マージンなどのデザイントークン

  data/
    types.ts                        # FishConfig / ResolvedTimeseries / ResolvedPrefectureRanking 等の型
    prefectures.ts                  # 47都道府県の正式名称（バリデーション用）
    geo/japanPaths.ts               # 都道府県ごとのSVGパス（地図、自動生成・手編集禁止）
    fish/
      registry.ts                    # FISH_IDS = ['sanma'] -- 魚種を追加する唯一の"コード"変更点
      loadFish.ts                     # config.json / CSV の読み込み・検証・集計（ピーク検出、比較、ランキング等）

  utils/
    csv.ts                          # ヘッダー付きCSVの汎用パーサー
    validation.ts                   # timeseries.csv / prefecture.csv の行単位バリデーション（エラーに行番号付き）
    formatters.ts                   # 数値表示（3桁区切り、年、増減率など）
    peak.ts / compare.ts            # ピーク自動検出 / compareFrom(first・peak・年指定)の比較計算
    rankingAuto.ts                  # TOP10/TOP5/全件の自動判定・ランキング計算
    timelineFrames.ts               # 順位カウントダウンの尺配分（frame⇄順位の相互変換）
    colorScale.ts / mapCamera.ts    # 地図の色分け・パン&ズームカメラ計算（既存の地図エンジンを流用）

  components/
    JapanMap.tsx / MapLegend.tsx     # 都道府県ハイライト地図（既存の地図テンプレートを流用）
    common/
      SeriesBackdrop.tsx              # シリーズ共通の背景
      FishImage.tsx                    # 魚画像 or 名前だけのフォールバック
      IntroTitleScene.tsx               # 冒頭1.5〜2秒（魚画像+魚種名+タイトル）
      PersistentHeader.tsx               # 本編中ずっと出る小さいヘッダー
      BigStat.tsx / SourceCredit.tsx      # 大きい数字表示 / 出典クレジット
      DisabledModeNotice.tsx               # config でモードが無効な場合の表示
    timeseries/
      FishTimeseriesVideo.tsx          # モード1の時間割
      LineChartScene.tsx                # 年ごとに伸びる折れ線グラフ本体
      PeakBadge.tsx / AnnotationCallout.tsx  # ピーク吹き出し / config.annotations の吹き出し
      ComparisonEnding.tsx              # 最新年ホールド→比較（○年→○年 約◯%減）
    prefectureRanking/
      FishPrefectureRankingVideo.tsx   # モード2の時間割
      RankRevealScene.tsx               # 各順位: 順位バッジ・県名・値・地図
      FinalTopThreeScene.tsx            # 締めのTOP3まとめ
      RankPill.tsx                      # 順位の丸バッジ
```

## 起動方法

```bash
npm install
npm start          # Remotion Studio 起動（ブラウザでプレビュー・スクラブ再生）
```

Studio左のCompositions一覧に `Fish-Timeseries-sanma` / `Fish-PrefectureRanking-sanma` が並びます。

### このサンドボックス環境について

Remotion標準のChrome Headless Shellダウンロード先への通信がブロックされているため、Playwright同梱のChromiumを使うよう `remotion.config.ts` で `REMOTION_BROWSER_EXECUTABLE` を見るようにしてあります。レンダリング（`remotion render` / `remotion still`）には new Headless モード対応のビルドが必要なため、`chromium_headless_shell` を指定してください:

```bash
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-<version>/chrome-linux/headless_shell
```

通常の開発マシンでは何も設定せずに `npm start` / render がそのまま動きます。

## サンマのサンプルデータについて

`public/data/fish/sanma/` の中身は **すべて仮のサンプルデータ**です（`config.json` の `source.name` にも明記）。timeseries.csv は1980〜2024年の45年分、prefecture.csv は12県分（うち0値1件・欠損1件を含む、バリデーション/自動判定の動作確認用）。実データに差し替える際は下記の「データの差し替え方」を参照してください。

魚画像 `public/fish/sanma.svg` も**レイアウト確認用のプレースホルダー**です（写実的なAI生成画像ではありません）。実運用では `public/fish/<魚種id>.png` に、写実的・背景透過・真横・頭は左向きの画像を配置してください。画像が存在しない場合でもエラーにならず、魚名だけのフォールバック表示になります（`checkStaticFileExists` で存在確認した上で分岐しているので、`<img>` の onError には依存していません）。

## データ・configの差し替え方（既存魚種のデータ更新）

`public/data/fish/sanma/` の3ファイルを実データで上書きするだけです。コンポーネントは触りません。

- `timeseries.csv`: `year,catch_tons` の2列。取得できる最古年〜最新年まで全年入れてください（間引き不要、グラフ側で自動的に間引いて軸ラベル表示します）。値が欠損している年は `catch_tons` を空欄にすればOK（欠損値として扱われ、グラフはその年をスキップします）
- `prefecture.csv`: `prefecture,catch_tons` の2列。都道府県名は `src/data/prefectures.ts` の表記と完全一致させてください。0件/未収録の県は行ごと省略するか `catch_tons` を `0` または空欄にできます
- `config.json`: タイトル文言・尺・`compareFrom`・`annotations`・`rankCount`・`zeroValuesIncluded`・出典など

## 新しい魚種の追加方法

例: 「サバ」を追加する場合

1. `public/fish/saba.png` を追加（写実的・背景透過・真横・頭は左向き。無くても動きます）
2. `public/data/fish/saba/config.json` を作成（`sanma/config.json` をコピーして書き換え）
3. `public/data/fish/saba/timeseries.csv` と `prefecture.csv` を追加
4. `src/data/fish/registry.ts` の `FISH_IDS` に `'saba'` を追加

これだけで Studio に `Fish-Timeseries-saba` / `Fish-PrefectureRanking-saba` が自動的に現れます。**既存の魚種（サンマ）のファイルは上書きしないでください** -- 新しいディレクトリを追加するだけです。

`config.json` のどちらかのモードだけ有効化することもできます（`timeseries.enabled` / `prefectureRanking.enabled` を `false` に）。無効化したモードのCompositionは残りますが、レンダリングすると「モードが無効化されています」という短い静止画になります。

## データの検証

`timeseries.csv` / `prefecture.csv` は Composition読み込み時（`calculateMetadata`）に自動検証されます（`src/utils/validation.ts`）。問題がある場合は該当行を含む `DataValidationError` が投げられ、Studioやレンダリングログにどの行の何が悪いかがそのまま表示されます。チェック内容:

- **timeseries.csv**: year が数値か / 重複していないか、catch_tons が数値か（空欄は欠損値として許容）。読み込み後は年昇順にソートされます
- **prefecture.csv**: 都道府県名が47都道府県の正式名称と一致するか / 重複していないか、catch_tons が数値か（空欄は欠損値として許容、0はランキング対象外がデフォルトだが `zeroValuesIncluded: true` で含められる）

## ランキング件数の自動判定

`prefectureRanking.rankCount: "auto"` のとき、有効な（欠損でない、かつ0値を除外設定なら0でない）都道府県数から自動判定します（`src/utils/rankingAuto.ts`）:

- 10件以上 → TOP10
- 5〜9件 → TOP5
- 1〜4件 → 全件表示

数値を直接指定する（例 `"rankCount": 7`）ことも可能です。

## 動画のレンダリング方法

```bash
npx remotion render Fish-Timeseries-sanma out/sanma-timeseries.mp4
npx remotion render Fish-PrefectureRanking-sanma out/sanma-ranking.mp4
```

`npm run build:timeseries` / `npm run build:ranking` でも同じことができます（サンマ固定）。他の魚種は Composition名を `Fish-Timeseries-<id>` に読み替えてください。

## 出典表示

各動画の下部に小さく `出典：{source.name}（{source.year}）` を常時表示します。`source.url` は動画には出さず、データ側の保持のみです。

## 日本地図データについて

`src/data/geo/japanPaths.ts` は手編集しないでください。[dataofjapan/land](https://github.com/dataofjapan/land) のGeoJSONを[mapshaper](https://github.com/mbloch/mapshaper)で簡略化し、`scripts/build-map-paths.py` でSVGパスへ変換したものです（都道府県ランキングテンプレートから流用）。再生成する場合:

```bash
cd scripts
python3 build-map-paths.py
```

## 次に改善すべきポイント

- **実際のAI生成魚画像への差し替え**: `public/fish/sanma.svg` は簡易プレースホルダー。写実的な透過PNGに差し替える
- **prefecture-ranking の地図カメラ**: 現状は都道府県スイープ用に作られたパン&ズームをそのまま流用しており、ランキングは地理的に隣接しない県へジャンプするため、ズームがやや控えめ（`cameraRectForBBox` の `minSizeFraction`）。順位ごとにもっと寄ったカメラにする、沖縄インセットと北海道表示が同時に画面右上で近接するケースの見た目を調整する、など
- **BGM・SE**: 現状は完全無音。`@remotion/media` 等で順位切り替え時のSE、ピーク到達時のSEを追加しやすい構造にはなっている（Sequence単位で差し込むだけ）
- **複数魚種・複数モードの一括レンダリング**: 現状はComposition名ごとに1コマンドずつ実行が必要。`FISH_IDS` を読んで全魚種×全モードを順にレンダリングするスクリプト化
- **デザインの作り込み**: 現状は視認性優先の仮デザイン（Phase 1）。フォント・余白・配色の最終調整、ロゴ表示など
- **timeseries.csv の欠損値の扱い**: 現状は欠損年をチャートの点として単純にスキップ（線がその年をまたいで隣の実データ点へ直接つながる）。「欠損期間は線を薄く/破線にする」等、より丁寧な表現も検討可
- **アクセシビリティ**: 色覚多様性を考慮した配色チェック（現状の5段階配色は既存テンプレートからの流用、再確認推奨）
