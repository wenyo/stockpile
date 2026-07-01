import type { Stock, StockStatus } from "@/interfaces/stock";
import { WARNING_COUNT, WARNING_DAYS } from "@/constant/stock";

function isWithinWarningPeriod(date: string | undefined) {
  if (!date) return false;
  const warningDate = Date.now() + WARNING_DAYS * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() <= warningDate;
}

function isLowCount(count: number | undefined) {
  if (count === undefined) return false;
  return Number(count) <= WARNING_COUNT;
}

export function getStockStatus(stock: Stock): StockStatus {
  const isExpired = !!stock.expirationDate && new Date(stock.expirationDate).getTime() < Date.now();
  const isExpiringSoon = !isExpired && isWithinWarningPeriod(stock.expirationDate);
  const isLowStock = isLowCount(stock.count);

  return { isExpired, isExpiringSoon, isLowStock };
}

export function getStockPriority(stock: Stock): number {
  const { isExpired, isExpiringSoon, isLowStock } = getStockStatus(stock);
  if (isExpired) return 0;
  if (isExpiringSoon) return 1;
  if (isLowStock) return 2;
  return 3;
}

export function sortStockList(a: Stock, b: Stock) {
  const priorityDiff = getStockPriority(a) - getStockPriority(b);
  if (priorityDiff !== 0) return priorityDiff;

  if (a.expirationDate && b.expirationDate) {
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  }
  if (a.count !== undefined && b.count !== undefined) {
    return Number(a.count) - Number(b.count);
  }
  return 0;
}