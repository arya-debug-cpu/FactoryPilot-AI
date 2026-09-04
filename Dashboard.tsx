import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  Factory,
  Gauge,
  Layers,
  Map as MapIcon,
  Settings as SettingsIcon,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CircularGauge } from "../components/gauges";
import { productionWeek } from "../data/mockData";

const tooltipStyle = { background: "#0a1714", border: "1px solid rgba(46,232,154,0.18)", borderRadius: 12, fontSize: 12, color: "#e6ebe8" };
const axisProps = { stroke: "#3d5149", fontSize: 11, tickLine: false, axisLine: false } as const;

const notifications = [
  { type: "error", text: "Machine M-12 temperature critical — 94°C detected. Cooling system may be failing.", time: "2 min ago" },
  { type: "warning", text: "Order #1042 at risk — 74% complete, deadline today. Consider reallocating resources.", time: "15 min ago" },
  { type: "success", text: "Maintenance on Machine M-02 completed successfully. Efficiency restored to 91%.", time: "1 hr ago" },
  { type: "info", text: "Inventory replenished — Steel rods +500 units. Stock level restored to 1,240.", time: "3 hr ago" },
  { type: "warning", text: "Steel Sheet 4mm below minimum threshold (320 / 400). Reorder recommended.", time: "4 hr ago" },
];

const notifStyles: Record<string, string> = {
  error: "border-[#4a1515] bg-[#1f0a0a] text-[#f08a8a]",
  warning: "border-[#4a3210] bg-[#1f150a] text-[#f0b45f]",
  success: "border-[#123a26] bg-[#0a1f15] text-[#5fe39a]",
  info: "border-[#12263a] bg-[#0a151f] text-[#7ab8e3]",
};

const energyTrend = [
  { day: "Mon", energy: 4.6, defects: 3.4 },
  { day: "Tue", energy: 4.4, defects: 2.9 },
  { day: "Wed", energy: 4.7, defects: 3.1 },
  { day: "Thu", energy: 4.3, defects: 2.4 },
  { day: "Fri", energy: 4.1, defects: 2.6 },
  { day: "Sat", energy: 4.2, defects: 2.2 },
  { day: "Sun", energy: 4.2, defects: 2.1 },
];

