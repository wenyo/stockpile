import { useState, useContext, useEffect } from "react"
import { type Stock, initialStock } from "@/interfaces/stock";
import { stockType, stockUnit } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";

export default function SearchStock() {
  const [searchStockProps, setSearchStockProps] = useState<Stock>(initialStock)
  const { searchStock } = useContext(StockListContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSearchStockProps({ ...searchStockProps, [id]: value });
  }
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStock(searchStockProps);
    }, 1000)
    return () => {
      clearTimeout(timeoutId);
    }
  }, [searchStockProps]);

    return (
        <div>
          <ul style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
            <li>
              <label htmlFor="name">名稱</label>
              <Input type="text" id="name" value={searchStockProps.name} onChange={handleInputChange}/>
            </li>
            <li>
              <label htmlFor="type">類別</label>
              {/* <select name="type" id="type" value={searchStockProps.type} onChange={handleInputChange}>
                <option value="">請選擇</option>
                {Object.entries(stockType).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select> */}
              <Select value={searchStockProps.type} onValueChange={(value) => handleInputChange({ target: { id: 'type', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
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
              <label htmlFor="count">數量小於</label>
              <Input type="number" id="count" value={searchStockProps.count} onChange={handleInputChange}/>
            </li>
            <li>
              <label htmlFor="unit">單位</label>
              {/* <select name="unit" id="unit" value={searchStockProps.unit} onChange={handleInputChange}>
                <option value="">請選擇</option>
                {Object.entries(stockUnit).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select> */}
              <Select value={searchStockProps.unit} onValueChange={(value) => handleInputChange({ target: { id: 'unit', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
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
              <label htmlFor="expirationDate">保存期限小於</label>
              <Input type="date" id="expirationDate" value={searchStockProps.expirationDate} onChange={handleInputChange}/>
            </li>
            <li>
              <label htmlFor="purchaseDate">購買日期小於</label>
              <Input type="date" id="purchaseDate" value={searchStockProps.purchaseDate} onChange={handleInputChange}/>
            </li>
        </ul>
        </div>
  )
}