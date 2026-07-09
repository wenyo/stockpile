import { useState, useEffect, useContext } from "react";
import { X, UsersRound, UserRoundPen } from "lucide-react";
import { type HouseholdMember, initialHouseholdMember } from "@/interfaces/family";
import { identityConstants } from "@/constant/family";
import { stockUnit } from "@/constant/stock";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
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
  const { closeModal } = useContext(ModalContext);
  const { addHousehold, updateHousehold, editHousehold } = useContext(SettingContext);
  const [ newFamilyInfo, setNewFamilyInfo ] = useState<HouseholdMember>(initialHouseholdMember);
  const isEdit = editHousehold?.id;
  const foodConfig = newFamilyInfo.identity === "infant"
    ? { key: "dailyBabyFoodNeed", data: newFamilyInfo.dailyBabyFoodNeed }
    : newFamilyInfo.identity === "pet"
    ? { key: "dailyPetFoodNeed", data: newFamilyInfo.dailyPetFoodNeed }
    : null;

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
    updateField(id, value);
  };

  const submit = () => {
    if (isEdit) {
      updateHousehold(newFamilyInfo);
    } else {
      addHousehold(newFamilyInfo);
    }
    closeModal();
  };

  useEffect(() => {
    if (editHousehold) {
      setNewFamilyInfo(editHousehold);
    }
  }, [editHousehold]);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="bg-card w-full h-dvh sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-xl border-0 sm:border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        >
        <p>{JSON.stringify(newFamilyInfo, null, 2)}</p>
        {/* Header */}
        <div className="shrink-0 flex justify-between items-center p-4 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
            {isEdit ? <UserRoundPen size={20} className="text-info" /> : <UsersRound size={20} className="text-primary" />}
            {isEdit ? "編輯家庭成員" : "新增家庭成員"}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="bg-background flex-1 overflow-y-auto p-4 md:p-6">
          <ul className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-3 md:gap-y-4">
            <li className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">名稱</label>
              <Input value={newFamilyInfo.name} onChange={handleInputChange} type="text" id="name" className="h-10 border-border/60" placeholder="e.g. 爸爸, 媽媽, 小明" />
            </li>
            <li className="flex flex-col gap-1.5">
              <label htmlFor="identity" className="text-sm font-semibold text-muted-foreground">身份</label>
              <Select value={newFamilyInfo.identity} onValueChange={(value) => handleSelectChange(value, "identity")}>
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
              <label htmlFor="dailyMlWater" className="text-sm font-semibold text-muted-foreground">每日飲水量 (ml)</label>
              <Input value={newFamilyInfo.dailyMlWater} onChange={handleInputChange} type="number" id="dailyMlWater" className="h-10 border-border/60" placeholder="e.g. 2000" />
            </li>
            {!foodConfig && <li className="flex flex-col gap-1.5">
              <label htmlFor="dailyKcalNeed" className="text-sm font-semibold text-muted-foreground">每日熱量需求 (kcal)</label>
              <Input value={newFamilyInfo.dailyKcalNeed} onChange={handleInputChange} type="number" id="dailyKcalNeed" className="h-10 border-border/60" placeholder="e.g. 2000" />
            </li>}
            {/* infant || pet */}
            {
              foodConfig && (
                <>
                  <li className="col-span-full my-4 border-b border-border/40"></li>
                  <li className="flex flex-col gap-1.5">
                    <label htmlFor={`${foodConfig.key}.amount`} className="text-sm font-semibold text-muted-foreground">每餐{identityConstants[newFamilyInfo.identity]}食物量</label>
                    <Input value={foodConfig.data?.amount || ""} onChange={handleInputChange} type="number" id={`${foodConfig.key}.amount`} className="h-10 border-border/60" placeholder="" />
                  </li>
                  <li className="flex flex-col gap-1.5">
                    <label htmlFor={`${foodConfig.key}.unit`} className="text-sm font-semibold text-muted-foreground">每餐{identityConstants[newFamilyInfo.identity]}食物單位</label>
                    <Select value={foodConfig.data?.unit} onValueChange={(value) => handleSelectChange(value, `${foodConfig.key}.unit`)}>
                      <SelectTrigger className="h-10 border-border/60" id={`${foodConfig.key}.unit`}>
                        <SelectValue placeholder="選擇單位..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(stockUnit).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="flex flex-col gap-1.5">
                    <label htmlFor={`${foodConfig.key}.frequencyDays`} className="text-sm font-semibold text-muted-foreground">每餐{identityConstants[newFamilyInfo.identity]}食物頻率 (天)</label>
                    <Input value={foodConfig.data?.frequencyDays || ""} onChange={handleInputChange} type="number" id={`${foodConfig.key}.frequencyDays`} className="h-10 border-border/60" placeholder="" />
                  </li>
                </>
              )
            }
          </ul>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border/40 bg-muted/10 flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal} className="px-6 border-border/60 hover:bg-muted/50">
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