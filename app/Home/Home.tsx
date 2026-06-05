import { useContext, useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";
import type { Stock } from "../interfaces/stock";
import { StockListContext } from "../store/stockList";
import { ModalContext } from "../store/modal";
import CreateModal from "../component/createModal";

export default function Index() {
  const { stockList, removeStock } = useContext(StockListContext);
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const [editStock, setEditStock] = useState<Stock | null>(null);

  useEffect(() => {
    if(isModalOpen) return;
    setEditStock(null);
  }, [isModalOpen])

  return (
    <>
      <button style={{border: '1px white solid', padding: '5px 10px'}} onClick={() => setIsModalOpen(true)}>新增</button>
      {isModalOpen && <CreateModal stock={editStock} />}
      <ul>
        {stockList.map((stock) => (
          <li style={{ margin: "10px 0", display: "flex", gap: "10px" }} key={stock.id}>
            <span>{stock.name}</span>
            <span>{stock.type}</span>
            <span>{stock.count}</span>
            <span>{stock.unit}</span>
            <span>{stock.expirationDate}</span>
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