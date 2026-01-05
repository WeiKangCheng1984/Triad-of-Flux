# 天地人變數卡牌

一個基於 Next.js 14 的心靈卡牌占卜遊戲，提供單卡抽籤和四卡占卜兩種模式。

## 功能特色

- **單卡抽籤**：快速指引，從四類中隨機抽取一張卡牌
- **四卡占卜**：完整運勢，依序抽取天、地、人、變數四張卡牌
- **運勢計算**：基於多維度權重系統的智能計算
- **文本生成**：根據卡牌組合自動生成運勢解讀
- **響應式設計**：完美支援手機和桌面端
- **動畫效果**：使用 Framer Motion 實現流暢的翻牌動畫

## 技術棧

- **框架**：Next.js 14 (App Router)
- **語言**：TypeScript 5
- **樣式**：Tailwind CSS 3
- **動畫**：Framer Motion
- **圖標**：Lucide React
- **部署**：Vercel

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置生產版本

```bash
npm run build
npm start
```

## 專案結構

```
app/
├── page.tsx              # 首頁（模式選擇）
├── single/
│   └── page.tsx         # 單卡抽籤頁面
└── fortune/
    └── page.tsx         # 四卡占卜頁面
components/
├── Card.tsx             # 卡牌組件
├── CardBack.tsx         # 卡牌背面
├── CardFront.tsx        # 卡牌正面
└── ModeSelector.tsx    # 模式選擇組件
lib/
├── cards.ts             # 卡牌數據庫（72張）
├── fortune.ts           # 運勢計算邏輯
└── singleCard.ts        # 單卡解讀邏輯
types/
└── card.ts              # TypeScript 類型定義
```

## 卡牌系統

### 卡牌類別

- **天（節氣）**：24 張 - 能量狀態與心理節奏
- **地（空間）**：12 張 - 環境現實與空間定位
- **人（角色）**：18 張 - 社交角色與身份認同
- **變數（意外）**：18 張 - 意外事件與失控反應

### 權重系統

每張卡牌包含以下權重維度：
- **能量值（Energy）**：1-10
- **影響力（Impact）**：1-10
- **方向性（Direction）**：-1（負面）、0（中性）、1（正面）
- **時間性（Temporal）**：1（短期）、2（中期）、3（長期）
- **強度等級（Intensity）**：low、medium、high、extreme

## 設計風格

- **色系**：古典雅緻 + 水墨風格（方案三）
- **視覺**：日式禪意 + 極簡主義（方案二）
- **卡牌尺寸**：3:5 比例，響應式設計

## 部署

專案已配置好 Vercel 部署，可直接推送到 GitHub 並連接 Vercel 自動部署。

## 授權

MIT License

