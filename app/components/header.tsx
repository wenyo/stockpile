import { NavLink } from "react-router";
import { useContext } from "react";
import { ModalContext } from "@/store/modal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"
import "./header.scss";

export default function Header() {
  const { openModal } = useContext(ModalContext);
  function activeStyle({ isActive }: { isActive: boolean }) {
    return isActive ? "text-lg underline decoration-(--text-primary) underline-offset-8" : "text-lg"
  }

  return (
    <header className="flex justify-between px-4 py-6 bg-(--card)">
      <div className="flex items-center gap-2">
        <NavLink to="/">
          <p className="logo font-serif font-bold text-3xl text-(--primary)" data-text="Stockpile">Stockpile</p>
        </NavLink>
        <Button variant="outline" size="xs" onClick={() => openModal("demoCheck")}>demo<X /></Button>
      </div>
      <nav className="flex gap-4 text-(--text-secondary)">
        <NavLink to="/" className={activeStyle}>Dashboard</NavLink>
        <NavLink to="/stock-list" className={activeStyle}>Stock List</NavLink>
      </nav>
    </header>
  )
}