import { X, Upload, TriangleAlert } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import { StockListContext } from "@/store/stockList";
import { SettingContext, migrateTagsWithUnits } from "@/store/setting";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { markOnboarded } from "@/utils/onboarding";

const KEEP_CURRENT = "維持現有資料";

function formatDays(days: number | undefined) {
  return typeof days === "number" ? `${days} 天` : "未提供";
}

export default function ImportConfirmModal() {
  const { closeModal } = useContext(ModalContext);
  const { replaceStockList } = useContext(StockListContext);
  const { pendingImport, setPendingImport, replaceSetting, replaceHousehold, replaceStockTags } = useContext(SettingContext);

  const data = pendingImport?.data;

  const summary = [
    { label: "物資", value: data?.stockList ? `${data.stockList.length} 項` : null },
    { label: "家庭成員", value: data?.household ? `${data.household.length} 位` : null },
    { label: "標籤", value: data?.stockTags ? `${data.stockTags.length} 個` : null },
    { label: "目標天數", value: data?.setting ? formatDays(data.setting.targetDays) : null },
    { label: "輪替天數", value: data?.setting ? formatDays(data.setting.rotationDays) : null },
  ];

  function handleCancel() {
    setPendingImport(null);
    closeModal();
  }

  function handleConfirm() {
    if (!data) {
      handleCancel();
      return;
    }
    if (data.setting) replaceSetting(data.setting);
    if (data.household) replaceHousehold(data.household);
    if (data.stockList) replaceStockList(data.stockList);
    if (data.stockTags) {
      const { migratedTags } = migrateTagsWithUnits(
        data.stockTags,
        data.household || [],
        data.stockList || []
      );
      replaceStockTags(migratedTags);
    }
    markOnboarded();
    toast.success("資料匯入成功");
    setPendingImport(null);
    closeModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleCancel}>
      <div
        className="bg-card w-full max-w-lg rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Upload size={22} className="text-primary" />
            確認匯入資料
          </h2>
          <Button variant="ghost" size="icon" onClick={handleCancel} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8" aria-label="關閉">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <p className="text-sm text-muted-foreground">檔案</p>
          <p className="font-semibold text-foreground break-all">{pendingImport?.fileName}</p>

          <dl className="mt-4 bg-muted/50 p-4 rounded-lg flex flex-col gap-2">
            {summary.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className={value ? "font-semibold text-foreground" : "text-muted-foreground"}>{value ?? KEEP_CURRENT}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 bg-warning/10 text-warning p-3 rounded-lg text-sm font-medium flex items-start gap-2">
            <TriangleAlert size={16} className="shrink-0 mt-0.5" />
            <p>匯入後會完全覆蓋上列區塊目前的資料，而且無法復原。</p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground">取消</Button>
            <Button onClick={handleConfirm} className="px-6">確認匯入</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
