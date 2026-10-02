import { useState, useEffect, useContext } from "react";
import { X, UsersRound, UserRoundPen, Plus } from "lucide-react";
import { type FeedPortion, type MedicineNeed, frequencyType } from "@/interfaces/stock";
import { type HouseholdMember, initialHouseholdMember, REQUIRED_FIELDS } from "@/interfaces/family";
import { modalTypeConstant } from "@/interfaces/modal";
import { identityConstants } from "@/constant/family";
import { stockFieldLabel, stockType, medicineUnit, stockUnit } from "@/constant/stock";
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
import NeedItemCard from "./components/NeedItemCard";

export default function CreateFamilyModal() {
  const { closeModal, openModal } = useContext(ModalContext);
  const { household, replaceHousehold, addHousehold, updateHousehold, editHousehold, setEditHousehold, stockTags, addStockTag, replaceStockTags, setDeleteHousehold } = useContext(SettingContext);
  const { stockList, replaceStockList } = useContext(StockListContext);
  const [newFamilyInfo, setNewFamilyInfo] = useState<HouseholdMember>(initialHouseholdMember);
  const [isComplete, setIsComplete] = useState(false);
  const [modifiedTagUnits, setModifiedTagUnits] = useState<Record<string, string>>({});
  const isEdit = editHousehold?.id;
  
  const showFeedPortion = newFamilyInfo.identity === "infant" || newFamilyInfo.identity === "pet" || newFamilyInfo.identity === "child";
  const appliesFeedType = newFamilyInfo.identity === "pet" ? "petStapleFood" : "infantStapleFood";
  const availableFeedTags = stockTags.filter((t) => t.appliesToStockType === appliesFeedType);
  const availableMedicineTags = stockTags.filter((t) => t.appliesToStockType === "medicine");

  const medicineUnitOptions = Object.entries(medicineUnit).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  const feedUnitOptions = Object.entries(stockUnit).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const requiredFields = REQUIRED_FIELDS[newFamilyInfo.identity];
  const requiredDom = <span className="text-danger ml-1">*</span>;
  const checkIsRequired = (key: keyof HouseholdMember) => {
    const isRequire = requiredFields.includes(key);
    return isRequire ? requiredDom : "";
  }

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

  const addFeedPortion = () => {
    setNewFamilyInfo((prev) => ({
      ...prev,
      feedPortions: [
        ...(prev.feedPortions || []),
        { feedTagId: "", amount: 0, unit: "g", frequencyType: frequencyType.TIMES_PER_DAY, frequencyValue: 1 },
      ],
    }));
  };

  const removeFeedPortion = (idx: number) => {
    setNewFamilyInfo((prev) => {
      const list = [...(prev.feedPortions || [])];
      list.splice(idx, 1);
      return { ...prev, feedPortions: list };
    });
  };

  const updateFeedPortion = (idx: number, key: keyof FeedPortion, val: any) => {
    setNewFamilyInfo((prev) => {
      const list = [...(prev.feedPortions || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...prev, feedPortions: list };
    });
  };

  const addMedicineNeed = () => {
    setNewFamilyInfo((prev) => ({
      ...prev,
      medicineNeeds: [
        ...(prev.medicineNeeds || []),
        { medicineTagId: "", amount: 0, unit: "tablet", frequencyType: frequencyType.TIMES_PER_DAY, frequencyValue: 1 },
      ],
    }));
  };

  const removeMedicineNeed = (idx: number) => {
    setNewFamilyInfo((prev) => {
      const list = [...(prev.medicineNeeds || [])];
      list.splice(idx, 1);
      return { ...prev, medicineNeeds: list };
    });
  };

  const updateMedicineNeed = (idx: number, key: keyof MedicineNeed, val: any) => {
    setNewFamilyInfo((prev) => {
      const list = [...(prev.medicineNeeds || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...prev, medicineNeeds: list };
    });
  };


  const closeCreateFamilyModal = () => {
    closeModal();
    setEditHousehold(null);
  }

  const checkFormRequirements = () => {
    // check required field of household
    for (let requireKey of requiredFields) {
      if (requireKey === "feedPortions") {
        const feedPortions = newFamilyInfo.feedPortions || [];
        if (feedPortions.length === 0) {
          return false;
        }
        for (let portion of feedPortions) {
          if (!portion.feedTagId || !portion.amount || !portion.unit || !portion.frequencyType || !portion.frequencyValue) {
            return false;
          }
        }
      } else {
        const val = newFamilyInfo[requireKey];
        if (val === undefined || val === null || val === "") {
          return false;
        }
      }
    }

    // check required field of medicineNeeds
    for (let need of newFamilyInfo.medicineNeeds || []) {
      if (!need.medicineTagId || !need.amount || !need.unit || !need.frequencyType || !need.frequencyValue) {
        return false;
      }
    }
    
    return true;
  }

  const handleTagUnitConfirmed = (tagId: string, newUnit: string) => {
    setModifiedTagUnits((prev) => ({
      ...prev,
      [tagId]: newUnit,
    }));

    // 同步更新當前正在編輯的成員所有相同標籤的項目單位
    setNewFamilyInfo((prev) => ({
      ...prev,
      medicineNeeds: prev.medicineNeeds?.map((m) =>
        m.medicineTagId === tagId ? { ...m, unit: newUnit as any } : m
      ),
      feedPortions: prev.feedPortions?.map((f) =>
        f.feedTagId === tagId ? { ...f, unit: newUnit as any } : f
      ),
    }));
  };

  const submit = () => {
    if (!isComplete) return;

    // 如果有修改標籤單位，在確認儲存時一併連動更新相關資料
    if (Object.keys(modifiedTagUnits).length > 0) {
      // 1. 更新 stockTags
      const updatedTags = stockTags.map((tag) =>
        modifiedTagUnits[tag.id] ? { ...tag, unit: modifiedTagUnits[tag.id] } : tag
      );
      replaceStockTags(updatedTags);

      // 2. 更新其他家庭成員 household
      const updatedHousehold = household.map((member) => {
        if (member.id === newFamilyInfo.id) {
          return newFamilyInfo;
        }
        let changed = false;
        const updatedMedicineNeeds = member.medicineNeeds?.map((need) => {
          if (modifiedTagUnits[need.medicineTagId]) {
            changed = true;
            return { ...need, unit: modifiedTagUnits[need.medicineTagId] as any };
          }
          return need;
        });
        const updatedFeedPortions = member.feedPortions?.map((portion) => {
          if (modifiedTagUnits[portion.feedTagId]) {
            changed = true;
            return { ...portion, unit: modifiedTagUnits[portion.feedTagId] as any };
          }
          return portion;
        });

        if (changed) {
          return {
            ...member,
            medicineNeeds: updatedMedicineNeeds,
            feedPortions: updatedFeedPortions,
          };
        }
        return member;
      });
      replaceHousehold(updatedHousehold);

      // 3. 更新庫存物資 stockList (藥品改 unit，食品改 volumeUnit)
      const updatedStockList = stockList.map((stock) => {
        let changed = false;
        let updated = { ...stock };
        if (stock.medicineTagId && modifiedTagUnits[stock.medicineTagId]) {
          updated.unit = modifiedTagUnits[stock.medicineTagId] as any;
          changed = true;
        }
        if (stock.feedTagId && modifiedTagUnits[stock.feedTagId]) {
          updated.volumeUnit = modifiedTagUnits[stock.feedTagId] as any;
          changed = true;
        }
        return changed ? updated : stock;
      });
      replaceStockList(updatedStockList);
    }

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
    setEditHousehold(null);
    openModal(modalTypeConstant.DELETE_CHECK);
  };

  useEffect(() => {
    setIsComplete(checkFormRequirements());
  },[newFamilyInfo])

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
              <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">{stockFieldLabel.name}{checkIsRequired("name")}</label>
              <Input
                value={newFamilyInfo.name} 
                onChange={handleInputChange} 
                type="text" 
                name="name" 
                id="name" 
                className="h-10 border-border/60" 
                placeholder="e.g. 爸爸, 媽媽, 小明" 
                required={requiredFields.includes("name")}
              />
            </li>
            <li className="flex flex-col gap-1.5">
              <label htmlFor="identity" className="text-sm font-semibold text-muted-foreground">身份{checkIsRequired("identity")}</label>
              <Select 
                name="identity" 
                value={newFamilyInfo.identity} 
                onValueChange={(value) => handleSelectChange(value, "identity")}
                required={requiredFields.includes("identity")}
              >
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
              <label htmlFor="dailyMlWater" className="text-sm font-semibold text-muted-foreground">{newFamilyInfo.identity === 'infant' ? '每日額外飲水量 (ml)' : '每日飲水量 (ml)'}{checkIsRequired("dailyMlWater")}</label>
              <Input 
                value={newFamilyInfo.dailyMlWater} 
                onChange={handleInputChange} 
                type="number" 
                id="dailyMlWater" 
                className="h-10 border-border/60" 
                placeholder="e.g. 2000" 
                required={requiredFields.includes("dailyMlWater")}
              />
            </li>
            {(newFamilyInfo.identity === "adult" || newFamilyInfo.identity === "child") && (
              <li className="flex flex-col gap-1.5">
                <label htmlFor="dailyKcalNeed" className="text-sm font-semibold text-muted-foreground">每日熱量需求 (kcal){checkIsRequired("dailyKcalNeed")}</label>
                <Input 
                  value={newFamilyInfo.dailyKcalNeed || ""} 
                  onChange={handleInputChange} 
                  type="number" 
                  id="dailyKcalNeed" 
                  className="h-10 border-border/60" 
                  placeholder="e.g. 2000" 
                  required={requiredFields.includes("dailyKcalNeed")}
                />
              </li>
            )}

            {/* medicine */}
            <li className="col-span-full">
                <div className="my-4 border-b border-border/40"></div>
                <div className="flex justify-between items-center mb-3 text-muted-foreground">
                  <h3 className="text-sm font-semibold">指定用藥需求</h3>
                  <div className="flex justify-center items-center gap-2">
                    <span className="font-normal text-sm">
                      適用類別：<span className="text-foreground font-bold">{stockType.medicine}</span>
                    </span>
                    <Button onClick={addMedicineNeed} variant="outline" size="sm" className="h-8 gap-1 border-border/60 w-fit">
                      <Plus size={14} /> 新增
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {(newFamilyInfo.medicineNeeds || []).length === 0 ? (
                    <div className="text-center py-6 bg-muted/20 border border-dashed border-border/60 rounded-xl text-muted-foreground text-sm">
                      尚未設定用藥需求
                    </div>
                  ) : (
                    (newFamilyInfo.medicineNeeds || []).map((medicine, idx) => {
                      const isTagUsedInStock = medicine.medicineTagId ? stockList.some(s => s.medicineTagId === medicine.medicineTagId) : false;
                      const currentTag = availableMedicineTags.find((t) => t.id === medicine.medicineTagId);
                      const currentUnit = medicine.unit || modifiedTagUnits[medicine.medicineTagId] || currentTag?.unit || "g";

                      return (
                        <NeedItemCard
                          key={idx}
                          item={{
                            tagId: medicine.medicineTagId,
                            amount: medicine.amount,
                            unit: currentUnit,
                            frequencyType: medicine.frequencyType,
                            frequencyValue: medicine.frequencyValue,
                          }}
                          availableTags={availableMedicineTags}
                          unitOptions={medicineUnitOptions}
                          isTagLocked={isTagUsedInStock}
                          isRequired={true}
                          showRequiredAsterisk={false}
                          labels={{
                            tagLabel: stockFieldLabel.medicineTagId,
                            tagPlaceholder: "選擇或建立標籤...",
                            newTagPlaceholder: "血壓藥、抗組織胺...",
                            tagHelpText: "※ 庫存標籤用於對應成員的藥品",
                            frequencyLabel: "用藥頻率",
                            amountLabel: "單次用藥量",
                          }}
                          onUpdate={(key, val) => {
                            const fieldKey = key === "tagId" ? "medicineTagId" : key;
                            updateMedicineNeed(idx, fieldKey as keyof MedicineNeed, val);
                          }}
                          onRemove={() => removeMedicineNeed(idx)}
                          onCreateTag={(label, unit) => {
                            const newTagId = addStockTag({ label, appliesToStockType: "medicine", unit });
                            updateMedicineNeed(idx, "medicineTagId", newTagId);
                            updateMedicineNeed(idx, "unit", unit);
                            return newTagId;
                          }}
                          onUnitChangeConfirmed={(newUnit) => {
                            handleTagUnitConfirmed(medicine.medicineTagId, newUnit);
                          }}
                        />
                      );
                    })
                  )}
                </div>
              </li>
            
            {/* pet || infant || child */}
            {showFeedPortion && (
              <li className="col-span-full">
                <div className="my-4 border-b border-border/40"></div>
                <div className="flex justify-between items-center mb-3 text-muted-foreground">
                  <h3 className="text-sm font-semibold">指定飲食需求{checkIsRequired("feedPortions")}</h3>
                  <div className="flex justify-center items-center gap-2">
                    <span className="font-normal text-sm">
                      適用類別：<span className="text-foreground font-bold">{appliesFeedType === "infantStapleFood" ? stockType.infantStapleFood : stockType.petStapleFood}</span>
                    </span>
                    <Button onClick={addFeedPortion} variant="outline" size="sm" className="h-8 gap-1 border-border/60 w-fit">
                      <Plus size={14} /> 新增
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {(newFamilyInfo.feedPortions || []).length === 0 ? (
                    <div className="text-center py-6 bg-muted/20 border border-dashed border-border/60 rounded-xl text-muted-foreground text-sm">
                      尚未設定飲食需求
                    </div>
                  ) : (
                    (newFamilyInfo.feedPortions || []).map((portion, idx) => {
                      const isTagUsedInStock = portion.feedTagId ? stockList.some(s => s.feedTagId === portion.feedTagId) : false;
                      const currentTag = availableFeedTags.find((t) => t.id === portion.feedTagId);
                      const currentUnit = portion.unit || modifiedTagUnits[portion.feedTagId] || currentTag?.unit || "g";

                      return (
                        <NeedItemCard
                          key={idx}
                          item={{
                            tagId: portion.feedTagId,
                            amount: portion.amount,
                            unit: currentUnit,
                            frequencyType: portion.frequencyType,
                            frequencyValue: portion.frequencyValue,
                          }}
                          availableTags={availableFeedTags}
                          unitOptions={feedUnitOptions}
                          isTagLocked={isTagUsedInStock}
                          isRequired={true}
                          showRequiredAsterisk={requiredFields.includes("feedPortions")}
                          labels={{
                            tagLabel: stockFieldLabel.feedTagId,
                            tagPlaceholder: "選擇或建立標籤...",
                            newTagPlaceholder: "如：奶粉、貓貓飼料...",
                            tagHelpText: "※ 庫存標籤用於對應成員的主食",
                            frequencyLabel: "餵食頻率",
                            amountLabel: "單次餵食量",
                          }}
                          onUpdate={(key, val) => {
                            const fieldKey = key === "tagId" ? "feedTagId" : key;
                            updateFeedPortion(idx, fieldKey as keyof FeedPortion, val);
                          }}
                          onRemove={() => removeFeedPortion(idx)}
                          onCreateTag={(label, unit) => {
                            const newTagId = addStockTag({ label, appliesToStockType: appliesFeedType, unit });
                            updateFeedPortion(idx, "feedTagId", newTagId);
                            updateFeedPortion(idx, "unit", unit);
                            return newTagId;
                          }}
                          onUnitChangeConfirmed={(newUnit) => {
                            handleTagUnitConfirmed(portion.feedTagId, newUnit);
                          }}
                        >
                          {["child", "infant"].includes(newFamilyInfo.identity) && (
                            <div className="flex flex-col gap-1.5 col-span-2 md:col-span-4 border-t border-border/40 pt-3 mt-1">
                              <label className="text-xs font-semibold text-muted-foreground">搭配水量 (ml) - 泡奶/稀釋專用</label>
                              <Input 
                                type="number" 
                                className="h-9 border-border/60" 
                                value={portion.waterAmount ?? ""} 
                                onChange={(e) => updateFeedPortion(idx, "waterAmount", e.target.value === "" ? undefined : Number(e.target.value))} 
                                placeholder="例如: 150"
                              />
                            </div>
                          )}
                        </NeedItemCard>
                      );
                    })
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
          <Button className="px-8 shadow-sm" disabled={!isComplete} onClick={submit}>
            {isEdit ? "儲存更新" : "確認新增"}
          </Button>
        </div>
      </div>
    </div>
  )
}