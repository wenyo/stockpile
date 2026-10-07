import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export interface TagConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TagConfirmDialog({
  isOpen,
  title = "修改標籤單位確認",
  message = "已修改庫存標籤單位，會一併修改此相關資料，包含物資、標籤，確定嗎？",
  onConfirm,
  onCancel,
}: TagConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-card w-full max-w-md rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-border/40 bg-muted/20">
          <h3 className="font-bold flex items-center gap-2 text-foreground text-base">
            <span className="p-1.5 bg-warning/15 text-warning rounded-md flex items-center justify-center">
              <AlertTriangle size={18} />
            </span>
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="p-5 md:p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>

          <div className="flex justify-end gap-2.5 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="px-4"
            >
              取消
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              className="px-4"
            >
              確定修改
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
