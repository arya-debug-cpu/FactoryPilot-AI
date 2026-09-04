import { inventory } from "../data/mockData";

const statusBadge = (s: string) =>
  s === "Critical" ? "border-[#3a1212] bg-[#1f0a0a] text-[#e35f5f]" : s === "Reorder Recommended" ? "border-[#3a2a12] bg-[#1f150a] text-[#f0b45f]" : "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 03 ] Operations</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Inventory</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Total Materials", v: "3,240", s: "SKUs tracked" },
          { l: "Low Stock", v: "2", s: "Reorder needed" },
          { l: "Critical Stock", v: "1", s: "Immediate action" },
          { l: "Incoming", v: "4", s: "Shipments this week" },
        ].map((k) => (
          <div key={k.l} className="glass-card p-5">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 text-[22px] font-medium text-white">{k.v}</div>
            <div className="mt-1 font-mono text-[10px] text-[#42554f]">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-black/25 text-[10px] uppercase tracking-widest text-[#42554f]">
              <tr><th className="px-5 py-3">Material</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Minimum</th><th className="px-5 py-3">Supplier</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {inventory.map((it) => {
                const ratio = Math.min(it.stock / it.min, 2) / 2;
                return (
                  <tr key={it.material} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{it.material}</td>
                    <td className="px-5 py-3 text-[#7d938c]">{it.category}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{it.stock}</span>
                        <div className="h-[3px] w-14 overflow-hidden rounded-full bg-[#0d1a16]"><div className={`h-full rounded-full ${ratio < 0.5 ? "bg-[#ff5a3d]" : ratio < 0.9 ? "bg-[#ff8c2a]" : "bg-[#22ff7a]"}`} style={{ width: `${ratio * 100}%` }} /></div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#7d938c]">{it.min}</td>
                    <td className="px-5 py-3 text-[#7d938c]">{it.supplier}</td>
                    <td className="px-5 py-3"><span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${statusBadge(it.status)}`}>{it.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
