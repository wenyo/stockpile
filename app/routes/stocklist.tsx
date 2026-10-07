import type { Route } from "./+types/stocklist";
import StockListComponent from "@/StockList";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "防災物資清單與效期管理｜Stockpile 防災物資管理系統",
    },
    {
      name: "description",
      content:
        "管理家庭防災物資清單，記錄食物、飲水、藥品與生活物資的庫存數量與保存期限，掌握即期、過期與短缺物資，並支援批次入庫與出庫。",
    },
    {
      name: "keywords",
      content:
        "防災物資清單,防災物資管理,物資庫存管理,保存期限,過期提醒,防災食品,防災藥品,地震物資清單",
    },
    {
      property: "og:title",
      content: "防災物資清單與效期管理｜Stockpile 防災物資管理系統",
    },
    {
      property: "og:description",
      content:
        "管理家庭防災物資的庫存與保存期限，快速掌握即期、過期與短缺物資。",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://wenyo.github.io/stockpile/stock-list",
    },
    {
      property: "og:image",
      content: "https://wenyo.github.io/stockpile/pwa-512x512.png",
    },
    { property: "og:locale", content: "zh_TW" },
  ];
}

export default function StockList() {
  return <StockListComponent />;
}
