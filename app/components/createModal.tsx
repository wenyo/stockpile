import { useState, useContext } from "react";
import { type Stock, initialStock, REQUIRED_FIELDS } from "@/interfaces/stock";
import { stockType, stockUnit } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
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
    // typeof undefined is 'undefined', so we use standard checks for number fields
    
    let parsedValue: string | number | undefined = value;
    if (id === 'count' || id === 'totalCalories' || id === 'volume') {
      parsedValue = value === '' ? undefined : Number(value);
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

  const requiredDom = <span className="text-danger ml-1">*</span>;
  const checkIsRequired = (key: keyof Stock) => {
    if(newStock.type === "") return false;
    const isRequire = REQUIRED_FIELDS[newStock.type].includes(key);
    return isRequire ? requiredDom : "";
  }

  return (
    <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'gray', padding: '20px', borderRadius: '10px', zIndex: 10}}>
      <ul>
        <li>
          <label htmlFor="type">類別{requiredDom}</label>
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
          <label htmlFor="name">名稱{checkIsRequired("name")}</label>
          <Input type="text" id="name" value={newStock.name} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="count">數量{checkIsRequired("count")}</label>
          <Input type="number" id="count" value={newStock.count ?? ""} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="unit">單位{checkIsRequired("unit")}</label>
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
          <label htmlFor="volume">單件容量 (ml){checkIsRequired("volume")}</label>
          <Input type="number" id="volume" value={newStock.volume ?? ""} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="expirationDate">保存期限{checkIsRequired("expirationDate")}</label>
          <Input type="date" id="expirationDate" value={newStock.expirationDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="purchaseDate">購買日期{checkIsRequired("purchaseDate")}</label>
          <Input type="date" id="purchaseDate" value={newStock.purchaseDate} onChange={handleInputChange} />
        </li>
        <li>
          <label htmlFor="remark">備註{checkIsRequired("remark")}</label>
          <Input type="text" id="remark" value={newStock.remark} onChange={handleInputChange} />
        </li>
        
        {/* for food */}
        <li>
          <label htmlFor="totalCalories">每單位總熱量{checkIsRequired("totalCalories")}</label>
          <Input type="number" id="totalCalories" value={newStock.totalCalories ?? ""} onChange={handleInputChange} />
        </li>
      </ul>
      <Button onClick={handleEditStock}>{newStock.id ? "更新" : "新增"}</Button>
      <Button onClick={() => setIsModalOpen(false)}>取消</Button>
    </div>
  );
}