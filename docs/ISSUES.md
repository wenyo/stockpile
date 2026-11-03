# Stockpile 問題清單

> 分析日期：2026-11-03（版本 1.5.3）
> 分析方式：閱讀程式碼，並以現有的 `.react-router/types` 執行 `tsc --noEmit`（無型別錯誤）。未實際在瀏覽器中操作。
>
> **狀態說明**
> - **已確認**：從程式碼邏輯可以直接推得，行為明確。
> - **待驗證**：程式碼看起來有問題，但實際影響要在瀏覽器或建置環境中確認，不應當成既定事實。
>
> **嚴重度說明**
> - **高**：會造成資料遺失、程式崩潰，或核心指標（可支撐天數）明顯錯誤。
> - **中**：計算結果在特定情境下不正確，或操作結果和使用者預期不同。
> - **低**：體驗、維護性、設定或文件層面的問題。

---

## 高

### 1. 選擇「使用範例」退出示範模式後，家庭成員與標籤會被清空
- **嚴重度**：高
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/store/stockList.tsx` 的 `startFromDemoData`；`app/store/setting.tsx` 中監聽 `isDemo` 的 `useEffect`
- **說明**：`startFromDemoData` 會執行 `setIsDemo(false)`，並把物資設為 `sampleStockData`。但 `SettingProvider` 偵測到 `isDemo` 變成 `false` 時，會進入 else 分支，把設定還原成預設值，家庭成員與標籤也都設為空陣列。
- **影響**：使用者以為自己拿到「一份可以修改的完整範例」，實際上只剩範例物資。沒有家庭成員，所有天數都是 0；範例物資的 `feedTagId` / `medicineTagId` 也指向不存在的標籤，會顯示「未知標籤」或不列入計算。
- **建議**：「使用範例」應該同時寫入 `sampleHouseholdData` 與 `sampleFeedTags`；或是把「退出示範模式」與「清空設定」拆成兩個明確的動作。

### 2. 還沒新增任何物資前，歡迎視窗每次都會出現；此時進入再退出示範模式，會清掉已設定的家庭成員
- **嚴重度**：高
- **類型**：功能
- **狀態**：已確認（「每次都會出現」與「資料被清掉」兩點都可從程式碼推得；實際操作流程仍建議在瀏覽器中重現一次）
- **位置**：`app/store/modal.tsx`（以 `localStorage.getItem("stockList")` 判斷是否顯示歡迎視窗）、`app/store/stockList.tsx`（儲存用的 effect）、`app/store/setting.tsx`
- **說明**：
  1. 第一次使用時 `stockList` 一直是 `[]`。初始化時儲存用的 effect 還在 `isInitialized === false` 的階段，所以不會寫入；之後 `stockList` 也沒有變化，effect 不會再執行，`stockList` 這個 key 就一直不存在，直到使用者新增第一筆物資。
  2. 因此只設定了家庭成員、但還沒新增物資的使用者，每次開啟都會看到歡迎視窗。
  3. 如果這時選擇「探索範例」，再透過「退出 Demo 模式」離開，`SettingProvider` 會把家庭成員、標籤、目標天數全部重設並寫回 `localStorage`，原本的設定就遺失了。
- **影響**：使用者自己建立的家庭成員設定會在沒有任何提示的情況下消失。
- **建議**：判斷是否顯示歡迎視窗時，改用專門的旗標（例如 `has-onboarded`）；示範模式結束時，應該從 `localStorage` 重新載入使用者的真實資料，而不是寫入空值。

### 3. 匯入檔案沒有驗證資料結構，格式不正確時可能讓整個 App 崩潰
- **嚴重度**：高
- **類型**：功能／技術
- **狀態**：崩潰本身已確認；崩潰後錯誤資料是否已寫入 `localStorage`、導致重新整理後仍然壞掉，**待驗證**
- **位置**：`app/Setting/index.tsx` 的 `handleImport`
- **說明**：`try/catch` 只包住 `JSON.parse` 與 `replace*` 的呼叫。只要 JSON 語法正確，內容就會原樣寫進狀態，沒有任何檢查。例如 `{"stockList": {}}` 或 `{"household": "x"}`，會在 `useDashboardStats` 執行 `.reduce` / `.forEach` 時於算繪階段丟出錯誤，進入根層的 `ErrorBoundary`。成員或物資缺少欄位時（例如 `feedPortions` 格式錯誤）也可能出錯。
- **影響**：整個畫面變成錯誤頁。另外，匯入是「完全覆蓋」，原本的資料沒有備份可以還原。
- **建議**：匯入前做結構驗證（檢查型別、陣列、必填欄位與 `version`），驗證通過才覆蓋；覆蓋前自動保留一份舊資料，以便還原。這也和 `prompt.md` P1「匯入差異比對」的需求相關。

### 4. 已過期的物資仍會計入熱量、飲水與可支撐天數
- **嚴重度**：高
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/hooks/useDashboardStats.ts` 的 `currentCalories`、`currentWater`、`computeCategorySummary`
- **說明**：加總庫存時沒有排除 `expirationDate` 早於今天的物資。
- **影響**：可支撐天數被高估，這正是這個產品最核心的指標。儀表板一邊提示「已過期 N 項」，一邊仍把這些物資算進天數裡，前後矛盾。
- **建議**：計算天數時排除已過期的物資，或在畫面上同時顯示「含過期」與「不含過期」兩個數字。

