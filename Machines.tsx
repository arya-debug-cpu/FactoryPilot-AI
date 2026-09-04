import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, Thermometer, X } from "lucide-react";
import { machines, type Machine } from "../data/mockData";

const statusBadge = (s: string) =>
  s === "running" ? "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]" : s === "warning" ? "border-[#3a2a12] bg-[#1f150a] text-[#f0b45f]" : s === "maintenance" ? "border-[#12263a] bg-[#0a151f] text-[#5fb2e3]" : "border-[#3a1212] bg-[#1f0a0a] text-[#e35f5f]";

export default function Machines() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Machine | null>(null);
  const filtered = filter === "All" ? machines : machines.filter((m) => m.status === filter.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="mono-label">[ 03 ] Operations</h2>
          <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Machines</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Running", "Warning", "Maintenance", "Offline"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${filter === f ? "border-[#22ff7a]/50 bg-[#22ff7a]/10 text-[#22ff7a]" : "border-[#1c2f28] text-[#7d938c] hover:border-[#22ff7a]/40 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Total Machines", v: machines.length },
          { l: "Running", v: machines.filter((m) => m.status === "running").length },
          { l: "Warning", v: machines.filter((m) => m.status === "warning").length },
          { l: "Maintenance", v: machines.filter((m) => m.status === "maintenance").length },
        ].map((k) => (
          <div key={k.l} className="glass-card p-4">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 text-[22px] font-medium text-white">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <button key={m.id} onClick={() => setSelected(m)} className="glass-card p-5 text-left transition-colors hover:border-[#22ff7a]/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[14px] font-medium text-white">{m.id}</span>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${statusBadge(m.status)}`}>{m.status}</span>
            </div>
            <div className="text-[12px] text-[#9db5ad]">{m.name}</div>
            <div className="mt-3 grid grid-cols-4 gap-3 font-mono text-[10px] text-[#42554f]">
              <div><div className="text-[9px]">Temp</div><div className="flex items-center gap-1 text-white"><Thermometer size={10} />{m.temp}°C</div></div>
              <div><div className="text-[9px]">Eff</div><div className="flex items-center gap-1 text-white"><Activity size={10} />{m.efficiency}%</div></div>
              <div><div className="text-[9px]">Health</div><div className="text-white">{m.health}%</div></div>
              <div><div className="text-[9px]">Down</div><div className="text-white">{m.downtime}m</div></div>
            </div>
            <div className="mt-3 font-mono text-[10px] text-[#2c3d38]">Runtime {m.runtime} • Last {m.lastMaint}</div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="w-full max-w-md rounded-2xl border border-[#1c2f28] bg-[#0a1714] p-6" initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} transition={{ ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-[14px] text-white">Machine {selected.id} — {selected.name}</h3>
                <button onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-md border border-[#1c2f28] text-[#7d938c] hover:text-white" aria-label="Close"><X size={16} /></button>
              </div>
              <div className="space-y-2.5 font-mono text-[11px] text-[#7d938c]">
                {[
                  ["Status", selected.status],
                  ["Temperature", `${selected.temp}°C`],
                  ["Efficiency", `${selected.efficiency}%`],
                  ["Health Score", `${selected.health}%`],
                  ["Runtime", selected.runtime],
                  ["Downtime", `${selected.downtime}m`],
                  ["Last Maintenance", selected.lastMaint],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/[0.05] pb-2"><span>{k}</span><span className="capitalize text-white">{v}</span></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
