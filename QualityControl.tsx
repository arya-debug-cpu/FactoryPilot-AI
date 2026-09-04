import { motion } from "motion/react";
import { defectTypes, productionLines } from "../data/mockData";

export default function QualityControl() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 04 ] Insights</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Quality Control</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Quality Score", v: "96.2%", s: "Above target" },
          { l: "Defect Rate", v: "2.1%", s: "−0.3% vs last week" },
          { l: "Rejected Units", v: "18", s: "This shift" },
          { l: "Passed Inspection", v: "1,842", s: "Today" },
        ].map((k) => (
          <div key={k.l} className="glass-card p-5">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 text-[22px] font-medium text-white">{k.v}</div>
            <div className="mt-1 font-mono text-[10px] text-[#42554f]">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Common Defect Types</h3>
          <div className="space-y-4">
            {defectTypes.map((d) => (
              <div key={d.type}>
                <div className="flex justify-between font-mono text-[11px]"><span className="text-white">{d.type}</span><span className="text-[#42554f]">{d.pct}%</span></div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#0d1a16]">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-[#c77b1e] to-[#ff8c2a]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Line Comparison — Pass Rate</h3>
          <div className="space-y-5">
            {productionLines.map((l, i) => {
              const pass = [97.2, 96.4, 93.8, 98.1][i];
              return (
                <div key={l.name}>
                  <div className="flex justify-between font-mono text-[11px]"><span className="text-white">{l.name}</span><span className="text-[#42554f]">{pass}%</span></div>
                  <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#0d1a16]">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pass}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-[#0fa85c] to-[#22ff7a]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
