import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { frequencyType, type Tag } from "@/interfaces/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagConfirmDialog from "./tagConfirmDialog";

export interface NeedItemData {
  tagId: string;
  amount: number;
  unit?: string;
  frequencyType: string;
  frequencyValue: number;
}

export interface UnitOption {
  value: string;
  label: string;
}

export interface NeedItemCardProps {
  item: NeedItemData;
  availableTags: Tag[];
  unitOptions: UnitOption[];
  isTagLocked?: boolean;
  isRequired?: boolean;
  showRequiredAsterisk?: boolean;
  labels: {
    tagLabel: string;
    tagPlaceholder?: string;
    newTagPlaceholder?: string;
    tagHelpText: string;
    frequencyLabel: string;
    amountLabel: string;
  };
  onUpdate: <K extends keyof NeedItemData>(key: K, value: NeedItemData[K]) => void;
  onRemove: () => void;
  onCreateTag: (label: string, unit: string) => string | void;
  onUnitChangeConfirmed?: (newUnit: string) => void;
  children?: React.ReactNode;
}

export default function NeedItemCard({
  item,
  availableTags,
  unitOptions,
  isTagLocked = false,
  isRequired = true,
  showRequiredAsterisk = false,
  labels,
  onUpdate,
  onRemove,
  onCreateTag,
  onUnitChangeConfirmed,
  children,
}: NeedItemCardProps) {
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagUnit, setNewTagUnit] = useState(item.unit || unitOptions[0]?.value || "g");
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [pendingUnit, setPendingUnit] = useState<string | null>(null);

  const handleConfirmCreateTag = () => {
    const trimmed = newTagLabel.trim();
    if (!trimmed) return;
    const selectedUnit = newTagUnit || item.unit || unitOptions[0]?.value || "g";
    const createdId = onCreateTag(trimmed, selectedUnit);
    if (typeof createdId === "string" && createdId) {
      onUpdate("tagId", createdId);
    }
    onUpdate("unit", selectedUnit);
    setIsCreatingTag(false);
    setNewTagLabel("");
  };

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === item.unit) return;
    if (isTagLocked) {
      setPendingUnit(newUnit);
      return;
    }
    onUpdate("unit", newUnit);
    onUnitChangeConfirmed?.(newUnit);
  };

  const handleConfirmUnit = () => {
    if (pendingUnit) {
      onUpdate("unit", pendingUnit);
      onUnitChangeConfirmed?.(pendingUnit);
      setPendingUnit(null);
      setIsEditingUnit(false);
    }
  };

  const handleCancelUnit = () => {
    setPendingUnit(null);
  };

  const currentUnitLabel = unitOptions.find((u) => u.value === item.unit)?.label || item.unit;

  return (
    <div className="bg-muted/10 border border-border/50 rounded-xl p-4 flex flex-col gap-3 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute -top-3 -right-3 h-8 w-8 bg-background border border-border/50 text-danger hover:text-danger hover:bg-danger/10 rounded-full shadow-sm"
        onClick={onRemove}
      >
        <Trash2 size={14} />
      </Button>

      {isCreatingTag ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">建立新標籤</label>
          <div className="flex gap-2">
            <Input
              autoFocus
              className="h-9 border-border/60"
              placeholder={labels.newTagPlaceholder || "請輸入標籤名稱..."}
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirmCreateTag();
                }
              }}
              required={isRequired}
            />
            <Select value={newTagUnit} onValueChange={setNewTagUnit}>
              <SelectTrigger className="h-9 w-20 shrink-0 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" size="sm" className="h-9" onClick={handleConfirmCreateTag}>
              確定
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9"
              variant="outline"
              onClick={() => {
                setIsCreatingTag(false);
                setNewTagLabel("");
              }}
            >
              取消
            </Button>
          </div>
          <span className="text-xs text-info">{labels.tagHelpText}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            {labels.tagLabel}
            {showRequiredAsterisk && <span className="text-danger ml-1">*</span>}
          </label>
          <Select
            value={item.tagId}
            onValueChange={(val) => {
              if (val === "__CREATE__") {
                setIsCreatingTag(true);
              } else {
                onUpdate("tagId", val);
                const tag = availableTags.find((t) => t.id === val);
                if (tag?.unit) {
                  onUpdate("unit", tag.unit);
                }
              }
            }}
            required={isRequired}
          >
            <SelectTrigger className="h-9 border-border/60">
              <SelectValue placeholder={labels.tagPlaceholder || "選擇或建立標籤..."} />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.label}
                </SelectItem>
              ))}
              <div className="h-px bg-border my-1" />
              <SelectItem
                value="__CREATE__"
                className="font-semibold text-primary focus:bg-primary/10"
              >
                + 新增{labels.tagLabel}
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-info">{labels.tagHelpText}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {labels.frequencyLabel}
            {showRequiredAsterisk && <span className="text-danger ml-1">*</span>}
          </label>
          <div className="flex gap-2">
            <Select
              value={item.frequencyType}
              onValueChange={(val) => onUpdate("frequencyType", val)}
              required={isRequired}
            >
              <SelectTrigger className="h-9 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={frequencyType.TIMES_PER_DAY}>一天幾次</SelectItem>
                <SelectItem value={frequencyType.DAYS_PER_TIME}>幾天一次</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="h-9 w-24 border-border/60"
              value={item.frequencyValue || ""}
              onChange={(e) =>
                onUpdate(
                  "frequencyValue",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              required={isRequired}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {labels.amountLabel}
            {showRequiredAsterisk && <span className="text-danger ml-1">*</span>}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              className="h-9 border-border/60"
              value={item.amount || ""}
              onChange={(e) =>
                onUpdate("amount", e.target.value === "" ? 0 : Number(e.target.value))
              }
              required={isRequired}
            />
            {isTagLocked && !isEditingUnit ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-1 shrink-0 font-normal border-border/60"
                onClick={() => setIsEditingUnit(true)}
              >
                {currentUnitLabel}
                <Pencil size={14} />
              </Button>
            ) : (
              <Select
                value={item.unit}
                onValueChange={handleUnitChange}
                required={isRequired}
              >
                <SelectTrigger className="h-9 w-20 shrink-0 border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {children}
      </div>

      <TagConfirmDialog
        isOpen={!!pendingUnit}
        onConfirm={handleConfirmUnit}
        onCancel={handleCancelUnit}
      />
    </div>
  );
}
