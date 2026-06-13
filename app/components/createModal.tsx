import { useState, useContext } from "react";
import { type Stock, initialStock } from "@/interfaces/stock";
import { stockType, stockUnit } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateModalProps {
  stock: Stock | null;
}

export default function CreateModal({ stock }: CreateModalProps) {
  const [newStock, setNewStock] = useState<Stock>(stock || initialStock);
  const { addStock, updateStock } = useContext(StockListContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const expectedType = typeof initialStock[id as keyof typeof initialStock];
    
    let parsedValue: string | number = value;
    if (expectedType === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setNewStock({ ...newStock, [id]: parsedValue });
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
    <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'gray', padding: '20px', borderRadius: '10px', zIndex: 10}}>
      <p>{JSON.stringify(newStock)}</p>
      <ul>
        <li>
          <label htmlFor="name">名稱</label>
          <Input type="text" id="name" value={newStock.name} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="type">類別</label>
          {/* <select name="type" id="type" value={newStock.type} onChange={handleInputChange}>
            <option value="">請選擇</option>
            {Object.entries(stockType).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select> */}
          <Select value={newStock.type} onValueChange={(value) => handleInputChange({ target: { id: 'type', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
            <SelectTrigger>
              <SelectValue placeholder="請選擇" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(stockType).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li>
          <label htmlFor="count">數量</label>
          <Input type="number" id="count" value={newStock.count} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="unit">單位</label>
          {/* <select name="unit" id="unit" value={newStock.unit} onChange={handleInputChange}>
            <option value="">請選擇</option>
            {Object.entries(stockUnit).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select> */}
          <Select value={newStock.unit} onValueChange={(value) => handleInputChange({ target: { id: 'unit', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
            <SelectTrigger>
              <SelectValue placeholder="請選擇" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(stockUnit).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li>
          <label htmlFor="expirationDate">保存期限</label>
          <Input type="date" id="expirationDate" value={newStock.expirationDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="purchaseDate">購買日期</label>
          <Input type="date" id="purchaseDate" value={newStock.purchaseDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="remark">備註</label>
          <Input type="text" id="remark" value={newStock.remark} onChange={handleInputChange} />
        </li>
        {/* for food */}
        
        <li>
          <label htmlFor="totalCalories">總熱量</label>
          <Input type="number" id="totalCalories" value={newStock.totalCalories ?? ""} onChange={handleInputChange} />
        </li>
      </ul>
      <Button onClick={handleEditStock}>{newStock.id ? "更新" : "新增"}</Button>
      <Button onClick={() => setIsModalOpen(false)}>取消</Button>
    </div>
  );
}