import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import DemoCheckModal from "@/components/modal/demoCheck";
import { StockListContext, StockListProvider, type StockListContextType } from "@/store/stockList";
import { SettingContext, SettingProvider } from "@/store/setting";
import { sampleFeedTags, sampleHouseholdData, sampleStockData } from "@/constant/sampleData";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = {
  stock: StockListContextType;
  setting: React.ContextType<typeof SettingContext>;
};

let latest: Snapshot;

function Probe() {
  latest = {
    stock: useContext(StockListContext),
    setting: useContext(SettingContext),
  };
  return null;
}

let container: HTMLDivElement;
let root: Root;

async function renderApp() {
  await act(async () => {
    root.render(
      <StockListProvider>
        <SettingProvider>
          <Probe />
          <DemoCheckModal />
        </SettingProvider>
      </StockListProvider>
    );
  });
}

async function enterDemo() {
  await act(async () => latest.stock.setIsDemo(true));
  expect(latest.stock.isDemo).toBe(true);
  expect(latest.setting.household).toEqual(sampleHouseholdData);
}

async function clickButton(label: string) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === label
  );
  if (!button) throw new Error(`找不到按鈕：${label}`);
  await act(async () => button.click());
}

beforeEach(() => {
  localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("退出 Demo 模式（ISSUE-001）", () => {
  it("選擇「使用範例」時，保留範例物資、家庭成員與標籤，並寫入 localStorage", async () => {
    await renderApp();
    await enterDemo();

    await clickButton("使用範例");

    expect(latest.stock.isDemo).toBe(false);
    expect(latest.stock.stockList).toEqual(sampleStockData);
    expect(latest.setting.household).toEqual(sampleHouseholdData);
    expect(latest.setting.stockTags).toEqual(sampleFeedTags);

    expect(JSON.parse(localStorage.getItem("stockpile_household") ?? "[]")).toEqual(sampleHouseholdData);
    expect(JSON.parse(localStorage.getItem("stockpile_stockTags") ?? "[]")).toEqual(sampleFeedTags);
    expect(JSON.parse(localStorage.getItem("stockList") ?? "[]")).toEqual(sampleStockData);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });

  it("選擇「開始建立」時，仍會清空物資、家庭成員與標籤", async () => {
    await renderApp();
    await enterDemo();

    await clickButton("開始建立");

    expect(latest.stock.isDemo).toBe(false);
    expect(latest.stock.stockList).toEqual([]);
    expect(latest.setting.household).toEqual([]);
    expect(latest.setting.stockTags).toEqual([]);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });
});
