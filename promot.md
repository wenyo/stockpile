以下是整合你這輪回答後的完整版本，可直接餵給 AI 使用。

---

## Prompt：Feed Tag（自訂餵食標籤）功能開發 — 最終版

### 背景

這是一個緊急物資庫存管理 App（React + React Router v7 + TypeScript + Tailwind + shadcn/ui），核心功能是計算「目前庫存能撐幾天」。家庭成員分五種身份：`adult`（成人）、`child`（兒童）、`elderly`（長者）、`infant`（嬰兒）、`pet`（寵物）。成人/兒童/長者共用同一個「一般食物」計算賽道，只是每日熱量需求不同；嬰兒與寵物因為吃的東西無法被其他成員取代，需要獨立的計算賽道。

現在要實作「Feed Tag」機制，讓嬰兒/寵物的主食可以彈性設定、支援混食情境（例如貓同時吃乾糧+罐頭），且不需要為每個物種／餵食型態預先窮舉分類。

### 前置修正：`stockUnit` 移除 `g`／`ml`

`count` 應永遠代表「離散可數的件數」（罐/包/個/瓶...），`g`／`ml` 這種度量單位不該跟計數單位混在同一個 enum：

```ts
export const stockUnit = {
  pack: "包",
  can: "罐",
  piece: "個",
  bottle: "瓶",
  pair: "雙",
  roll: "捲",
  other: "其他",
} as const;
```

物資既有的 `volume` 欄位（每件容量/重量）保留沿用，作為「每個計數單位裡裝多少量」的依據，總量換算固定為：

```
總量 = count × volume
```

### `stockType` 調整：新增主食分類，必填 `volume`

```ts
export const stockType = {
  // ...既有分類
  infantStapleFood: "嬰兒主食（配方奶）",
  petStapleFood: "寵物主食（飼料/罐頭）",
  babyFood: "嬰兒副食品", // 保留既有分類，但不參與任何計算
} as const;
```

- `infantStapleFood`、`petStapleFood` 這兩個分類，`volume` 欄位改為**必填**（原本的 `REQUIRED_FIELDS` 機制直接沿用），確保每筆資料都能正確換算總量
- `babyFood`（副食品）**完全不參與存活天數計算**，Dashboard 上僅顯示庫存筆數/份數作為參考資訊，不接入 Feed Tag 機制、不支援混食設定

### 核心設計原則

1. `stockType` 系統固定 enum，不開放自訂；Feed Tag 是掛在 `infantStapleFood`／`petStapleFood` 底下的使用者自訂子標籤，用來描述具體餵食型態（如「乾糧」「罐頭」「配方奶 A 廠牌」），無法窮舉，完全交由使用者自建
2. Feed Tag 的建立時機在「成員設定」流程中，不在「新增物資」流程中——新增物資時只能**選用**已建立的 Tag
3. **Feed Tag 可跨成員共用**：例如兩隻貓都選「乾糧」這個 Tag，計算時視為**合併需求**，以兩隻貓的總消耗量對同一批乾糧庫存計算天數（不是各自獨立算一份）
4. 嬰兒的奶（`infantStapleFood`）與寵物主食（`petStapleFood`）都走 Feed Tag 機制；嬰兒副食品（`babyFood`）不使用 Feed Tag、不計入任何天數計算

### 資料結構

```ts
type FeedTag = {
  id: string;
  label: string; // 使用者自訂，如「乾糧」「罐頭」「配方奶」
  appliesToStockType: "infantStapleFood" | "petStapleFood";
};

type FeedPortion = {
  feedTagId: string;
  amount: number;        // 每次餵食/飲用量
  frequencyDays: number; // 每幾天一次，預設 1
};

type HouseholdMember = {
  id: string;
  identity: "adult" | "child" | "elderly" | "infant" | "pet";
  label?: string;
  dailyNeed?: number;         // 成人/兒童/長者，選填
  feedPortions?: FeedPortion[]; // 嬰兒／寵物的主食組成，支援多品項混食
};

type Stock = {
  // ...既有欄位
  count: number;
  unit: StockUnit;   // 不含 g/ml
  volume?: number;   // 每件容量/重量；infantStapleFood、petStapleFood 必填
  feedTagId?: string; // 只有 type 為 infantStapleFood/petStapleFood 時使用
};
```

### 功能需求

**A. 成員設定流程（身份為 `infant` 或 `pet` 時）**

- 顯示「主食組成」區塊，可新增多筆 `FeedPortion`
- 每筆需選擇：Feed Tag（下拉選單，含「+ 新增標籤」選項，新建立的 Tag 全域共用、供所有成員選用）、份量、每幾天一次
- 選「+ 新增標籤」時跳出輸入框建立新 Tag，儲存後加入全域 Feed Tag 清單

**B. 新增物資流程**

- `stockType` 選擇 `infantStapleFood` 或 `petStapleFood` 時，多顯示「餵食標籤」欄位（從已建立的 Feed Tag 清單選擇，不可在此新建）
- `volume` 欄位在這兩個分類下為必填
- 若尚無任何 Feed Tag 可選，提示使用者「請先至成員設定建立餵食標籤」

**C. 計算邏輯**

- 每個 Feed Tag 的**每日總消耗量** = 所有使用該 Tag 的成員之 `FeedPortion` 消耗量加總（例如兩隻貓都用「乾糧」Tag，各自 `amount/frequencyDays` 相加）
- 該 Tag 的可支撐天數 = 該 Tag 對應庫存總量（`Σ count × volume`）÷ 每日總消耗量
- 每個嬰兒/寵物成員的整體可支撐天數 = 其所有 `FeedPortion` 對應 Tag 天數中的**最小值**（瓶頸邏輯）
- 需標示造成瓶頸的品項

**D. Dashboard 呈現**

- 只有實際存在嬰兒/寵物成員時才顯示對應賽道
- 顯示整體可支撐天數 + 逐項列出各 Feed Tag 的天數，標示瓶頸項目
- 副食品（`babyFood`）僅顯示庫存筆數/份數，獨立呈現、不參與任何天數計算

### 本次不處理的部分（明確排除）

1. **Feed Tag 的刪除/編輯機制暫不實作**——如需修改成員的一日飲食所需，先忽略「刪除 Tag 後既有資料如何處理」這個問題，之後再設計
2. **嬰兒副食品不支援混食/多品項設定**，也不參與計算，維持純顯示
3. **醫療用藥（`medicine` + medical tag）不在本次範圍內實作**，待本機制於寵物/嬰兒驗證可用後再評估是否套用