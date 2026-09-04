import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Droplets,
  Factory,
  Gauge,
  Layers,
  Lightbulb,
  Map as MapIcon,
  SearchCode,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import FactoryFloor, { stations } from "../components/FactoryFloor";
import LineRobot from "../components/LineRobot";
import SandTransitionImage from "../components/SandTransitionImage";

const fadeUp: Variants = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Machines", href: "#live-ops" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const chaptersData = [
  { name: "Unified Data Integration", meta: "ERP, IoT, workers, machines", value: "12 sources live", image: "https://images.pexels.com/photos/18469652/pexels-photo-18469652.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Real-Time Production Logs", meta: "Units, targets, shift output", value: "94% to plan", image: "https://images.pexels.com/photos/5532674/pexels-photo-5532674.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Predictive Machine Health", meta: "Heat, vibration, service risk", value: "7 days notice", image: "https://images.pexels.com/photos/34222005/pexels-photo-34222005.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Root Cause Analysis", meta: "Bottlenecks explained fast", value: "3 causes found", image: "https://images.pexels.com/photos/7480242/pexels-photo-7480242.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { name: "Smart Recommendations", meta: "Actions that protect throughput", value: "18 min saved", image: "https://images.pexels.com/photos/33427061/pexels-photo-33427061.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
];

