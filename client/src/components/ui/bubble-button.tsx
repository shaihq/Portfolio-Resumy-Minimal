import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

/* ─── Keyframes ─────────────────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes bubble-rise {
    0%   { transform: translateY(0) scale(1);  opacity: 0.4; }
    100% { transform: translateY(-100px) scale(0); opacity: 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 0.55; transform: scale(1);   }
    50%       { opacity: 1;    transform: scale(1.25); }
  }
`;

/* ─── Badge bubble particles ─────────────────────────────────────────── */
const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width:    Math.random() * 12 + 4,
  height:   Math.random() * 12 + 4,
  left:     Math.random() * 95,
  duration: 2 + Math.random() * 3,
  delay:    Math.random() * 4,
}));

const BadgeBubbles = () => (
  <>
    <style>{KEYFRAMES}</style>
    <div className="absolute inset-0 z-[5] overflow-hidden rounded-full pointer-events-none">
      {BUBBLES.map((b) => (
        <span key={b.id}
          className="absolute bottom-[-10px] block rounded-full bg-foreground/20 [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            width: `${b.width}px`, height: `${b.height}px`, left: `${b.left}%`,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  </>
);

/* ─── Color palette per credit level ────────────────────────────────── */
function palette(pct: number) {
  if (pct > 0.5) return {
    bright: "#b5f546", mid: "#4ade80", deep: "#166534",
    glow:   "#22c55e", label: "#86efac",
  };
  if (pct > 0.2) return {
    bright: "#fde68a", mid: "#f59e0b", deep: "#92400e",
    glow:   "#d97706", label: "#fcd34d",
  };
  return {
    bright: "#fca5a5", mid: "#ef4444", deep: "#7f1d1d",
    glow:   "#dc2626", label: "#fca5a5",
  };
}

/* ─── SVG polar helpers ──────────────────────────────────────────────── */
// Angles in "clock degrees": 0 = 12 o'clock, clockwise
function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = pt(cx, cy, r, a1);
  const e = pt(cx, cy, r, a2);
  const sw = ((a2 - a1) + 360) % 360;
  if (sw === 0) return "";
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${sw > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/* ─── Gauge geometry constants ───────────────────────────────────────── */
// 240° sweep: 8 o'clock (240°) → over top → 4 o'clock (120°)
const A0    = 240;   // start angle (clock °)
const A1    = 120;   // end angle   (clock °)
const SWEEP = 240;   // total sweep
const CX    = 120;   // SVG center x
const CY    = 104;   // SVG center y
const R     = 88;    // arc radius
const SW    = 22;    // stroke width

/* ─── Tick marks on empty arc ────────────────────────────────────────── */
function Ticks({ startDeg, endDeg, color }: { startDeg: number; endDeg: number; color: string }) {
  const sweep = ((endDeg - startDeg) + 360) % 360;
  const n = 14;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const deg = startDeg + (i / (n - 1)) * sweep;
        const isMajor = i % 7 === 0;
        const inner = pt(CX, CY, R - (isMajor ? 5 : 3), deg);
        const outer = pt(CX, CY, R + (isMajor ? 5 : 3), deg);
        return (
          <line key={i}
            x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke={color} strokeWidth={isMajor ? 1.2 : 0.7} strokeLinecap="round"
            opacity={isMajor ? 0.35 : 0.18}
          />
        );
      })}
    </>
  );
}

/* ─── Arc-following particles (clipped to stroke path) ───────────────── */
const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  frac:     Math.random(),                         // position along arc 0-1
  radOff:   (Math.random() - 0.5) * (SW * 0.7),  // radial offset within stroke
  size:     0.8 + Math.random() * 2.0,
  dur:      1.6 + Math.random() * 2.8,
  delay:    Math.random() * 4,
  baseOpac: 0.35 + Math.random() * 0.55,
}));

