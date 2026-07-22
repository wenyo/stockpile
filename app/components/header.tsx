import { X, LayoutDashboard, List, Settings, BookOpen } from "lucide-react"
import { NavLink } from "react-router";
import { useContext } from "react";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { StockListContext } from "@/store/stockList";
import { Button } from "@/components/ui/button";
import "./header.scss";

export default function Header() {
  const { openModal } = useContext(ModalContext);
  const { isDemo } = useContext(StockListContext);
  function activeStyle({ isActive }: { isActive: boolean }) {
    return isActive ? "text-lg text-primary" : "text-lg"
  }

  return (
    <header className="flex justify-between px-4 py-6 bg-(--card)">
      <div className="flex items-center gap-2 md:gap-4">
        <NavLink to="/">
          <p className="logo font-serif font-bold text-2xl md:text-3xl text-(--primary)" data-text="Stockpile">Stockpile</p>
        </NavLink>
        <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new Event("start-tour"))} className="h-9 px-3">
          <BookOpen className="mr-1.5" />
          <span className="hidden sm:inline">新手教學</span>
          <span className="sm:hidden">教學</span>
        </Button>
      </div>

      {isDemo && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Button 
            variant="default" 
            className="rounded-full"
            size="lg"
            onClick={() => openModal(modalTypeConstant.DEMO_CHECK)}
          >
            <X className="mr-1" /> Demo 模式
          </Button>
        </div>
      )}
      <nav className="flex gap-4 text-(--text-secondary) items-center">
        <NavLink id="nav-dashboard" to="/" className={activeStyle}><LayoutDashboard className="md:hidden" /><span className="hidden md:block">Dashboard</span></NavLink>
        <NavLink id="nav-stocklist" to="/stock-list" className={activeStyle}><List className="md:hidden" /><span className="hidden md:block">Stock List</span></NavLink>
        <NavLink id="nav-setting" to="/setting" className={activeStyle}><Settings className="md:hidden" /><span className="hidden md:block">Setting</span></NavLink>
      </nav>
    </header>
  )
}