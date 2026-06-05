import { useState, useContext } from "react";
import { type Stock, initialStock } from "../interfaces/stock";
import { StockListContext } from "../store/stockList";
import { ModalContext } from "../store/modal";

interface CreateModalProps {
  stock: Stock | null;
}

export default function CreateModal({ stock }: CreateModalProps) {
  const [newStock, setNewStock] = useState<Stock>(stock || initialStock);
  const { addStock, updateStock } = useContext(StockListContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewStock({ ...newStock, [id]: value });
  };

  const handleEditStock = () => {
    // Generate a unique ID if it doesn't have one or if it's a new item
    const stockToAdd = { ...newStock, id: newStock.id || Date.now().toString() };
    newStock.id ? updateStock(stockToAdd.id, stockToAdd) : addStock(stockToAdd);
    
    // Optionally reset the form
    setNewStock(initialStock);

    // close modal
    setIsModalOpen(false);
  };

  return (
    <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'gray', padding: '20px', borderRadius: '10px', zIndex: 1000}}>
      <ul>
        <li>
          <label htmlFor="name">名稱</label>
          <input type="text" id="name" value={newStock.name} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="type">類別</label>
          <select name="type" id="type" value={newStock.type} onChange={handleInputChange}>
            <option value="">請選擇</option>
            <option value="food">食物</option>
            <option value="medical">醫療</option>
            <option value="tool">工具</option>
            <option value="water">水</option>
            <option value="other">其他</option>
          </select>
        </li>
        <li>
          <label htmlFor="count">數量</label>
          <input type="number" id="count" value={newStock.count} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="unit">單位</label>
          <select name="unit" id="unit" value={newStock.unit} onChange={handleInputChange}>
            <option value="">請選擇</option>
            <option value="g">g</option>
            <option value="pack">包</option>
            <option value="can">罐</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="piece">個</option>
          </select>
        </li>
        <li>
          <label htmlFor="expirationDate">保存期限</label>
          <input type="date" id="expirationDate" value={newStock.expirationDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="purchaseDate">購買日期</label>
          <input type="date" id="purchaseDate" value={newStock.purchaseDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="remark">備註</label>
          <input type="text" id="remark" value={newStock.remark} onChange={handleInputChange} />
        </li>
        {/* for food */}
        
        <li>
          <label htmlFor="totalCalories">總熱量</label>
          <input type="number" id="totalCalories" value={newStock.totalCalories ?? ""} onChange={handleInputChange} />
        </li>
      </ul>
      <button style={{border: '1px white solid', padding: '5px 10px'}} onClick={handleEditStock}>{newStock.id ? "更新" : "新增"}</button>
      <button style={{border: '1px white solid', padding: '5px 10px'}} onClick={() => setIsModalOpen(false)}>取消</button>
    </div>
  );
}