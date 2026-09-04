import { Link, useLocation } from "react-router-dom";
import { Search, Bell, Menu, Sparkles } from "lucide-react";

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const page = parts[parts.length - 1] || "dashboard";
  const titles: Record<string, string> = {
    dashboard: "Factory Overview",
    assistant: "AI Assistant",
    production: "Production",
    machines: "Machines",
    workers: "Workers",
    inventory: "Inventory",
    orders: "Orders",
    maintenance: "Maintenance",
    quality: "Quality Control",
    analytics: "Analytics",
    sustainability: "Sustainability",
    settings: "Settings",
  };

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center gap-4 border-b border-[#122019] bg-[#071210]/85 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-md border border-[#1c2f28] text-[#6f857e] hover:text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#42554f] md:flex">
        <Link to="/dashboard" className="hover:text-white">
          Home
        </Link>
        <span className="text-[#1c2f28]">/</span>
        {parts.map((p, i) => (
          <span key={p} className={i === parts.length - 1 ? "text-[#22ff7a]" : "text-[#42554f]"}>
            {p}
          </span>
        ))}
      </div>

      <div className="mx-2 hidden h-4 w-px bg-[#122019] md:block" />

      <div>
        <h1 className="text-[15px] font-semibold tracking-tight text-white">{titles[page] || page}</h1>
        <p className="hidden font-mono text-[10px] tracking-wide text-[#42554f] md:block">Real-time monitoring</p>
      </div>

      <div className="flex-1" />

      <div className="hidden items-center gap-2 rounded-full border border-[#152420] bg-[#0a1714] px-3 py-2 text-[12px] text-[#42554f] lg:flex">
        <Search size={14} />
        <span>Search machines, orders, workers...</span>
      </div>

      <Link
        to="/dashboard/assistant"
        className="hidden items-center gap-2 rounded-full border border-[#152420] bg-[#0a1714] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#7d938c] transition hover:border-[#22ff7a]/40 hover:text-white md:inline-flex"
      >
        <Sparkles size={12} className="text-[#22ff7a]" /> Ask AI
      </Link>

      <button className="relative grid h-9 w-9 place-items-center rounded-full border border-[#152420] bg-[#0a1714] text-[#7d938c] transition hover:text-white">
        <Bell size={16} />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#071210] bg-[#ff7a2a]" />
      </button>

      <div className="flex items-center gap-3 border-l border-[#122019] pl-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#22ff7a] to-[#0fa85c] font-mono text-[11px] font-bold text-black">
          AM
        </div>
        <div className="hidden md:block">
          <div className="text-[12px] font-medium leading-none text-white">Alex Morgan</div>
          <div className="mt-1 font-mono text-[10px] leading-none text-[#42554f]">Factory Manager</div>
        </div>
      </div>
    </header>
  );
}
