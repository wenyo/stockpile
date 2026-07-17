import { useState, useEffect, useContext } from "react";
import { X, UsersRound, UserRoundPen, Plus, Trash2 } from "lucide-react";
import { type HouseholdMember, initialHouseholdMember } from "@/interfaces/family";
import { identityConstants } from "@/constant/family";
import { stockFieldLabel } from "@/constant/stock";
import { type FeedPortion } from "@/interfaces/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
import { StockListContext } from "@/store/stockList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateFamilyModal() {
  const { closeModal, openModal } = useContext(ModalContext);
  const { addHousehold, updateHousehold, editHousehold, setEditHousehold, feedTags, addFeedTag, setDeleteHousehold } = useContext(SettingContext);
  const { stockList } = useContext(StockListContext);
  const [newFamilyInfo, setNewFamilyInfo] = useState<HouseholdMember>(initialHouseholdMember);
  const [newTagInput, setNewTagInput] = useState<{ idx: number, label: string } | null>(null);
  const isEdit = editHousehold?.id;
  
  const showFeedPortion = newFamilyInfo.identity === "infant" || newFamilyInfo.identity === "pet";
  const appliesToStockType = newFamilyInfo.identity === "infant" ? "infantStapleFood" : "petStapleFood";
  const availableTags = feedTags.filter((t) => t.appliesToStockType === appliesToStockType);

  const updateField = (keyPath: string, value: string | number) => {
    setNewFamilyInfo((prev) => {
      const keys = keyPath.split(".");
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      }
      const [parentKey, childKey] = keys as [keyof HouseholdMember, string];
      return {
        ...prev,
        [parentKey]: {
          ...(prev[parentKey] as any || {}),
          [childKey]: value
        }
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    let parsedValue: string | number = value;
    if (e.target.type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    updateField(id, parsedValue);
  };

  const handleSelectChange = (value: string, id: string) => {
    if (id === "identity") {
      setNewFamilyInfo((prev) => ({
        ...prev,
        identity: value as any,
        dailyMlWater: value === "infant" ? 0 : prev.dailyMlWater,
      }));
    } else {
      updateField(id, value);
    }
  };

  const setFeedPortions = (portions: FeedPortion[]) => {
    setNewFamilyInfo((prev) => ({ ...prev, feedPortions: portions }));
  };

  const addFeedPortion = () => {
    setFeedPortions([
      ...(newFamilyInfo.feedPortions || []),
      { feedTagId: "", amount: 0, unit: "g", frequencyType: "timesPerDay", frequencyValue: 1 }
    ]);
  };

  const removeFeedPortion = (idx: number) => {
    const list = [...(newFamilyInfo.feedPortions || [])];
    list.splice(idx, 1);
    setFeedPortions(list);
  };

  const updateFeedPortion = (idx: number, key: keyof FeedPortion, val: any) => {
    const list = [...(newFamilyInfo.feedPortions || [])];
    list[idx] = { ...list[idx], [key]: val };
    setFeedPortions(list);
  };

  const confirmCreateTag = () => {
    if (!newTagInput || !newTagInput.label.trim()) return;
    const tagId = addFeedTag({ label: newTagInput.label.trim(), appliesToStockType });
    updateFeedPortion(newTagInput.idx, "feedTagId", tagId);
    setNewTagInput(null);
  };

  const closeCreateFamilyModal = () => {
    closeModal();
    setEditHousehold(null);
  }

  const submit = () => {
    if (isEdit) {
      updateHousehold(newFamilyInfo);
    } else {
      addHousehold(newFamilyInfo);
    }
    closeCreateFamilyModal();
  };

  const handleDelete = () => {
    if (!editHousehold) return;
    setDeleteHousehold(editHousehold);
    openModal(modalTypeConstant.DELETE_CHECK);
  };

  useEffect(() => {
    if (editHousehold) {
      setNewFamilyInfo(editHousehold);
    }
  }, [editHousehold]);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeCreateFamilyModal}
    >
      <div
        className="bg-card w-full h-dvh sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-xl border-0 sm:border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="shrink-0 flex justify-between items-center p-4 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
            {isEdit ? <UserRoundPen size={20} className="text-info" /> : <UsersRound size={20} className="text-primary" />}
            {isEdit ? "編輯家庭成員" : "新增家庭成員"}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCreateFamilyModal} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="bg-background flex-1 overflow-y-auto p-4 md:p-6">
          <ul className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-3 md:gap-y-4">
            <li className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.name}</label>
              <Input value={newFamilyInfo.name} onChange={handleInputChange} type="text" id="name" className="h-10 border-border/60" placeholder="e.g. 爸爸, 媽媽, 小明" />
            </li>
            <li className="flex flex-col gap-1.5">
              <label htmlFor="identity" className="text-sm font-semibold text-muted-foreground">身份</label>
              <Select value={newFamilyInfo.identity} onValueChange={(value) => { handleSelectChange(value, "identity"); setNewTagInput(null); }}>
                <SelectTrigger className="h-10 border-border/60">
                  <SelectValue placeholder="選擇分類..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(identityConstants).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
            <li className="flex flex-col gap-1.5">
              <label htmlFor="dailyMlWater" className="text-sm font-semibold text-muted-foreground">{newFamilyInfo.identity === 'infant' ? '每日額外飲水量 (ml)' : '每日飲水量 (ml)'}</label>
              <Input value={newFamilyInfo.dailyMlWater} onChange={handleInputChange} type="number" id="dailyMlWater" className="h-10 border-border/60" placeholder="e.g. 2000" />
            </li>
            {!showFeedPortion && <li className="flex flex-col gap-1.5">
              <label htmlFor="dailyKcalNeed" className="text-sm font-semibold text-muted-foreground">每日熱量需求 (kcal)</label>
              <Input value={newFamilyInfo.dailyKcalNeed || ""} onChange={handleInputChange} type="number" id="dailyKcalNeed" className="h-10 border-border/60" placeholder="e.g. 2000" />
            </li>}
            
            {showFeedPortion && (
              <li className="col-span-full">
                <div className="my-4 border-b border-border/40"></div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">搭配主食與需求量</h3>
                  <Button onClick={addFeedPortion} variant="outline" size="sm" className="h-8 gap-1 border-border/60">
                    <Plus size={14} /> 新增主食
                  </Button>
                </div>
                
                <div className="flex flex-col gap-4">
                  {(newFamilyInfo.feedPortions || []).length === 0 ? (
                    <div className="text-center py-6 bg-muted/20 border border-dashed border-border/60 rounded-xl text-muted-foreground text-sm">
                      尚未新增任何主食設定
                    </div>
                  ) : (
                    (newFamilyInfo.feedPortions || []).map((portion, idx) => {
                      const isTagUsedInStock = portion.feedTagId ? stockList.some(s => s.feedTagId === portion.feedTagId) : false;
                      
                      return (
                      <div key={idx} className="bg-muted/10 border border-border/50 rounded-xl p-4 flex flex-col gap-3 relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -top-3 -right-3 h-8 w-8 bg-background border border-border/50 text-danger hover:text-danger hover:bg-danger/10 rounded-full shadow-sm"
                          onClick={() => removeFeedPortion(idx)}
                        >
                          <Trash2 size={14} />
                        </Button>
                        
                        {newTagInput?.idx === idx ? (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">建立新標籤</label>
                            <div className="flex gap-2">
                              <Input 
                                autoFocus
                                className="h-9 border-border/60" 
                                placeholder="如：皇家幼貓乾糧..." 
                                value={newTagInput.label} 
                                onChange={(e) => setNewTagInput({ ...newTagInput, label: e.target.value })} 
                                onKeyDown={(e) => e.key === 'Enter' && confirmCreateTag()}
                              />
                              <Button type="button" size="sm" className="h-9" onClick={confirmCreateTag}>確定</Button>
                              <Button type="button" size="sm" className="h-9" variant="outline" onClick={() => setNewTagInput(null)}>取消</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">{stockFieldLabel.feedTagId}</label>
                            <Select 
                              value={portion.feedTagId} 
                              onValueChange={(val) => {
                                if (val === "__CREATE__") setNewTagInput({ idx, label: "" });
                                else updateFeedPortion(idx, "feedTagId", val);
                              }}
                            >
                              <SelectTrigger className="h-9 border-border/60">
                                <SelectValue placeholder="選擇或建立標籤..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTags.map((tag) => (
                                  <SelectItem key={tag.id} value={tag.id}>{tag.label}</SelectItem>
                                ))}
                                <div className="h-px bg-border my-1" />
                                <SelectItem value="__CREATE__" className="font-semibold text-primary focus:bg-primary/10">
                                  + 新增{stockFieldLabel.feedTagId}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">餵食頻率</label>
                            <div className="flex gap-2">
                              <Select value={portion.frequencyType || "timesPerDay"} onValueChange={(val) => updateFeedPortion(idx, "frequencyType", val)}>
                                <SelectTrigger className="h-9 border-border/60">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="timesPerDay">一天幾次</SelectItem>
                                  <SelectItem value="daysPerTime">幾天一次</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input 
                                type="number" 
                                className="h-9 w-24 border-border/60" 
                                value={portion.frequencyValue || ""} 
                                onChange={(e) => updateFeedPortion(idx, "frequencyValue", e.target.value === "" ? 0 : Number(e.target.value))} 
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">單次餵食量</label>
                            <div className="flex gap-2">
                              <Input 
                                type="number" 
                                className="h-9 border-border/60" 
                                value={portion.amount || ""} 
                                onChange={(e) => updateFeedPortion(idx, "amount", e.target.value === "" ? 0 : Number(e.target.value))} 
                              />
                              <Select disabled={isTagUsedInStock} value={portion.unit} onValueChange={(val) => updateFeedPortion(idx, "unit", val)}>
                                <SelectTrigger className="h-9 w-20 shrink-0 border-border/60">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="unit">份</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {isTagUsedInStock && (
                              <span className="text-[11px] text-info font-medium tracking-wide">※ 已有庫存物資，鎖定單位</span>
                            )}
                          </div>

                          {newFamilyInfo.identity === "infant" && (
                            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-4 border-t border-border/40 pt-3 mt-1">
                              <label className="text-xs font-semibold text-muted-foreground">搭配水量 (ml) - 泡奶用</label>
                              <Input 
                                type="number" 
                                className="h-9 border-border/60" 
                                value={portion.waterAmount ?? ""} 
                                onChange={(e) => updateFeedPortion(idx, "waterAmount", e.target.value === "" ? undefined : Number(e.target.value))} 
                                placeholder="例如: 150"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )})
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border/40 bg-muted/10 flex justify-end gap-3">
          {isEdit && (
            <Button variant="ghost" onClick={handleDelete} className="px-4 text-danger hover:bg-danger/10 hover:text-danger mr-auto">
              刪除成員
            </Button>
          )}
          <Button variant="outline" onClick={closeCreateFamilyModal} className="px-6 border-border/60 hover:bg-muted/50">
            取消
          </Button>
          <Button className="px-8 shadow-sm" onClick={submit}>
            {isEdit ? "儲存更新" : "確認新增"}
          </Button>
        </div>
      </div>
    </div>
  )
}