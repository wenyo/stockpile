// 只能在 useEffect 或事件處理中呼叫（預先算繪沒有 localStorage）
const ONBOARDED_KEY = "has-onboarded";

// 非空陣列才算真實資料（stockTags 初始即為 []）；stockpile_setting 不列入
const USER_DATA_KEYS = [
  "stockList",
  "stockpile_household",
  "stockpile_stockTags",
  "stockpile_feedTags", // 舊名
];

function hasStoredItems(key: string): boolean {
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

export function hasStoredUserData(): boolean {
  return USER_DATA_KEYS.some(hasStoredItems);
}

export function hasOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function markOnboarded(): void {
  localStorage.setItem(ONBOARDED_KEY, "true");
}
