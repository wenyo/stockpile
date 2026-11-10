import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import ImportConfirmModal from "@/components/modal/importConfirm";
import { StockListContext, StockListProvider, type StockListContextType } from "@/store/stockList";
import { SettingContext, SettingProvider } from "@/store/setting";
import type { BackupData } from "@/utils/backup";
import { userHousehold, userSetting, userStockList, userStockTags } from "../../../test/fixtures/userData";

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

async function renderWithPending(data: BackupData) {
  await act(async () => {
    root.render(
      <StockListProvider>
        <SettingProvider>
          <Probe />
          <ImportConfirmModal />
        </SettingProvider>
      </StockListProvider>
    );
  });
  await act(async () => latest.setting.setPendingImport({ fileName: "backup.json", data }));
}

async function clickButton(label: string) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === label
  );
  if (!button) throw new Error(`找不到按鈕：${label}`);
  await act(async () => button.click());
}

function summaryText() {
  return Array.from(container.querySelectorAll("dl > div")).map((row) => row.textContent);
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

describe("匯入確認視窗（ISSUE-003）", () => {
  const fullBackup: BackupData = {
    setting: userSetting,
    household: userHousehold,
    stockList: userStockList,
    stockTags: userStockTags,
  };

  it("顯示檔名與各區塊摘要", async () => {
    await renderWithPending(fullBackup);

    expect(container.textContent).toContain("backup.json");
    expect(summaryText()).toEqual([
      "物資1 項",
      "家庭成員1 位",
      "標籤1 個",
      "目標天數45 天",
      "輪替天數120 天",
    ]);
  });

  it("檔案沒有的區塊標示為維持現有資料", async () => {
    await renderWithPending({ stockList: userStockList });

    expect(summaryText()).toEqual([
      "物資1 項",
      "家庭成員維持現有資料",
      "標籤維持現有資料",
      "目標天數維持現有資料",
      "輪替天數維持現有資料",
    ]);
  });

  it("按「確認匯入」後才覆蓋資料並寫入 localStorage", async () => {
    await renderWithPending(fullBackup);

    expect(latest.stock.stockList).toEqual([]);
    expect(latest.setting.household).toEqual([]);

    await clickButton("確認匯入");

    expect(latest.stock.stockList).toEqual(userStockList);
    expect(latest.setting.household).toEqual(userHousehold);
    expect(latest.setting.stockTags).toEqual(userStockTags);
    expect(latest.setting.setting).toEqual(userSetting);
    expect(latest.setting.pendingImport).toBeNull();

    expect(JSON.parse(localStorage.getItem("stockList") ?? "[]")).toEqual(userStockList);
    expect(JSON.parse(localStorage.getItem("stockpile_household") ?? "[]")).toEqual(userHousehold);
    expect(JSON.parse(localStorage.getItem("stockpile_stockTags") ?? "[]")).toEqual(userStockTags);
    expect(localStorage.getItem("has-onboarded")).toBe("true");
  });

  it("按「取消」時不變更任何資料", async () => {
    await renderWithPending(fullBackup);

    await clickButton("取消");

    expect(latest.stock.stockList).toEqual([]);
    expect(latest.setting.household).toEqual([]);
    expect(latest.setting.stockTags).toEqual([]);
    expect(latest.setting.pendingImport).toBeNull();
    expect(localStorage.getItem("has-onboarded")).toBeNull();
  });

  it("只匯入部分區塊時，其他區塊維持現有資料", async () => {
    localStorage.setItem("stockpile_household", JSON.stringify(userHousehold));
    await renderWithPending({ stockList: userStockList });

    await clickButton("確認匯入");

    expect(latest.stock.stockList).toEqual(userStockList);
    expect(latest.setting.household).toEqual(userHousehold);
  });

  it("標籤沒有單位時，依成員需求與物資補上單位", async () => {
    const { unit: _unit, ...tagWithoutUnit } = userStockTags[0];
    await renderWithPending({ stockTags: [tagWithoutUnit] });

    await clickButton("確認匯入");

    expect(latest.setting.stockTags).toEqual([{ ...tagWithoutUnit, unit: "g" }]);
  });
});