function StatBlock({ label, value, sub, icon, tone = "default" }: { label: string; value: string; sub: string; icon: React.ReactNode; tone?: "default" | "orange" }) {
  const orange = tone === "orange";
  return (
    <div className={`rounded-xl border p-4 ${orange ? "border-[#5a3010] bg-gradient-to-b from-[#2a1608] to-[#1c0f05]" : "border-emerald-400/10 bg-black/25"}`}>
      <div className={`flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] ${orange ? "text-[#ff8c2a]/70" : "text-emerald-100/40"}`}>
        {label} <ArrowUpRight size={10} />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className={`text-[26px] font-medium leading-none ${orange ? "text-[#ff8c2a]" : "text-white"}`}>{value}</div>
          <div className={`mt-1 font-mono text-[10px] ${orange ? "text-[#ff8c2a]/60" : "text-emerald-100/40"}`}>{sub}</div>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-full ${orange ? "bg-[#ff8c2a]/15 text-[#ff8c2a]" : "bg-[#2ee89a]/10 text-[#2ee89a]"}`}>{icon}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.6rem] font-bold text-[#2ee89a] md:text-[1.9rem]">Factory Overview</h1>
          <p className="mt-1 text-sm text-emerald-100/50">Real-time monitoring of all factory operations</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-100/40">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2ee89a]" /> Good morning, Alex — 3 alerts need attention
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* ===== LEFT COLUMN ===== */}
        <div className="space-y-4 lg:col-span-3">
          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] text-white"><span className="grid h-5 w-5 place-items-center rounded bg-[#2ee89a] text-black"><Layers size={11} /></span>Data Overview</span>
              <SettingsIcon size={12} className="text-emerald-100/40" />
            </div>
            <div className="space-y-2">
              {[
                { icon: <Activity size={13} />, l: "Accumulated working hours", v: "201", u: "h" },
                { icon: <Droplets size={13} />, l: "Accumulated steam quantity", v: "500.21", u: "T" },
                { icon: <Users size={13} />, l: "Number of staff", v: "24/30", u: "Staff" },
                { icon: <Zap size={13} />, l: "Voltage", v: "42/60", u: "V", alert: true },
              ].map((r) => (
                <div key={r.l} className="flex items-center gap-3 rounded-lg border border-emerald-400/[0.08] bg-black/25 px-3 py-2.5">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${r.alert ? "bg-[#2a1608] text-[#ff8c2a]" : "bg-emerald-400/10 text-[#2ee89a]"}`}>{r.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-100/40">{r.l}</div>
                    <div className="font-mono text-[12px] font-medium text-white">{r.v} <span className="text-[9px] text-emerald-100/40">{r.u}</span></div>
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full ${r.alert ? "bg-[#ff8c2a]" : "bg-[#2ee89a]"}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white"><span className="grid h-5 w-5 place-items-center rounded bg-[#2ee89a] text-black"><MapIcon size={11} /></span>Map</span>
              <SettingsIcon size={12} className="text-emerald-100/40" />
            </div>
            <div className="relative h-[150px] overflow-hidden rounded-xl border border-emerald-400/10 bg-[#04120b]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(46,232,154,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(46,232,154,0.4) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="absolute left-1/2 top-1/2 h-14 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#2ee89a] shadow-[0_0_40px_rgba(46,232,154,0.7)]" />
              <span className="absolute bottom-2 right-3 font-mono text-[9px] tracking-widest text-emerald-100/40">LINE_3</span>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#2ee89a]" />LP - 2</div>
            <div className="flex justify-center py-2"><CircularGauge completed={24} planned={53} /></div>
          </div>
          <div className="glass-card p-4">
            <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#2ee89a]" />LP - 3</div>
            <div className="flex justify-center py-2"><CircularGauge completed={56} planned={84} /></div>
          </div>
        </div>

        {/* ===== CENTER COLUMN ===== */}
        <div className="space-y-4 lg:col-span-6">
          <div className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2ee89a]">Production vs Target</h3>
                <p className="text-xs text-emerald-100/45">Daily output comparison</p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-xs text-[#5fe39a]"><ArrowUpRight size={13} /> +8.2% this week</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={productionWeek} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="target" fill="rgba(0, 248, 74, 0.68)" radius={[6, 6, 0, 0]} name="Target" />
                <Bar dataKey="output" fill="#3b83f6a1" radius={[6, 6, 0, 0]} name="Output" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#2a1608] font-mono text-[12px] font-bold text-[#ff8c2a]">!</span>
              <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-white">Smart Notifications</h3>
            </div>
            <div className="max-h-[300px] space-y-2.5 overflow-y-auto pr-1">
              {notifications.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-xl border p-3.5 ${notifStyles[n.type]}`}
                >
                  <p className="text-sm leading-snug">{n.text}</p>
                  <span className="mt-1.5 block font-mono text-[10px] opacity-60">{n.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="space-y-4 lg:col-span-3">
          <div className="glass-card border-[#123a26] bg-[#0a1f15] p-4">
            <p className="text-sm leading-relaxed text-emerald-100/70">
              Defect rate improved to <span className="font-semibold text-[#2ee89a]">1.8%</span> — lowest in 6 weeks. Line C still needs attention.
            </p>
          </div>

          <StatBlock label="Total number of devices" value="201" sub="Devices" icon={<Gauge size={15} />} />
          <div className="grid grid-cols-2 gap-3">
            <StatBlock label="Working" value="15" sub="Devices" icon={<Activity size={13} />} />
            <StatBlock label="Under repair" value="4" sub="Devices" icon={<Wrench size={13} />} tone="orange" />
          </div>
          <StatBlock label="To be repaired" value="5" sub="Devices" icon={<AlertTriangle size={14} />} />

          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2ee89a]">Energy Consumption <span className="text-[12px]">⚡</span></h3>
              <span className="font-mono text-[10px] text-[#f0b45f]">4.2 MWh avg</span>
            </div>
            <p className="text-xs text-emerald-100/45">MWh &amp; defects trend</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={energyTrend} margin={{ top: 12, right: 4, left: 4, bottom: 0 }}>
                <XAxis dataKey="day" {...axisProps} fontSize={9} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={1.6} dot={{ fill: "#f59e0b", r: 2.5 }} name="Energy" />
                <Line type="monotone" dataKey="defects" stroke="#ef4444" strokeWidth={1.6} dot={{ fill: "#ef4444", r: 2.5 }} name="Defects" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card flex items-center justify-between p-4">
            <span className="flex items-center gap-2 font-mono text-[11px] text-white"><Factory size={13} className="text-[#2ee89a]" /> AI Engine Online</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2ee89a]" />
          </div>
        </div>
      </div>
    </div>
  );
}
