import { workers } from "../data/mockData";

export default function Workers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mono-label">[ 03 ] Operations</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Workers</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { l: "Total Workers", v: "48" },
          { l: "Active Workers", v: "36" },
          { l: "Attendance", v: "92%" },
          { l: "Current Shift", v: "Morning" },
          { l: "Avg Productivity", v: "94%" },
        ].map((k) => (
          <div key={k.l} className="glass-card p-4">
            <div className="mono-label">{k.l}</div>
            <div className="mt-1 text-[20px] font-medium text-white">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-black/25 text-[10px] uppercase tracking-widest text-[#42554f]">
              <tr>
                <th className="px-5 py-3">Employee</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Shift</th><th className="px-5 py-3">Attendance</th><th className="px-5 py-3">Productivity</th><th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {workers.map((w) => (
                <tr key={w.name} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-medium text-white">{w.name}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{w.role}</td>
                  <td className="px-5 py-3 text-[#7d938c]">{w.shift}</td>
                  <td className="px-5 py-3"><span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${w.attendance === "Off" ? "border-[#3a1212] bg-[#1f0a0a] text-[#e35f5f]" : "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]"}`}>{w.attendance}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[3px] w-16 overflow-hidden rounded-full bg-[#0d1a16]"><div className="h-full rounded-full bg-gradient-to-r from-[#0fa85c] to-[#22ff7a]" style={{ width: `${w.prod}%` }} /></div>
                      <span className="text-white">{w.prod}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white">{w.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
