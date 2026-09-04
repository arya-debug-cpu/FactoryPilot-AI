import { DeviceRing } from "./gauges";

const stations = [
  { id: "R- F3", v: 74, t: "green" as const, x: 18, y: 36 },
  { id: "Z- 7X", v: 77, t: "green" as const, x: 42, y: 24 },
  { id: "T- 9R", v: 65, t: "green" as const, x: 68, y: 12 },
  { id: "T- 8R", v: 71, t: "green" as const, x: 82, y: 26 },
  { id: "Z- 8X", v: 28, t: "orange" as const, x: 64, y: 36 },
  { id: "T- 4F", v: 74, t: "green" as const, x: 92, y: 38 },
  { id: "C- T2", v: 74, t: "green" as const, x: 50, y: 48 },
  { id: "R- F2", v: 58, t: "green" as const, x: 81, y: 49 },
  { id: "C- T2", v: 59, t: "green" as const, x: 63, y: 62 },
];

export default function FactoryFloor({
  active,
  onSelect,
  className = "",
}: {
  active: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#081715] ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,255,122,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,255,122,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(34,255,122,0.14),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(34,255,122,0.07),transparent_50%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <g opacity="0.45" stroke="#9fb8b1" strokeWidth="18" strokeLinecap="square">
          <line x1="120" y1="220" x2="420" y2="80" />
          <line x1="420" y1="320" x2="720" y2="180" />
          <line x1="260" y1="460" x2="560" y2="320" />
        </g>
        <g opacity="0.9" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="8 10">
          <line x1="120" y1="220" x2="420" y2="80" />
          <line x1="420" y1="320" x2="720" y2="180" />
          <line x1="260" y1="460" x2="560" y2="320" />
        </g>
        <g opacity="0.6" fill="#cbd5d3" stroke="rgba(255,255,255,0.2)">
          <rect x="410" y="145" width="120" height="34" transform="skewX(-20)" rx="2" />
          <rect x="530" y="505" width="120" height="54" transform="skewX(-20)" rx="2" />
          <rect x="830" y="275" width="110" height="110" transform="skewX(-18)" rx="3" />
        </g>
      </svg>

      {stations.map((s, idx) => {
        const isActive = idx === active;
        return (
          <button
            key={`${s.id}-${idx}`}
            onClick={() => onSelect(idx)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            aria-label={`Station ${s.id}, efficiency ${s.v}%`}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`flex items-center gap-2 rounded-full border px-2.5 py-1 backdrop-blur-md transition-all ${
                  isActive || s.t === "orange"
                    ? "border-[#ff8c2a]/50 bg-[#1a120e]/90 shadow-[0_6px_24px_rgba(255,140,42,0.25)]"
                    : "border-white/10 bg-[#101f1c]/80"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.t === "orange" ? "bg-[#ff7a2a]" : "bg-[#22ff7a]"}`} />
                <span className="font-mono text-[10px] font-medium tracking-wide text-white">{s.id}</span>
                <DeviceRing value={s.v} tone={s.t} />
              </div>
              <div className="relative mt-2">
                <div className="absolute left-1/2 top-[54%] h-[86px] w-[110px] -translate-x-1/2 rounded-[18px] bg-[radial-gradient(ellipse_at_center,rgba(34,255,122,0.26),transparent_70%)] blur-[1px]" />
                <div
                  className={`relative h-[84px] w-[110px] rounded-[16px] border bg-gradient-to-b transition-all ${
                    isActive
                      ? "border-[#22ff7a]/50 from-[#0f2b25] to-[#0a1c19] shadow-[0_0_24px_rgba(34,255,122,0.35)]"
                      : "border-white/10 from-[#0f2320] to-[#0b1a18]"
                  }`}
                  style={{ transform: "perspective(600px) rotateX(55deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-[10px] rounded-[10px] border border-white/[0.06]" />
                  <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#22ff7a]/30 bg-[radial-gradient(circle_at_center,rgba(34,255,122,0.9),rgba(34,255,122,0.18)_60%,transparent_70%)]" />
                  <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-[#22ff7a] shadow-[0_0_8px_rgba(34,255,122,0.9)]" />
                  <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-[#22ff7a] shadow-[0_0_8px_rgba(34,255,122,0.9)]" />
                </div>
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
                  <svg width="56" height="66" viewBox="0 0 56 66" fill="none">
                    <path
                      d="M28 10 C28 10 38 13 38 19 L38 26 L34 28 L34 22 L32 20 L24 20 L22 22 L22 28 L18 26 L18 19 C18 13 28 10 28 10Z"
                      fill={s.t === "orange" ? "#ff8a2a" : "#c8fff0"}
                      stroke={s.t === "orange" ? "#ffb57a" : "white"}
                      strokeWidth="0.8"
                    />
                    <path d="M22 28 L18 34 L20 42 L28 46 L36 42 L38 34 L34 28 Z" fill={s.t === "orange" ? "#ff7a2a" : "#aef2dd"} />
                    <path d="M26 46 L26 54 L21 57 L21 60 L35 60 L35 57 L30 54 L30 46 Z" fill={s.t === "orange" ? "#6b2f0a" : "#0e2722"} />
                    <circle cx="28" cy="17" r="3.2" fill={s.t === "orange" ? "#fff1e6" : "white"} />
                  </svg>
                </div>
              </div>
              {isActive ? <span className="mt-1 h-[2px] w-8 rounded-full bg-[#22ff7a] shadow-[0_0_10px_rgba(34,255,122,0.9)]" /> : null}
            </div>
          </button>
        );
      })}

      <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-white/60 backdrop-blur md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22ff7a]" /> Line A
        <span className="mx-1 h-3 w-px bg-white/10" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff8c2a]" /> Alert
      </div>
    </div>
  );
}

export { stations };
