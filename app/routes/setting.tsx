import type { Route } from "./+types/setting";
import SettingComponent from "@/Setting";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Stockpile - 設定" }];
}

export default function Setting() {
  return <SettingComponent />;
}
