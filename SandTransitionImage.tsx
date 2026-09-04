import { useEffect, useRef } from "react";
import { usePresence } from "motion/react";

export default function SandTransitionImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const id = useRef(`sand-${Math.random().toString(36).slice(2)}`);
  const disp = useRef<SVGFEDisplacementMapElement | null>(null);
  const off = useRef<SVGFEOffsetElement | null>(null);
  const blur = useRef<SVGFEGaussianBlurElement | null>(null);
  const op = useRef<SVGFEColorMatrixElement | null>(null);

  useEffect(() => {
    const dur = 900;
    const start = performance.now();
    let f = 0;
    const tick = (now: number) => {
      const el = Math.min((now - start) / dur, 1);
      const eased = isPresent ? 1 - Math.pow(1 - el, 4) : Math.pow(el, 3);
      const prog = isPresent ? 1 - eased : eased;
      const o = Math.max(0, 1 - prog * 1.2);
      if (disp.current) disp.current.setAttribute("scale", `${prog * 150}`);
      if (off.current) {
        off.current.setAttribute("dx", `${(isPresent ? -30 : 30) * prog}`);
        off.current.setAttribute("dy", `${(isPresent ? -80 : 120) * prog}`);
      }
      if (blur.current) blur.current.setAttribute("stdDeviation", `${prog * 6}`);
      if (op.current)
        op.current.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${o} 0`);
      if (el < 1) f = requestAnimationFrame(tick);
      else if (!isPresent) safeToRemove();
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [isPresent, safeToRemove]);

  return (
    <>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <filter id={id.current} x="-30%" y="-40%" width="160%" height="190%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feOffset ref={off} in="d" dx="0" dy="0" result="o" />
          <feGaussianBlur ref={blur} in="o" stdDeviation="0" result="b" />
          <feColorMatrix ref={op} in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className={className}
        style={{ filter: `url(#${id.current})` }}
      />
    </>
  );
}
