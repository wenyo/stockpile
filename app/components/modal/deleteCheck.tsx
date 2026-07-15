import { X } from 'lucide-react';
import { useContext } from "react";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button"

export default function DeleteCheck() {
  const { closeModal } = useContext(ModalContext);
  const { deleteStock, removeStock } = useContext(StockListContext);
  const { deleteHousehold, removeHousehold } = useContext(SettingContext);
  const deleteConfig = deleteStock ? 
    { name: deleteStock.name, id: deleteStock.id, remove: removeStock } : 
    deleteHousehold ? 
    { name: deleteHousehold.name, id: deleteHousehold.id, remove: removeHousehold } : null;

  function handleDelete() {
    if (deleteConfig) {
      deleteConfig.remove(deleteConfig.id);
    }
    closeModal();
  }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
      <div 
        className="bg-card w-full max-w-lg rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-danger">
            <X size={22} className="p-1.5 bg-danger/10 rounded-md hover:bg-danger/20" />
            刪除確認
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p>確定要刪除<span className="font-bold text-primary mx-2">{deleteConfig?.name}</span>嗎？</p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => closeModal()}>取消</Button>
            <Button onClick={handleDelete}>刪除</Button>
          </div>
        </div>
      </div>
    </div>
  )
}