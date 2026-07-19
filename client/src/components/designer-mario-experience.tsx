"use client";

import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
export interface WorkExperience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
}

const EXPERIENCES: WorkExperience[] = [
  {
    id: "exp-1",
    period: "Jan '24 – Present",
    role: "Senior Product Designer",
    company: "Designfolio Inc.",
    location: "San Francisco, CA",
    bullets: [
      "Led end-to-end redesign of the core dashboard, cutting time-on-task by 40%.",
      "Built a cross-team design system adopted by 3 product squads.",
      "Grew the design team from 2 to 6 through structured hiring and onboarding.",
    ],
  },
  {
    id: "exp-2",
    period: "Mar '22 – Dec '23",
    role: "Product Designer",
    company: "Acme Corp",
    location: "New York, NY",
    bullets: [
      "Redesigned the onboarding flow, boosting activation rate by 28%.",
      "Partnered with engineering to ship a new mobile app in 3 months.",
      "Ran 12 user research sessions that directly shaped the product roadmap.",
    ],
  },
  {
    id: "exp-3",
    period: "Jun '20 – Feb '22",
    role: "UI / UX Design Intern",
    company: "Startup Studio",
    location: "Austin, TX",
    bullets: [
      "Designed user flows and wireframes for 4 client products.",
      "Created a component library reducing UI inconsistencies by 60%.",
    ],
  },
];

// ── Layout constants ──────────────────────────────────────────────────────────
const SECTION_W   = 440;   // px per experience column
const LEAD_PAD    = 100;   // left breathing room before first card
const TRAIL_PAD   = 160;   // right breathing room after last card
const TOTAL_H     = 520;   // component height
const GROUND_H    = 72;    // ground strip height
const PLATFORM_H  = 28;    // brick platform row height
const PLATFORM_W  = 180;   // brick platform width
const CARD_W      = 320;   // experience card width

// Alternating card elevations (distance up from ground)
const ELEVATIONS = [220, 130, 250];

// Decorative cloud configs [left%, top%]
const CLOUDS = [
  { x: 6,  y: 6,  scale: 1.1 },
  { x: 24, y: 11, scale: 0.75 },
  { x: 44, y: 5,  scale: 1.3 },
  { x: 64, y: 9,  scale: 0.9 },
  { x: 82, y: 5,  scale: 1.05 },
  { x: 93, y: 13, scale: 0.65 },
];

// Floating coin clusters [left%, top%]
const COIN_CLUSTERS = [
  [{ x: 22.0, y: 40 }, { x: 22.8, y: 40 }, { x: 23.6, y: 40 }],
  [{ x: 48.0, y: 48 }, { x: 48.8, y: 48 }],
  [{ x: 73.0, y: 43 }, { x: 73.8, y: 43 }, { x: 74.6, y: 43 }],
];

// ── Pixel cloud ───────────────────────────────────────────────────────────────
function PixelCloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `scale(${scale})`,
        transformOrigin: "left top",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <div style={{ position: "relative", width: 96, height: 48 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 18, background: "rgba(255,255,255,0.92)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 10, width: 32, height: 22, background: "rgba(255,255,255,0.92)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24, width: 40, height: 28, background: "rgba(255,255,255,0.92)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 54, width: 26, height: 20, background: "rgba(255,255,255,0.92)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 4, right: 4, height: 4, background: "rgba(0,0,0,0.04)" }} />
      </div>
    </div>
  );
}

// ── Coin ─────────────────────────────────────────────────────────────────────
function Coin({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.div
      style={{ position: "absolute", left: `${x}%`, top: `${y}%`, zIndex: 3 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #FFE045 0%, #F5B800 55%, #CC8C00 100%)",
        border: "2px solid #B87800",
        boxShadow: "inset 2px 2px 0 rgba(255,245,180,0.8), 0 3px 6px rgba(160,100,0,0.3)",
      }} />
    </motion.div>
  );
}

