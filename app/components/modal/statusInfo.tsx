import { X, Info, CheckCircle2 } from 'lucide-react';
import { useContext } from "react";
import { ModalContext } from "@/store/modal";
import { preparednessLevels } from "@/constant/stock";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function StatusInfoModal() {
  const { setting, progressPercent } = useDashboardStats();
  const { closeModal } = useContext(ModalContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
      <div 
        className="bg-card w-full max-w-lg rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Info size={22} className="text-primary" />
            備戰狀態分級說明
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-sm text-muted-foreground -mt-1">
            依「目前準備天數 ÷ 目標天數」的達成率判定等級。以你目前設定的目標
            <span className="font-semibold text-foreground"> {setting?.targetDays || 30} 天</span>
            換算，各等級對應天數如下：
          </p>
          <div className="rounded-lg border border-border/60 overflow-hidden mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs">
                <th className="text-left font-medium px-3 py-2">等級</th>
                <th className="text-left font-medium px-3 py-2">達成率</th>
                <th className="text-left font-medium px-3 py-2">對應天數</th>
              </tr>
            </thead>
            <tbody>
              {preparednessLevels.map((level, index) => {
                const minDays = Math.round(((setting?.targetDays || 30) * level.minPercentage) / 100);
                const isCurrent =
                  progressPercent >= level.minPercentage &&
                  (index === 0 || progressPercent < preparednessLevels[index - 1].minPercentage);

                return (
                  <tr
                    key={level.label}
                    className={`border-t border-border/40 ${isCurrent ? "bg-muted/40" : ""}`}
                  >
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${level.className}`}>
                        <span className={`w-2 h-2 rounded-full ${level.bgClassName}`} aria-hidden />
                        {level.label}
                        {isCurrent && (
                          <CheckCircle2 size={13} className={level.className} aria-label="目前等級" />
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{level.minPercentage}% 以上</td>
                    <td className="px-3 py-2.5 font-medium">{minDays} 天以上</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  )
}