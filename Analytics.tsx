import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar,
} from "recharts";
import { productionWeek, defectTrend, energyData, machines } from "../data/mockData";

const tooltipStyle = { background: "#0a1714", border: "1px solid rgba(34,255,122,0.18)", borderRadius: "12px", fontSize: "12px", color: "#e6ebe8" };
const axis = { stroke: "#42554f", fontSize: 11, tickLine: false, axisLine: false };

export default function Analytics() {
  const [range, setRange] = useState("30 Days");

  const utilizationData = machines.filter((m) => m.status !== "maintenance").map((m) => ({
    machine: m.id,
    utilization: m.efficiency,
    status: m.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="mono-label">[ 04 ] Insights</h2>
          <h1 className="text-[1.9rem] font-medium tracking-tight text-white">Production Analytics</h1>
          <p className="mt-1 font-mono text-[11px] text-[#42554f]">Comprehensive insights across all factory operations</p>
        </div>
        <div className="flex gap-2">
          {["Today", "7 Days", "30 Days", "90 Days"].map((d) => (
            <button key={d} onClick={() => setRange(d)} className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${range === d ? "border-[#22ff7a]/50 bg-[#22ff7a]/10 text-[#22ff7a]" : "border-[#1c2f28] text-[#7d938c] hover:border-[#22ff7a]/40 hover:text-white"}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Daily Production Output</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={productionWeek}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22ff7a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22ff7a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(34,255,122,0.2)" }} />
              <Area type="monotone" dataKey="output" stroke="#22ff7a" strokeWidth={2} fill="url(#prodGrad)" name="Output" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Machine Utilization</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={utilizationData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="machine" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(34,255,122,0.05)" }} />
              <Bar dataKey="utilization" radius={[6, 6, 0, 0]} name="Utilization %">
                {utilizationData.map((entry, i) => (
                  <Cell key={i} fill={entry.status === "warning" ? "#ff8c2a" : "#22ff7a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Defect Trends (6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={defectTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="week" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="defects" stroke="#ff5a3d" strokeWidth={2} dot={{ fill: "#ff5a3d", r: 4 }} name="Defects" />
              <Line type="monotone" dataKey="rate" stroke="#ff8c2a" strokeWidth={2} dot={{ fill: "#ff8c2a", r: 4 }} name="Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Downtime Analysis</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[{ name: "Mechanical", value: 42 }, { name: "Electrical", value: 24 }, { name: "Material", value: 18 }, { name: "Changeover", value: 16 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {["#22ff7a", "#ff8c2a", "#5fb2e3", "#ff5a3d"].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Energy Consumption</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c2a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff8c2a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5fb2e3" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5fb2e3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="electricity" stroke="#ff8c2a" strokeWidth={2} fill="url(#elecGrad)" name="Electricity" />
              <Area type="monotone" dataKey="gas" stroke="#5fb2e3" strokeWidth={2} fill="url(#gasGrad)" name="Gas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Material Usage Efficiency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart data={[{ name: "Efficiency", value: 87, fill: "#22ff7a" }]} innerRadius="55%" outerRadius="100%" startAngle={90} endAngle={-270}>
              <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={10} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="26" fontWeight="600">87%</text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div><div className="text-sm font-semibold text-white">94.2%</div><div className="text-[10px] text-[#42554f]">Raw Material</div></div>
            <div><div className="text-sm font-semibold text-[#5fe39a]">48%</div><div className="text-[10px] text-[#42554f]">Recycled</div></div>
            <div><div className="text-sm font-semibold text-[#f0b45f]">42kg</div><div className="text-[10px] text-[#42554f]">Waste</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
