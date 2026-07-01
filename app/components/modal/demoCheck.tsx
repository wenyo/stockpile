import { X, CirclePlay } from 'lucide-react';
import { useContext } from "react";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";

export default function DemoCheckModal() {
  const { startFromClearingData, startFromDemoData } = useContext(StockListContext);
  const { closeModal } = useContext(ModalContext);
  
    function handleStart() {
      startFromClearingData();
      closeModal();
    }
  
    function handleDemo() {
      startFromDemoData();
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
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <CirclePlay size={22} className="text-primary" />
            範例 Demo
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="mb-2">來看看能撐幾天。</p>
          <p className="mb-2 text-muted-foreground">建立自己的備戰清單，隨時掌握目前的準備狀況。</p>

          <div className="mt-4 bg-muted/50 p-4 rounded-lg relative">
            <p className="mb-2">開始建立自己的物資清單</p>
            <p className="mb-2 text-muted-foreground">從零開始建立自己的物資清單。</p>
            <Button className="absolute h-3/5 top-2/10 right-4 w-25" onClick={handleStart}>直接開始</Button>
          </div>

          <div className="mt-4 bg-muted/50 p-4 rounded-lg relative">
            <p className="mb-2">使用範例作為初始清單</p>
            <p className="mb-2 text-muted-foreground">使用範例資料，並可自行修改。</p>
            <Button className="absolute h-3/5 top-2/10 right-4 w-25" variant="outline" onClick={handleDemo}>使用目前資料</Button>
          </div>
        </div>
      </div>
    </div>
  )
}