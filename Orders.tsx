import { useState } from "react";
import { orders } from "../data/mockData";

const riskBadge = (r: string) =>
  r === "High" ? "border-[#3a1212] bg-[#1f0a0a] text-[#e35f5f]" : r === "Medium" ? "border-[#3a2a12] bg-[#1f150a] text-[#f0b45f]" : "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]";

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="mono-label">[ 03 ] Operations</h2>
          <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Orders</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "On Track", "At Risk", "Delayed", "Completed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${filter === f ? "border-[#22ff7a]/50 bg-[#22ff7a]/10 text-[#22ff7a]" : "border-[#1c2f28] text-[#7d938c] hover:border-[#22ff7a]/40 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Total Orders", v: orders.length },
          { l: "Due Today", v: orders.filter((o) => o.deadline === "Today").length },
          { l: "At Risk", v: orders.filter((o) => o.risk === "High").length },
          { l: "Completed", v: orders.filter((o) => o.status === "Completed").length },
        ].map((k) => (
          <div key={k.l} className="glass-card p-4">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 text-[22px] font-medium text-white">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-black/25 text-[10px] uppercase tracking-widest text-[#42554f]">
              <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Product</th><th className="px-5 py-3">Qty</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3">Risk</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-medium text-white">#{o.id}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{o.customer}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{o.product}</td>
                  <td className="px-5 py-3 text-white">{o.qty}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[3px] w-20 overflow-hidden rounded-full bg-[#0d1a16]"><div className="h-full rounded-full bg-gradient-to-r from-[#0fa85c] to-[#22ff7a]" style={{ width: `${o.progress}%` }} /></div>
                      <span className="text-white">{o.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#7d938c]">{o.deadline}</td>
                  <td className="px-5 py-3"><span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${riskBadge(o.risk)}`}>{o.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
