import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { X, Smartphone } from "lucide-react";
import { useContext } from "react";
import pwaAndroidImg from "@/asset/images/pwa-android.jpeg";
import pwaIosImg from "@/asset/images/pwa-ios.jpeg";

export default function PwaNoticeModal() {
  const { closeModal } = useContext(ModalContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
      <div 
        className="bg-card w-full max-w-lg rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Smartphone size={22} className="text-primary" />
            什麼是 PWA?
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-4 text-base">
            PWA 是一種免安裝的網頁 App，可直接加入手機主畫面使用。支援<span className="text-primary text-bold">離線操作</span>，在緊急情況發生時，即使沒有網路也能隨時查看與管理資料。
          </div>
          <div className="flex justify-between gap-4 max-w-full">
            <img src={pwaAndroidImg} alt="Home Screen" className="w-1/2 rounded-md shadow-sm" />
            <img src={pwaIosImg} alt="Home Screen" className="w-1/2 rounded-md shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}