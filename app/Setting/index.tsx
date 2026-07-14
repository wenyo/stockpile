import { useContext } from "react";
import { X, Edit2, Plus, Target, RotateCw, UsersRound, Baby, PawPrint, User, Smile } from "lucide-react";
import { type HouseholdMember } from "@/interfaces/family";
import { modalTypeConstant } from "@/interfaces/modal";
import { identityConstants } from "@/constant/family";
import { SettingContext } from "@/store/setting";
import { ModalContext } from "@/store/modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SettingComponent() {
  const { setting, updateSetting, household, setEditHousehold, setDeleteHousehold } = useContext(SettingContext);
  const { openModal } = useContext(ModalContext);

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
              <Input type="number" name="targetDays" className="h-10 text-center text-lg font-semibold" value={setting.targetDays} onChange={(e) => updateSetting({ targetDays: Number(e.target.value) })} />
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
              <Input type="number" name="rotationDays" className="h-10 text-center text-lg font-semibold" value={setting.rotationDays} onChange={(e) => updateSetting({ rotationDays: Number(e.target.value) })} />
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
    </div>
  );
}