function OverviewRow({ icon, label, value, unit, alert }: { icon: React.ReactNode; label: string; value: string; unit: string; alert?: boolean }) {
  return (
    <div className="rounded-xl border border-emerald-400/10 bg-black/25 p-3">
      <div className="flex items-center gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${alert ? "bg-[#2a1608] text-[#ff8c2a]" : "bg-emerald-400/10 text-[#2ee89a]"}`}>{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-100/40">{label}</div>
          <div className="mt-0.5 font-mono text-[13px] font-medium text-white">
            {value} <span className="text-[9px] text-emerald-100/40">{unit}</span>
          </div>
        </div>
        <span className={`h-2 w-2 rounded-full ${alert ? "bg-[#ff8c2a]" : "bg-[#2ee89a]"}`} />
      </div>
    </div>
  );
}

function DeviceTile({ id, v, tone }: { id: string; v: number; tone: "green" | "orange" }) {
  const c = tone === "orange" ? "#ff8c2a" : "#2ee89a";
  return (
    <div className={`relative rounded-xl border p-3 ${tone === "orange" ? "border-[#5a3010] bg-[#1c0f05]" : "border-emerald-400/10 bg-black/25"}`}>
      <div className="flex items-center gap-2">
        <span className="h-3 w-[3px] rounded-full" style={{ background: c }} />
        <span className="font-mono text-[10px] font-medium text-white">{id}</span>
        <span className="font-mono text-[11px]" style={{ color: c }}>{v}</span>
        <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4" fill="none">
          <path d="M12 21a9 9 0 1 1 9-9" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <path d="M12 21a9 9 0 0 0 9-9h-9z" fill={c} opacity="0.7" />
        </svg>
      </div>
      <LineRobot tone={tone} className="mx-auto mt-2 h-12 w-12" />
    </div>
  );
}

export default function LandingPage() {
  const [activeStation, setActiveStation] = useState(4);
  const [activeChapter, setActiveChapter] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStation((p) => (p + 1) % stations.length);
      setActiveChapter((p) => (p + 1) % chaptersData.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  const chapter = chaptersData[activeChapter];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#04130c] font-sans text-white antialiased">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[700px] rounded-full bg-[#2ee89a]/[0.07] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#0fa85c]/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(46,232,154,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(46,232,154,0.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }}
        />
      </div>

      {/* header */}
      <header className="relative z-20 flex items-center justify-between gap-6 px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2ee89a] text-black shadow-[0_0_24px_rgba(46,232,154,0.4)]"><Activity size={18} /></span>
          <span className="text-[15px] font-bold tracking-tight">FactoryPilot <span className="text-[#2ee89a]">AI</span></span>
        </Link>
        <p className="hidden max-w-[360px] font-mono text-[11px] leading-relaxed text-emerald-100/50 lg:block">
          Unified factory data into real-time decisions, predictions, and uptime.
        </p>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-100/60 transition hover:text-[#2ee89a]">
              {l.label}
            </a>
          ))}
        </nav>
        <button className="flex flex-col gap-1.5 md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <span className={`h-[1.5px] w-6 bg-[#2ee89a] transition ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-6 bg-[#2ee89a] transition ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative z-20 overflow-hidden border-b border-emerald-400/10 bg-[#04130c] px-6 md:hidden">
            <div className="flex flex-col gap-5 py-6">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="font-mono text-[13px] uppercase tracking-[0.2em] text-emerald-100/70">{l.label}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ============ HERO ============ */}
      <section className="relative z-10 grid gap-12 px-6 pb-24 pt-8 md:px-12 lg:grid-cols-[5fr_7fr] lg:gap-8 lg:pt-14">
        {/* left */}
        <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }} className="flex flex-col">
          <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#2ee89a]">
            <span>01</span>
            <span className="h-px w-16 bg-[#2ee89a]/40" />
            <span>Live Ops</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-[clamp(3rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            The AI
            <br />
            copilot for
            <br />
            <span className="text-[#2ee89a]">factory floors.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-8 max-w-md text-[15px] leading-[1.7] text-emerald-100/60">
            Factory Pilot AI unifies data from machines, ERP, workers, and IoT sensors — then predicts failures, explains root causes, and tells you exactly what to do next.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-[#2ee89a] px-6 py-3.5 text-[15px] font-semibold text-[#04130c] shadow-[0_0_32px_rgba(46,232,154,0.35)] transition hover:shadow-[0_0_48px_rgba(46,232,154,0.55)]"
            >
              <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
              Launch Pilot
            </Link>
            <a href="#live-ops" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 px-6 py-3.5 text-[15px] font-medium text-white transition hover:border-[#2ee89a]/60 hover:bg-[#2ee89a]/5">
              See it in action <ArrowUpRight size={16} />
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-16 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center gap-[4px] rounded-full border border-[#2ee89a]/30">
              <span className="h-3 w-px bg-[#2ee89a]" />
              <span className="h-3 w-px bg-[#2ee89a]" />
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#2ee89a]/80">Scroll to explore</span>
          </motion.div>
        </motion.div>

        {/* right — dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-emerald-400/10 bg-gradient-to-b from-[#0a2016] to-[#06170f] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          <div className="grid gap-3 lg:grid-cols-[200px_1fr_190px]">
            {/* data overview */}
            <div className="space-y-2.5 rounded-xl border border-emerald-400/10 bg-black/20 p-3">
              <div className="flex items-center justify-between pb-1">
                <span className="flex items-center gap-2 font-mono text-[11px] text-white"><span className="grid h-5 w-5 place-items-center rounded bg-[#2ee89a] text-black"><Layers size={11} /></span>Data Overview</span>
                <SettingsIcon size={12} className="text-emerald-100/40" />
              </div>
              <OverviewRow icon={<Activity size={14} />} label="Accumulated working hours" value="201" unit="h" />
              <OverviewRow icon={<Droplets size={14} />} label="Accumulated steam quantity" value="500.21" unit="T" />
              <OverviewRow icon={<Users size={14} />} label="Number of staff" value="24/30" unit="Staff" />
              <OverviewRow icon={<Zap size={14} />} label="Voltage" value="42/60" unit="V" alert />
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-2 font-mono text-[11px] text-white"><span className="grid h-5 w-5 place-items-center rounded bg-[#2ee89a] text-black"><MapIcon size={11} /></span>Map</span>
                <SettingsIcon size={12} className="text-emerald-100/40" />
              </div>
            </div>

            {/* center — timeline + tiles */}
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-3">
                <div className="relative h-2 rounded-full bg-emerald-400/10">
                  <div className="absolute inset-y-0 left-0 w-[68%] rounded-full bg-[#2ee89a] shadow-[0_0_12px_rgba(46,232,154,0.6)]" />
                  {[18, 34, 50, 62, 78, 90].map((p, i) => (
                    <span key={i} className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#ff8c2a]" style={{ left: `${p}%` }} />
                  ))}
                  <span className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ left: "68%" }} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[8px] text-emerald-100/40">
                  {["10:00", "10:15", "10:30", "10:45", "11:00"].map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {stations.slice(0, 6).map((s, i) => (
                  <button key={i} onClick={() => setActiveStation(i)} className={`transition ${i === activeStation % 6 ? "scale-[1.02]" : "opacity-90 hover:opacity-100"}`}>
                    <DeviceTile id={s.id} v={s.v} tone={s.t} />
                  </button>
                ))}
              </div>
            </div>

            {/* right — device stats */}
            <div className="space-y-2.5">
              <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-3">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-100/40">Total number of devices <ArrowUpRight size={10} /></div>
                <div className="mt-1 flex items-end justify-between">
                  <div className="flex items-baseline gap-1.5"><span className="text-[30px] font-medium leading-none text-white">201</span><span className="font-mono text-[10px] text-emerald-100/40">Devices</span></div>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[#2ee89a]/30 bg-[#2ee89a]/10 text-[#2ee89a]"><Gauge size={15} /></span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-3">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-100/40">Working</div>
                  <div className="mt-1 text-[22px] font-medium text-white">15</div>
                  <div className="font-mono text-[9px] text-emerald-100/40">Devices</div>
                </div>
                <div className="rounded-xl border border-[#5a3010] bg-gradient-to-b from-[#2a1608] to-[#1c0f05] p-3">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#ff8c2a]/70">Under repair</div>
                  <div className="mt-1 text-[22px] font-medium text-[#ff8c2a]">4</div>
                  <div className="font-mono text-[9px] text-[#ff8c2a]/60">Devices</div>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-3">
                <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-100/40">To be repaired</div>
                <div className="mt-1 flex items-end justify-between">
                  <div className="flex items-baseline gap-1.5"><span className="text-[22px] font-medium text-white">5</span><span className="font-mono text-[9px] text-emerald-100/40">Devices</span></div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2ee89a]/10 text-[#2ee89a]"><Wrench size={13} /></span>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-400/10 bg-black/20 p-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-white"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#2ee89a]" />LP - 3</span><ArrowUpRight size={10} className="text-emerald-100/40" /></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ EXPLORE PLATFORM ============ */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mb-10 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#2ee89a]">
          [ 02 ] <span className="text-white">Explore the platform</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center text-[clamp(2.2rem,5.5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.02em]"
        >
          Turn raw machine data into foresight — <span className="text-[#2ee89a]">predict failures</span>, hit daily targets, keep every line running.
        </motion.h2>

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="rounded-2xl border border-emerald-400/10 bg-gradient-to-b from-[#0a2016] to-[#06170f] p-7 md:col-span-2">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#2ee89a]/10 text-[#2ee89a]"><Layers size={20} /></div>
            <h3 className="text-xl font-semibold">Unified Data Integration</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-100/55">Centralize machines, ERP, workers, inventory, and IoT sensors into one intelligent workspace — no more spreadsheet archaeology.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["PLC / SCADA", "SAP · MES", "IoT Sensors", "Shift Logs", "Quality DB"].map((t) => (
                <span key={t} className="rounded-full border border-emerald-400/15 bg-black/25 px-3 py-1 font-mono text-[10px] text-emerald-100/60">{t}</span>
              ))}
            </div>
          </motion.div>
          {[
            { icon: BrainCircuit, t: "AI-Powered Analytics", d: "Detect anomalies and surface operational insights from live telemetry in real time." },
            { icon: SearchCode, t: "Root Cause Analysis", d: "Understand why an issue happened — not just what — for faster targeted resolution." },
            { icon: Sparkles, t: "Predictive Intelligence", d: "Anticipate machine failures, bottlenecks, and order delays before they hit." },
            { icon: Lightbulb, t: "Smart Recommendations", d: "The next best action to minimize downtime and maximize throughput, ranked." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 2) * 0.1 }}
                className="group rounded-2xl border border-emerald-400/10 bg-black/20 p-7 transition hover:-translate-y-1 hover:border-[#2ee89a]/40"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#2ee89a]/10 text-[#2ee89a] transition group-hover:bg-[#2ee89a] group-hover:text-black"><Icon size={20} /></div>
                <h3 className="text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-100/55">{f.d}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ LIVE OPS — ISOMETRIC FLOOR ============ */}
      <section id="live-ops" className="relative z-10 px-3 pb-10 md:px-6">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-2">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="text-[#2ee89a]">[ 03 ]</span>
              <span className="font-bold text-white">Live Command Center</span>
              <span className="hidden items-center gap-2 md:inline-flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2ee89a]" /><span className="text-emerald-100/50">streaming</span></span>
            </div>
            <p className="max-w-[560px] text-right font-mono text-[10px] leading-relaxed text-emerald-100/40">
              Isometric floor twin • 201 devices • Predictive alerts in <span className="text-[#2ee89a]">next 48h</span>
            </p>
          </div>
          <div className="relative h-[560px] overflow-hidden rounded-2xl border border-emerald-400/10 bg-[#06170f] shadow-[0_40px_120px_rgba(0,0,0,0.6)] md:h-[680px]">
            <FactoryFloor active={activeStation} onSelect={setActiveStation} />
          </div>
        </div>
      </section>

      {/* ============ INSIGHTS CHAPTERS ============ */}
      <section id="insights" className="relative z-10 mt-10 border-t border-emerald-400/10 bg-[#03100a]">
        <div className="flex flex-col gap-10 px-8 py-20 md:px-16 xl:flex-row xl:justify-between">
          <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="max-w-[820px] text-[clamp(1.7rem,3.6vw,3.4rem)] font-medium leading-[1.1] tracking-tight">
            Curated from every line, sensor
            <span className="mx-3 inline-flex translate-y-[-4px] gap-2 align-middle">
              {[Factory, Gauge, Activity].map((Icon, i) => (
                <span key={i} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/20 bg-black text-[#2ee89a] transition hover:bg-[#2ee89a] hover:text-black md:h-14 md:w-14"><Icon size={22} /></span>
              ))}
            </span>
            &amp; shift into one operational memory.
          </motion.h2>
          <div className="max-w-[320px] xl:pt-4">
            <p className="mb-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-emerald-100/40">We don&apos;t just monitor alerts<br />we explain what to do next</p>
            <div className="flex flex-wrap gap-3">
              {["Predictive", "Explainable", "Actionable"].map((p) => (
                <span key={p} className="rounded-full border border-emerald-400/20 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-100/60 transition hover:bg-[#2ee89a] hover:text-black">{p}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-emerald-400/10" />
        <div className="flex flex-col md:flex-row">
          <div className="relative min-h-[400px] border-b border-emerald-400/10 md:min-h-[480px] md:w-[35%] md:border-b-0 md:border-r">
            <div className="absolute left-8 top-8 font-mono text-lg tracking-[0.3em] text-[#2ee89a]/40">***</div>
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={chapter.name} className="absolute inset-0">
                  <SandTransitionImage src={chapter.image} alt={chapter.name} className="absolute inset-0 m-auto h-[78%] w-[78%] object-contain mix-blend-lighten opacity-90" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-8 left-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-emerald-100/50">
              <AnimatePresence mode="wait">
                <motion.span key={activeChapter} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {String(activeChapter + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <span className="text-emerald-100/20">/</span><span>05</span>
              <span className="ml-3 text-[#2ee89a]/60">{chapter.value}</span>
            </div>
          </div>
          <div className="md:w-[65%]">
            <div className="flex items-center justify-between border-b border-emerald-400/10 p-7 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/40">
              <span>Explore the floor. Understand the risk.</span>
              <AnimatePresence mode="wait">
                <motion.span key={activeChapter} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }} className="text-[#2ee89a]">
                  Chapter {String(activeChapter + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            {chaptersData.map((c, i) => {
              const active = i === activeChapter;
              return (
                <button key={c.name} onClick={() => setActiveChapter(i)} className={`flex w-full items-center justify-between border-b border-emerald-400/[0.07] px-7 py-6 text-left transition ${active ? "text-white" : "text-emerald-100/25 hover:text-emerald-100/60"}`}>
                  <span>
                    <span className="block text-lg font-medium tracking-tight md:text-[1.6rem]">{c.name}</span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100/30">{c.meta}</span>
                  </span>
                  <AnimatePresence>
                    {active && (
                      <motion.span initial={{ opacity: 0, x: -10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 10, y: -10 }} transition={{ duration: 0.25 }}>
                        <ArrowUpRight size={20} className="text-[#2ee89a]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA + FOOTER ============ */}
      <section id="contact" className="relative z-10 border-t border-emerald-400/10 px-6 py-24 text-center md:px-12">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05] tracking-tight">
          Ready to run your factory <span className="text-[#2ee89a]">smarter?</span>
        </motion.h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] text-emerald-100/55">Join plant managers who use FactoryPilot AI to make faster, data-backed decisions on the floor.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2.5 rounded-lg bg-[#2ee89a] px-8 py-4 text-[15px] font-semibold text-[#04130c] shadow-[0_0_32px_rgba(46,232,154,0.35)] transition hover:shadow-[0_0_56px_rgba(46,232,154,0.6)]">
            <Sparkles size={16} /> Launch Pilot
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 px-8 py-4 text-[15px] font-medium transition hover:border-[#2ee89a]/60 hover:bg-[#2ee89a]/5">
            Explore features <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-emerald-400/10 px-6 py-8 md:px-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/35">FactoryPilot AI © 2026 — the AI copilot for factory floors</p>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-100/45">
            <a href="#" className="hover:text-[#2ee89a]">Privacy</a>
            <a href="#" className="hover:text-[#2ee89a]">Security</a>
            <Link to="/dashboard" className="hover:text-[#2ee89a]">Book a demo</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
