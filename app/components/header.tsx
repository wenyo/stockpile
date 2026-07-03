import { NavLink } from "react-router";
import { useContext } from "react";
import { ModalContext } from "@/store/modal";
import { StockListContext } from "@/store/stockList";
import { Button } from "@/components/ui/button";
import { X, LayoutDashboard, List, Settings } from "lucide-react"
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
        {isDemo && <Button variant="outline" size="xs" onClick={() => openModal("demoCheck")}>demo<X /></Button>}
      </div>
      <nav className="flex gap-4 text-(--text-secondary)">
        <NavLink to="/" className={activeStyle}><LayoutDashboard className="md:hidden" /><span className="hidden md:block">Dashboard</span></NavLink>
        <NavLink to="/stock-list" className={activeStyle}><List className="md:hidden" /><span className="hidden md:block">Stock List</span></NavLink>
        <NavLink to="/setting" className={activeStyle}><Settings className="md:hidden" /><span className="hidden md:block">Setting</span></NavLink>
      </nav>
    </header>
  )
}