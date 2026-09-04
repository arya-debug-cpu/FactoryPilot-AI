export default function LineRobot({ tone = "green", className = "" }: { tone?: "green" | "orange"; className?: string }) {
  const c = tone === "orange" ? "#ff8c2a" : "#2ee89a";
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="15" y="40" width="18" height="4" rx="1.2" stroke={c} strokeWidth="1.6" />
      <path d="M24 40 V31 L33 22" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="31" r="2.2" fill="#071810" stroke={c} strokeWidth="1.4" />
      <circle cx="33" cy="22" r="2.2" fill={c} />
      <path d="M33 22 L39 15" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="39" cy="15" r="1.6" fill={c} />
    </svg>
  );
}
