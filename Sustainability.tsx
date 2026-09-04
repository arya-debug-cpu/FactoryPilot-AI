import { motion } from "motion/react";
import { Droplets, Leaf, Recycle, Zap } from "lucide-react";

const goals = [
  { label: "Reduce energy consumption by 15%", pct: 68, icon: Zap },
  { label: "Reduce water usage by 10%", pct: 82, icon: Droplets },
  { label: "Reduce carbon emissions by 20%", pct: 55, icon: Leaf },
  { label: "Divert 60% of waste from landfill", pct: 74, icon: Recycle },
];

export default function Sustainability() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 04 ] Insights</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Sustainability</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Energy Consumption", v: "4.2", u: "MWh", icon: Zap },
          { l: "Water Usage", v: "12,400", u: "L", icon: Droplets },
          { l: "Carbon Emissions", v: "186", u: "tCO₂", icon: Leaf },
          { l: "Waste Generated", v: "42", u: "kg", icon: Recycle },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.l} className="glass-card p-5">
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg border border-[#123a26] bg-[#0a1f15] text-[#5fe39a]"><Icon size={16} /></div>
              <div className="mono-label">{k.l}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[22px] font-medium text-white">{k.v}</span>
                <span className="font-mono text-[10px] text-[#42554f]">{k.u}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Sustainability Goals</h3>
        <div className="space-y-6">
          {goals.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.label}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[12px] text-white"><Icon size={14} className="text-[#5fe39a]" /> {g.label}</span>
                  <span className="font-mono text-[11px] text-[#5fe39a]">{g.pct}%</span>
                </div>
                <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-[#0d1a16]">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-[#0fa85c] to-[#22ff7a]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
