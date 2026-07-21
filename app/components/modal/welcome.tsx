import { useContext, useState } from "react";
import { X, Package } from "lucide-react";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";

export default function WelcomeModal() {
  const { setIsDemo } = useContext(StockListContext);
  const { closeModal } = useContext(ModalContext);
  const [showTour, setShowTour] = useState(true);

  function finishWelcome() {
    closeModal();
    if (showTour) {
      setTimeout(() => window.dispatchEvent(new Event("start-tour")), 300);
    }
  }

  function handleStart() {
    setIsDemo(false);
    finishWelcome();
  }

  function handleDemo() {
    setIsDemo(true);
    finishWelcome();
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
            <Package size={22} className="text-primary" />
            Stockpile 物資管理系統 👋
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="mb-2">來看看能撐幾天。</p>
          <p className="mb-2 text-muted-foreground">建立自己的備戰清單，隨時掌握目前的準備狀況。</p>

          <div className="mt-4 bg-muted/50 p-4 rounded-lg relative">
            <p className="mb-2 w-3/4">第一次使用？</p>
            <p className="mb-2 text-muted-foreground w-3/4">建立自己的物資清單</p>
            <Button className="absolute h-3/5 top-2/10 right-4 w-1/4" onClick={handleStart}>直接開始</Button>
          </div>

          <div className="mt-4 bg-muted/50 p-4 rounded-lg relative">
            <p className="mb-2 w-3/4">想先看看功能？</p>
            <p className="mb-2 text-muted-foreground w-3/4">載入一份完整的範例資料。</p>
            <Button className="absolute h-3/5 top-2/10 right-4 w-1/4" variant="outline" onClick={handleDemo}>探索範例</Button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2">
            <input 
              type="checkbox" 
              id="show-tour" 
              checked={showTour} 
              onChange={(e) => setShowTour(e.target.checked)} 
              className="w-4 h-4 rounded border-border/50 text-primary cursor-pointer accent-primary"
            />
            <label htmlFor="show-tour" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
              開始後，同時進行系統教學導覽 (推薦新手)
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}