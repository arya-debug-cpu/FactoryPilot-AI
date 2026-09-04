import { useState } from "react";

export default function Settings() {
  const [prefs, setPrefs] = useState({ ai: true, refresh: true, dark: true, critical: true, warning: true, maint: true, orders: true, insights: false });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-[#22ff7a]" : "bg-[#1c2f28]"}`} aria-pressed={on}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div>
        <h2 className="mono-label">[ 05 ] System</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Settings</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Company Profile</h3>
          <div className="space-y-2.5 font-mono text-[11px] text-[#7d938c]">
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Name</span><span className="text-white">Apex Manufacturing Group</span></div>
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Location</span><span className="text-white">Detroit, MI</span></div>
            <div className="flex justify-between"><span>Facility</span><span className="text-white">Plant 3 — Assembly & Weld</span></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Dashboard Preferences</h3>
          <div className="space-y-4">
            {([
              ["ai", "Show AI recommendations"],
              ["refresh", "Auto-refresh every 30s"],
              ["dark", "Dark mode"],
            ] as const).map(([k, label]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#7d938c]">{label}</span>
                <Toggle on={prefs[k]} onClick={() => toggle(k)} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 md:col-span-2">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Notifications</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ["critical", "Critical alerts"],
              ["warning", "Warning alerts"],
              ["maint", "Maintenance reminders"],
              ["orders", "Order updates"],
              ["insights", "AI insights digest"],
            ] as const).map(([k, label]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/20 px-4 py-3">
                <span className="font-mono text-[11px] text-[#9db5ad]">{label}</span>
                <Toggle on={prefs[k]} onClick={() => toggle(k)} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Security</h3>
          <div className="space-y-2.5 font-mono text-[11px] text-[#7d938c]">
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Two-factor auth</span><span className="text-[#5fe39a]">Enabled</span></div>
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Session timeout</span><span className="text-white">30 min</span></div>
            <div className="flex justify-between"><span>API tokens</span><span className="text-white">2 active</span></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">User Preferences</h3>
          <div className="space-y-2.5 font-mono text-[11px] text-[#7d938c]">
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Language</span><span className="text-white">English (US)</span></div>
            <div className="flex justify-between border-b border-white/[0.05] pb-2"><span>Timezone</span><span className="text-white">America/Detroit</span></div>
            <div className="flex justify-between"><span>Units</span><span className="text-white">Metric</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
