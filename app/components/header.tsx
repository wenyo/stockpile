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
      <div className="flex items-center gap-2">
        <NavLink to="/">
          <p className="logo font-serif font-bold text-3xl text-(--primary)" data-text="Stockpile">Stockpile</p>
        </NavLink>
        {isDemo && <Button variant="outline" size="xs" onClick={() => openModal(modalTypeConstant.DEMO_CHECK)}>demo<X /></Button>}
        <Button variant="outline" size="xs" onClick={() => window.dispatchEvent(new Event("start-tour"))}><BookOpen size={14} className="mr-1" />新手教學</Button>
      </div>
      <nav className="flex gap-4 text-(--text-secondary) items-center">
        <NavLink id="nav-dashboard" to="/" className={activeStyle}><LayoutDashboard className="md:hidden" /><span className="hidden md:block">Dashboard</span></NavLink>
        <NavLink id="nav-stocklist" to="/stock-list" className={activeStyle}><List className="md:hidden" /><span className="hidden md:block">Stock List</span></NavLink>
        <NavLink id="nav-setting" to="/setting" className={activeStyle}><Settings className="md:hidden" /><span className="hidden md:block">Setting</span></NavLink>
      </nav>
    </header>
  )
}