### 5. 批次更新庫存時，多列選到同一個物資，只有最後一列會生效
- **嚴重度**：高
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/components/modal/updateStock.tsx` 的 `handleSubmit`
- **說明**：每一列都是從同一份 `stockList` 取出 `stock`，再呼叫 `updateStock(stock.id, { ...stock, count })`。如果有兩列都操作同一個物資（例如分兩次使用），每一列都是用舊的數量去計算，後面那列會覆蓋前面的結果。如果某一列觸發了 `removeStock`，後面的列仍可能把物資用 `updateStock` 寫回去（實際結果取決於更新的順序）。
- **影響**：庫存數量與實際狀況不符，畫面卻顯示「庫存更新成功」。
- **建議**：先依 `stockId` 合併各列的增減量，再一次套用；或是不允許兩列選到同一個物資。

---

## 中

### 6. 嬰幼兒與寵物食品的熱量也會計入家庭總熱量
- **嚴重度**：中
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/hooks/useDashboardStats.ts` 的 `currentCalories`；`app/interfaces/stock.ts` 的 `HIDE_FIELD_TYPE`
- **說明**：`currentCalories` 會把所有物資的 `count × totalCalories` 加總，沒有篩選類別。嬰幼兒主食、副食品，以及寵物主食、副食品的表單都會顯示熱量欄位（`HIDE_FIELD_TYPE` 中這幾類是空陣列），只要填了，就會被當成全家可以吃的熱量。
- **影響**：食物可支撐天數被高估。寵物飼料的熱量被算進人的食物裡。
- **建議**：`currentCalories` 只計算 `food`（以及明確設計為人可以吃的類別）；或在這幾類的表單中隱藏熱量欄位。

### 7. 家庭裡沒有人設定每日熱量需求時，整體可支撐天數會顯示為 0
- **嚴重度**：中
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/hooks/useDashboardStats.ts` 的 `survivalFoodDays`、`survivalWaterDays`、`survivalDays`
- **說明**：每日需求總和為 0 時，天數直接回傳 0；而 `survivalDays` 是取所有維度的最小值，所以結果也會是 0。嬰幼兒的必填欄位不包含 `dailyKcalNeed`，因此「只有寵物」或「只有嬰幼兒」的家庭（或尚未設定成員時），即使物資很充足，也會顯示 0 天。
- **影響**：特定家庭組成下，數字完全錯誤，使用者也無從得知原因。
- **建議**：沒有需求的維度不列入取最小值；畫面上顯示「未設定需求」，而不是 0 天。

### 8. 目標天數可以設成 0、負數或空白，畫面顯示的值與實際儲存的值不同
- **嚴重度**：中
- **類型**：功能
- **狀態**：輸入與儲存的行為已確認；儀表板實際會顯示成什麼樣子，**待驗證**
- **位置**：`app/Setting/index.tsx`（`value={setting?.targetDays || 30}`、`Number(e.target.value)`）；`app/hooks/useDashboardStats.ts` 的 `progressPercent`
- **說明**：把輸入框清空時，會儲存 `Number("") = 0`，但因為 `|| 30`，畫面上仍顯示 30。`targetDays = 0` 時，`survivalDays / 0` 會得到 `NaN` 或 `Infinity`。負數也沒有被擋下。`rotationDays` 同樣沒有驗證，而且當 `rotationDays < targetDays` 時，「需要輪替」永遠是空的。
- **影響**：使用者看到的設定值和實際用來計算的值不一致；進度條可能顯示異常。
- **建議**：限制最小值（例如 ≥ 1），並要求 `rotationDays ≥ targetDays`；輸入框改用受控的字串狀態，離開欄位時再驗證。

### 9. 藥品或主食的容量為 0 或未填時，會被當成 1 計算
- **嚴重度**：中
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/hooks/useDashboardStats.ts` 的 `computeCategorySummary`（`const vol = Number(stock.volume) || 1`）
- **說明**：`volume` 為 0、`undefined` 或 `NaN` 時都會變成 1。藥品的 `count` 固定為 1，所以一個已經用完（volume = 0）的藥品，仍會被算成還有 1 單位庫存。
- **影響**：必要用藥與嬰幼兒、寵物主食的天數被高估。藥品用完時尤其容易誤判。
- **建議**：未填時列為「資料缺漏」，並以 0 計算，不要預設成 1。

