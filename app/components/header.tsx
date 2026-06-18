import { NavLink } from "react-router";
import "./header.scss";

export default function Header() {
  function activeStyle({ isActive }: { isActive: boolean }) {
    return isActive ? "text-lg underline decoration-(--text-primary) underline-offset-8" : "text-lg"
  }

  return (
    <header className="flex justify-between px-4 py-6 bg-(--card)">
      <NavLink to="/">
        <p className="logo font-serif font-bold text-3xl text-(--primary)" data-text="Stockpile">Stockpile</p>
      </NavLink>
      <nav className="flex gap-4 text-(--text-secondary)">
        <NavLink to="/" className={activeStyle}>Home</NavLink>
        <NavLink to="/stock-list" className={activeStyle}>Stock List</NavLink>
      </nav>
    </header>
  )
}