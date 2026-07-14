import { useState, useContext, useEffect } from "react"
import { type Stock, initialStock } from "@/interfaces/stock";
import { stockType, stockItemUnit } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

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
  }, [searchStockProps, searchStock]);

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/50 mb-6">
      <CardHeader className="pb-3 md:pb-4 border-b border-border/40">
        <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
          <span>進階篩選</span>
          <Search strokeWidth={1.5} size={20} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 md:pt-6">
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <li className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">名稱</label>
            <Input type="text" id="name" value={searchStockProps.name} onChange={handleInputChange} className="h-10 text-base" placeholder="搜尋名稱..."/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-semibold text-muted-foreground">類別</label>
            <Select value={searchStockProps.type} onValueChange={(value) => handleInputChange({ target: { id: 'type', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
              <SelectTrigger className="h-10 text-base">
                <SelectValue placeholder="所有類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有類別</SelectItem>
                {Object.entries(stockType).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="count" className="text-sm font-semibold text-muted-foreground">數量小於</label>
            <Input type="number" id="count" value={searchStockProps.count ?? ""} onChange={handleInputChange} className="h-10 text-base" placeholder="輸入數量限制"/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="unit" className="text-sm font-semibold text-muted-foreground">單位</label>
            <Select value={searchStockProps.unit} onValueChange={(value) => handleInputChange({ target: { id: 'unit', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
              <SelectTrigger className="h-10 text-base">
                <SelectValue placeholder="所有單位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有單位</SelectItem>
                {Object.entries(stockItemUnit).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="expirationDate" className="text-sm font-semibold text-muted-foreground">保存期限小於 (即將到期)</label>
            <Input type="date" id="expirationDate" value={searchStockProps.expirationDate} onChange={handleInputChange} className="appearance-none h-10 text-base"/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="purchaseDate" className="text-sm font-semibold text-muted-foreground">購買日期小於</label>
            <Input type="date" id="purchaseDate" value={searchStockProps.purchaseDate} onChange={handleInputChange} className="appearance-none h-10 text-base"/>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}