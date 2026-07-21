import { useContext, useRef } from "react";
import { Plus, Target, RotateCw, UsersRound, Baby, PawPrint, User, Smile, Download, Upload, ShieldCheck, Smartphone, Info, MessageCircleQuestionMark } from "lucide-react";
import { type HouseholdMember } from "@/interfaces/family";
import { modalTypeConstant } from "@/interfaces/modal";
import { identityConstants } from "@/constant/family";
import { SettingContext } from "@/store/setting";
import { StockListContext } from "@/store/stockList";
import { ModalContext } from "@/store/modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingComponent() {
  const { setting, updateSetting, household, setEditHousehold, setDeleteHousehold, replaceSetting, replaceHousehold, feedTags, replaceFeedTags } = useContext(SettingContext);
  const { isDemo, setIsDemo, stockList, replaceStockList } = useContext(StockListContext);
  const { openModal } = useContext(ModalContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      version: 1,
      setting,
      household,
      stockList,
      feedTags,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stockpile_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isDemo) {
      if (!confirm("匯入檔案將會覆蓋目前的內容，且因為目前在 Demo 模式，將會結束 Demo 狀態，確定要繼續嗎？")) {
        e.target.value = '';
        return;
      }
      setIsDemo(false);
    } else {
      if (!confirm("警告：匯入檔案將會「完全覆蓋」目前的儲備資料與家庭成員設定。確定要繼續嗎？")) {
        e.target.value = '';
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.setting) replaceSetting(data.setting);
        if (data.household) replaceHousehold(data.household);
        if (data.stockList) replaceStockList(data.stockList);
        if (data.feedTags) replaceFeedTags(data.feedTags);
        toast.success("資料匯入成功");
      } catch (err) {
        toast.error("資料匯入失敗，檔案格式不正確");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const editMember = (member: HouseholdMember) => {
    setEditHousehold(member);
    openModal(modalTypeConstant.FAMILY);
  };

  const deleteMember = (e: React.MouseEvent, member: HouseholdMember) => {
    e.stopPropagation();
    setDeleteHousehold(member);
    openModal(modalTypeConstant.DELETE_CHECK);
  };

  const getIdentityIcon = (identity: string) => {
    switch (identity) {
      case "adult": return <User size={26} className="text-primary/70" />;
      case "elderly": return <User size={26} className="text-muted-foreground" />;
      case "child": return <Smile size={26} className="text-info/80" />;
      case "infant": return <Baby size={26} className="text-warning/80" />;
      case "pet": return <PawPrint size={26} className="text-danger/70" />;
      default: return <User size={26} />;
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">設定</h1>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target size={20} className="text-muted-foreground" />
            儲備基礎設定
          </CardTitle>
          <CardDescription>管理您家庭物資儲備的基礎參數</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-muted/10 border border-border/40 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0 mt-0.5">
                <Target size={18} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-foreground">目標天數</span>
                <span className="text-sm text-muted-foreground mt-0.5">設定遇到緊急狀況時，期望能維持全家生存的目標天數。</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 md:w-32">
              <Input type="number" name="targetDays" className="h-10 text-center text-lg font-semibold" value={setting?.targetDays || 30} onChange={(e) => updateSetting({ targetDays: Number(e.target.value) })} />
              <span className="text-muted-foreground font-medium whitespace-nowrap">天</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-muted/10 border border-border/40 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-info/10 rounded-lg shrink-0 mt-0.5">
                <RotateCw size={18} className="text-info" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-foreground">輪替天數</span>
                <span className="text-sm text-muted-foreground mt-0.5">建議定期檢查庫存並將快過期的物資替換掉的天數週期。</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 md:w-32">
              <Input type="number" name="rotationDays" className="h-10 text-center text-lg font-semibold" value={setting?.rotationDays || 90} onChange={(e) => updateSetting({ rotationDays: Number(e.target.value) })} />
              <span className="text-muted-foreground font-medium whitespace-nowrap">天</span>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UsersRound size={20} className="text-muted-foreground" />
            家庭成員
          </CardTitle>
          <CardDescription>新增與管理您的家庭成員，系統會依此計算總熱量與主食需求</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-2">
            
            <li 
              id="tour-add-member-btn"
              className="cursor-pointer flex flex-col justify-center items-center bg-transparent p-4 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors gap-2 min-h-[120px]" 
              onClick={() => openModal(modalTypeConstant.FAMILY)}
            >
              <div className="p-2 bg-muted/40 rounded-full">
                <Plus size={24} className="text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">新增成員</span>
            </li>
            
            {household.map((member) => (
              <li 
                key={member.id} 
                id={member.id.includes("tour-demo-member") ? "tour-demo-member" : undefined}
                className="relative group flex flex-col bg-card hover:bg-muted/30 p-4 rounded-xl border border-border/60 hover:border-border transition-colors gap-3 min-h-[120px] overflow-hidden cursor-pointer"
                onClick={() => editMember(member)}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-muted/40 rounded-full">
                    {getIdentityIcon(member.identity)}
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 opacity-90 font-medium">
                    {identityConstants[member.identity as keyof typeof identityConstants] || member.identity}
                  </Badge>
                </div>
                
                <div className="flex flex-col mt-auto pt-2">
                  <span className="font-bold text-lg text-foreground leading-tight truncate">{member.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div id="tour-pwa-privacy" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <ShieldCheck size={20} />
              隱私聲明：本地端儲存
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              為了保護您的隱私與物資安全性，本系統採用<strong>本地端儲存 (Local Storage)</strong> 技術。您的所有家庭成員設定與物資資料都僅保存在您目前的瀏覽器中，不會上傳至任何雲端伺服器。
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm relative">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-info">
              <Smartphone size={20} />
              強烈建議安裝 PWA
            </CardTitle>
            <MessageCircleQuestionMark size={20} onClick={() => openModal(modalTypeConstant.PWA_NOTICE)} className="absolute top-5 right-5 cursor-pointer text-muted-foreground hover:bg-muted/60" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              在遇到斷網的緊急情況下，您仍然需要能夠查看庫存。請將本網頁<strong>「加入主畫面」</strong> (Install PWA) 以支援離線操作。
            </p>
            <div className="bg-info/10 text-info p-3 rounded-lg text-xs font-medium flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>如果您已經建立了一些資料，建議您先使用下方的「資料匯出」備份檔案，安裝好 PWA 後再匯入資料，以免切換應用程式導致資料遺失。</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 資料管理 */}
      <Card id="tour-data-management" className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">資料管理</CardTitle>
          <CardDescription>備份您的資料或將資料移轉到其他裝置 (例如 PWA App)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 border-border/60 gap-2 h-12" onClick={handleExport}>
              <Download size={18} />
              資料匯出 (Backup)
            </Button>
            <div className="flex-1 relative">
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImport}
              />
              <Button variant="outline" className="w-full border-border/60 gap-2 h-12 text-primary hover:text-primary hover:border-primary/50 hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} />
                資料匯入 (Restore)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}