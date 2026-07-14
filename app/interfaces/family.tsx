import { stockItemUnit } from '@/constant/stock';
import { identityConstants } from '@/constant/family';

export type Identity = keyof typeof identityConstants;

export type HouseholdMember = {
  id: string;                // 每個個體的唯一 id,新增時自動產生 (e.g. Date.now())
  identity: Identity;        // 分類,固定就這五種,不會再增加
  name: string;            // 使用者自己取的名字,方便辨識,如「大寶」「二寶」「貓咪 Momo」
  dailyKcalNeed?: number;        // 成人/兒童/長者用
  dailyMlWater: number;
  dailyBabyFoodNeed?: {         // 嬰兒專用,個體自己填    
    amount: number;             // 量/每餐
    unit: keyof typeof stockItemUnit;
    frequencyDays: number;
  };
  dailyPetFoodNeed?: {            // 寵物專用,個體自己填
    amount: number;             // 量/每餐
    unit: keyof typeof stockItemUnit;
    frequencyDays: number;
  };
};

export const initialHouseholdMember: HouseholdMember = {
  id: "",
  identity: "adult",
  name: "",
  dailyKcalNeed: 0,
  dailyMlWater: 0,
};