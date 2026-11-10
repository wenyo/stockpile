import { describe, expect, it } from "vitest";

import { BACKUP_VERSION, NEWER_VERSION_MESSAGE, parseBackup } from "@/utils/backup";
import { sampleFeedTags, sampleHouseholdData, sampleStockData } from "@/constant/sampleData";
import { userHousehold, userSetting, userStockList, userStockTags } from "../../test/fixtures/userData";

const validBackup = {
  version: BACKUP_VERSION,
  setting: userSetting,
  household: userHousehold,
  stockList: userStockList,
  stockTags: userStockTags,
};

function parse(value: unknown) {
  return parseBackup(JSON.stringify(value));
}

function expectRejected(value: unknown, messagePart?: string) {
  const result = parse(value);
  expect(result.ok).toBe(false);
  if (!result.ok && messagePart) expect(result.message).toContain(messagePart);
}

describe("parseBackup（ISSUE-003）", () => {
  describe("接受", () => {
    it("完整的備份檔", () => {
      expect(parse(validBackup)).toEqual({
        ok: true,
        data: {
          setting: userSetting,
          household: userHousehold,
          stockList: userStockList,
          stockTags: userStockTags,
        },
      });
    });

    it("範例資料（含 feedPortions 與 medicineNeeds）", () => {
      const result = parse({
        version: 1,
        household: sampleHouseholdData,
        stockList: sampleStockData,
        stockTags: sampleFeedTags,
      });
      expect(result.ok).toBe(true);
    });

    it("只有部分區塊的備份檔，缺少的區塊不出現在結果中", () => {
      const result = parse({ version: 1, stockList: userStockList, household: null });
      expect(result).toEqual({ ok: true, data: { stockList: userStockList } });
    });

    it("空陣列視為有該區塊", () => {
      const result = parse({ version: 1, stockList: [], household: [], stockTags: [] });
      expect(result).toEqual({ ok: true, data: { stockList: [], household: [], stockTags: [] } });
    });

    it("舊欄位名稱 feedTags，結果改放在 stockTags", () => {
      const result = parse({ version: 1, feedTags: userStockTags });
      expect(result).toEqual({ ok: true, data: { stockTags: userStockTags } });
    });

    it("同時有 stockTags 與 feedTags 時以 stockTags 為準", () => {
      const result = parse({ version: 1, stockTags: userStockTags, feedTags: [] });
      expect(result).toEqual({ ok: true, data: { stockTags: userStockTags } });
    });

    it("數量等欄位是字串的物資（不會造成崩潰）", () => {
      const result = parse({ version: 1, stockList: [{ ...userStockList[0], count: "3" }] });
      expect(result.ok).toBe(true);
    });
  });

  describe("版本", () => {
    it("高於目前版本時拒絕，並提示更新方式", () => {
      const result = parse({ ...validBackup, version: BACKUP_VERSION + 1 });
      expect(result).toEqual({ ok: false, message: NEWER_VERSION_MESSAGE });
    });

    it.each([
      ["缺少", undefined],
      ["字串", "1"],
      ["null", null],
    ])("version 為%s時拒絕", (_, version) => {
      expectRejected({ ...validBackup, version }, "版本");
    });
  });

  describe("拒絕結構錯誤", () => {
    it("不是合法的 JSON", () => {
      const result = parseBackup("{ not json");
      expect(result.ok).toBe(false);
    });

    it.each([
      ["陣列", []],
      ["字串", "x"],
      ["null", null],
    ])("最外層是%s", (_, value) => {
      expectRejected(value);
    });

    it("stockList 是物件（ISSUES 的重現案例）", () => {
      expectRejected({ version: 1, stockList: {} }, "物資");
    });

    it("household 是字串（ISSUES 的重現案例）", () => {
      expectRejected({ version: 1, household: "x" }, "家庭成員");
    });

    it("stockTags 不是陣列", () => {
      expectRejected({ version: 1, stockTags: {} }, "標籤");
    });

    it("feedTags 不是陣列", () => {
      expectRejected({ version: 1, feedTags: "x" }, "標籤");
    });

    it("setting 是陣列", () => {
      expectRejected({ version: 1, setting: [] }, "基礎設定");
    });

    it("setting 的天數不是數字", () => {
      expectRejected({ version: 1, setting: { targetDays: "30", rotationDays: 90 } }, "天數");
    });

    it.each([
      ["不是物件", null, "第 2 筆"],
      ["缺少 id", { ...userStockList[0], id: undefined }, "id"],
      ["缺少名稱", { ...userStockList[0], name: undefined }, "名稱"],
      ["類別無法辨識", { ...userStockList[0], type: "weapon" }, "類別"],
      ["類別是物件原型上的鍵", { ...userStockList[0], type: "toString" }, "類別"],
      ["欄位是巢狀物件", { ...userStockList[0], remark: { a: 1 } }, "欄位"],
    ])("物資%s時整份拒絕", (_, badStock, messagePart) => {
      expectRejected({ ...validBackup, stockList: [userStockList[0], badStock] }, messagePart);
    });

    it.each([
      ["不是物件", "x", "第 1 筆"],
      ["缺少 id", { ...userHousehold[0], id: 1 }, "id"],
      ["缺少名稱", { ...userHousehold[0], name: null }, "名稱"],
      ["身分無法辨識", { ...userHousehold[0], identity: "alien" }, "身分"],
      ["feedPortions 不是陣列", { ...userHousehold[0], feedPortions: {} }, "需求"],
      ["feedPortions 內含 null", { ...userHousehold[0], feedPortions: [null] }, "需求"],
      ["medicineNeeds 不是陣列", { ...userHousehold[0], medicineNeeds: "x" }, "需求"],
    ])("家庭成員%s時整份拒絕", (_, badMember, messagePart) => {
      expectRejected({ ...validBackup, household: [badMember] }, messagePart);
    });

    it.each([
      ["不是物件", 1, "第 1 筆"],
      ["缺少 id", { ...userStockTags[0], id: undefined }, "id"],
      ["缺少名稱", { ...userStockTags[0], label: undefined }, "名稱"],
    ])("標籤%s時整份拒絕", (_, badTag, messagePart) => {
      expectRejected({ ...validBackup, stockTags: [badTag] }, messagePart);
    });
  });
});
