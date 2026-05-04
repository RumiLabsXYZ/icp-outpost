import { Link, NavLink } from "react-router-dom";
import { useTheme } from "@/theme/ThemeProvider";
import { SearchBar } from "./SearchBar";
import { HealthPill } from "./HealthPill";
import { APP_CONFIG } from "@/app.config";

function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();
  return (
    <select
      aria-label="Theme"
      value={theme}
      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
      className="bg-transparent text-ink-muted rounded-sm px-1.5 py-0.5 text-[11px] border border-quartz focus:outline-none"
    >
      <option value="system">sys</option>
      <option value="light">lgt</option>
      <option value="dark">drk</option>
    </select>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-quartz bg-vellum/90 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-3 py-2.5 md:flex-row md:items-center md:gap-5">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex flex-col leading-none whitespace-nowrap">
            <span className="font-semibold tracking-tightest text-ink-primary text-[15px]">{APP_CONFIG.name}</span>
            {APP_CONFIG.tagline && (
              <span className="text-[9px] font-mono text-ink-disabled tracking-[0.12em] uppercase">{APP_CONFIG.tagline}</span>
            )}
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <HealthPill />
            <ThemeToggleCompact />
          </div>
        </div>
        <SearchBar />
        <nav className="hidden md:flex items-center gap-0.5 text-sm">
          {APP_CONFIG.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-2 py-1 text-sm rounded-sm transition-colors ${
                  isActive
                    ? "text-ink-primary border-b-2 border-verdigris"
                    : "text-ink-muted hover:text-ink-secondary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <HealthPill />
          <ThemeToggleCompact />
        </div>
      </div>
    </header>
  );
}
