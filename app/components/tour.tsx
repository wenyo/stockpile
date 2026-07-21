import { useEffect, useState, useContext } from "react";
import { Joyride, STATUS, type Step } from "react-joyride";
import { BookOpen, Settings, List } from "lucide-react";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";
import { useNavigate, useLocation } from "react-router";
import type { HouseholdMember } from "@/interfaces/family";
import type { Stock } from "@/interfaces/stock";
import { Button } from "@/components/ui/button";

export default function AppTour() {
  const [run, setRun] = useState(false);
  const { isInitialized, addStock } = useContext(StockListContext);
  const { addHousehold } = useContext(SettingContext);
  const navigate = useNavigate();
  const location = useLocation();

  const steps: Step[] = [
    {
      target: ".logo",
      placement: "bottom",
      title: "歡迎來到 Stockpile!",
      content: <div>讓我們透過幾個簡單的步驟，快速了解如何使用家庭防災儲備系統。您可以隨時在左上角點擊<Button className="mx-2" variant="outline" size="xs"><BookOpen size={14} className="mr-1" />新手教學</Button>重新開啟導覽。</div>,
      skipBeacon: true,
    },
    {
      target: "#tour-add-member-btn",
      title: "第一步：設定家庭成員",
      content: <div>首先，您需要來到<span className="inline-flex items-center gap-1 text-primary"><Settings size={14} />Setting</span>頁面新增成員。當您點擊下一步時，系統會自動為您建立一位「媽麻」作為測試成員！</div>,
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-demo-member",
      title: "成功建立成員",
      content: "看！這就是剛剛幫您建立的測試成員。未來您可以在這裡修改成員的需求量。接著讓我們前往物資清單！",
      skipBeacon: true,
      placement: "top",
    },
    {
      target: "#tour-add-stock-btn",
      title: "第二步：盤點現有物資",
      content: <div>同樣地，在<span className="inline-flex items-center gap-1 text-primary"><List size={14} />Stock List</span>頁面可以新增物資。當您點擊下一步時，我們也會自動建立一箱「礦泉水」的庫存！</div>,
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: typeof window !== 'undefined' && window.innerWidth >= 768 ? "#tour-demo-stock-desktop" : "#tour-demo-stock-mobile",
      title: "成功建立物資",
      content: "這是剛剛新增的礦泉水。您可以隨時點選卡片展開詳細資訊。馬上到首頁看看計算結果吧！",
      skipBeacon: true,
      placement: "top",
    },
    {
      target: "#nav-dashboard",
      title: "第三步：查看準備狀態",
      content: "最後，回到「儀表板」查看總結！您可以一眼看出家庭的防災準備是否已經達標，以及哪些物資快要過期了。",
      skipBeacon: true,
      placement: "bottom",
    },
    {
      target: "#tour-data-management",
      title: "第四步：匯入與匯出",
      content: "在設定頁的下方，您可以隨時將資料匯出成檔案備份，或是將備份檔匯入還原。",
      skipBeacon: true,
      placement: "top",
    },
    {
      target: "#tour-pwa-privacy",
      title: "第五步：本地儲存與離線操作",
      content: <div>本系統所有資料都<span className="text-primary">儲存在您的裝置中</span>，保障隱私安全。<br />強烈建議您將本系統安裝為 <span className="text-primary">PWA (加入主畫面)</span>，確保在斷網時也能順利查看庫存！<br />如果您已經有資料，請先在此匯出，切換到 PWA 後再匯入。</div>,
      skipBeacon: true,
      placement: "top",
    }
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
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      navigate("/");
    }
    
    // Handle navigation BEFORE the next step is rendered
    if (type === "step:before") {
      // If we are moving to step 1 (nav-setting), ensure we are on setting page? 
      // Actually Joyride expects targets to exist. We should navigate FIRST.
    }
    
    if (type === "step:after" && action === "next") {
      if (index === 0) {
        navigate("/setting");
      } else if (index === 1) {
        const testMember: HouseholdMember = {
          id: `tour-demo-member-${Date.now()}`,
          name: "媽麻 (教學示範)",
          identity: "adult",
          dailyMlWater: 2000,
          dailyKcalNeed: 2000,
        };
        addHousehold(testMember);
        // stay on setting
      } else if (index === 2) {
        navigate("/stock-list");
      } else if (index === 3) {
        const testStock: Stock = {
          id: `tour-demo-stock-${Date.now()}`,
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
        // stay on stock-list
      } else if (index === 4) {
        navigate("/");
      } else if (index === 5) {
        navigate("/setting");
        setTimeout(() => {
          document.getElementById("tour-data-management")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else if (type === "step:after" && action === "prev") {
      if (index === 1) {
        navigate("/");
      } else if (index === 2) {
        // stay on setting
      } else if (index === 3) {
        navigate("/setting");
      } else if (index === 4) {
        // stay on stock-list
      } else if (index === 5) {
        navigate("/stock-list");
      } else if (index === 6) {
        navigate("/");
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
