import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

const suggestions = [
  "Why is production below target?",
  "Which machine needs attention?",
  "Which orders are at risk?",
  "Summarize today's factory performance.",
  "What should I prioritize?",
];

const mockResponses: Record<string, string> = {
  "Why is production below target?": "Production is 8% below target today. Machine M-12 experienced three stoppages during the morning shift, resulting in 45 minutes of downtime. Two customer orders may be delayed if output does not recover this afternoon.",
  "Which machine needs attention?": "Machine M-12 (Welding Arm E5) is operating at 78% efficiency with a health score of 72%. Temperature reached 87°C — 12°C above safe range. A cooling-system inspection is recommended after the current shift.",
  "Which orders are at risk?": "Order #1042 (Apex Manufacturing) is at high risk — 74% complete with a deadline today. Order #1051 is delayed by a Titanium Rod shortage. Reallocating Line 4 capacity would recover both.",
  "Summarize today's factory performance.": "920 of 1,000 target units produced (92% efficiency). Utilization 94.2%, downtime 45 min, defect rate 2.1% (−0.3%). Three alerts active — one critical on M-12.",
  "What should I prioritize?": "1) Inspect M-12 cooling system. 2) Reorder Steel Sheet 4mm (320 < 400 min). 3) Shift one operator to Line 3 to protect order #1042's deadline.",
};

export default function AIAssistant() {
  const [active, setActive] = useState(suggestions[0]);
  const [input, setInput] = useState("");

  const ask = (q: string) => {
    if (!q.trim()) return;
    const match = suggestions.find((s) => s.toLowerCase() === q.trim().toLowerCase());
    setActive(match ?? suggestions[0]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div>
        <h2 className="mono-label">[ 02 ] Assistant</h2>
        <h1 className="text-[1.9rem] font-medium tracking-tight text-white">FactoryPilot AI</h1>
        <p className="font-mono text-[11px] tracking-wide text-[#42554f]">Ask anything about your factory. Mock responses — no live model connected.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition ${
                active === s ? "border-[#22ff7a]/50 bg-[#22ff7a]/10 text-[#22ff7a]" : "border-[#1c2f28] text-[#7d938c] hover:border-[#22ff7a]/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.07] bg-black/25 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#22ff7a] text-black"><Sparkles size={14} /></div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#22ff7a]">AI Insight</span>
          </div>
          <p className="text-[13px] leading-[1.7] text-[#9db5ad]">{mockResponses[active]}</p>
          <div className="mt-4 rounded-lg border border-[#123a26] bg-[#0a1f15] p-3">
            <div className="mono-label text-[#5fe39a]">Recommended action</div>
            <p className="mt-1 text-[12px] font-medium text-white">Schedule an inspection for Machine M-12 after the current shift and reallocate one operator to Line 3.</p>
          </div>
        </div>

        <form
          className="mt-6 flex items-center gap-2 rounded-full border border-[#1c2f28] bg-black/30 px-4 py-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about machines, orders, inventory..."
            className="flex-1 bg-transparent font-mono text-[12px] text-white placeholder:text-[#42554f] focus:outline-none"
          />
          <button type="submit" className="grid h-7 w-7 place-items-center rounded-full bg-[#22ff7a] text-black" aria-label="Send">
            <ArrowUp size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
