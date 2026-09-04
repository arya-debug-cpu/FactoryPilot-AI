export function CircularGauge({ completed, planned }: { completed: number; planned: number }) {
  const pct = Math.min(completed / planned, 1);
  const r = 52;
  const circ = Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="relative flex h-[92px] w-[156px] items-end justify-center">
      <svg width="156" height="92" viewBox="0 0 156 92" className="overflow-visible">
        <path d="M 14 86 A 64 64 0 0 1 142 86" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 14 86 A 64 64 0 0 1 142 86"
          fill="none"
          stroke="#22ff7a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: "drop-shadow(0 0 8px rgba(34,255,122,0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[28px] font-light tracking-tight text-white">{completed}</span>
          <span className="text-[14px] font-light text-white/60">{planned}</span>
        </div>
        <div className="mt-1 flex gap-3 font-mono text-[8px] uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="h-2 w-2 rounded-[2px] bg-[#22ff7a]" /> Completed
          </span>
          <span className="flex items-center gap-1.5 text-white/60">
            <span className="h-2 w-2 rounded-[2px] bg-[#ff8c2a]" /> Planned
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-[18px] left-1/2 h-[56px] w-[2px] origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${pct * 180 - 90}deg)` }}
      >
        <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[10px] border-l-[6px] border-r-[6px] border-b-[#ffcf7a] border-l-transparent border-r-transparent drop-shadow-[0_2px_6px_rgba(255,140,42,0.8)]" />
      </div>
      <div className="absolute bottom-[16px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

export function DeviceRing({ value, tone = "green" }: { value: number; tone?: "green" | "orange" }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(6, Math.min(100, value));
  const dash = (pct / 100) * circ;
  const color = tone === "orange" ? "#ff7a2a" : "#22ff7a";
  return (
    <div className="relative h-9 w-9 shrink-0">
      <svg width={36} height={36} viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}99)` }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-[10px] font-medium text-white">{value}</span>
    </div>
  );
}
