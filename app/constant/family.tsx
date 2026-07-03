import { stockUnit } from '@/constant/stock';

export type Identity = "adult" | "child" | "elderly" | "infant" | "pet";

export type HouseholdMember = {
  id: string;                // 每個個體的唯一 id,新增時自動產生 (e.g. Date.now())
  identity: Identity;        // 分類,固定就這五種,不會再增加
  label?: string;            // 使用者自己取的名字,方便辨識,如「大寶」「二寶」「貓咪 Momo」
  dailyNeed?: number;        // 成人/兒童/長者用
  dailyMilkNeed?: number;    // 嬰兒專用,個體自己填
  petFeedingNote?: {         // 寵物專用,個體自己填
    amount: number;
    unit: keyof typeof stockUnit;
    frequencyDays: number;
  };
};