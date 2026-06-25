export const stockType: Record<string, string> = {
  food: "食物",
  medical: "醫療",
  water: "水",
  light: "照明",
  communication: "通訊",
  tool: "工具",
  other: "其他",
}

export const stockUnit: Record<string, string> = {
  g: "g",
  pack: "包",
  can: "罐",
  ml: "ml",
  l: "l",
  piece: "個",
  other: "其他",
}

export const stockFieldLabel: Record<string, string> = {
  name: "名稱",
  count: "數量",
  totalCalories: "總熱量",
  expirationDate: "到期日",
  purchaseDate: "購買日期",
  remark: "備註",
}

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