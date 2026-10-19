import { Link, NavLink, useLocation } from "react-router-dom";
import { Plus, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
export default function Header() {
  const loc = useLocation();
  const drafts =
    loc.pathname === "/recipes" &&
    new URLSearchParams(loc.search).get("status") === "draft";
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/95 backdrop-blur-lg">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Logo />
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <NavLink
            to="/recipes"
            end
            className={({ isActive }) =>
              `text-sm font-bold transition ${isActive && !drafts ? "text-terracotta" : "text-stone-500 hover:text-ink"}`
            }
          >
            Explore recipes
          </NavLink>
          <Link
            to="/recipes?status=draft"
            className={`text-sm font-bold transition ${drafts ? "text-terracotta" : "text-stone-500 hover:text-ink"}`}
          >
            My drafts
          </Link>
        </nav>
        <Link
          to="/recipes/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-terracotta sm:px-5 sm:text-sm"
        >
          <Plus size={17} />{" "}
          <span className="hidden sm:inline">Create recipe</span>
          <span className="sm:hidden">Create</span>{" "}
          <ArrowUpRight size={14} className="hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}
