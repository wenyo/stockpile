import { useEffect, useState, useContext } from "react";
import { Joyride, STATUS, type Step } from "react-joyride";
import { BookOpen, Settings, List, LayoutDashboard } from "lucide-react";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";
import { useNavigate } from "react-router";
import type { HouseholdMember } from "@/interfaces/family";
import type { Stock } from "@/interfaces/stock";
import { Button } from "@/components/ui/button";

export default function AppTour() {
  const [run, setRun] = useState(false);
  const { addStock, stockList } = useContext(StockListContext);
  const { addHousehold, household } = useContext(SettingContext);
  const navigate = useNavigate();

  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 768 : true;

  const steps: Step[] = [
  {
    target: ".logo",
    placement: "bottom",
    title: "歡迎來到 Stockpile！",
    content: (
      <div>
        只要完成 <strong>建立家庭成員 → 新增物資 → 查看 Dashboard</strong> 三個步驟，就能快速開始使用。
        <br />
        <br />
        之後也可以隨時點擊
        <Button className="mx-2" variant="outline" size="xs">
          <BookOpen size={14} className="mr-1" />
          新手教學
        </Button>
        重新觀看導覽。
      </div>
    ),
    skipBeacon: true,
    scrollOffset: 120,
  },
  {
    target: "#tour-demo-member",
    title: "第一步：建立家庭成員",
    content: (
      <div>
        先在<span className="inline-flex items-center gap-1 text-primary"><Settings size={14} />Setting</span>建立家庭成員，系統會自動新增一位測試成員，方便您快速體驗功能。
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
    scrollOffset: 120,
  },
  {
    target: isDesktop ? "#tour-demo-stock-desktop" : "#tour-demo-stock-mobile",
    title: "第二步：新增第一項物資",
    content: (
      <div>
        在 <span className="inline-flex items-center gap-1 text-primary"><List size={14} />Stock List</span> 建立第一項物資，系統會自動新增一箱礦泉水，讓您立即看到管理效果。
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
    scrollOffset: 120,
  },
  {
    target: "#nav-dashboard",
    title: "最後一步：查看 Dashboard",
    content: (
      <div>
        所有資料都會整理在 <span className="inline-flex items-center gap-1 text-primary"><LayoutDashboard size={14} />Dashboard</span>，包含可支撐天數、準備達成率與即將到期的物資。
      </div>
    ),
    placement: "bottom",
    skipBeacon: true,
    scrollOffset: 120,
  },
];

  useEffect(() => {
    const handleStartTour = () => {
      setRun(true);
    };
    window.addEventListener("start-tour", handleStartTour);
    return () => window.removeEventListener("start-tour", handleStartTour);
  }, []);


  const handleJoyrideCallback = (data: any) => {
    const { status, type, index, action } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED || action === "close") {
      setRun(false);
      // Optional: you can remove navigate("/") here if you want them to stay on the current page when closing
      return;
    }
    
    // Handle navigation BEFORE the next step is rendered
    if (type === "step:before") {
      // If we are moving to step 1 (nav-setting), ensure we are on setting page? 
      // Actually Joyride expects targets to exist. We should navigate FIRST.
    }
    
    if (type === "step:after" && action === "next") {
      if (index === 0) {
        navigate("/setting");
        if (!household.find(m => m.id === "tour-demo-member")) {
          const testMember: HouseholdMember = {
            id: "tour-demo-member",
            name: "媽麻 (教學示範)",
            identity: "adult",
            dailyMlWater: 2000,
            dailyKcalNeed: 2000,
          };
          addHousehold(testMember);
        }
      } else if (index === 1) {
        navigate("/stock-list");
        if (!stockList.find(s => s.id === "tour-demo-stock")) {
          const testStock: Stock = {
            id: "tour-demo-stock",
            name: "礦泉水 (教學示範)",
            type: "water",
            count: 9,
            unit: "bottle",
            volume: 600,
            volumeUnit: "ml",
            totalCalories: undefined,
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            purchaseDate: new Date().toISOString().split("T")[0],
            remark: "新手教學自動建立的資料",
          };
          addStock(testStock);
        }
      } else if (index === 2) {
        navigate("/");
      } else if (index === 3) {
        // Tour finished
      }
    } else if (type === "step:after" && action === "prev") {
      if (index === 1) {
        navigate("/");
      } else if (index === 2) {
        navigate("/setting");
      } else if (index === 3) {
        navigate("/stock-list");
      }
    }
  };

  return (
    <Joyride
      onEvent={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      steps={steps}
      styles={{
        tooltipContainer: {
          textAlign: "left",
        },
        buttonPrimary: {
          backgroundColor: "#018f62",
          color: "#f9fbfb",
        },
        buttonBack: {
          color: "#a8a8a8",
        },
        buttonSkip: {
          color: "#a8a8a8",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        tooltip: {
          backgroundColor: "#373839",
          color: "#f9fbfb",
          zIndex: 10000,
        },
        arrow: {
          color: "#373839",
        },
        buttonClose: {
          color: "#018f62",
        }
      }}
      locale={{
        back: "上一步",
        close: "關閉",
        last: "完成",
        next: "下一步",
        skip: "跳過教學"
      }}
    />
  );
}
