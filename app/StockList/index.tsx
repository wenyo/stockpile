import { useContext, useState, useEffect } from "react";
import { X, Edit2, Plus, Calendar, AlertTriangle, Package2 } from "lucide-react";
import type { Stock } from "@/interfaces/stock";
import { stockType, stockUnit } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchStock from "@/components/search";

export default function Index() {
  const { stockList, showStockList, removeStock, setEditStock } = useContext(StockListContext);
  const { isModalOpen, openModal } = useContext(ModalContext);
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
      sortIdx += Number(a.count) >= Number(b.count) ? 1 : -1;
    }
    return sortIdx;
  }

  useEffect(() => {
    if(isModalOpen) return;
    setEditStock(null);
  }, [isModalOpen])

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">物資列表</h1>
        <Button onClick={() => openModal("create")} className="flex items-center gap-1">
          <Plus size={18} /> 新增物資
        </Button>
      </div>
      
      <SearchStock />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stockList.filter(item => showStockList.includes(item.id)).sort(sortStockList).map((stock) => {
          const isLowStock = stock.count !== undefined && !compareCount(stock.count);
          const isExpired = stock.expirationDate && new Date(stock.expirationDate).getTime() < new Date().getTime();
          const isExpiringSoon = stock.expirationDate && !isExpired && compareDate(stock.expirationDate);
          
          return (
            <li key={stock.id}>
              <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-colors flex flex-col relative group">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => {setEditStock(stock); openModal("edit")}} className="p-1.5 bg-muted/80 rounded-md hover:bg-muted text-info"><Edit2 size={16} /></button>
                  <button onClick={() => removeStock(stock.id)} className="p-1.5 bg-danger/10 rounded-md hover:bg-danger/20 text-danger"><X size={16} /></button>
                </div>
                
                <CardHeader className="pb-3 flex flex-row justify-between items-start pt-5">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-xl font-bold pr-14 leading-tight">{stock.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {stock.type && <Badge variant="secondary" className="opacity-80">{stockType[stock.type]}</Badge>}
                      {isLowStock && <Badge variant="outline" className="flex items-center gap-1 bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"><AlertTriangle size={12}/>庫存低於 {warningCount}</Badge>}
                      {isExpiringSoon && <Badge variant="destructive" className="flex items-center gap-1 text-warning"><Calendar size={12}/>即將到期</Badge>}
                      {isExpired && <Badge variant="destructive" className="flex items-center gap-1 text-danger"><Calendar size={12}/>已過期</Badge>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 pt-2">
                   <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/40">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Package2 size={12}/> 總量</span>
                        <span className={`text-lg font-bold ${isLowStock ? "text-warning" : "text-foreground"}`}>
                           {stock.count ?? "-"} <span className="text-sm font-normal text-muted-foreground">{stock.unit ? stockUnit[stock.unit] : ""}</span>
                        </span>
                      </div>
                      
                      {stock.volume && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium">單件容量</span>
                          <span className="text-base font-semibold text-foreground">
                            {stock.volume} <span className="text-sm font-normal text-muted-foreground">ml</span>
                          </span>
                        </div>
                      )}
                      
                      {stock.totalCalories && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground font-medium">每單位熱量</span>
                          <span className="text-base font-semibold text-foreground">
                            {stock.totalCalories} <span className="text-sm font-normal text-muted-foreground">kcal</span>
                          </span>
                        </div>
                      )}
                   </div>

                   <div className="grid grid-cols-2 gap-2 text-sm">
                      {stock.expirationDate && (
                         <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground font-medium">到期日</span>
                           <span className={isExpiringSoon ? "text-danger font-semibold" : "font-medium"}>{stock.expirationDate}</span>
                         </div>
                      )}
                      {stock.purchaseDate && (
                         <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground font-medium">購買日</span>
                           <span className="font-medium">{stock.purchaseDate}</span>
                         </div>
                      )}
                      {stock.remark && (
                        <div className="flex flex-col col-span-2 mt-1 pt-2 border-t border-border/40">
                           <span className="text-xs text-muted-foreground font-medium">備註</span>
                           <span className="font-medium text-foreground">{stock.remark}</span>
                        </div>
                      )}
                   </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
      {stockList.filter(item => showStockList.includes(item.id)).length === 0 && (
         <div className="py-20 text-center flex flex-col items-center opacity-70">
           <Package2 size={48} className="text-muted-foreground mb-4" />
           <p className="text-xl font-medium text-muted-foreground">目前沒有物資，或查無結果</p>
         </div>
      )}
    </div>
  );
}