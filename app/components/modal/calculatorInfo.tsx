import { useContext } from "react";
import { X, PackageSearch, Users, Milk, Utensils, Droplet, PawPrint } from "lucide-react";
import { stockType } from "@/constant/stock";
import { identityConstants, identityEng } from "@/constant/family";
import type { Identity } from "@/interfaces/family";
import { getIdentityIcon } from "@/utils/family";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type InfoDetail = {
  label: string;
  value: string;
  icon: React.ReactNode;
}

type Info = {
  identityEng: string;
  memberName: string;
  dailyNeed: string;
  unit: string;
  details: InfoDetail[];
}

type InfoDetails = {
  question1: Info[];
  question2: Info[];
}

export default function PwaNoticeModal() {
  const { closeModal } = useContext(ModalContext);

  const infoDetails: InfoDetails = {
    question1: [
      {identityEng: identityEng.adult, memberName: `${identityConstants.adult} A`, dailyNeed: "2,000", unit: "kcal", details:[]},
      {identityEng: identityEng.adult, memberName: `${identityConstants.adult} B`, dailyNeed: "1,800", unit: "kcal", details:[]},
      {identityEng: identityEng.child, memberName: `${identityConstants.child}`, dailyNeed: "1,200", unit: "kcal", details:[
        {label:`${stockType.food}`, value: '400', icon:<Utensils size={14} className="text-foreground/70" />},
        {label:`${stockType.infantStapleFood}`, value: '800', icon:<Milk size={14} className="text-foreground/70" />},
      ]},
    ],
    question2: [
      {identityEng: identityEng.adult, memberName: `${identityConstants.adult}`, dailyNeed: "1,800", unit: "ml", details:[]},
      {identityEng: identityEng.child, memberName: `${identityConstants.child}`, dailyNeed: "1,100", unit: "ml", details:[
        {label:`主食用水`, value: '400', icon:<Milk size={14} className="text-foreground/70" />},
        {label:`${stockType.water}`, value: '700', icon:<Droplet size={14} className="text-foreground/70" />},
      ]},
      {identityEng: identityEng.infant, memberName: `${identityConstants.infant}`, dailyNeed: "600", unit: "ml", details:[
        {label:`主食用水`, value: '600', icon:<Milk size={14} className="text-foreground/70" />},
      ]},
      {identityEng: identityEng.pet, memberName: `${identityConstants.pet}`, dailyNeed: "300", unit: "ml", details:[
        {label:`主食用水`, value: '50', icon:<PawPrint size={14} className="text-foreground/70" />},
        {label:`${stockType.water}`, value: '250', icon:<Droplet size={14} className="text-foreground/70" />},
      ]},
    ]
  }

  const getInfoList = (info: Info, index: number) => {
    const {identityEng, memberName, dailyNeed, unit, details} = info;
    return <li key={index} className="flex flex-col gap-2 pt-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <div className="bg-background p-1.5 rounded-md border border-border/40 shadow-sm">{getIdentityIcon(identityEng)}</div>
                {memberName}
              </div>
              <span className="font-semibold text-foreground">{dailyNeed} <span className="text-xs font-normal text-muted-foreground">{unit}</span></span>
            </div>
            
            {/* Nested Tree Structure */}
            {details && details.length > 0 && (
              <ul className="ml-4 pl-5 space-y-2.5 relative before:absolute before:inset-y-0 before:left-[-1px] before:w-[2px] before:bg-border/60">
                {
                  details.map((detail, index) => (
                    <li key={index} className="flex justify-between items-center relative pl-1 group text-sm text-muted-foreground">
                      <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-border/60 group-hover:bg-primary/50 transition-colors"></span>
                      <div className="flex items-center gap-1.5">
                        {detail.icon}
                        {detail.label}
                      </div>
                      <span className="font-medium">{detail.value} <span className="text-[10px] text-muted-foreground">{unit}</span></span>
                    </li>
                  ))
                }
              </ul>
            )}
          </li>
  }

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
                    {
                      infoDetails.question1.map((infoDetail, index) => {
                        return getInfoList(infoDetail, index)
                      })
                    }
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>家庭一日飲水怎麼計算？</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">依所有家庭成員的每日需求加總。</p>
                
                <div className="bg-muted/20 border border-border/40 rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col gap-4 pb-4 border-b border-border/50 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        <Users size={18} className="text-primary" /> 家庭每日飲水量
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 bg-background/60 rounded-lg p-3 border border-border/40 shadow-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                          <Droplet size={13} className="text-foreground/70" /> {stockType.water}
                        </div>
                        <span className="font-bold text-foreground text-lg">4,350 <span className="text-xs font-medium text-muted-foreground">ml</span></span>
                      </div>
                      <div className="flex flex-col gap-1 bg-primary/5 rounded-lg p-3 border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-1.5 text-primary/80 text-xs font-bold tracking-wide">
                          <Droplet size={13} /> 主食搭配用水
                        </div>
                        <span className="font-bold text-primary text-lg">1,050 <span className="text-xs font-medium opacity-70">ml</span></span>
                      </div>
                    </div>
                  </div>

                  
                  <ul className="flex flex-col gap-3">
                    {
                      infoDetails.question2.map((infoDetail, index) => {
                        return getInfoList(infoDetail, index)
                      })
                    }
                  </ul>
                </div>
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