function ArcSparks({ filledSweep, clipId }: { filledSweep: number; clipId: string }) {
  return (
    <g clipPath={`url(#${clipId})`}>
      {SPARKS.map((s) => {
        const deg = A0 + s.frac * filledSweep;
        const p = pt(CX, CY, R + s.radOff, deg);
        return (
          <circle key={s.id} cx={p.x} cy={p.y} r={s.size}
            fill="white"
            style={{
              opacity: s.baseOpac,
              animation: `pulse-dot ${s.dur}s ${s.delay}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </g>
  );
}

/* ─── Liquid Speedometer SVG ─────────────────────────────────────────── */
// viewBox has 24px of glow padding on every side so feDropShadow never clips
const VB_PAD = 24;
const VB = `${-VB_PAD} ${-VB_PAD} ${(CX * 2) + VB_PAD * 2} ${CY + R * 0.6 + VB_PAD * 2}`;

function LiquidGauge({ pct, remaining, limit, uid }: {
  pct: number; remaining: number; limit: number; uid: string;
}) {
  const c = palette(pct);
  const filledSweep = SWEEP * Math.min(Math.max(pct, 0), 1);
  const filledEnd   = (A0 + filledSweep) % 360;
  const emptyStart  = filledEnd;

  const track    = arcPath(CX, CY, R, A0, A1);
  const filled   = filledSweep > 0.5 ? arcPath(CX, CY, R, A0, filledEnd) : "";
  const empty    = filledSweep < SWEEP - 0.5 ? arcPath(CX, CY, R, emptyStart, A1) : "";
  const clipPath = filledSweep > 0.5 ? arcPath(CX, CY, R, A0, filledEnd) : "";

  // Animated spring for score counter
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 20 });
  const [disp, setDisp] = React.useState(0);
  React.useEffect(() => { sp.on("change", (v) => setDisp(Math.round(v))); }, [sp]);
  React.useEffect(() => { const t = setTimeout(() => mv.set(remaining), 100); return () => clearTimeout(t); }, [remaining, mv]);

  // Viewbox computed height: arc bottom y + some floor space
  const arcBottomY = CY - R * Math.cos((A0 * Math.PI) / 180); // = CY + R*0.5 for 240°
  const svgH = arcBottomY + 28 + VB_PAD * 2;
  const svgW = CX * 2 + VB_PAD * 2;

  const capPt = filled ? pt(CX, CY, R, filledEnd) : null;

  return (
    <svg
      viewBox={VB}
      width={svgW}
      height={svgH}
      style={{ display: "block", overflow: "visible", margin: "0 auto" }}
    >
      <defs>
        {/* Fill gradient: bright at top, deep at bottom */}
        <linearGradient id={`fg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY + R * 0.55}>
          <stop offset="0%"   stopColor={c.bright} />
          <stop offset="38%"  stopColor={c.mid} />
          <stop offset="100%" stopColor={c.deep} />
        </linearGradient>

        {/* Gloss gradient: white top → transparent */}
        <linearGradient id={`gg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY - R * 0.1}>
          <stop offset="0%"   stopColor="white" stopOpacity="0.50" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Floor ambient glow */}
        <radialGradient id={`rg-${uid}`} cx="50%" cy="85%" r="55%">
          <stop offset="0%"   stopColor={c.glow} stopOpacity="0.50" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>

        {/* Multi-pass ambient glow filter — generous region so it never clips */}
        <filter id={`af-${uid}`} x="-60%" y="-60%" width="220%" height="220%"
          colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="4"  floodColor={c.glow} floodOpacity="1"   result="s1"/>
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={c.glow} floodOpacity="0.6" result="s2"/>
          <feDropShadow dx="0" dy="3" stdDeviation="18" floodColor={c.glow} floodOpacity="0.3" result="s3"/>
        </filter>

        {/* Blur-only filter for soft glow bloom */}
        <filter id={`bf-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>

        {/* ── Clip path for particles: strictly inside the filled stroke ── */}
        {clipPath && (
          <clipPath id={`cp-${uid}`} clipPathUnits="userSpaceOnUse">
            <path d={clipPath} fill="none" stroke="white"
              strokeWidth={SW - 3} strokeLinecap="round" />
          </clipPath>
        )}
      </defs>

      {/* ── Floor glow ellipse ── */}
      <ellipse cx={CX} cy={CY + R * 0.42} rx={R * 0.85} ry={R * 0.28}
        fill={`url(#rg-${uid})`}
        style={{ filter: "blur(10px)" }}
      />

      {/* ── Track: outer depth shadow ── */}
      <path d={track} fill="none"
        stroke="rgba(0,0,0,0.55)" strokeWidth={SW + 3} strokeLinecap="round" />
      {/* Track: main dark surface */}
      <path d={track} fill="none"
        stroke="rgba(15,15,18,0.92)" strokeWidth={SW} strokeLinecap="round" />
      {/* Track: subtle inner rim highlight */}
      <path d={track} fill="none"
        stroke="rgba(255,255,255,0.055)" strokeWidth={1.5} strokeLinecap="round" />

      {/* ── Empty arc tick marks ── */}
      {empty && <Ticks startDeg={emptyStart} endDeg={A1} color={c.label} />}

      {/* ── Filled arc: outer bloom (blurred, wide) ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW + 18} strokeLinecap="round"
          style={{ filter: `url(#bf-${uid})`, opacity: 0.4 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        />
      )}

      {/* ── Filled arc: focused glow (with ambient filter) ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW + 4} strokeLinecap="round"
          style={{ filter: `url(#af-${uid})`, opacity: 0.7 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        />
      )}

      {/* ── Filled arc: main liquid body (gradient) ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#fg-${uid})`} strokeWidth={SW} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        />
      )}

      {/* ── Filled arc: gloss specular overlay ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#gg-${uid})`} strokeWidth={SW} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        />
      )}

      {/* ── Filled arc: inner rim bright line ── */}
      {filled && (
        <motion.path d={arcPath(CX, CY, R - SW * 0.44, A0, filledEnd)} fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      )}

      {/* ── Floating sparks — clipped strictly to the filled stroke ── */}
      {filled && pct > 0.02 && (
        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <ArcSparks filledSweep={filledSweep} clipId={`cp-${uid}`} />
        </motion.g>
      )}

      {/* ── Leading edge cap glow ── */}
      {capPt && pct > 0.02 && pct < 0.99 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.5}
            fill={c.bright} opacity={0.3}
            style={{ filter: `blur(${SW * 0.35}px)` }}
          />
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.22}
            fill={c.bright} opacity={0.95}
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
        </motion.g>
      )}

      {/* ── Center score: number ── */}
      <motion.text
        x={CX} y={CY + R * 0.25}
        textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="36" fontWeight="700"
        style={{ userSelect: "none", letterSpacing: "-1.5px", fontFamily: "inherit" }}
        initial={{ opacity: 0, y: CY + R * 0.35 }}
        animate={{ opacity: 1, y: CY + R * 0.25 }}
        transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {disp}
      </motion.text>

      {/* ── Center score: "/ N credits left" label ── */}
      <motion.text
        x={CX} y={CY + R * 0.52}
        textAnchor="middle" dominantBaseline="central"
        fill="rgba(255,255,255,0.36)" fontSize="9" fontWeight="500"
        style={{ userSelect: "none", letterSpacing: "0.4px", fontFamily: "inherit" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48, duration: 0.5 }}
      >
        / {limit} credits left
      </motion.text>
    </svg>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface UsageBadgeProps {
  icon: React.ReactNode;
  planName: string;
  usage: number;
  limit: number;
  tooltipContent?: React.ReactNode;
  className?: string;
}

/* ─── Main exported component ────────────────────────────────────────── */
const UsageBadge = React.forwardRef<HTMLDivElement, UsageBadgeProps>(
  ({ icon, planName, usage, limit, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef   = React.useRef<HTMLDivElement>(null);
    const uid = React.useId().replace(/:/g, "");

    const remaining = usage;
    const pct    = limit > 0 ? remaining / limit : 0;
    const c      = palette(pct);
    const status = pct > 0.5 ? "Healthy" : pct > 0.2 ? "Running low" : "Almost out";

    React.useEffect(() => {
      if (!open) return;
      const h = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open]);

    return (
      <div ref={containerRef} className="relative">

        {/* ── Trigger badge ── */}
        <div
          ref={ref} role="button" tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
          className={cn(
            "group relative inline-flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full h-9 px-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
            open ? "border-2 border-input bg-accent text-accent-foreground" : "border border-input bg-background",
            className,
          )}
        >
          <BadgeBubbles />
          <div className="relative z-10 flex-shrink-0">{icon}</div>
          <div className="relative z-10 whitespace-nowrap">
            <span>{planName}:</span>
            <span className="ml-1.5 font-semibold">{usage}</span>
            <span className="ml-0.5 opacity-50 text-xs">/ {limit}</span>
          </div>
        </div>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1,  y: 0,   scale: 1    }}
              exit={{    opacity: 0,  y: -8,  scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-[calc(100%+10px)] z-50"
              style={{ width: 288 }}
            >
              {/* ── Glass card shell ── */}
              <div style={{
                background: "linear-gradient(160deg, rgba(24,26,30,0.98) 0%, rgba(14,15,18,1) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 22,
                boxShadow: [
                  "0 28px 64px rgba(0,0,0,0.65)",
                  "0 4px 12px rgba(0,0,0,0.45)",
                  "inset 0 1px 0 rgba(255,255,255,0.07)",
                  `0 0 40px ${c.glow}18`,
                ].join(", "),
                padding: "22px 22px 20px",
                position: "relative",
              }}>

                {/* Top gloss streak */}
                <div style={{
                  position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                  pointerEvents: "none",
                }} />

                {/* ── Gauge — centered, SVG overflow:visible so glow never clips ── */}
                <div style={{ marginBottom: 6 }}>
                  <LiquidGauge pct={pct} remaining={remaining} limit={limit} uid={uid} />
                </div>

                {/* ── Title row: name + status pill ── */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "-0.2px",
                  }}>
                    AI Balance
                  </span>

                  {/* Status pill */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: `${c.glow}1a`,
                    border: `1px solid ${c.glow}40`,
                    borderRadius: 20, padding: "3px 9px",
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: c.mid,
                      boxShadow: `0 0 6px ${c.glow}`,
                      animation: "pulse-dot 2.2s ease-in-out infinite",
                    }} />
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: c.label, letterSpacing: "0.25px",
                    }}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* ── Description ── */}
                <p style={{
                  fontSize: 12, color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.6, marginBottom: 16, marginTop: 0,
                }}>
                  Credits power mock interviews and scout chats.
                </p>

                {/* ── CTA button ── */}
                <style>{`
                  .liq-cta-v2 {
                    position: relative; overflow: hidden; cursor: pointer; width: 100%;
                    background: linear-gradient(155deg, ${c.bright}1e 0%, ${c.deep}3a 100%);
                    border: 1px solid ${c.glow}50;
                    border-radius: 40px; height: 34px;
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    box-shadow: 0 0 14px ${c.glow}2a, inset 0 1px 0 rgba(255,255,255,0.09);
                    transition: all 0.2s ease;
                  }
                  .liq-cta-v2::before {
                    content: ""; position: absolute;
                    top: 0; left: 0; right: 0; height: 48%;
                    background: linear-gradient(180deg, rgba(255,255,255,0.065) 0%, transparent 100%);
                    border-radius: 40px 40px 0 0; pointer-events: none;
                  }
                  .liq-cta-v2:hover {
                    background: linear-gradient(155deg, ${c.bright}30 0%, ${c.deep}55 100%);
                    border-color: ${c.glow}88;
                    box-shadow: 0 0 22px ${c.glow}44, inset 0 1px 0 rgba(255,255,255,0.13);
                    transform: translateY(-1px);
                  }
                  .liq-cta-v2:active { transform: translateY(1px); }
                `}</style>
                <button className="liq-cta-v2">
                  <Zap style={{ width: 12, height: 12, color: c.bright, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: c.label, letterSpacing: "0.1px" }}>
                    Get more credits
                  </span>
                </button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

UsageBadge.displayName = "UsageBadge";
export { UsageBadge };
