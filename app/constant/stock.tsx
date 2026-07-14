export const WARNING_COUNT = 10;
export const WARNING_DAYS = 30;
export const stockType = {
  food: "一般食物",
  infantStapleFood: "嬰兒主食", // 列入生存必要計算
  infantNonStapleFood: "嬰兒副食品", // 不列入生存必要計算
  petStapleFood: "寵物主食", // 列入生存必要計算
  petNonStapleFood: "寵物副食品", // 不列入生存必要計算
  medical: "醫療",
  water: "飲用水",
  light: "照明",
  communication: "通訊",
  tool: "工具",
  other: "其他",
} as const;

export const stockUnit: Record<string, string> = {
  g: 'g',
  ml: 'ml',
  unit: '份',
} as const;

export const stockItemUnit: Record<string, string> = {
  pack: "包",
  can: "罐",
  piece: "個",
  bottle: "瓶",
  pair: "雙",
  roll: "捲",
  other: "其他",
} as const;

export const stockFieldLabel = {
  name: "名稱",
  count: "數量",
  totalCalories: "總熱量",
  volume: "單件容量(ml)",
  expirationDate: "到期日",
  purchaseDate: "購買日期",
  remark: "備註",
} as const;

export const preparednessLevels = [
  {
    minPercentage: 200,
    label: "高度準備",
    className: "text-primary",
    bgClassName: "bg-primary",
  },
  {
    minPercentage: 100,
    label: "充足準備",
    className: "text-success",
    bgClassName: "bg-success",
  },
  {
    minPercentage: 50,
    label: "中度準備",
    className: "text-info",
    bgClassName: "bg-info",
  },
  {
    minPercentage: 25,
    label: "基礎準備",
    className: "text-warning",
    bgClassName: "bg-warning",
  },
  {
    minPercentage: 0,
    label: "準備不足",
    className: "text-danger",
    bgClassName: "bg-danger",
  },
] as const;