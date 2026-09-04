import { motion } from "motion/react";
import { productionLines, shifts } from "../data/mockData";

export default function Production() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 03 ] Operations</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Production</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "Total Production", v: "920", u: "units" },
          { l: "Target", v: "1,000", u: "units" },
          { l: "Efficiency", v: "92", u: "%" },
          { l: "Downtime", v: "45", u: "min" },
          { l: "Rejected", v: "18", u: "units" },
        ].map((k) => (
          <div key={k.l} className="glass-card p-5">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[22px] font-medium text-white">{k.v}</span>
              <span className="font-mono text-[10px] text-[#42554f]">{k.u}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Production Lines</h3>
        <div className="space-y-6">
          {productionLines.map((l) => {
            const pct = (l.actual / l.target) * 100;
            return (
              <div key={l.name}>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-white">{l.name}</span>
                  <span className="text-[#42554f]">Target {l.target.toLocaleString()} • Actual {l.actual.toLocaleString()} • {pct.toFixed(0)}%</span>
                </div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#0d1a16]">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className={`h-full rounded-full ${l.status === "Running" ? "bg-gradient-to-r from-[#0fa85c] to-[#22ff7a]" : "bg-gradient-to-r from-[#c77b1e] to-[#ff8c2a]"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {shifts.map((s) => (
          <div key={s.shift} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#42554f]">{s.shift}</div>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${s.status === "Completed" ? "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]" : s.status === "In Progress" ? "border-[#12263a] bg-[#0a151f] text-[#5fb2e3]" : "border-[#1c2f28] text-[#42554f]"}`}>{s.status}</span>
            </div>
            <div className="mt-2 font-medium text-white">{s.output} units • {s.efficiency ? `${s.efficiency}%` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
