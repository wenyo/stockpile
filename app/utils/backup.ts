import type { HouseholdMember } from "@/interfaces/family";
import type { Stock, Tag } from "@/interfaces/stock";
import type { SettingConfig } from "@/store/setting";
import { stockType } from "@/constant/stock";
import { identityConstants } from "@/constant/family";

// 匯出與匯入共用；備份格式有不相容變更時遞增
export const BACKUP_VERSION = 1;

// 沒有的區塊代表匯入時維持現有資料
export type BackupData = {
  setting?: SettingConfig;
  household?: HouseholdMember[];
  stockList?: Stock[];
  stockTags?: Tag[];
};

export type BackupParseResult =
  | { ok: true; data: BackupData }
  | { ok: false; message: string };

export const NEWER_VERSION_MESSAGE =
  "此備份檔由較新版本的 Stockpile 匯出。請連上網路並重新整理頁面以更新，再匯入一次。";

type Dict = Record<string, unknown>;

function isDict(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

// 巢狀物件或陣列被當成文字算繪時會讓 React 崩潰
function findNestedField(item: Dict, allowed: string[] = []): string | null {
  for (const [key, value] of Object.entries(item)) {
    if (allowed.includes(key)) continue;
    if (typeof value === "object" && value !== null) return key;
  }
  return null;
}

function validateSetting(value: unknown): string | null {
  if (!isDict(value)) return "基礎設定的格式不正確";
  for (const key of ["targetDays", "rotationDays"]) {
    const days = value[key];
    if (!isNil(days) && !(typeof days === "number" && Number.isFinite(days))) {
      return "目標天數或輪替天數不是數字";
    }
  }
  return null;
}

function validateNeeds(value: unknown, where: string): string | null {
  if (isNil(value)) return null;
  if (!Array.isArray(value)) return `${where}的需求設定格式不正確`;
  for (const need of value) {
    if (!isDict(need) || findNestedField(need)) return `${where}的需求設定格式不正確`;
  }
  return null;
}

function validateHousehold(value: unknown): string | null {
  if (!Array.isArray(value)) return "家庭成員不是清單格式";
  for (let i = 0; i < value.length; i++) {
    const where = `家庭成員第 ${i + 1} 筆`;
    const member: unknown = value[i];
    if (!isDict(member)) return `${where}的格式不正確`;
    if (typeof member.id !== "string") return `${where}缺少 id`;
    if (typeof member.name !== "string") return `${where}缺少名稱`;
    if (typeof member.identity !== "string" || !Object.hasOwn(identityConstants, member.identity)) {
      return `${where}的身分無法辨識`;
    }
    if (findNestedField(member, ["feedPortions", "medicineNeeds"])) return `${where}的欄位格式不正確`;
    const needsError =
      validateNeeds(member.feedPortions, where) ?? validateNeeds(member.medicineNeeds, where);
    if (needsError) return needsError;
  }
  return null;
}

function validateStockList(value: unknown): string | null {
  if (!Array.isArray(value)) return "物資不是清單格式";
  for (let i = 0; i < value.length; i++) {
    const where = `物資第 ${i + 1} 筆`;
    const stock: unknown = value[i];
    if (!isDict(stock)) return `${where}的格式不正確`;
    if (typeof stock.id !== "string") return `${where}缺少 id`;
    if (typeof stock.name !== "string") return `${where}缺少名稱`;
    if (typeof stock.type !== "string" || !Object.hasOwn(stockType, stock.type)) {
      return `${where}的類別無法辨識`;
    }
    if (findNestedField(stock)) return `${where}的欄位格式不正確`;
  }
  return null;
}

function validateTags(value: unknown): string | null {
  if (!Array.isArray(value)) return "標籤不是清單格式";
  for (let i = 0; i < value.length; i++) {
    const where = `標籤第 ${i + 1} 筆`;
    const tag: unknown = value[i];
    if (!isDict(tag)) return `${where}的格式不正確`;
    if (typeof tag.id !== "string") return `${where}缺少 id`;
    if (typeof tag.label !== "string") return `${where}缺少名稱`;
    if (findNestedField(tag)) return `${where}的欄位格式不正確`;
  }
  return null;
}

function fail(reason: string): BackupParseResult {
  return { ok: false, message: `資料匯入失敗：${reason}` };
}

// 只擋會讓 App 崩潰的結構問題；任何一筆不合格就整份拒絕
export function parseBackup(text: string): BackupParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return fail("檔案不是有效的 JSON 格式");
  }
  if (!isDict(raw)) return fail("檔案不是 Stockpile 的備份格式");

  if (typeof raw.version !== "number" || !Number.isFinite(raw.version)) {
    return fail("無法辨識備份檔的版本");
  }
  if (raw.version > BACKUP_VERSION) {
    return { ok: false, message: NEWER_VERSION_MESSAGE };
  }

  // 舊版備份的標籤欄位名稱為 feedTags
  const rawTags = isNil(raw.stockTags) ? raw.feedTags : raw.stockTags;

  const error =
    (isNil(raw.setting) ? null : validateSetting(raw.setting)) ??
    (isNil(raw.household) ? null : validateHousehold(raw.household)) ??
    (isNil(raw.stockList) ? null : validateStockList(raw.stockList)) ??
    (isNil(rawTags) ? null : validateTags(rawTags));
  if (error) return fail(error);

  const data: BackupData = {};
  if (!isNil(raw.setting)) data.setting = raw.setting as SettingConfig;
  if (!isNil(raw.household)) data.household = raw.household as HouseholdMember[];
  if (!isNil(raw.stockList)) data.stockList = raw.stockList as Stock[];
  if (!isNil(rawTags)) data.stockTags = rawTags as Tag[];
  return { ok: true, data };
}