// ── Green pipe ────────────────────────────────────────────────────────────────
function Pipe({ centerX }: { centerX: number }) {
  return (
    <div style={{ position: "absolute", left: centerX - 26, bottom: GROUND_H, zIndex: 3, pointerEvents: "none" }}>
      {/* Cap */}
      <div style={{
        width: 60, height: 18,
        marginLeft: -6,
        background: "linear-gradient(to right, #228B22 0%, #32CD32 45%, #228B22 100%)",
        border: "2.5px solid #155C15",
        borderBottom: "none",
        boxShadow: "inset 5px 0 0 rgba(255,255,255,0.2)",
      }} />
      {/* Body */}
      <div style={{
        width: 48, height: 64,
        background: "linear-gradient(to right, #228B22 0%, #32CD32 45%, #228B22 100%)",
        border: "2.5px solid #155C15",
        borderTop: "none",
        boxShadow: "inset 5px 0 0 rgba(255,255,255,0.2)",
      }} />
    </div>
  );
}

// ── Brick platform ────────────────────────────────────────────────────────────
function BrickPlatform({ centerX }: { centerX: number }) {
  const count = Math.round(PLATFORM_W / 36);
  return (
    <div style={{
      position: "absolute",
      left: centerX - PLATFORM_W / 2,
      bottom: GROUND_H,
      width: PLATFORM_W,
      height: PLATFORM_H,
      display: "flex",
      zIndex: 4,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          flex: 1,
          height: PLATFORM_H,
          background: "#C84B11",
          border: "2px solid #8B3A0D",
          borderRight: i < count - 1 ? "1px solid #8B3A0D" : "2px solid #8B3A0D",
          boxShadow: "inset 0 3px 0 rgba(255,255,255,0.22), inset 0 -3px 0 rgba(0,0,0,0.2)",
        }} />
      ))}
    </div>
  );
}

// ── Date badge ────────────────────────────────────────────────────────────────
function DateBadge({ text, centerX, y }: { text: string; centerX: number; y: number }) {
  return (
    <div style={{
      position: "absolute",
      left: centerX,
      top: y,
      transform: "translateX(-50%)",
      background: "linear-gradient(160deg, #FFE045 0%, #F5B800 55%, #E09C00 100%)",
      border: "2.5px solid #A06800",
      borderRadius: 8,
      padding: "6px 16px",
      fontFamily: "'Inter', sans-serif",
      fontSize: 11.5,
      fontWeight: 800,
      color: "#3D1C00",
      letterSpacing: "0.03em",
      whiteSpace: "nowrap",
      boxShadow: "0 1px 0 rgba(255,240,140,0.9) inset, 0 -2px 0 rgba(120,70,0,0.4) inset, 0 4px 14px rgba(180,120,0,0.3)",
      zIndex: 6,
    }}>
      {text}
    </div>
  );
}

