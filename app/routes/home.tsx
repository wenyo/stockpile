import type { Route } from "./+types/home";
import HomeComponent from "@/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stockpile" },
    { name: "description", content: "Know how long your supplies can support you." },
  ];
}

export default function Home() {
  return <HomeComponent />;
}
