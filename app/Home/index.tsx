import SummaryTable from "@/components/dashboard/summaryTable";
import StatusSummary from "@/components/dashboard/statusSummary";
import ActionPlan from "@/components/dashboard/actionPlan";
import StockTypeSummary from "@/components/dashboard/stockTypeSummary";
import StockTips from "@/components/dashboard/stockTip";
import RecentStock from "@/components/dashboard/recentStock";

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <StatusSummary />
        <ActionPlan />
      </div>
      <SummaryTable />
      <StockTips />
      <StockTypeSummary />
      <RecentStock />
    </div>
  )
}