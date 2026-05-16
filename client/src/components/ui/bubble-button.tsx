import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Zap } from "lucide-react";

/* ─── Bubble rise animation (trigger badge) ──────────────────────────── */
const keyframes = `
  @keyframes bubble-rise {
    0%   { transform: translateY(0) scale(1); opacity: 0.4; }
    100% { transform: translateY(-100px) scale(0); opacity: 0; }
  }
  @keyframes particle-float {
    0%,100% { transform: translateY(0px) scale(1); opacity: 0.6; }
    50%      { transform: translateY(-3px) scale(1.15); opacity: 1; }
  }
  @keyframes pulse-glow {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
`;

const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width:  Math.random() * 12 + 4,
  height: Math.random() * 12 + 4,
  left:   Math.random() * 95,
  duration: 2 + Math.random() * 3,
  delay:    Math.random() * 4,
}));

const Bubbles = () => (
  <>
    <style>{keyframes}</style>
    <div className="absolute inset-0 z-[5] overflow-hidden rounded-full pointer-events-none">
      {BUBBLES.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-[-10px] block rounded-full bg-foreground/20 [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            width: `${b.width}px`,
            height: `${b.height}px`,
            left: `${b.left}%`,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  </>
);

/* ─── Color system ───────────────────────────────────────────────────── */
function getColorSystem(pct: number) {
  if (pct > 0.5) return {
    bright:   "#a3e635",
    main:     "#22c55e",
    deep:     "#15803d",
    glow:     "#16a34a",
    glowFade: "#16a34a00",
    track:    "rgba(34,197,94,0.08)",
    tick:     "rgba(134,239,172,0.18)",
    label:    "#86efac",
  };
  if (pct > 0.2) return {
    bright:   "#fcd34d",
    main:     "#f59e0b",
    deep:     "#b45309",
    glow:     "#d97706",
    glowFade: "#d9770600",
    track:    "rgba(245,158,11,0.08)",
    tick:     "rgba(252,211,77,0.18)",
    label:    "#fcd34d",
  };
  return {
    bright:   "#fca5a5",
    main:     "#ef4444",
    deep:     "#991b1b",
    glow:     "#dc2626",
    glowFade: "#dc262600",
    track:    "rgba(239,68,68,0.08)",
    tick:     "rgba(252,165,165,0.18)",
    label:    "#fca5a5",
  };
}

/* ─── Polar coordinate helper ───────────────────────────────────────── */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const sweep = ((endDeg - startDeg) + 360) % 360;
  const large = sweep > 180 ? 1 : 0;
  if (sweep === 0) return "";
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
}

/* ─── Tick marks along an arc ───────────────────────────────────────── */
function TickMarks({ cx, cy, r, startDeg, endDeg, count, inner, outer, color }: {
  cx: number; cy: number; r: number; startDeg: number; endDeg: number;
  count: number; inner: number; outer: number; color: string;
}) {
  const sweep = ((endDeg - startDeg) + 360) % 360;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = startDeg + (i / (count - 1)) * sweep;
        const p1 = polar(cx, cy, r - inner, angle);
        const p2 = polar(cx, cy, r - outer, angle);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={color} strokeWidth="0.8" strokeLinecap="round" />
        );
      })}
    </>
  );
}

/* ─── Floating particles along arc ──────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  arcFrac:  Math.random(),
  r:        1 + Math.random() * 2.2,
  offset:   (Math.random() - 0.5) * 10,
  duration: 1.8 + Math.random() * 2.4,
  delay:    Math.random() * 3,
  opacity:  0.4 + Math.random() * 0.5,
}));

function ArcParticles({ cx, cy, r, startDeg, filledSweep, color }: {
  cx: number; cy: number; r: number; startDeg: number; filledSweep: number; color: string;
}) {
  return (
    <>
      {PARTICLES.map((p) => {
        const angle = startDeg + p.arcFrac * filledSweep;
        const pr = r + p.offset;
        const pt = polar(cx, cy, pr, angle);
        return (
          <circle key={p.id} cx={pt.x} cy={pt.y} r={p.r} fill={color}
            style={{
              animation: `particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </>
  );
}

/* ─── Liquid Speedometer SVG ─────────────────────────────────────────── */
const GAUGE_START = 240;
const GAUGE_END   = 120;
const GAUGE_SWEEP = 240;
const CX = 100, CY = 78, R = 68;
const STROKE = 18;

