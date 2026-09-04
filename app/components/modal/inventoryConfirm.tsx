import { X, ClipboardCheck, CheckCircle2, Clock } from "lucide-react";
import { useContext } from "react";
import { ModalContext } from "@/store/modal";
import { StockListContext } from "@/store/stockList";
import { Button } from "@/components/ui/button";

export default function InventoryConfirmModal() {
  const { closeModal } = useContext(ModalContext);
  const { relativeTime, updateLastInventoryConfirmedAt } = useContext(StockListContext);

  const handleConfirm = () => {
    updateLastInventoryConfirmedAt();
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardCheck size={22} className="text-primary" />
            確認庫存
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <ClipboardCheck size={32} className="text-primary" />
          </div>
          
          <h3 className="text-lg font-bold text-foreground mb-2">更新盤點紀錄</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm">確認目前庫存與實際狀況一致？</p>
          
          {relativeTime?.status && (
            <div className="w-full flex items-center justify-between bg-muted/30 border border-border/40 rounded-lg p-3 mb-6 shadow-sm">
              <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Clock size={16} className="text-primary/70" /> 上次盤點
              </span>
              <span className={`text-sm font-semibold ${{success: 'text-success', warning: 'text-warning', danger: 'text-danger'}[relativeTime.status as 'success' | 'warning' | 'danger']}`}>{relativeTime.timeFormat}</span>
            </div>
          )}

          <div className="flex w-full gap-3 mt-2">
            <Button variant="outline" onClick={() => closeModal()} className="flex-1 py-5 shadow-sm border-border/60">
              取消
            </Button>
            <Button variant="default" onClick={() => handleConfirm()} className="flex-1 py-5 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 size={18} /> 是的，數量一致
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}