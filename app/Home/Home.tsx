import { useContext, useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";
import type { Stock } from "../interfaces/stock";
import { stockType, stockUnit } from "../constant/stock";
import { StockListContext } from "../store/stockList";
import { ModalContext } from "../store/modal";
import CreateModal from "../component/createModal";
import SearchStock from "../component/search";

export default function Index() {
  const { stockList, showStockList, removeStock } = useContext(StockListContext);
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const [editStock, setEditStock] = useState<Stock | null>(null);
  const warningDate = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
  const warningCount = 10;

  function compareDate(date: string | undefined) {
    if (!date) return false;
    const dateObj = new Date(date).getTime();
    return dateObj > warningDate;
  }

  function compareCount(count: number | undefined) {
    if (!count) return false;
    return count > warningCount;
  }

  // sort by expirationDate, then count, and waring date & count first
  function sortStockList(a: Stock, b: Stock) {
    let sortIdx = 0;
    // expirationDate
    
    if (!compareDate(a.expirationDate) && a.expirationDate && b.expirationDate) {
      sortIdx += new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime() > 0 ? 1 : -1;
    }

    // count
    if (!compareCount(a.count) && sortIdx === 0 && a.count && b.count) {
      sortIdx += Number(a.count) > Number(b.count) ? 1 : -1;
    }
    return sortIdx;
  }

  useEffect(() => {
    if(isModalOpen) return;
    setEditStock(null);
  }, [isModalOpen])

  return (
    <>
      <button style={{border: '1px white solid', padding: '5px 10px'}} onClick={() => setIsModalOpen(true)}>新增</button>
      {isModalOpen && <CreateModal stock={editStock} />}
      <SearchStock />
      <ul>
        {stockList.filter(item => showStockList.includes(item.id)).sort(sortStockList).map((stock) => (
          <li style={{ margin: "10px 0", display: "flex", gap: "10px" }} key={stock.id}>
            <span>{stock.name}</span>
            <span>{stock.type ? stockType[stock.type] : ""}</span>
            <span className={stock.count && compareCount(stock.count) ? "" : "text-yellow-500"}>{stock.count}</span>
            <span>{stock.unit ? stockUnit[stock.unit] : ""}</span>
            <span className={stock.expirationDate && compareDate(stock.expirationDate) ? "" : "text-red-500"}>{stock.expirationDate}</span>
            <span>{stock.purchaseDate}</span>
            <span>{stock.remark}</span>
            <span>{stock.totalCalories}</span>
            <Trash2 style={{ cursor: "pointer", color: "red" }} onClick={() => removeStock(stock.id)} />
            <Edit2 style={{ cursor: "pointer", color: "blue" }} onClick={() => {setEditStock(stock); setIsModalOpen(true)}} />
          </li>
        ))}
      </ul>
    </>
  );
}