# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 溝通語言

與使用者溝通時一律使用繁體中文，並使用台灣用語（例如：資料、程式、元件、設定、檔案、介面、快取、使用者、匯入／匯出），不可使用中國用語（數據、組件、設置、文件、接口、緩存、用戶、導入／導出等）。UI 文案同樣以台灣用語撰寫。

## 常用指令

```bash
npm run dev        # 開發伺服器（開發環境啟用 SSR，Service Worker 也會啟用）
npm run build      # 正式建置：SPA + 預先算繪，輸出至 build/client
npm run typecheck  # react-router typegen && tsc（修改路由後務必執行）
npm run serve      # vite preview
```

專案目前**沒有測試框架與 linter**，驗證變更的方式為 `npm run typecheck` 與 `npm run build`。

## 專案概要

Stockpile 是離線優先（local-first）的家庭防災物資管理 PWA：依家庭成員需求，計算食物（熱量）、飲水、嬰幼兒／寵物主食、必要用藥的「可支撐天數」與缺口。**沒有後端、沒有 API**，所有資料只存在瀏覽器 `localStorage`，這是產品的核心定位（隱私、斷網可用），新增功能不應引入任何資料上傳。

技術：React 19、React Router v7（framework 模式）、TypeScript strict、Vite、Tailwind CSS v4、shadcn/ui（`components.json`，style `radix-mira`）、Recharts、sonner、react-joyride、vite-plugin-pwa。路徑別名 `@/*` → `app/*`。

## 架構重點

### 路由與頁面分層
- `app/routes.ts` 定義三條路由：`/`、`/stock-list`、`/setting`。
- `app/routes/*.tsx` 只負責 `meta`（SEO / OG 標籤），實際畫面在 `app/Home`、`app/StockList`、`app/Setting`。
- 新增路由時，也要同步更新 `react-router.config.ts` 的 `prerender()` 清單與 `public/sitemap.xml`。

### 全域狀態（React Context，位於 `app/store/`）
`root.tsx` 的 Provider 巢狀順序有相依性，不可任意調換：
`ModalProvider` → `StockListProvider` → `SettingProvider`（`SettingProvider` 會讀取 `StockListContext.isDemo`）。

- `stockList.tsx`：物資 CRUD、搜尋（結果是 id 陣列 `showStockList`，由畫面再對應回物資）、示範模式 `isDemo`、上次盤點時間、新手導覽狀態、清單頁籤 `activeTab`。
- `setting.tsx`：`targetDays`（預設 30）／`rotationDays`（預設 90）、家庭成員、標籤（Tag），以及舊資料遷移 `migrateTagsWithUnits`。
- `modal.tsx`：全域只有一個對話框，以 `openModal(type)` 切換；類型定義在 `app/interfaces/modal.tsx`，對應元件在 `app/components/modal/index.tsx` 中分派。新增對話框需同時改這兩處。

### localStorage 保存模式
每個 Provider 都是同一套寫法：掛載時讀取 → 設 `isInitialized` → 之後由 `useEffect` 在狀態變動時自動寫回。**示範模式（`isDemo`）時不寫入**，避免覆蓋使用者真實資料。修改這些 effect 時要保留 `isInitialized && !isDemo` 的判斷。

使用中的 key：`stockList`、`stockpile_setting`、`stockpile_household`、`stockpile_stockTags`（舊名 `stockpile_feedTags`，啟動時會自動遷移）、`lastInventoryConfirmedAt`、`has-seen-tour`。變更資料結構時須在 Provider 初始化階段加入向下相容的遷移邏輯（參考 `migrateTagsWithUnits`），因為使用者裝置上已有舊資料，也可能匯入舊版備份 JSON（`app/Setting/index.tsx` 的匯入／匯出）。

### 計算核心：`app/hooks/useDashboardStats.ts`
儀表板所有指標都集中在這支 hook，從兩個 Context 衍生計算：
- 食物天數 = Σ(`count` × `totalCalories`) ÷ 家庭每日 `dailyKcalNeed` 總和。
- 飲水 = `water` 類物資的 `count` × `volume`，需求包含成員 `dailyMlWater` 加上 `feedPortions` 的沖泡用水（依 `frequencyType` 換算成每日量）。
- 到期分類：已過期／即將到期（≤ `targetDays`）／需輪替（介於 `targetDays` 與 `rotationDays` 之間）。
- 資料缺漏：依 `app/interfaces/stock.ts` 的 `REQUIRED_FIELDS`（依物資類別）檢查。
- 特殊需求（嬰幼兒、寵物、藥品）：透過**標籤**把成員需求（`feedPortions[].feedTagId`、`medicineNeeds[].medicineTagId`）和物資（`Stock.feedTagId` / `medicineTagId`）對應起來，逐一計算每個標籤可支撐的天數，並以最少的那一項作為瓶頸。

### 領域模型要點
- 物資類別在 `app/constant/stock.tsx` 的 `stockType`：`tagAllowedType`（嬰幼兒主食、寵物主食、藥品）可綁定標籤並列入生存計算；`notRequiredType` 不列入計算。
- 藥品（`medicine`）在新增或更新時，`count` 會被強制設為 1、`unit` 設為 `piece`，實際數量記在 `volume`，單位記在 `volumeUnit`，而且單位由標籤決定並鎖定。修改標籤單位時，要同步更新使用該標籤的成員需求與庫存。
- 成員身分（`adult` / `child` / `infant` / `pet`）各有不同必填欄位，定義在 `app/interfaces/family.tsx` 的 `REQUIRED_FIELDS`。
- 清單排序與狀態判斷在 `app/utils/stock.ts`：已過期 > 即將到期（`WARNING_DAYS`）> 庫存偏低（`WARNING_COUNT`）。
- 示範資料在 `app/constant/sampleData.tsx`，資料結構變更時也要一併更新。

## 建置與部署

- `react-router.config.ts`：正式環境 `ssr: false` 並預先算繪三個頁面；`basename` 與 `vite.config.ts` 的 `base` 都是 `/stockpile/`（GitHub Pages 子路徑）。靜態資源路徑請使用 `import.meta.env.BASE_URL`，不可寫死成 `/`。
- 程式碼必須能在預先算繪（Node 環境）下執行：`localStorage`、`window` 只能在 `useEffect` 或事件處理中存取。
- PWA 的 manifest 與 Workbox 快取設定在 `vite.config.ts`。
- 部署：推送 `v*` 標籤會觸發 `.github/workflows/deploy.yml`，建置後把 `build/client/stockpile/*` 攤平到根目錄，並複製一份 `404.html` 作為 SPA fallback，再部署到 GitHub Pages。版本號透過 `npm version` 更新（commit 訊息即版本號）。

## 其他文件

- `prompt.md`：功能需求與工作排序（P0／P1／P2）及完成狀態，實作新功能前請先查看。
- `wireframe.md`：各頁面的線框圖。
