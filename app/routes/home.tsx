import type { Route } from "./+types/home";
import Index from "@/Home/Home";
import { StockListProvider } from "@/store/stockList";
import { ModalProvider } from "@/store/modal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <ModalProvider>
      <StockListProvider>
        <Index />
      </StockListProvider>
    </ModalProvider>
  );
}
