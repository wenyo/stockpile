import { useState, useContext, useEffect } from "react"
import { type Stock, initialStock } from "@/interfaces/stock";
import { stockType, stockItemUnit, stockFieldLabel } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export default function SearchStock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchStockProps, setSearchStockProps] = useState<Stock>(initialStock)
  const { searchStock } = useContext(StockListContext);
  const { feedTags } = useContext(SettingContext);

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
    <div className="mb-4 md:mb-6">
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        <Search size={14} strokeWidth={2} />
        <span>進階篩選</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isExpanded && (
        <div className="mt-3 p-4 md:p-5 bg-card/30 backdrop-blur-sm border border-border/40 rounded-xl">
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <li className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.name}</label>
            <Input type="text" id="name" value={searchStockProps.name} onChange={handleInputChange} className="h-9 text-sm" placeholder="搜尋名稱..."/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.type}</label>
            <Select value={searchStockProps.type} onValueChange={(value) => handleInputChange({ target: { id: 'type', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
              <SelectTrigger className="h-9 text-sm">
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
            <label htmlFor="count" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.count}小於</label>
            <Input type="number" id="count" value={searchStockProps.count ?? ""} onChange={handleInputChange} className="h-9 text-sm" placeholder="輸入數量限制"/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="unit" className="text-sm font-semibold text-muted-foreground">單位</label>
            <Select value={searchStockProps.unit} onValueChange={(value) => handleInputChange({ target: { id: 'unit', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
              <SelectTrigger className="h-9 text-sm">
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
            <Input type="date" id="expirationDate" value={searchStockProps.expirationDate} onChange={handleInputChange} className="appearance-none h-9 text-sm"/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="purchaseDate" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.purchaseDate}小於</label>
            <Input type="date" id="purchaseDate" value={searchStockProps.purchaseDate} onChange={handleInputChange} className="appearance-none h-9 text-sm"/>
          </li>
          <li className="flex flex-col gap-2">
            <label htmlFor="feedTagId" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.feedTagId}</label>
            <Select value={searchStockProps.feedTagId} onValueChange={(value) => handleInputChange({ target: { id: 'feedTagId', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="所有標籤" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有標籤</SelectItem>
                {feedTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>{tag.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </li>
        </ul>
        </div>
      )}
    </div>
  )
}