import SummaryTable from "@/components/dashboard/summaryTable";
import StatusSummary from "@/components/dashboard/statusSummary";
import ActionPlan from "@/components/dashboard/actionPlan";
import StockRisk from "@/components/dashboard/stockRisk";
import StockTips from "@/components/dashboard/stockTip";

export default function Home() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2">
           <StatusSummary />
        </div>
        <div className="xl:col-span-1">
           <ActionPlan />
        </div>
      </div>
      <SummaryTable />
      <StockTips />
      <StockRisk />
    </div>
  )
}