import { NavLink } from "react-router";
import { AlertCircle, Clock, RotateCw, FileQuestion, ChevronRight } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryTable() {
  const { expiredStock, missingInfoStock, expiringSoonStock, withinRotationDaysStock } = useDashboardStats();

  const metrics = [
    {
      label: "已過期",
      count: expiredStock.length,
      unit: "項",
      icon: <AlertCircle size={18} strokeWidth={2} />,
      colorClass: expiredStock.length > 0 ? "text-danger" : "text-muted-foreground/60",
      iconBg: expiredStock.length > 0 ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground",
      borderHover: "hover:border-danger/30",
    },
    {
      label: "即將到期",
      count: expiringSoonStock.length,
      unit: "項",
      icon: <Clock size={18} strokeWidth={2} />,
      colorClass: expiringSoonStock.length > 0 ? "text-warning" : "text-muted-foreground/60",
      iconBg: expiringSoonStock.length > 0 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground",
      borderHover: "hover:border-warning/30",
    },
    {
      label: "需要輪替",
      count: withinRotationDaysStock.length,
      unit: "項",
      icon: <RotateCw size={18} strokeWidth={2} />,
      colorClass: withinRotationDaysStock.length > 0 ? "text-info" : "text-muted-foreground/60",
      iconBg: withinRotationDaysStock.length > 0 ? "bg-info/10 text-info" : "bg-muted text-muted-foreground",
      borderHover: "hover:border-info/30",
    },
    {
      label: "待補資料",
      count: missingInfoStock.length,
      unit: "項",
      icon: <FileQuestion size={18} strokeWidth={2} />,
      colorClass: missingInfoStock.length > 0 ? "text-foreground" : "text-muted-foreground/60",
      iconBg: missingInfoStock.length > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
      borderHover: "hover:border-primary/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
      {metrics.map((item, idx) => (
        <NavLink key={idx} to="/stock-list" className="block group">
          <Card
            className={`h-full bg-card/40 backdrop-blur-sm border-border/50 shadow-sm transition-all duration-200 group-hover:bg-card/70 group-hover:scale-[1.01] ${item.borderHover}`}
          >
            <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between h-full gap-3">
              {/* Header: Label + Icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {item.label}
                </span>
                <div className={`p-1.5 sm:p-2 rounded-xl transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}>
                  {item.icon}
                </div>
              </div>

              {/* Number and Arrow */}
              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight tabular-nums transition-colors ${item.colorClass}`}
                  >
                    {item.count}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    {item.unit}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>
        </NavLink>
      ))}
    </div>
  );
}