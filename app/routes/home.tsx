import type { Route } from "./+types/home";
import HomeComponent from "@/Home";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Stockpile｜家庭防災物資管理系統・計算可支撐天數",
    },
    {
      name: "description",
      content:
        "Stockpile 是免費的家庭防災物資管理工具，可依家庭成員需求計算食物、飲水、嬰幼兒與寵物主食、必要用藥的可支撐天數，掌握物資短缺與保存期限，協助你知道目前還能撐多久、接下來最需要補充什麼。",
    },
    {
      name: "keywords",
      content:
        "防災物資,防災物資管理,防災物資清單,家庭防災,防災儲備,備戰物資,物資管理,可支撐天數,地震防災,嬰幼兒防災,寵物防災,必要用藥",
    },

    { property: "og:site_name", content: "Stockpile 防災物資管理系統" },
    {
      property: "og:title",
      content: "Stockpile｜家庭防災物資管理系統",
    },
    {
      property: "og:description",
      content:
        "管理家庭防災物資，計算食物、飲水、特殊飲食與必要用藥的可支撐天數，快速掌握目前短缺與下一步需要補充的物資。",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://wenyo.github.io/stockpile/" },
    {
      property: "og:image",
      content: "https://wenyo.github.io/stockpile/pwa-512x512.png",
    },
    { property: "og:locale", content: "zh_TW" },

    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Stockpile｜家庭防災物資管理系統",
    },
    {
      name: "twitter:description",
      content:
        "計算家庭防災物資可支撐天數，掌握食物、飲水、特殊飲食與必要用藥的短缺狀況。",
    },
    {
      name: "twitter:image",
      content: "https://wenyo.github.io/stockpile/pwa-512x512.png",
    },
  ];
}

export default function Home() {
  return <HomeComponent />;
}
