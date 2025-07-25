// =====================================================
// TENANi - ポートフォリオデータ管理
// 実績データを追加・編集する際はこのファイルを更新してください
// =====================================================

const portfolioData = [
    // ===== 実績（LINE構築は古め、Web制作は新しめに配置） =====
    {
        id: 21,
        category: "web",
        title: "京都府京都市 司厨士協会 ウェブサイト",
        image: "./images/portfolio/web/015.png",
        description: "西洋料理で世界を紡ぐ、未来へつなぐ - 協会の活動内容と会員向け情報を整理したレスポンシブサイト"
    },
    {
        id: 20,
        category: "web",
        title: "滋賀県草津市 自治体 サービスサイト",
        image: "./images/portfolio/web/014.png",
        description: "市民サービスの利便性向上を目指したポータルサイト"
    },
    {
        id: 19,
        category: "web",
        title: "滋賀県栗東市 建設会社 ウェブサイト",
        image: "./images/portfolio/web/013.png",
        description: "最新の施工技術と豊富な実績をアピールするサイト"
    },
    {
        id: 18,
        category: "web",
        title: "滋賀県東近江市 清掃会社 ホームページ",
        image: "./images/portfolio/web/012.png",
        description: "プロフェッショナルなサービスと信頼性を表現したサイト"
    },
    {
        id: 17,
        category: "web",
        title: "滋賀県大津市 保険会社 ウェブサイト",
        image: "./images/portfolio/web/011.png",
        description: "信頼性を重視したコーポレートサイトデザイン"
    },
    {
        id: 16,
        category: "web",
        title: "滋賀県大津市 表具店 ホームページ",
        image: "./images/portfolio/web/010.png",
        description: "伝統的な表具の技術と歴史を現代的なデザインで表現"
    },
    {
        id: 15,
        category: "web",
        title: "滋賀県栗東市 工務店 ウェブサイト",
        image: "./images/portfolio/web/009.png",
        description: "施工実績を効果的に見せる構成とデザイン"
    },
    {
        id: 16,
        category: "system",
        title: "滋賀県守山市 印刷会社 AIチャットボット導入",
        image: "./images/portfolio/system/002.png",
        description: "顧客対応の効率化を実現するAIチャットボットシステム"
    },
    {
        id: 15,
        category: "system",
        title: "大阪府大阪市 化粧品販売会社 AIチャットボット導入",
        image: "./images/portfolio/system/001.png",
        description: "商品問い合わせに24時間対応するAIチャットボット"
    },
    {
        id: 14,
        category: "web",
        title: "福井県福井市 建設会社 ホームページ",
        image: "./images/portfolio/web/008.png",
        description: "企業の技術力と実績を分かりやすく伝えるサイト"
    },
    {
        id: 13,
        category: "web",
        title: "大阪府大阪市 化粧品販売会社 ホームページ",
        image: "./images/portfolio/web/007.png",
        description: "商品の魅力を最大限に引き出すビジュアル重視のデザイン"
    },
    {
        id: 12,
        category: "web",
        title: "滋賀県東近江市 建設会社 ホームページ",
        image: "./images/portfolio/web/006.png",
        description: "地域密着型の建設会社としての安心感を伝えるサイト"
    },
    {
        id: 20,
        category: "line",
        title: "滋賀県甲賀市 サッカースクール 公式LINE構築",
        image: "./images/portfolio/line/004.png",
        description: "スクール運営と保護者連絡を円滑化する公式LINEシステム"
    },
    {
        id: 11,
        category: "web",
        title: "滋賀県草津市 地域自治体 ウェブサイト",
        image: "./images/portfolio/web/005.png",
        description: "住民の利便性を考慮したユーザビリティ重視のサイト"
    },
    {
        id: 18,
        category: "line",
        title: "滋賀県守山市 製造会社 求人対応システム構築",
        image: "./images/portfolio/line/002.png",
        description: "効率的な採用活動を支援するLINE求人対応システム"
    },
    {
        id: 10,
        category: "web",
        title: "滋賀県栗東市 飲食店 ホームページ",
        image: "./images/portfolio/web/004.png",
        description: "料理の美味しさが伝わる写真とメニュー構成"
    },
    {
        id: 19,
        category: "line",
        title: "滋賀県栗東市 整骨院 予約システム構築",
        image: "./images/portfolio/line/003.png",
        description: "患者の利便性を向上させる自動予約システムの開発"
    },
    {
        id: 9,
        category: "web",
        title: "滋賀県栗東市 美容室 ホームページ",
        image: "./images/portfolio/web/003.png",
        description: "スタイリッシュで洗練された美容室のブランドイメージを表現"
    },
    {
        id: 17,
        category: "line",
        title: "滋賀県栗東市 美容室 予約システム構築",
        image: "./images/portfolio/line/001.png",
        description: "LINEでスムーズな予約管理ができるシステムの構築"
    },
    {
        id: 8,
        category: "web",
        title: "滋賀県湖南市 飲食店 ホームページ",
        image: "./images/portfolio/web/002.png",
        description: "アットホームな雰囲気と美味しい料理をアピールするデザイン"
    },
    {
        id: 21,
        category: "line",
        title: "滋賀県栗東市 飲食店 公式LINE開設",
        image: "./images/portfolio/line/005.png",
        description: "店舗運営を効率化する公式LINEアカウントの開設と運用設計"
    },
    {
        id: 22,
        category: "line",
        title: "滋賀県草津市 ピラティススタジオ 自動応答システム",
        image: "./images/portfolio/line/006.png",
        description: "スタジオ運営の効率化と顧客対応の自動化を実現するLINEシステム"
    },
    {
        id: 7,
        category: "web",
        title: "京都府城陽市 整骨院 ホームページ",
        image: "./images/portfolio/web/001.png",
        description: "安心感と専門性を伝える清潔感のあるデザイン"
    },

];

// =====================================================
// 新しい実績を追加する方法：
// 1. 上記の配列に新しいオブジェクトを追加
// 2. 必須項目：id, category, title, image, description
// 3. カテゴリーは以下から選択：
//    - "web" : Web制作
//    - "graphic" : グラフィックデザイン
//    - "line" : LINE公式アカウント構築
//    - "system" : AI業務効率化システム
// 4. 画像は指定のフォルダに配置してパスを記載
// =====================================================