function LiquidSpeedometer({ pct, remaining, limit, uid }: {
  pct: number; remaining: number; limit: number; uid: string;
}) {
  const colors = getColorSystem(pct);
  const filledSweep = GAUGE_SWEEP * pct;
  const filledEnd   = (GAUGE_START + filledSweep) % 360;
  const emptyStart  = filledEnd;

  const trackPath  = arc(CX, CY, R, GAUGE_START, GAUGE_END);
  const fillPath   = filledSweep > 0 ? arc(CX, CY, R, GAUGE_START, filledEnd) : "";
  const emptyPath  = filledSweep < GAUGE_SWEEP ? arc(CX, CY, R, emptyStart, GAUGE_END) : "";

  const fillSweepActual = ((filledEnd - GAUGE_START) + 360) % 360 || 0;

  const motionPct = useMotionValue(0);
  const spring = useSpring(motionPct, { stiffness: 60, damping: 18 });
  const animCount = useTransform(spring, (v) => Math.round(v * remaining));

  React.useEffect(() => {
    const t = setTimeout(() => motionPct.set(1), 80);
    return () => clearTimeout(t);
  }, [remaining, motionPct]);

  const floorPt = polar(CX, CY, 0, 0);

  return (
    <svg viewBox="0 0 200 130" width="180" height="117" style={{ overflow: "visible" }}>
      <defs>
        {/* Main fill gradient — bright top, deep bottom */}
        <linearGradient id={`lg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY + R}>
          <stop offset="0%"   stopColor={colors.bright} />
          <stop offset="40%"  stopColor={colors.main} />
          <stop offset="100%" stopColor={colors.deep} />
        </linearGradient>

        {/* Specular gloss overlay — white at top */}
        <linearGradient id={`gloss-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY}>
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="60%"  stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Outer glow gradient */}
        <radialGradient id={`floor-${uid}`} cx="50%" cy="100%" r="60%">
          <stop offset="0%"   stopColor={colors.glow} stopOpacity="0.45" />
          <stop offset="100%" stopColor={colors.glowFade} />
        </radialGradient>

        {/* Ambient glow filter for filled arc */}
        <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="5"   floodColor={colors.glow} floodOpacity="0.8" />
          <feDropShadow dx="0" dy="2" stdDeviation="12"  floodColor={colors.glow} floodOpacity="0.4" />
          <feDropShadow dx="0" dy="4" stdDeviation="20"  floodColor={colors.glow} floodOpacity="0.2" />
        </filter>

        {/* Soft blur for glow under-layer */}
        <filter id={`blur-${uid}`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Inner shadow for track */}
        <filter id={`track-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.7)" floodOpacity="1" />
        </filter>
      </defs>

      {/* ── Floor ambient glow ── */}
      <ellipse cx={CX} cy={CY + R * 0.3} rx={R * 0.9} ry={R * 0.35}
        fill={`url(#floor-${uid})`} style={{ filter: `blur(8px)` }} />

      {/* ── Background glow bloom behind filled arc ── */}
      {fillPath && (
        <path d={fillPath} fill="none"
          stroke={colors.glow} strokeWidth={STROKE + 14} strokeLinecap="round"
          style={{ filter: `url(#blur-${uid})`, opacity: 0.35 }} />
      )}

      {/* ── Track (recessed background ring) ── */}
      <path d={trackPath} fill="none"
        stroke="rgba(255,255,255,0.04)" strokeWidth={STROKE + 2} strokeLinecap="round"
        style={{ filter: `url(#track-${uid})` }} />
      <path d={trackPath} fill="none"
        stroke="rgba(20,20,20,0.85)" strokeWidth={STROKE} strokeLinecap="round" />
      {/* Track inner glint */}
      <path d={trackPath} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={1.2} strokeLinecap="round"
        style={{ transform: "translate(0,-1px)", transformOrigin: `${CX}px ${CY}px` }} />

      {/* ── Tick marks on empty portion ── */}
      {emptyPath && (
        <TickMarks cx={CX} cy={CY} r={R} startDeg={emptyStart} endDeg={GAUGE_END}
          count={12} inner={4} outer={9} color={colors.tick} />
      )}

      {/* ── Filled arc: glow base layer ── */}
      {fillPath && (
        <motion.path d={fillPath} fill="none"
          stroke={colors.glow} strokeWidth={STROKE + 6} strokeLinecap="round"
          style={{ filter: `url(#glow-${uid})` }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
      )}

      {/* ── Filled arc: main liquid body ── */}
      {fillPath && (
        <motion.path d={fillPath} fill="none"
          stroke={`url(#lg-${uid})`} strokeWidth={STROKE} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
      )}

      {/* ── Filled arc: gloss overlay ── */}
      {fillPath && (
        <motion.path d={fillPath} fill="none"
          stroke={`url(#gloss-${uid})`} strokeWidth={STROKE} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
      )}

      {/* ── Top rim highlight (inner edge bright line) ── */}
      {fillPath && (
        <motion.path d={fillPath} fill="none"
          stroke="rgba(255,255,255,0.28)" strokeWidth={1.4} strokeLinecap="round"
          style={{ transform: `translate(0,-${STROKE * 0.42}px)`, transformOrigin: `${CX}px ${CY}px` }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }} />
      )}

      {/* ── Floating particles inside filled arc ── */}
      {pct > 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <ArcParticles cx={CX} cy={CY} r={R} startDeg={GAUGE_START}
            filledSweep={fillSweepActual} color="rgba(255,255,255,0.75)" />
        </motion.g>
      )}

      {/* ── Leading edge cap glow dot ── */}
      {pct > 0.01 && pct < 0.99 && (() => {
        const capPt = polar(CX, CY, R, filledEnd);
        return (
          <motion.circle cx={capPt.x} cy={capPt.y} r={5}
            fill={colors.bright} style={{ filter: `blur(3px)`, animation: "pulse-glow 1.8s ease-in-out infinite" }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1 }} />
        );
      })()}

      {/* ── Center: animated number + label ── */}
      <motion.text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="30" fontWeight="700"
        style={{ userSelect: "none", letterSpacing: "-1px" }}
        initial={{ opacity: 0, y: CY + 20 }} animate={{ opacity: 1, y: CY + 14 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        {remaining}
      </motion.text>
      <motion.text x={CX} y={CY + 32} textAnchor="middle"
        fill="rgba(255,255,255,0.38)" fontSize="7.5" fontWeight="500"
        style={{ userSelect: "none", letterSpacing: "0.3px" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
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

/* ─── Main component ─────────────────────────────────────────────────── */
const UsageBadge = React.forwardRef<HTMLDivElement, UsageBadgeProps>(
  ({ icon, planName, usage, limit, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const uid = React.useId().replace(/:/g, "");

    const remaining = usage;
    const pct = limit > 0 ? remaining / limit : 0;
    const colors = getColorSystem(pct);

    React.useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const statusLabel = pct > 0.5 ? "Healthy" : pct > 0.2 ? "Running low" : "Almost out";

    return (
      <div ref={containerRef} className="relative">
        {/* Badge trigger */}
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
          className={cn(
            "group relative inline-flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full h-9 px-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
            open
              ? "border-2 border-input bg-accent text-accent-foreground"
              : "border border-input bg-background",
            className
          )}
        >
          <Bubbles />
          <div className="relative z-10 flex-shrink-0">{icon}</div>
          <div className="relative z-10 whitespace-nowrap">
            <span>{planName}:</span>
            <span className="ml-1.5 font-semibold">{usage}</span>
            <span className="ml-0.5 opacity-50 text-xs">/ {limit}</span>
          </div>
        </div>

        {/* Dropdown — liquid glass speedometer card */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-[calc(100%+10px)] z-50"
              style={{ width: 360 }}
            >
              {/* Glass card */}
              <div style={{
                background: "linear-gradient(145deg, rgba(28,28,32,0.97) 0%, rgba(18,18,22,0.99) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 20,
                boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
                overflow: "hidden",
                padding: "20px 20px 18px 18px",
              }}>
                {/* Top gloss line */}
                <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  borderRadius: 1,
                }} />

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {/* Left: Speedometer */}
                  <div style={{ flexShrink: 0, position: "relative" }}>
                    <LiquidSpeedometer pct={pct} remaining={remaining} limit={limit} uid={uid} />
                  </div>

                  {/* Right: Info panel */}
                  <div style={{ flex: 1, paddingLeft: 4, paddingBottom: 6 }}>
                    {/* Title */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6, letterSpacing: "-0.2px" }}>
                      AI Balance
                    </div>

                    {/* Status pill */}
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: `${colors.glow}22`,
                      border: `1px solid ${colors.glow}44`,
                      borderRadius: 20, padding: "2px 8px", marginBottom: 10,
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: colors.main,
                        boxShadow: `0 0 5px ${colors.glow}`,
                        animation: "pulse-glow 2s ease-in-out infinite",
                      }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: colors.label, letterSpacing: "0.2px" }}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 14 }}>
                      Credits power mock interviews and scout chats.
                    </p>

                    {/* CTA button */}
                    <style>{`
                      .liq-cta {
                        position: relative; overflow: hidden; cursor: pointer;
                        background: linear-gradient(160deg, ${colors.bright}22 0%, ${colors.deep}44 100%);
                        border: 1px solid ${colors.glow}55;
                        border-radius: 40px;
                        box-shadow: 0 0 12px ${colors.glow}33, inset 0 1px 0 rgba(255,255,255,0.1);
                        transition: all 0.2s ease;
                        padding: 0 14px;
                        height: 32px;
                        display: flex; align-items: center; gap: 6px;
                        width: 100%;
                        justify-content: center;
                      }
                      .liq-cta::before {
                        content: "";
                        position: absolute; top: 0; left: 0; right: 0; height: 50%;
                        background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%);
                        border-radius: 40px 40px 0 0; pointer-events: none;
                      }
                      .liq-cta:hover {
                        background: linear-gradient(160deg, ${colors.bright}33 0%, ${colors.deep}66 100%);
                        border-color: ${colors.glow}99;
                        box-shadow: 0 0 20px ${colors.glow}55, inset 0 1px 0 rgba(255,255,255,0.15);
                        transform: translateY(-1px);
                      }
                      .liq-cta:active { transform: translateY(1px); }
                    `}</style>
                    <button className="liq-cta">
                      <Zap style={{ width: 11, height: 11, color: colors.bright }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: colors.label, letterSpacing: "0.1px" }}>
                        Get more credits
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom divider + usage bar */}
                <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>USED</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>TOTAL</span>
                  </div>
                  {/* Mini HUD bar */}
                  <div style={{
                    height: 4, borderRadius: 4,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                  }}>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      style={{
                        height: "100%", borderRadius: 4,
                        background: `linear-gradient(90deg, ${colors.deep}, ${colors.bright})`,
                        boxShadow: `0 0 8px ${colors.glow}88`,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                      {limit - remaining} used
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                      {limit} total
                    </span>
                  </div>
                </div>
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
