import SummaryTable from "@/components/dashboard/summaryTable"
import SurvivalAnalysis from "@/components/dashboard/survival"
import StockTypeSummary from "@/components/dashboard/stockTypeSummary"
import StockTips from "@/components/dashboard/sTockTips"

export default function Home() {
  return (
    <div className="p-4">
      <SummaryTable />
      <div className="grid grid-cols-2 gap-2">
        <SurvivalAnalysis />
        <StockTypeSummary />
      </div>
      <StockTips />
    </div>
  )
}