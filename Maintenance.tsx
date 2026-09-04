import { maintenance } from "../data/mockData";

const priorityBadge = (p: string) =>
  p === "Critical" ? "border-[#3a1212] bg-[#1f0a0a] text-[#e35f5f]" : p === "High" ? "border-[#3a2a12] bg-[#1f150a] text-[#f0b45f]" : p === "Medium" ? "border-[#12263a] bg-[#0a151f] text-[#5fb2e3]" : "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]";

export default function Maintenance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 03 ] Operations</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Maintenance</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Upcoming", v: "3" },
          { l: "Overdue", v: "1" },
          { l: "In Progress", v: "0" },
          { l: "Completed", v: "12" },
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
              <tr><th className="px-5 py-3">Machine</th><th className="px-5 py-3">Issue</th><th className="px-5 py-3">Priority</th><th className="px-5 py-3">Scheduled</th><th className="px-5 py-3">Technician</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {maintenance.map((m) => (
                <tr key={m.machine} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-medium text-white">{m.machine}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{m.issue}</td>
                  <td className="px-5 py-3"><span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${priorityBadge(m.priority)}`}>{m.priority}</span></td>
                  <td className="px-5 py-3 text-[#7d938c]">{m.date}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{m.tech}</td>
                  <td className="px-5 py-3"><span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${m.status === "Completed" ? "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]" : "border-[#12263a] bg-[#0a151f] text-[#5fb2e3]"}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