### 10. 到期判斷有邊界與時區問題，儀表板和清單頁使用的標準也不一致
- **嚴重度**：中
- **類型**：功能
- **狀態**：判斷標準不一致已確認；時區造成的實際偏差，**待驗證**
- **位置**：`app/hooks/useDashboardStats.ts`（`expiringSoonStock` 用 `days > 0`，`expiredStock` 用 `days < 0`）；`app/utils/stock.ts`（`WARNING_DAYS = 30`）
- **說明**：
  - 儀表板的「即將到期」以使用者設定的 `targetDays` 為準；清單頁的 `getStockStatus` 則固定用 `WARNING_DAYS = 30`。使用者把目標天數改成 60 之後，兩個頁面的結果就會不同。
  - `Math.floor` 算出 `days === 0` 的物資，既不算「即將到期」也不算「已過期」，在儀表板上會消失。
  - `new Date("YYYY-MM-DD")` 會被解析為 UTC 午夜，在台灣（UTC+8）等於當天早上 8 點，同一個物資在一天之內的分類可能會改變。
- **建議**：把到期判斷統一抽成一個共用函式，以「本地日期」比較天數，並明確定義當天到期算哪一類。

---

## 低

### 11. 數量用到 0 時會直接刪除物資
- **嚴重度**：低
- **類型**：功能
- **狀態**：待驗證（是否為刻意設計）
- **位置**：`app/components/modal/updateStock.tsx`
- **說明**：選擇「使用」後，如果數量或容量 ≤ 0，就會直接 `removeStock`，沒有確認步驟，也不能復原。
- **影響**：用完的必要物資（例如固定用藥）整筆消失，使用者得重新建立，包括標籤、單位、備註等資料。
- **建議**：保留這筆物資，數量顯示為 0 並標示「已用完」；或在刪除前先詢問使用者。

### 12. 匯出的備份不包含盤點時間
- **嚴重度**：低
- **類型**：功能
- **狀態**：已確認
- **位置**：`app/Setting/index.tsx` 的 `handleExport`
- **說明**：匯出內容只有 `setting`、`household`、`stockList`、`stockTags`，沒有 `lastInventoryConfirmedAt`。
- **影響**：換裝置或還原備份後，「上次確認庫存」的時間會遺失，儀表板的盤點提醒也會隨之失效。
- **建議**：把盤點時間加進備份，並提高 `version` 版本號。

### 13. 相對時間的語系設定為 `"cn"`
- **嚴重度**：低
- **類型**：技術
- **狀態**：待驗證（實際顯示的語言取決於瀏覽器的預設語系）
- **位置**：`app/store/stockList.tsx`（`new Intl.RelativeTimeFormat("cn", ...)`）
- **說明**：`"cn"` 不是有效的中文語系代碼（中文應為 `zh`），瀏覽器可能會改用預設語系，在英文環境下可能顯示「3 days ago」。
- **建議**：改為 `"zh-TW"`。

### 14. 「上次盤點」的相對時間不會隨時間更新
- **嚴重度**：低
- **類型**：技術
- **狀態**：已確認
- **位置**：`app/store/stockList.tsx` 的 `relativeTime`（`useMemo` 只依賴 `lastInventoryConfirmedAt`）
- **說明**：頁面或 PWA 長時間開著不關時，顯示的「今天」不會自動變成「1 天前」。到期判斷同樣是在 `useMemo` 中取 `new Date()`，有一樣的問題。
- **建議**：頁面重新取得焦點（`visibilitychange`）時重新計算，或加入以日期為單位的依賴值。

### 15. Dockerfile 可能與正式環境的建置設定不相容
- **嚴重度**：低
- **類型**：技術
- **狀態**：待驗證（需實際執行 `docker build`）
- **位置**：`Dockerfile`、`react-router.config.ts`
- **說明**：正式環境的建置設定是 `ssr: false`，但 Dockerfile 用 `react-router-serve ./build/server/index.js` 啟動；SPA 模式可能不會產生這個檔案。實際部署使用的是 GitHub Pages，Dockerfile 可能已經沒有在維護。
- **建議**：確認後擇一處理：刪除 Dockerfile，或改用靜態伺服器（例如 nginx）提供 `build/client`。

