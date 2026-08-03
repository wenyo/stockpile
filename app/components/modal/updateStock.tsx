import { useContext, useState } from "react";
import { X, Plus, Trash2, Package } from "lucide-react";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stockType, stockItemUnit } from "@/constant/stock";
import { toast } from "sonner";
import { modalTypeConstant } from "@/interfaces/modal";

type ActionType = "use" | "add";

interface StockRow {
  id: string;
  action: ActionType;
  type: string;
  stockId: string;
  count: string;
}

export default function UpdateStockModal() {
  const { stockList, updateStock, removeStock } = useContext(StockListContext);
  const { closeModal, modalType } = useContext(ModalContext);

  const [rows, setRows] = useState<StockRow[]>([
    { id: Date.now().toString(), action: "use", type: "all", stockId: "", count: "" }
  ]);

  if (modalType !== modalTypeConstant.UPDATE_STOCK) return null;

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), action: "use", type: "all", stockId: "", count: "" }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof StockRow, value: string) => {
    if (field === "type") {
      setRows(rows.map(r => r.id === id ? { ...r, type: value, stockId: "" } : r));
    } else {
      setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    }
  };

  const handleSubmit = () => {
    const invalidRow = rows.find(r => !r.stockId || !r.count || isNaN(Number(r.count)) || Number(r.count) <= 0);
    if (invalidRow) {
      toast.error("請確認所有欄位皆已正確填寫，且數量需大於 0");
      return;
    }

    // Process updates
    rows.forEach(row => {
      const stock = stockList.find(s => s.id === row.stockId);
      if (stock) {
        const rowCount = Number(row.count);
        let newCount = stock.count || 0;
        if (row.action === "use") {
          newCount -= rowCount;
        } else {
          newCount += rowCount;
        }

        if (newCount <= 0 && row.action === "use") {
          removeStock(stock.id);
        } else {
          updateStock(stock.id, { ...stock, count: newCount });
        }
      }
    });

    toast.success("庫存更新成功！");
    closeModal();
  };

  const getFilteredStocks = (type: string) => {
    if (type === "all") return stockList;
    return stockList.filter(s => s.type === type);
  };

  const getStockLabel = (stockId: string) => {
    const stock = stockList.find(s => s.id === stockId);
    if (!stock) return "";
    const unit = stock.unit ? (stockItemUnit[stock.unit] || stock.unit) : "";
    return `${stock.name} (剩餘 ${stock.count} ${unit})`;
  };

  const calculateRemaining = (stockId: string, action: ActionType, countInput: string) => {
    const stock = stockList.find(s => s.id === stockId);
    if (!stock) return null;
    const currentCount = stock.count || 0;
    const inputCount = Number(countInput) || 0;
    const newCount = action === "use" ? currentCount - inputCount : currentCount + inputCount;
    const unit = stock.unit ? (stockItemUnit[stock.unit] || stock.unit) : "";
    return `計算後剩餘: ${Math.max(0, newCount)} ${unit}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Package className="text-primary" /> 批次更新庫存 (出庫/入庫)
          </h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-full hover:bg-muted">
            <X size={20} className="text-muted-foreground" />
          </Button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          <div className="bg-primary/10 text-primary-foreground text-sm p-3 rounded-lg flex gap-2">
            💡 提示：購入或補充物資後，請更新庫存；已拆封且正在使用的物資，建議不要列入防災庫存喔！
          </div>

          <div className="flex flex-col gap-6">
            {rows.map((row, index) => (
              <div key={row.id} className="flex flex-col gap-3 p-4 bg-muted/30 rounded-xl relative border border-border/50">
                {rows.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-background border border-border text-muted-foreground hover:text-danger hover:border-danger transition-colors z-10"
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
                
                <div className="flex gap-2 w-full">
                  <div className="w-[100px] shrink-0">
                    <Select value={row.action} onValueChange={(val) => updateRow(row.id, "action", val)}>
                      <SelectTrigger className="font-semibold text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="use">使用庫存</SelectItem>
                        <SelectItem value="add">補充庫存</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={row.type} onValueChange={(val) => updateRow(row.id, "type", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="篩選類別" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有類別</SelectItem>
                        {Object.entries(stockType).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="w-full">
                  <Select value={row.stockId} onValueChange={(val) => updateRow(row.id, "stockId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇物資" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredStocks(row.type).length === 0 ? (
                        <SelectItem value="__none__" disabled>目前沒有庫存</SelectItem>
                      ) : (
                        getFilteredStocks(row.type).map(stock => {
                          const unit = stock.unit ? (stockItemUnit[stock.unit] || stock.unit) : "";
                          const dateInfo = stock.expirationDate ? ` - ${stock.expirationDate} 到期` : "";
                          return (
                            <SelectItem key={stock.id} value={stock.id}>
                              {stock.name} (剩餘 {stock.count} {unit}){dateInfo}
                            </SelectItem>
                          )
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="數量" 
                      value={row.count} 
                      onChange={(e) => updateRow(row.id, "count", e.target.value)}
                      className="w-full"
                    />
                    <span className="text-muted-foreground w-12 shrink-0">
                      {row.stockId ? (stockItemUnit[stockList.find(s => s.id === row.stockId)?.unit || ""] || stockList.find(s => s.id === row.stockId)?.unit) : ""}
                    </span>
                  </div>
                  {row.stockId && row.count && (
                    <div className={`text-xs mt-1 font-medium ${row.action === 'use' && (stockList.find(s => s.id === row.stockId)?.count || 0) - Number(row.count) <= 0 ? 'text-danger' : 'text-primary'}`}>
                      {calculateRemaining(row.stockId, row.action, row.count)}
                      {row.action === 'use' && (stockList.find(s => s.id === row.stockId)?.count || 0) - Number(row.count) <= 0 && " (庫存將被清空)"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground" onClick={addRow}>
            <Plus className="mr-2 h-4 w-4" /> 新增一筆異動
          </Button>
        </div>

        <div className="p-4 md:p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/10">
          <Button variant="ghost" onClick={closeModal} className="text-muted-foreground">取消</Button>
          <Button onClick={handleSubmit} className="px-6">確認更新</Button>
        </div>
      </div>
    </div>
  );
}
