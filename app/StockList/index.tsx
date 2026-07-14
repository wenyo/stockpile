import { useContext, useState } from "react";
import { X, Edit2, Plus, Calendar, AlertTriangle, Package2, ChevronDown } from "lucide-react";
import type { Stock } from "@/interfaces/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { stockType, stockItemUnit, stockUnit, WARNING_COUNT, stockFieldLabel } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchStock from "@/components/search";
import { getStockStatus, sortStockList } from "@/utils/stock";

export default function Index() {
  const { stockList, showStockList, setDeleteStock, setEditStock } = useContext(StockListContext);
  const { openModal } = useContext(ModalContext);

  const visibleStockList = stockList
    .filter((item) => showStockList.includes(item.id))
    .sort(sortStockList);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">物資列表</h1>
        <Button onClick={() => openModal(modalTypeConstant.STOCK)} className="flex items-center gap-1">
          <Plus size={18} /> 新增物資
        </Button>
      </div>

      <SearchStock />

      <ul className="flex flex-col divide-y divide-border/50 border-y border-border/50 md:hidden">
        {visibleStockList.map((stock) => (
          <MobileStockRow
            key={stock.id}
            stock={stock}
            onEdit={() => { setEditStock(stock); openModal(modalTypeConstant.STOCK); }}
            onDelete={() => { setDeleteStock(stock); openModal(modalTypeConstant.DELETE_CHECK); }}
          />
        ))}
      </ul>

      <ul className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleStockList.map((stock) => {
          const { isExpired, isExpiringSoon, isLowStock } = getStockStatus(stock);

          return (
            <li key={stock.id}>
              <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-colors flex flex-col relative group">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => { setEditStock(stock); openModal(modalTypeConstant.STOCK); }} className="cursor-pointer p-1.5 bg-muted/80 rounded-md hover:bg-muted text-info"><Edit2 size={16} /></button>
                  <button onClick={() => { setDeleteStock(stock); openModal(modalTypeConstant.DELETE_CHECK); }} className="cursor-pointer p-1.5 bg-danger/10 rounded-md hover:bg-danger/20 text-danger"><X size={16} /></button>
                </div>

                <CardHeader className="pb-3 flex flex-row justify-between items-start pt-5">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-xl font-bold pr-14 leading-tight">{stock.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {stock.type && <Badge variant="secondary" className="opacity-80">{stockType[stock.type]}</Badge>}
                      {isLowStock && <Badge variant="outline" className="flex items-center gap-1 bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"><AlertTriangle size={12} />庫存低於 {WARNING_COUNT}</Badge>}
                      {isExpiringSoon && <Badge variant="destructive" className="flex items-center gap-1 text-warning"><Calendar size={12} />即將到期</Badge>}
                      {isExpired && <Badge variant="destructive" className="flex items-center gap-1 text-danger"><Calendar size={12} />已過期</Badge>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 pt-2">
                  <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/40">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Package2 size={12} /> 總量</span>
                      <span className={`text-lg font-bold ${isLowStock ? "text-warning" : "text-foreground"}`}>
                        {stock.count ?? "-"} <span className="text-sm font-normal text-muted-foreground">{stock.unit ? stockItemUnit[stock.unit] : ""}</span>
                      </span>
                    </div>

                    {stock.volume && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium">單件容量</span>
                        <span className="text-base font-semibold text-foreground">
                          {stock.volume} <span className="text-sm font-normal text-muted-foreground">{stockUnit[stock.volumeUnit as keyof typeof stockUnit]}</span>
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
                        <span className="text-xs text-muted-foreground font-medium">{stockFieldLabel.expirationDate}</span>
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
                        <span className="text-xs text-muted-foreground font-medium">{stockFieldLabel.remark}</span>
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

      {visibleStockList.length === 0 && (
        <div className="py-12 md:py-20 text-center flex flex-col items-center opacity-70">
          <Package2 size={40} className="text-muted-foreground mb-4" />
          <p className="text-lg md:text-xl font-medium text-muted-foreground">目前沒有物資，或查無結果</p>
        </div>
      )}
    </div>
  );
}

type MobileStockRowProps = {
  stock: Stock;
  onEdit: () => void;
  onDelete: () => void;
};

function MobileStockRow({ stock, onEdit, onDelete }: MobileStockRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { isExpired, isExpiringSoon, isLowStock } = getStockStatus(stock);
  const statusColor = isExpired ? "bg-danger" : isExpiringSoon || isLowStock ? "bg-warning" : "bg-transparent";

  return (
    <li className="bg-card/30">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-2.5 px-3 py-3 text-left active:bg-muted/40"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor}`} aria-hidden />

        <span className="flex-1 min-w-0">
          <span className="block font-medium truncate">{stock.name}</span>
          {(isExpired || isExpiringSoon || isLowStock) && (
            <span className="flex gap-1.5 mt-0.5">
              {isExpired && <span className="text-xs text-danger font-medium">已過期</span>}
              {!isExpired && isExpiringSoon && <span className="text-xs text-warning font-medium">即將到期</span>}
              {isLowStock && <span className="text-xs text-warning font-medium">庫存低於 {WARNING_COUNT}</span>}
            </span>
          )}
        </span>

        <span className="text-sm font-semibold shrink-0">
          {stock.count ?? "-"}
          <span className="text-xs font-normal text-muted-foreground ml-0.5">{stock.unit ? stockItemUnit[stock.unit] : ""}</span>
        </span>

        <ChevronDown size={16} className={`shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 pl-6 flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap gap-1.5">
            {stock.type && <Badge variant="secondary" className="opacity-80">{stockType[stock.type]}</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {stock.volume && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">單件容量</span>
                <span className="font-medium">{stock.volume} {stock.volumeUnit}</span>
              </div>
            )}
            {stock.totalCalories && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">每單位熱量</span>
                <span className="font-medium">{stock.totalCalories} kcal</span>
              </div>
            )}
            {stock.expirationDate && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{stockFieldLabel.expirationDate}</span>
                <span className={isExpiringSoon ? "text-danger font-semibold" : "font-medium"}>{stock.expirationDate}</span>
              </div>
            )}
            {stock.purchaseDate && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">購買日</span>
                <span className="font-medium">{stock.purchaseDate}</span>
              </div>
            )}
          </div>

          {stock.remark && (
            <div className="pt-1.5 border-t border-border/40">
              <span className="text-xs text-muted-foreground block">{stockFieldLabel.remark}</span>
              <span className="font-medium">{stock.remark}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={onEdit} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-muted/80 rounded-md text-info">
              <Edit2 size={14} /> 編輯
            </button>
            <button onClick={onDelete} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-danger/10 rounded-md text-danger">
              <X size={14} /> 刪除
            </button>
          </div>
        </div>
      )}
    </li>
  );
}