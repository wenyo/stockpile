import { stockItemUnit } from '@/constant/stock';
import type { FeedPortion } from '@/interfaces/stock';
import { identityConstants } from '@/constant/family';

export type Identity = keyof typeof identityConstants;

export type HouseholdMember = {
  id: string;                // 每個個體的唯一 id,新增時自動產生 (e.g. Date.now())
  identity: Identity;        // 分類,固定就這五種,不會再增加
  name: string;            // 使用者自己取的名字,方便辨識,如「大寶」「二寶」「貓咪 Momo」
  dailyKcalNeed?: number;        // 成人/兒童/長者用
  dailyMlWater: number;
  feedPortions?: FeedPortion[];  // 嬰兒 / 寵物的飲食組成，支援多品項混食
};

export const initialHouseholdMember: HouseholdMember = {
  id: "",
  identity: "adult",
  name: "",
  dailyKcalNeed: 0,
  dailyMlWater: 0,
};