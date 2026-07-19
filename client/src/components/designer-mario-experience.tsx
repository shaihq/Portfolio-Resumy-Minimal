"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
export interface WorkExperience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
  logo: string; // URL or data-URI
}

// Inline SVG logos — no external requests, always visible
const LOGO_DESIGNFOLIO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='10' fill='%23111827'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-size='18' font-weight='700' fill='white'>D</text></svg>`;

const LOGO_GOOGLE = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/><path fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/><path fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/><path fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/><path fill='none' d='M0 0h48v48H0z'/></svg>`;

const LOGO_FACEBOOK = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='10' fill='%231877F2'/><path d='M22 20h3l.5-3.5H22V14c0-1 .5-2 2-2h2V9s-1.3-.2-2.8-.2c-2.8 0-4.7 1.7-4.7 4.8v2.9H16V20h2.5v10H22V20z' fill='white'/></svg>`;

const EXPERIENCES: WorkExperience[] = [
  {
    id: "exp-1",
    period: "Jan '24 – Present",
    role: "Senior Product Designer",
    company: "Designfolio Inc.",
    location: "San Francisco, CA",
    logo: LOGO_DESIGNFOLIO,
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
    company: "Google",
    location: "New York, NY",
    logo: LOGO_GOOGLE,
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
    company: "Facebook",
    location: "Austin, TX",
    logo: LOGO_FACEBOOK,
    bullets: [
      "Designed user flows and wireframes for 4 client products.",
      "Created a component library reducing UI inconsistencies by 60%.",
    ],
  },
];

// ── Layout constants ──────────────────────────────────────────────────────────
const SECTION_W   = 450;   // px per experience column
const LEAD_PAD    = 80;    // left breathing room before first card
const TRAIL_PAD   = 120;   // right breathing room after last card
const TOTAL_H     = 580;   // component height
const GROUND_H    = 72;    // ground strip height
const PLATFORM_H  = 28;    // brick platform row height
const PLATFORM_W  = 210;   // brick platform width
const CARD_W      = 370;   // experience card width

// Single elevation — all cards sit on the same horizontal line, centred in the sky
const ELEVATION = 230;

// Decorative cloud positions [x%, y%]
const CLOUDS = [
  { x: 8, y: 8, scale: 1 },
  { x: 28, y: 14, scale: 0.7 },
  { x: 52, y: 6, scale: 1.2 },
  { x: 72, y: 12, scale: 0.85 },
  { x: 88, y: 7, scale: 0.95 },
];

// Floating coins between entries [x%, y%]
const COINS = [
  { x: 22, y: 42 }, { x: 22.8, y: 42 }, { x: 23.6, y: 42 },
  { x: 47, y: 50 }, { x: 47.8, y: 50 },
  { x: 71, y: 44 }, { x: 71.8, y: 44 }, { x: 72.6, y: 44 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

/** Classic Mario-style pixel cloud */
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
        imageRendering: "pixelated",
      }}
    >
      {/* Cloud built from stacked rounded rectangles — no border-radius = pixel style */}
      <div style={{ position: "relative", width: 80, height: 40 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 16, background: "white", borderRadius: 0 }} />
        <div style={{ position: "absolute", bottom: 12, left: 12, width: 28, height: 20, background: "white" }} />
        <div style={{ position: "absolute", bottom: 16, left: 24, width: 32, height: 22, background: "white" }} />
        <div style={{ position: "absolute", bottom: 12, left: 44, width: 22, height: 18, background: "white" }} />
        {/* shadow line */}
        <div style={{ position: "absolute", bottom: 0, left: 2, right: 2, height: 3, background: "rgba(0,0,0,0.06)" }} />
      </div>
    </div>
  );
}

/** Mario coin (yellow circle with $ highlight) */
function Coin({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      style={{ position: "absolute", left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1.2 }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFE045 0%, #F5B800 60%, #CC8C00 100%)",
          border: "2px solid #CC8800",
          boxShadow: "inset 2px 2px 0 rgba(255,255,200,0.7), 0 2px 4px rgba(180,120,0,0.3)",
        }}
      />
    </motion.div>
  );
}

/** Green pipe (classic Mario) */
function Pipe({ x }: { x: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: GROUND_H,
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      {/* Pipe cap */}
      <div style={{
        width: 52, height: 16,
        background: "linear-gradient(to right, #2EA829 0%, #3FBF3A 40%, #2EA829 100%)",
        border: "2.5px solid #1D7C19",
        borderBottom: "none",
        marginLeft: -4,
        boxShadow: "inset 4px 0 0 rgba(255,255,255,0.18)",
      }} />
      {/* Pipe body */}
      <div style={{
        width: 44, height: 56,
        background: "linear-gradient(to right, #2EA829 0%, #3FBF3A 40%, #2EA829 100%)",
        border: "2.5px solid #1D7C19",
        borderTop: "none",
        boxShadow: "inset 4px 0 0 rgba(255,255,255,0.18)",
      }} />
    </div>
  );
}

/** Brick platform under each card */
function BrickPlatform({ centerX }: { centerX: number }) {
  const brickCount = Math.round(PLATFORM_W / 32);
  return (
    <div
      style={{
        position: "absolute",
        left: centerX - PLATFORM_W / 2,
        bottom: GROUND_H,
        width: PLATFORM_W,
        height: PLATFORM_H,
        display: "flex",
        gap: 0,
      }}
    >
      {Array.from({ length: brickCount }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: PLATFORM_H,
            background: "#C84B11",
            border: "2px solid #8B3A0D",
            borderRight: i < brickCount - 1 ? "1px solid #8B3A0D" : "2px solid #8B3A0D",
            boxShadow: "inset 0 3px 0 rgba(255,255,255,0.22), inset 0 -3px 0 rgba(0,0,0,0.2)",
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
}

/** Yellow "? block" style date badge */
function DateBadge({ text, centerX, y }: { text: string; centerX: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: y,
        transform: "translateX(-50%)",
        background: "linear-gradient(160deg, #FFE045 0%, #F5B800 55%, #E09C00 100%)",
        border: "2.5px solid #A06800",
        borderRadius: 6,
        padding: "6px 16px",
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        fontWeight: 800,
        color: "#3D1C00",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        boxShadow:
          "0 1px 0 rgba(255,240,140,0.9) inset, 0 -2px 0 rgba(120,70,0,0.4) inset, 0 4px 12px rgba(180,120,0,0.25)",
        zIndex: 4,
      }}
    >
      {text}
    </div>
  );
}

/** Vertical dotted connector from badge to card */
function Connector({ x, top, bottom }: { x: number; top: number; bottom: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 1,
        top,
        width: 2,
        height: bottom - top,
        backgroundImage: "repeating-linear-gradient(to bottom, #CBD5E1 0px, #CBD5E1 5px, transparent 5px, transparent 10px)",
        zIndex: 3,
      }}
    />
  );
}

/** Experience card */
function ExperienceCard({
  exp,
  centerX,
  top,
}: {
  exp: WorkExperience;
  centerX: number;
  top: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      style={{
        position: "absolute",
        left: centerX - CARD_W / 2,
        top,
        width: CARD_W,
        background: "rgba(255,255,255,0.97)",
        border: "1.5px solid rgba(226,232,240,0.9)",
        borderRadius: 14,
        padding: "22px 26px",
        boxShadow:
          "0 4px 24px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.06)",
        zIndex: 5,
      }}
    >
      {/* Logo + header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        {/* Company logo */}
        <img
          src={exp.logo}
          alt={exp.company}
          width={40}
          height={40}
          style={{
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            objectFit: "contain",
            background: "#fff",
            flexShrink: 0,
          }}
        />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
            fontFamily: "'Inter', sans-serif",
            marginBottom: 4,
          }}>
            {exp.role}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <p style={{ fontSize: 15, color: "#64748B", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              {exp.company}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              <MapPin size={13} color="#94A3B8" strokeWidth={2} />
              <p style={{ fontSize: 13, color: "#94A3B8", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                {exp.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#F1F5F9", marginBottom: 14 }} />

      {/* Bullets */}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {exp.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{
              marginTop: 7,
              flexShrink: 0,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#CBD5E1",
            }} />
            <span style={{
              fontSize: 14,
              color: "#475569",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.65,
            }}>
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
  const scrollRef   = useRef<HTMLDivElement>(null);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);
  const [pressedBtn, setPressedBtn] = useState<"left" | "right" | null>(null);

  /** Synthesised Mario coin sound — no audio file needed */
  const playMarioSound = useCallback((direction: "left" | "right") => {
    try {
      const ctx  = new AudioContext();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      // Two-note Mario coin sweep (square wave)
      const freqs = direction === "right"
        ? [783.99, 1046.50]   // G5 → C6  (forward / coin)
        : [1046.50, 783.99];  // C6 → G5  (backward)

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.connect(gain);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.10);
      });
    } catch { /* AudioContext blocked — silently ignore */ }
  }, []);

  /** Scroll by exactly one card section */
  const scrollByCard = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    playMarioSound(dir);
    setPressedBtn(dir);
    setTimeout(() => setPressedBtn(null), 160);
    scrollRef.current.scrollBy({ left: dir === "right" ? SECTION_W : -SECTION_W, behavior: "smooth" });
  }, [playMarioSound]);

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

  const n         = EXPERIENCES.length;
  const totalWidth = LEAD_PAD + n * SECTION_W + TRAIL_PAD;

  // Positions
  const centerXs = EXPERIENCES.map((_, i) => LEAD_PAD + i * SECTION_W + SECTION_W / 2);
  const cardTops = EXPERIENCES.map(() => TOTAL_H - GROUND_H - PLATFORM_H - ELEVATION);
  const badgeTops = cardTops.map(t => t - 54);
  const connTop   = (i: number) => badgeTops[i] + 28;
  const connBot   = (i: number) => cardTops[i];

  // Pipe positions (between entries)
  const pipeXs = EXPERIENCES.slice(0, -1).map((_, i) =>
    ((centerXs[i] + centerXs[i + 1]) / 2 / totalWidth) * 100
  );

  return (
    <div style={{ position: "relative", marginTop: 0, marginBottom: 64 }}>
      {/* Mario nav buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 14 }}>
        {(["left", "right"] as const).map((dir) => {
          const pressed = pressedBtn === dir;
          return (
            <button
              key={dir}
              onClick={() => scrollByCard(dir)}
              title={dir === "left" ? "Previous" : "Next"}
              style={{
                width: 44,
                height: 44,
                cursor: "pointer",
                border: "3px solid #5A2D00",
                borderRadius: 6,
                background: pressed
                  ? "linear-gradient(to bottom, #D49000 0%, #A06800 100%)"
                  : "linear-gradient(to bottom, #FFE045 0%, #F5A800 60%, #D48000 100%)",
                boxShadow: pressed
                  ? "inset 0 3px 6px rgba(0,0,0,0.35), 0 1px 0 #5A2D00"
                  : "inset 0 3px 0 rgba(255,255,200,0.55), 0 4px 0 #5A2D00, 0 5px 8px rgba(0,0,0,0.22)",
                transform: pressed ? "translateY(3px)" : "translateY(0px)",
                transition: "transform 0.08s, box-shadow 0.08s, background 0.08s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                outline: "none",
                userSelect: "none",
                imageRendering: "pixelated",
              }}
            >
              {/* Pixel chevron SVG */}
              {dir === "left" ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ imageRendering: "pixelated" }}>
                  <rect x="8"  y="1"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="6"  y="3"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="4"  y="5"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="4"  y="7"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="6"  y="9"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="8"  y="11" width="2" height="2" fill="#5A2D00"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ imageRendering: "pixelated" }}>
                  <rect x="4"  y="1"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="6"  y="3"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="8"  y="5"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="8"  y="7"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="6"  y="9"  width="2" height="2" fill="#5A2D00"/>
                  <rect x="4"  y="11" width="2" height="2" fill="#5A2D00"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll container */}
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
          borderRadius: 20,
          border: "1.5px solid rgba(226,232,240,0.7)",
          boxShadow: "0 8px 40px rgba(15,23,42,0.07)",
          scrollbarWidth: "none",
        }}
        className="hide-scrollbar"
      >
        {/* Inner track */}
        <div
          style={{
            position: "relative",
            width: totalWidth,
            height: TOTAL_H,
            background: "linear-gradient(to bottom, #DAEFFE 0%, #C5E8FB 40%, #B3DFF8 100%)",
            flexShrink: 0,
          }}
        >
          {/* ── Clouds ── */}
          {CLOUDS.map((c, i) => (
            <PixelCloud key={i} x={(c.x / 100) * totalWidth / totalWidth * 100} y={c.y} scale={c.scale} />
          ))}

          {/* ── Floating coins between platforms ── */}
          {COINS.map((c, i) => (
            <Coin key={i} x={c.x} y={c.y} />
          ))}

          {/* ── Ground strip ── */}
          {/* Green grass top */}
          <div
            style={{
              position: "absolute",
              bottom: GROUND_H - 20,
              left: 0,
              width: totalWidth,
              height: 20,
              background: "linear-gradient(to bottom, #4ABA41 0%, #3DA435 100%)",
            }}
          />
          {/* Brick dirt */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: totalWidth,
              height: GROUND_H - 20,
              backgroundColor: "#C84B11",
              backgroundImage: [
                "repeating-linear-gradient(90deg, transparent 0px, transparent 39px, rgba(0,0,0,0.18) 39px, rgba(0,0,0,0.18) 40px)",
                "repeating-linear-gradient(0deg, transparent 0px, transparent 19px, rgba(0,0,0,0.18) 19px, rgba(0,0,0,0.18) 20px)",
              ].join(", "),
              boxShadow: "inset 0 3px 0 rgba(255,255,255,0.15)",
            }}
          />

          {/* ── Pipes between entries ── */}
          {pipeXs.map((x, i) => (
            <Pipe key={i} x={(((centerXs[i] + centerXs[i + 1]) / 2) / totalWidth) * 100} />
          ))}

          {/* ── Per-experience elements ── */}
          {EXPERIENCES.map((exp, i) => (
            <div key={exp.id}>
              {/* Brick platform */}
              <BrickPlatform centerX={centerXs[i]} />

              {/* Connector line */}
              <Connector
                x={centerXs[i]}
                top={connTop(i)}
                bottom={connBot(i)}
              />

              {/* Date badge */}
              <DateBadge text={exp.period} centerX={centerXs[i]} y={badgeTops[i]} />

              {/* Experience card */}
              <ExperienceCard exp={exp} centerX={centerXs[i]} top={cardTops[i]} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
