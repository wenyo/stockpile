import { ModalContext } from "@/store/modal";
import { identityConstants } from "@/constant/family";
import { Button } from "@/components/ui/button";
import { X, PackageSearch, Users, User, Baby, Milk, Utensils } from "lucide-react";
import { useContext } from "react";
import { stockType } from "@/constant/stock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PwaNoticeModal() {
  const { closeModal } = useContext(ModalContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
      <div 
        className="bg-card w-full max-w-lg rounded-xl border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-border/40 bg-muted/20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PackageSearch size={22} className="text-primary" />
            熱量計算說明
          </h2>
          <Button variant="ghost" size="icon" onClick={() => closeModal()} className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
            <X size={18} />
          </Button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>家庭一日熱量怎麼計算？</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">家庭每日熱量依所有成員的設定計算，並依飲食需求分別統計。</p>
                
                <div className="bg-muted/20 border border-border/40 rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col gap-4 pb-4 border-b border-border/50 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        <Users size={18} className="text-primary" /> 家庭每日熱量分配
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 bg-background/60 rounded-lg p-3 border border-border/40 shadow-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                          <Utensils size={13} className="text-foreground/70" /> {stockType.food}
                        </div>
                        <span className="font-bold text-foreground text-lg">4,200 <span className="text-xs font-medium text-muted-foreground">kcal</span></span>
                      </div>
                      <div className="flex flex-col gap-1 bg-primary/5 rounded-lg p-3 border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-1.5 text-primary/80 text-xs font-bold tracking-wide">
                          <Milk size={13} /> {stockType.infantStapleFood}
                        </div>
                        <span className="font-bold text-primary text-lg">800 <span className="text-xs font-medium opacity-70">kcal</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="flex flex-col gap-3">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <div className="bg-background p-1.5 rounded-md border border-border/40 shadow-sm"><User size={14} className="text-foreground/70" /></div>
                        {identityConstants.adult} A
                      </div>
                      <span className="font-semibold text-foreground">2,000 <span className="text-xs font-normal text-muted-foreground">kcal</span></span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <div className="bg-background p-1.5 rounded-md border border-border/40 shadow-sm"><User size={14} className="text-foreground/70" /></div>
                        {identityConstants.adult} B
                      </div>
                      <span className="font-semibold text-foreground">1,800 <span className="text-xs font-normal text-muted-foreground">kcal</span></span>
                    </li>
                    <li className="flex flex-col gap-2 pt-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <div className="bg-background p-1.5 rounded-md border border-border/40 shadow-sm"><Baby size={14} className="text-primary/70" /></div>
                          {identityConstants.child}
                        </div>
                        <span className="font-semibold text-foreground">1,200 <span className="text-xs font-normal text-muted-foreground">kcal</span></span>
                      </div>
                      
                      {/* Nested Tree Structure */}
                      <ul className="ml-4 pl-5 space-y-2.5 relative before:absolute before:inset-y-0 before:left-[-1px] before:w-[2px] before:bg-border/60">
                        <li className="flex justify-between items-center relative pl-1 group">
                          <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-border/60 group-hover:bg-primary/50 transition-colors"></span>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Milk size={13} className="text-muted-foreground/70" /> {stockType.infantStapleFood}
                          </div>
                          <span className="font-medium text-foreground/80 text-sm">800 <span className="text-[10px] text-muted-foreground">kcal</span></span>
                        </li>
                        <li className="flex justify-between items-center relative pl-1 group">
                          <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-border/60 group-hover:bg-primary/50 transition-colors"></span>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Utensils size={13} className="text-muted-foreground/70" /> {stockType.food}
                          </div>
                          <span className="font-medium text-foreground/80 text-sm">400 <span className="text-[10px] text-muted-foreground">kcal</span></span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>家庭一日飲水怎麼計算？</AccordionTrigger>
              <AccordionContent>
                Yes. It uses Tailwind CSS for styling and is highly customizable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>嬰幼兒／寵物飲食怎麼計算？</AccordionTrigger>
              <AccordionContent>
                Yes. It uses Tailwind CSS for styling and is highly customizable.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}