### 16. Workbox 的執行時快取設定有範本殘留，而且沒有上限
- **嚴重度**：低
- **類型**：技術
- **狀態**：待驗證（實際影響）
- **位置**：`vite.config.ts` 的 `workbox.runtimeCaching`
- **說明**：
  - `/someInterface/i` 是範本留下的規則，專案本身沒有任何 API。
  - JS、CSS 已經由 precache 處理，又額外設了 CacheFirst 的執行時快取，而且沒有 `expiration` 設定。
  - JS、CSS 那條規則的正規表示式也會比對到 `.ts`，以及網址中任何位置出現 `.js` 的請求。
- **影響**：每次改版後，舊的快取可能持續累積；行為也比較難推測。
- **建議**：移除範例規則；先評估只用 precache 是否就足夠，若保留執行時快取，加上 `expiration`。

### 17. Inter 字型重複載入，而且會連到 Google 的伺服器
- **嚴重度**：低
- **類型**：技術
- **狀態**：已確認
- **位置**：`app/app.css`（`@import "@fontsource-variable/inter"`）、`app/root.tsx` 的 `links`（Google Fonts）
- **說明**：本地已經打包了 Inter，又從 Google Fonts 載入同一套字型。
- **影響**：多了一次不必要的網路請求；而且每次開啟都會連到第三方伺服器，與 README 標榜的「隱私優先、不上傳資料」定位不太一致（不會傳出物資資料，但會暴露使用者的 IP）。
- **建議**：移除 Google Fonts 的連結，只使用本地字型。

### 18. 沒有自動化測試與 lint
- **嚴重度**：低
- **類型**：技術
- **狀態**：已確認
- **位置**：`package.json`
- **說明**：核心的天數計算（`useDashboardStats`）、資料轉換（`migrateTagsWithUnits`）與排序（`app/utils/stock.ts`）都沒有測試。上面第 4、6、7、9、10 項都屬於這類邊界情況，有測試的話比較容易發現。
- **建議**：導入 Vitest，把計算邏輯從 hook 中抽成純函式，再針對這些邊界情況撰寫測試。

### 19. 重複邏輯與失效的程式碼
- **嚴重度**：低
- **類型**：技術
- **狀態**：已確認
- **位置**：
  - `app/hooks/useDashboardStats.ts`：計算「每日飲水需求」的程式碼在 `targetWater` 與 `survivalWaterDays` 各寫了一次；三個到期分類也各自重複計算天數。
  - 「藥品數量固定為 1、單位為件」的規則分散在 `app/store/stockList.tsx`（`addStock`、`updateStock`）與 `app/components/modal/createStock.tsx` 兩處。
  - `app/store/stockList.tsx`、`app/store/setting.tsx` 初始化時的 `if (isDemo) return;`：`isDemo` 的初始值一定是 `false`，這段判斷永遠不會成立。
- **建議**：抽成共用函式，並刪除這段失效的判斷。

### 20. 搜尋結果透過 effect 同步成另一份狀態
- **嚴重度**：低
- **類型**：技術
- **狀態**：已確認
- **位置**：`app/store/stockList.tsx`（`showStockList` 與 `searchParams` 的 `useEffect`）
- **說明**：搜尋結果是由 `stockList` 與 `searchParams` 推算出來的，卻另外存成一份狀態，再用 effect 同步。這樣會多一次算繪，而且在新增或刪除物資的當下，兩份資料會短暫不一致。另外，名稱搜尋會區分大小寫，也沒有去除前後的空白。
- **建議**：改用 `useMemo` 直接推算結果。

### 21. 物資與成員的 ID 使用 `Date.now()`
- **嚴重度**：低
- **類型**：技術
- **狀態**：待驗證（目前匯入是整份覆蓋，暫時不會衝突）
- **位置**：`app/components/modal/createStock.tsx`、`app/store/setting.tsx` 的 `addHousehold`
- **說明**：未來如果實作 `prompt.md` P1 的「匯入差異比對」，要合併兩台裝置的資料時，用時間戳記當 ID 可能會撞號，也很難判斷兩筆資料是不是同一筆。
- **建議**：改用 `crypto.randomUUID()`。

### 22. README 的 Roadmap 沒有更新
- **嚴重度**：低
- **類型**：文件
- **狀態**：已確認
- **位置**：`README.md`
- **說明**：PWA、家庭成員設定、資料匯入匯出都已經實作完成，README 卻仍列在「Planned」。
- **建議**：更新 Roadmap，與 `prompt.md` 的完成狀態保持一致。
