import type { Route } from "./+types/setting";
import SettingComponent from "@/Setting";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "家庭成員與防災目標設定｜Stockpile 防災物資管理系統",
    },
    {
      name: "description",
      content:
        "設定家庭成員與防災儲備目標，依成人、幼童、嬰兒與寵物的需求設定每日熱量、飲水、特殊飲食與必要用藥，作為物資可支撐天數的計算依據。",
    },
    {
      name: "keywords",
      content:
        "家庭防災設定,防災儲備目標,家庭成員需求,每日熱量,飲水需求,嬰幼兒防災,寵物防災,必要用藥",
    },
    {
      property: "og:title",
      content: "家庭成員與防災目標設定｜Stockpile 防災物資管理系統",
    },
    {
      property: "og:description",
      content:
        "設定家庭成員的食物、飲水、特殊飲食與必要用藥需求，作為防災物資可支撐天數的計算依據。",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://wenyo.github.io/stockpile/setting",
    },
    {
      property: "og:image",
      content: "https://wenyo.github.io/stockpile/pwa-512x512.png",
    },
    { property: "og:locale", content: "zh_TW" },
  ];
}

export default function Setting() {
  return <SettingComponent />;
}
