import { useContext } from "react";
import { X, Edit2, Plus } from "lucide-react";
import { SettingContext } from "@/store/setting";
import { ModalContext } from "@/store/modal";
import { modalTypeConstant } from "@/interfaces/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingComponent() {
  const { setting, updateSetting, config, updateConfig, addMember, removeMember } = useContext(SettingContext);
  const { openModal } = useContext(ModalContext);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">設定</h1>
      </div>
      <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>目標天數</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="number" name="targetDays" value={setting.targetDays} onChange={(e) => updateSetting({ targetDays: Number(e.target.value) })} />
        </CardContent>
      </Card>
      <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>輪替天數</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="number" name="rotationDays" value={setting.rotationDays} onChange={(e) => updateSetting({ rotationDays: Number(e.target.value) })} />
        </CardContent>
      </Card>
      <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>家庭成員</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mt-4">
            <li className="cursor-pointer flex justify-center items-center flex-col bg-(--muted-foreground)/5 p-4 rounded-xl text-base border border-border/50 hover:bg-(--muted-foreground)/30" onClick={() => openModal(modalTypeConstant.CREATE_FAMILY)}>
              <Plus size={30} />
            </li>
            {config.map((member) => (
              <li key={member.id} className="relative group flex justify-between flex-col bg-(--muted-foreground)/10 p-4 rounded-xl text-base border border-border/50">
                <span className="text-muted-foreground text-sm font-medium mb-1">{member.label}</span>
                <span className="font-semibold text-lg">{member.identity}</span>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="cursor-pointer p-1.5 bg-muted/80 rounded-md hover:bg-muted text-info"><Edit2 size={16} /></button>
                  <button className="cursor-pointer p-1.5 bg-danger/10 rounded-md hover:bg-danger/20 text-danger"><X size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}