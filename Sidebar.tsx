import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Factory,
  Cog,
  Users,
  Boxes,
  ClipboardList,
  Wrench,
  ShieldCheck,
  BarChart3,
  Leaf,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
};

const sections = [
  {
    label: "MAIN",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { to: "/dashboard/production", label: "Production", icon: Factory },
      { to: "/dashboard/machines", label: "Machines", icon: Cog },
      { to: "/dashboard/workers", label: "Workers", icon: Users },
      { to: "/dashboard/inventory", label: "Inventory", icon: Boxes },
      { to: "/dashboard/orders", label: "Orders", icon: ClipboardList },
      { to: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { to: "/dashboard/quality", label: "Quality Control", icon: ShieldCheck },
      { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/dashboard/sustainability", label: "Sustainability", icon: Leaf },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ to: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
];

export default function Sidebar({ collapsed, onToggle, mobile = false }: Props) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-[#152420] bg-[#071210] text-white transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[264px]"
      }`}
    >
      <div className="flex h-[68px] items-center justify-between border-b border-[#122019] px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#22ff7a] font-mono text-[13px] font-bold text-black shadow-[0_4px_16px_rgba(34,255,122,0.35)]">
            ↗
          </div>
          {!collapsed && (
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white">
              FactoryPilot <span className="text-[#22ff7a]">AI</span>
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="grid h-8 w-8 place-items-center rounded-md border border-[#1c2f28] text-[#6f857e] transition hover:border-[#22ff7a]/40 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {mobile ? <X size={16} /> : collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        {sections.map((sec) => (
          <div key={sec.label} className="mb-7">
            {!collapsed && (
              <div className="mb-3 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#42554f]">{sec.label}</div>
            )}
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-[#22ff7a]/10 text-[#22ff7a] shadow-[inset_0_0_0_1px_rgba(34,255,122,0.25)]"
                          : "text-[#7d938c] hover:bg-[#0d1a16] hover:text-white"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                  >
                    <Icon size={18} strokeWidth={1.6} />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#22ff7a] opacity-0 transition-opacity group-[.active]:opacity-100" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="m-3 rounded-xl border border-[#152a22] bg-[#0a1714] p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#22ff7a]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9db5ad]">AI Engine Online</span>
          </div>
          <p className="mt-2 font-mono text-[10px] leading-snug text-[#42554f]">
            Processing 1,284 sensors in real-time
          </p>
        </div>
      )}
    </aside>
  );
}
