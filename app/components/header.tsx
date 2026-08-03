import { X, LayoutDashboard, List, Settings, BookOpen, PackagePlus } from "lucide-react"
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
    <>
      <div className="sticky top-0 z-40 w-full">
        {isDemo && (
          <div className="bg-(--color-primary-800) text-primary px-4 py-2 text-sm flex justify-between items-center gap-4 border-b border-primary/20 font-medium">
            <span>目前為 Demo 模式，所有操作皆不會儲存。</span>
            <Button variant="outline" size="xs" onClick={() => openModal(modalTypeConstant.DEMO_CHECK)} className="h-6 rounded-full bg-background hover:bg-primary hover:text-primary-foreground border-primary/30">
              退出 Demo
            </Button>
          </div>
        )}
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

          <nav className="flex gap-4 text-(--text-secondary) items-center">
            <NavLink id="nav-dashboard" to="/" className={activeStyle}><LayoutDashboard className="md:hidden" /><span className="hidden md:block">Dashboard</span></NavLink>
            <NavLink id="nav-stocklist" to="/stock-list" className={activeStyle}><List className="md:hidden" /><span className="hidden md:block">Stock List</span></NavLink>
            <NavLink id="nav-setting" to="/setting" className={activeStyle}><Settings className="md:hidden" /><span className="hidden md:block">Setting</span></NavLink>
          </nav>
        </header>
      </div>
      <div className="fixed bottom-20 md:bottom-8 right-6 z-40 flex flex-col items-end gap-3">
          <Button 
            variant="default" 
            className="rounded-full shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300"
            size="lg"
            onClick={() => openModal(modalTypeConstant.UPDATE_STOCK)}
          >
            <PackagePlus className="mr-1.5" size={18} /> 更新庫存
          </Button>
        </div>
    </>
  )
}