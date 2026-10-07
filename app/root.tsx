import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { ModalProvider } from "@/store/modal";
import { StockListProvider } from "@/store/stockList";
import { SettingProvider } from "@/store/setting";
import { PWABadge } from "@/components/pwa-badge";
import Header from "@/components/header";
import Modal from "@/components/modal/index";
import { Toaster } from "@/components/ui/sonner";
import AppTour from "@/components/tour";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.ico`} />
        <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.webmanifest`} />
        <link rel="canonical" href="https://wenyo.github.io/stockpile/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Stockpile｜家庭防災物資管理系統・計算可支撐天數",
              url: "https://wenyo.github.io/stockpile/",
              description: "Stockpile 是免費的家庭防災物資管理工具，可依家庭成員需求計算食物、飲水、嬰幼兒與寵物主食、必要用藥的可支撐天數，掌握物資短缺與保存期限，協助你知道目前還能撐多久、接下來最需要補充什麼。",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TWD",
              },
            }),
          }}
        />
        <Meta />
        <meta name="google-site-verification" content="xx5BYzrsRiV0CG0aplj_megYBM_KYdEA2WF0ARkrkM4" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <PWABadge />
      <ModalProvider>
        <StockListProvider>
          <SettingProvider>
            <AppTour />
            <Modal />
            <Header />
            <Outlet />
            <Toaster />
          </SettingProvider>
        </StockListProvider>
      </ModalProvider>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
