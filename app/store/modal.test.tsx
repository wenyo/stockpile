import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import WelcomeModal from "@/components/modal/welcome";
import { ModalContext, ModalProvider, type Modal } from "@/store/modal";
import { StockListContext, StockListProvider, type StockListContextType } from "@/store/stockList";
import { SettingProvider } from "@/store/setting";
import { userHousehold, userSetting, userStockList, userStockTags } from "../../test/fixtures/userData";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = {
  modal: Modal;
  stock: StockListContextType;
};

let latest: Snapshot;

// 比照 components/modal/index.tsx 算繪歡迎視窗
function Probe() {
  latest = {
    modal: useContext(ModalContext),
    stock: useContext(StockListContext),
  };
  const { isModalOpen, modalType } = latest.modal;
  return isModalOpen && modalType === "welcome" ? <WelcomeModal /> : null;
}

let container: HTMLDivElement;
let root: Root;

async function mountApp() {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <ModalProvider>
        <StockListProvider>
          <SettingProvider>
            <Probe />
          </SettingProvider>
        </StockListProvider>
      </ModalProvider>
    );
  });
}

async function unmountApp() {
  await act(async () => root.unmount());
  container.remove();
}

function isWelcomeOpen() {
  return latest.modal.isModalOpen && latest.modal.modalType === "welcome";
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
});

afterEach(async () => {
  await unmountApp();
});

describe("歡迎視窗的顯示條件（ISSUE-002）", () => {
  it("全新使用者會看到歡迎視窗，且尚未寫入 has-onboarded", async () => {
    await mountApp();

    expect(isWelcomeOpen()).toBe(true);
    expect(localStorage.getItem("has-onboarded")).toBeNull();
  });

  it.each([
    ["家庭成員", "stockpile_household", userHousehold],
    ["物資", "stockList", userStockList],
    ["標籤", "stockpile_stockTags", userStockTags],
    ["舊版標籤（stockpile_feedTags）", "stockpile_feedTags", userStockTags],
  ])("只有%s時不顯示歡迎視窗，並補寫 has-onboarded", async (_name, key, value) => {
    localStorage.setItem(key, JSON.stringify(value));

    await mountApp();

    expect(isWelcomeOpen()).toBe(false);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });

  it("只有 stockpile_setting、其他資料皆為空時，不算有真實資料，仍顯示歡迎視窗", async () => {
    localStorage.setItem("stockpile_setting", JSON.stringify(userSetting));
    localStorage.setItem("stockList", "[]");
    localStorage.setItem("stockpile_household", "[]");
    localStorage.setItem("stockpile_stockTags", "[]");

    await mountApp();

    expect(isWelcomeOpen()).toBe(true);
    expect(localStorage.getItem("has-onboarded")).toBeNull();
  });

  it("已有 has-onboarded 旗標時，即使沒有任何資料也不顯示", async () => {
    localStorage.setItem("has-onboarded", "true");

    await mountApp();

    expect(isWelcomeOpen()).toBe(false);
  });
});

describe("歡迎視窗寫入 has-onboarded 的時機（ISSUE-002）", () => {
  it("按 X 關閉後寫入旗標，重新載入不再顯示", async () => {
    await mountApp();

    await clickButton(""); // X 按鈕沒有文字
    expect(isWelcomeOpen()).toBe(false);
    expect(localStorage.getItem("has-onboarded")).toBe("true");

    await unmountApp();
    await mountApp();
    expect(isWelcomeOpen()).toBe(false);
  });

  it("點背景關閉後寫入旗標", async () => {
    await mountApp();

    const backdrop = container.firstElementChild as HTMLElement;
    await act(async () => backdrop.click());

    expect(isWelcomeOpen()).toBe(false);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });

  it("按「直接開始」後寫入旗標", async () => {
    await mountApp();

    await clickButton("直接開始");

    expect(isWelcomeOpen()).toBe(false);
    expect(latest.stock.isDemo).toBe(false);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });

  it("按「探索範例」進入 Demo 模式，但不寫入旗標，重新載入後仍會顯示歡迎視窗", async () => {
    await mountApp();

    await clickButton("探索範例");
    expect(isWelcomeOpen()).toBe(false);
    expect(latest.stock.isDemo).toBe(true);
    expect(localStorage.getItem("has-onboarded")).toBeNull();

    await unmountApp();
    await mountApp();
    expect(isWelcomeOpen()).toBe(true);
  });
});
