"use client";

import { useRef } from "react";

export interface Recommendation {
  id: string;
  name: string;
  title: string;
  company: string;
  photo: string;
  quote: string;
}

const RECS: Recommendation[] = [
  {
    id: "r1",
    name: "Sarah Jenkins",
    title: "Head of Product",
    company: "Notion",
    photo: "https://i.pravatar.cc/150?u=sarah-jenkins",
    quote:
      "Working with Matt was genuinely one of the best design collaborations I've had. He brings a rare combination of craft and systems thinking — the kind of designer who makes everyone around him sharper.",
  },
  {
    id: "r2",
    name: "David Chen",
    title: "Founder & CEO",
    company: "Linear",
    photo: "https://i.pravatar.cc/150?u=david-chen-linear",
    quote:
      "Matt has an exceptional eye for what matters. He cut through months of ambiguity and handed us a direction that felt obvious in hindsight. I'd work with him again without hesitation.",
  },
  {
    id: "r3",
    name: "Priya Nair",
    title: "VP Design",
    company: "Figma",
    photo: "https://i.pravatar.cc/150?u=priya-nair-figma",
    quote:
      "Few designers can hold a product vision and sweat the pixels at the same time. Matt does both effortlessly. The work he shipped during his time here is still referenced as the bar.",
  },
  {
    id: "r4",
    name: "Tom Okafor",
    title: "Engineering Lead",
    company: "Vercel",
    photo: "https://i.pravatar.cc/150?u=tom-okafor-vercel",
    quote:
      "Matt is the designer every engineer wants. He specs with precision, communicates edge cases clearly, and ships work that needs almost no back-and-forth. An absolute pleasure.",
  },
  {
    id: "r5",
    name: "Léa Fontaine",
    title: "Creative Director",
    company: "Dribbble",
    photo: "https://i.pravatar.cc/150?u=lea-fontaine-dribbble",
    quote:
      "The portfolio Matt put together for our rebrand was stunning — thoughtful, opinionated, and beautifully executed. He has a voice that you can feel in every screen he touches.",
  },
];

/** SVG paper clip */
function PaperClip() {
  return (
    <svg width="24" height="48" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4C8.477 4 4 8.477 4 14v24c0 7.732 6.268 14 14 14s14-6.268 14-14V10"
        stroke="#A0896A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M22 10V34c0 4.418-3.582 8-8 8s-8-3.582-8-8V14"
        stroke="#A0896A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Decorative corner SVG */
function Corner({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28" fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path d="M2 26 C2 14 14 2 26 2" stroke="#C4A97A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M2 20 C2 11 11 2 20 2" stroke="#C4A97A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

/** Opening quotation mark flourish */
function QuoteMark() {
  return (
    <span style={{
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 80,
      lineHeight: 1,
      color: "#C4A97A",
      opacity: 0.35,
      display: "block",
      marginBottom: -20,
      userSelect: "none",
    }}>"</span>
  );
}

function LetterCard({ rec }: { rec: Recommendation }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 480,
        background: "linear-gradient(160deg, #FAF3E0 0%, #F5EAC8 60%, #EFE0B0 100%)",
        borderRadius: 4,
        padding: "36px 36px 40px",
        position: "relative",
        /* double-rule vintage border */
        boxShadow:
          "0 0 0 1px #C4A97A, 0 0 0 4px #FAF3E0, 0 0 0 5px #C4A97A, 0 12px 40px rgba(80,50,10,0.18), 0 2px 6px rgba(80,50,10,0.10)",
        /* aged paper texture via repeating lines */
        backgroundImage:
          "linear-gradient(160deg, #FAF3E0 0%, #F5EAC8 60%, #EFE0B0 100%), repeating-linear-gradient(transparent, transparent 29px, rgba(160,120,60,0.12) 30px)",
        backgroundBlendMode: "multiply",
      }}
    >
      {/* Decorative corners */}
      <div style={{ position: "absolute", top: 10, left: 10 }}><Corner /></div>
      <div style={{ position: "absolute", top: 10, right: 10 }}><Corner flip /></div>
      <div style={{ position: "absolute", bottom: 10, left: 10, transform: "scaleY(-1)" }}><Corner /></div>
      <div style={{ position: "absolute", bottom: 10, right: 10, transform: "scale(-1,-1)" }}><Corner /></div>

      {/* Paper clip top-center */}
      <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
        <PaperClip />
      </div>

      {/* Opening quote flourish */}
      <QuoteMark />

      {/* Quote text */}
      <p style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 26,
        lineHeight: 1.6,
        color: "#3D2B1A",
        margin: "0 0 28px 0",
        letterSpacing: "0.01em",
      }}>
        {rec.quote}
      </p>

      {/* Divider — ink-style rule */}
      <div style={{
        height: 1,
        background: "linear-gradient(to right, transparent, #C4A97A 20%, #C4A97A 80%, transparent)",
        marginBottom: 24,
        opacity: 0.6,
      }} />

      {/* Person row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Stamp-style photo frame */}
        <div style={{
          padding: "5px 5px 5px 5px",
          background: "white",
          boxShadow: "0 3px 12px rgba(80,50,10,0.22)",
          transform: "rotate(-2deg)",
          flexShrink: 0,
          borderRadius: 2,
        }}>
          {/* Perforated stamp edge via dashed border */}
          <div style={{
            border: "2px dashed #C4A97A",
            padding: 3,
          }}>
            <img
              src={rec.photo}
              alt={rec.name}
              draggable={false}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                display: "block",
                filter: "sepia(15%)",
              }}
            />
          </div>
        </div>

        {/* Name + title */}
        <div>
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#3D2B1A",
            margin: "0 0 4px",
            letterSpacing: "0.02em",
          }}>
            {rec.name}
          </p>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 17,
            color: "#7A5C38",
            margin: 0,
            lineHeight: 1.4,
          }}>
            {rec.title} · {rec.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DesignerRecommendations() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cards = [...RECS, ...RECS];

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Left fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 140, zIndex: 10,
        pointerEvents: "none",
        background: "linear-gradient(to right, white 0%, transparent 100%)",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 140, zIndex: 10,
        pointerEvents: "none",
        background: "linear-gradient(to left, white 0%, transparent 100%)",
      }} />

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 28,
          width: "max-content",
          animation: "rec-scroll 44s linear infinite",
          paddingBottom: 12,
          paddingTop: 32,
        }}
        onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; }}
        onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; }}
      >
        {cards.map((rec, i) => (
          <LetterCard key={`${rec.id}-${i}`} rec={rec} />
        ))}
      </div>

      <style>{`
        @keyframes rec-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