// ── Connector ─────────────────────────────────────────────────────────────────
function Connector({ x, top, height }: { x: number; top: number; height: number }) {
  return (
    <div style={{
      position: "absolute",
      left: x - 1,
      top,
      width: 2,
      height,
      backgroundImage: "repeating-linear-gradient(to bottom, #94A3B8 0px, #94A3B8 5px, transparent 5px, transparent 11px)",
      zIndex: 5,
    }} />
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
function ExperienceCard({ exp, centerX, top }: { exp: WorkExperience; centerX: number; top: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      style={{
        position: "absolute",
        left: centerX - CARD_W / 2,
        top,
        width: CARD_W,
        background: "rgba(255,255,255,0.97)",
        border: "1.5px solid rgba(220,230,244,0.9)",
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 8px 32px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)",
        zIndex: 7,
      }}
    >
      <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", fontFamily: "'Inter', sans-serif", marginBottom: 3 }}>
        {exp.role}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "#64748B", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
          {exp.company}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <MapPin size={10} color="#94A3B8" strokeWidth={2} />
          <p style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
            {exp.location}
          </p>
        </div>
      </div>
      <div style={{ height: 1, background: "#F1F5F9", marginBottom: 12 }} />
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {exp.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{
              marginTop: 5, flexShrink: 0,
              width: 5, height: 5, borderRadius: "50%", background: "#CBD5E1",
            }} />
            <span style={{ fontSize: 12, color: "#475569", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function DesignerMarioExperience() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  // Parallax: clouds drift as section scrolls into view
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start end", "end start"] });
  const cloud1X = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const cloud2X = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const cloud3X = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const cloudXs = [cloud1X, cloud2X, cloud3X, cloud1X, cloud2X, cloud3X];

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current     = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x     = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const delta = (x - startX.current) * 1.2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - delta;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  const n          = EXPERIENCES.length;
  const totalWidth = LEAD_PAD + n * SECTION_W + TRAIL_PAD;
  const centerXs   = EXPERIENCES.map((_, i) => LEAD_PAD + i * SECTION_W + SECTION_W / 2);
  const cardTops   = EXPERIENCES.map((_, i) => TOTAL_H - GROUND_H - PLATFORM_H - ELEVATIONS[i % ELEVATIONS.length]);
  const badgeTops  = cardTops.map(t => t - 58);

  // Pipe positions: midpoints between adjacent entries
  const pipeXs = EXPERIENCES.slice(0, -1).map((_, i) => (centerXs[i] + centerXs[i + 1]) / 2);

  return (
    <div ref={outerRef} style={{ position: "relative", marginBottom: 80 }}>
      {/* Drag hint */}
      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "#94A3B8",
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 14,
        userSelect: "none",
      }}>
        ← drag to scroll →
      </p>

      {/* Scroll container — full-bleed, no border-radius */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          userSelect: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Inner track */}
        <div style={{
          position: "relative",
          width: totalWidth,
          height: TOTAL_H,
          background: "linear-gradient(to bottom, #B8DFF8 0%, #CAEBFF 35%, #D8F0FF 100%)",
          overflow: "hidden",
        }}>

          {/* ── Parallax clouds ── */}
          {CLOUDS.map((c, i) => (
            <motion.div key={i} style={{ x: cloudXs[i % cloudXs.length] }}>
              <PixelCloud x={c.x} y={c.y} scale={c.scale} />
            </motion.div>
          ))}

          {/* ── Coins ── */}
          {COIN_CLUSTERS.map((cluster, ci) =>
            cluster.map((coin, i) => (
              <Coin key={`${ci}-${i}`} x={coin.x} y={coin.y} delay={i * 0.2 + ci * 0.5} />
            ))
          )}

          {/* ── Ground: green grass strip ── */}
          <div style={{
            position: "absolute",
            bottom: GROUND_H - 22,
            left: 0,
            width: totalWidth,
            height: 22,
            background: "linear-gradient(to bottom, #4EC944 0%, #3BAB34 100%)",
            zIndex: 1,
          }} />
          {/* ── Ground: brick dirt ── */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: totalWidth,
            height: GROUND_H - 22,
            backgroundColor: "#C84B11",
            backgroundImage: [
              "repeating-linear-gradient(90deg, transparent 0px, transparent 39px, rgba(0,0,0,0.16) 39px, rgba(0,0,0,0.16) 40px)",
              "repeating-linear-gradient(0deg, transparent 0px, transparent 19px, rgba(0,0,0,0.16) 19px, rgba(0,0,0,0.16) 20px)",
            ].join(", "),
            boxShadow: "inset 0 4px 0 rgba(255,255,255,0.12)",
            zIndex: 1,
          }} />

          {/* ── Pipes between entries ── */}
          {pipeXs.map((x, i) => <Pipe key={i} centerX={x} />)}

          {/* ── Per-experience elements ── */}
          {EXPERIENCES.map((exp, i) => {
            const cx      = centerXs[i];
            const cardTop = cardTops[i];
            const badgeTop = badgeTops[i];
            const connTop  = badgeTop + 30;
            const connH    = cardTop - connTop;
            return (
              <div key={exp.id}>
                <BrickPlatform centerX={cx} />
                <Connector x={cx} top={connTop} height={connH} />
                <DateBadge text={exp.period} centerX={cx} y={badgeTop} />
                <ExperienceCard exp={exp} centerX={cx} top={cardTop} />
              </div>
            );
          })}

        </div>
      </div>

      <style>{`.mario-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
