import { useContext } from "react";
import { X, UsersRound, UserRoundPen } from "lucide-react";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";


export default function CreateFamilyModal() {
  const { closeModal } = useContext(ModalContext);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="bg-card w-full h-dvh sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-xl border-0 sm:border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header：固定在頂部，不隨內容捲動 */}
        <div className="shrink-0 flex justify-between items-center p-4 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-foreground">
            {false ? <UserRoundPen size={20} className="text-info" /> : <UsersRound size={20} className="text-primary" />}
            {false ? "編輯家庭成員" : "新增家庭成員"}
          </h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}