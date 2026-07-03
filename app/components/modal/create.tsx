import { useState, useContext, useEffect } from "react";
import { X, PackagePlus, Edit } from "lucide-react";
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

export default function CreateModal() {
  const [newStock, setNewStock] = useState<Stock>(initialStock);
  const { addStock, updateStock, editStock, setEditStock } = useContext(StockListContext);
  const { closeModal } = useContext(ModalContext);

   useEffect(() => {
    return () => {
      setEditStock(null);
    }
  }, []);

  useEffect(() => {
    if (editStock) {
      setNewStock(editStock);
    }
  }, [editStock]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let parsedValue: string | number | undefined = value;
    if (id === 'count' || id === 'totalCalories' || id === 'volume') {
      parsedValue = value === '' ? undefined : Number(value);
    }

    setNewStock({ ...newStock, [id]: parsedValue });
  };

  const handleEditStock = () => {
    const stockToAdd = { ...newStock, id: newStock.id || Date.now().toString() };
    newStock.id ? updateStock(stockToAdd.id, stockToAdd) : addStock(stockToAdd);

    setNewStock(initialStock);
    closeModal();
  };

  const requiredDom = <span className="text-danger ml-1">*</span>;
  const checkIsRequired = (key: keyof Stock) => {
    if(!newStock.type) return false;
    const isRequire = REQUIRED_FIELDS[newStock.type]?.includes(key);
    return isRequire ? requiredDom : "";
  }

  const isEditing = !!newStock.id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="bg-card w-full h-dvh sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-xl border-0 sm:border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header：固定在頂部，不隨內容捲動 */}
        <div className="shrink-0 flex justify-between items-center p-4 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
            {isEditing ? <Edit size={20} className="text-info" /> : <PackagePlus size={20} className="text-primary" />}
            {isEditing ? "編輯物資" : "新增物資"}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        {/* Body：唯一會捲動的區域，用 flex-1 吃滿剩餘空間 */}
        <div className="bg-background flex-1 overflow-y-auto p-4 md:p-6">
          <ul className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-3 md:gap-y-4">
            <li className="flex flex-col gap-1.5 col-span-2">
              <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">名稱{checkIsRequired("name")}</label>
              <Input type="text" id="name" value={newStock.name} onChange={handleInputChange} className="h-10 border-border/60" placeholder="e.g. 礦泉水, 止痛藥..." />
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-semibold text-muted-foreground">類別{requiredDom}</label>
              <Select value={newStock.type} onValueChange={(value) => handleInputChange({ target: { id: 'type', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
                <SelectTrigger className="h-10 border-border/60">
                  <SelectValue placeholder="選擇分類..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stockType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="unit" className="text-sm font-semibold text-muted-foreground">單位{checkIsRequired("unit")}</label>
              <Select value={newStock.unit} onValueChange={(value) => handleInputChange({ target: { id: 'unit', value } } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)}>
                <SelectTrigger className="h-10 border-border/60">
                  <SelectValue placeholder="選擇單位..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stockUnit).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="count" className="text-sm font-semibold text-muted-foreground">數量{checkIsRequired("count")}</label>
              <Input type="number" id="count" value={newStock.count ?? ""} onChange={handleInputChange} className="h-10 border-border/60" placeholder="0" />
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="volume" className="text-sm font-semibold text-muted-foreground">容量 (ml){checkIsRequired("volume")}</label>
              <Input type="number" id="volume" value={newStock.volume ?? ""} onChange={handleInputChange} className="h-10 border-border/60" placeholder="e.g. 600" />
            </li>

            <li className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
              <label htmlFor="totalCalories" className="text-sm font-semibold text-muted-foreground">熱量 (kcal){checkIsRequired("totalCalories")}</label>
              <Input type="number" id="totalCalories" value={newStock.totalCalories ?? ""} onChange={handleInputChange} className="h-10 border-border/60" placeholder="e.g. 250" />
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="expirationDate" className="text-sm font-semibold text-muted-foreground">保存期限{checkIsRequired("expirationDate")}</label>
              <Input type="date" id="expirationDate" value={newStock.expirationDate} onChange={handleInputChange} className="h-10 border-border/60 text-sm md:text-base" />
            </li>

            <li className="flex flex-col gap-1.5">
              <label htmlFor="purchaseDate" className="text-sm font-semibold text-muted-foreground">購買日期{checkIsRequired("purchaseDate")}</label>
              <Input type="date" id="purchaseDate" value={newStock.purchaseDate} onChange={handleInputChange} className="h-10 border-border/60 text-sm md:text-base" />
            </li>

            <li className="flex flex-col gap-1.5 col-span-2">
              <label htmlFor="remark" className="text-sm font-semibold text-muted-foreground">備註{checkIsRequired("remark")}</label>
              <Input type="text" id="remark" value={newStock.remark} onChange={handleInputChange} className="h-10 border-border/60" placeholder="新增一些補充說明..." />
            </li>
          </ul>
        </div>

        {/* Footer：固定在底部，永遠看得到，不用滑到最後 */}
        <div className="shrink-0 p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border/40 bg-muted/10 flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal} className="px-6 border-border/60 hover:bg-muted/50">
            取消
          </Button>
          <Button onClick={handleEditStock} className="px-8 shadow-sm">
            {isEditing ? "儲存更新" : "確認新增"}
          </Button>
        </div>
      </div>
    </div>
  );
}