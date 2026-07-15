import type { Route } from "./+types/stocklist";
import StockListComponent from "@/StockList";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Stockpile - 物資列表" }];
}

export default function StockList() {
  return <StockListComponent />;
}
