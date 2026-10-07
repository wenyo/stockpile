import SummaryTable from "@/components/dashboard/summaryTable";
import StatusSummary from "@/components/dashboard/statusSummary";
import StockRisk from "@/components/dashboard/stockRisk";
import StockTips from "@/components/dashboard/stockTip";

export default function Home() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-3.5 sm:gap-4 md:gap-6">
      <StatusSummary />
      <StockRisk />
      <SummaryTable />
      <StockTips />
    </div>
  );
}