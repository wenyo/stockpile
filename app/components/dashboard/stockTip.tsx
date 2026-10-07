import { useContext } from "react";
import { Zap, ClipboardPen, CheckCircle2, ChevronRight, PackageOpen } from "lucide-react";
import { stockFieldLabel } from "@/constant/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { ModalContext } from "@/store/modal";
import { StockListContext } from "@/store/stockList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";

export default function StockTips() {
  const { stockCount, withinRotationDaysStock, expiringSoonStock, expiredStock, missingInfoStock } =
    useDashboardStats();
  const { setEditStock } = useContext(StockListContext);
  const { openModal } = useContext(ModalContext);

  const showCount = 4;

  const priorityItems = [
    ...expiredStock.map((stock) => ({
      id: `expired-${stock.id}`,
      name: stock.name,
      status: "已過期",
      badgeClass: "bg-danger/10 text-danger border-danger/25",
    })),
    ...expiringSoonStock.map((stock) => ({
      id: `expiring-${stock.id}`,
      name: stock.name,
      status: "即將到期",
      badgeClass: "bg-warning/10 text-warning border-warning/25",
    })),
    ...withinRotationDaysStock.map((stock) => ({
      id: `rotation-${stock.id}`,
      name: stock.name,
      status: "需要輪替",
      badgeClass: "bg-info/10 text-info border-info/25",
    })),
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
      {/* Card 1: 優先處理 */}
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-base sm:text-lg font-semibold flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-foreground">
              <span>優先處理清單</span>
              <Zap strokeWidth={1.8} size={20} className="text-warning" />
            </div>
            {priorityItems.length > 0 ? (
              <NavLink
                to="/stock-list"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
              >
                <span>共 {priorityItems.length} 項</span>
                <ChevronRight size={14} />
              </NavLink>
            ) : (
              <span className="text-xs font-semibold text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                狀態正常
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4 flex-1 flex flex-col justify-between">
          {priorityItems.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {priorityItems.slice(0, showCount).map((item) => (
                <li
                  key={item.id}
                  className="p-3 rounded-xl bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors flex flex-col justify-between gap-2"
                >
                  <span
                    className="font-semibold text-sm text-foreground truncate"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center justify-between pt-1 border-t border-border/20">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${item.badgeClass}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center my-auto">
              <CheckCircle2 size={32} className="text-success/70 mb-2" />
              <p className="text-sm font-semibold text-foreground">所有品項皆在安全期內</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                目前無過期、即將到期或需緊急輪替的物資
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 2: 需要補充資料 */}
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-base sm:text-lg font-semibold flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-foreground">
              <span>待補全資料</span>
              <ClipboardPen strokeWidth={1.8} size={20} className="text-primary" />
            </div>
            {missingInfoStock.length > 0 ? (
              <span className="text-xs font-bold text-foreground px-2 py-0.5 rounded-full bg-muted border border-border/40">
                {missingInfoStock.length} 項待補
              </span>
            ) : (
              <span className="text-xs font-semibold text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                資料齊全
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4 flex-1 flex flex-col justify-between">
          {stockCount === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center my-auto">
              <PackageOpen size={32} className="text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold text-foreground">目前尚無任何物資庫存</p>
              <p className="text-xs text-muted-foreground mt-0.5">點擊右下角按鈕新增物資</p>
            </div>
          ) : missingInfoStock.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {missingInfoStock.slice(0, showCount).map((item) => (
                <li
                  key={item.stock.id}
                  onClick={() => {
                    setEditStock(item.stock);
                    openModal(modalTypeConstant.STOCK);
                  }}
                  className="p-3 rounded-xl bg-muted/20 border border-border/40 hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer flex flex-col justify-between gap-2 group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate"
                      title={item.stock.name}
                    >
                      {item.stock.name}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </div>
                  <div className="pt-1 border-t border-border/20">
                    <span className="text-[11px] text-muted-foreground truncate block">
                      缺少: {item.missingFields.map((f) => stockFieldLabel[f as keyof typeof stockFieldLabel] || f).join("、")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center my-auto">
              <CheckCircle2 size={32} className="text-success/70 mb-2" />
              <p className="text-sm font-semibold text-foreground">所有物資資料皆已完善</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                品項數值、單位與保存期限皆已完整建立
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}