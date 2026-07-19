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

/** SVG paper clip — purely decorative */
function PaperClip() {
  return (
    <svg
      width="28"
      height="52"
      viewBox="0 0 28 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <path
        d="M14 4C8.477 4 4 8.477 4 14v24c0 7.732 6.268 14 14 14s14-6.268 14-14V10"
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 10V34c0 4.418-3.582 8-8 8s-8-3.582-8-8V14"
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function LetterCard({ rec }: { rec: Recommendation }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 440,
        background: "#FDFAF3",
        border: "1px solid #E8DEC8",
        borderRadius: 6,
        padding: "36px 36px 40px",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.6)",
        position: "relative",
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, #EDE5D0 28px)",
        backgroundSize: "100% 28px",
        backgroundPositionY: "56px",
      }}
    >
      {/* Paper clip top-center */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <PaperClip />
      </div>

      {/* Photo + name block */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        {/* Polaroid-style photo */}
        <div
          style={{
            background: "white",
            padding: "4px 4px 14px 4px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            transform: "rotate(-2deg)",
            flexShrink: 0,
          }}
        >
          <img
            src={rec.photo}
            alt={rec.name}
            draggable={false}
            style={{
              width: 68,
              height: 68,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Name / title */}
        <div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1A1A1A",
              marginBottom: 3,
            }}
          >
            {rec.name}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 1.4,
            }}
          >
            {rec.title}
            <br />
            {rec.company}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 22,
          lineHeight: 1.65,
          color: "#374151",
          margin: 0,
        }}
      >
        "{rec.quote}"
      </p>
    </div>
  );
}

export function DesignerRecommendations() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate for seamless loop
  const cards = [...RECS, ...RECS];

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Left fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to right, white 0%, transparent 100%)",
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to left, white 0%, transparent 100%)",
      }} />
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 24,
          width: "max-content",
          animation: "rec-scroll 40s linear infinite",
          paddingBottom: 8,
          paddingTop: 28, /* room for paper clip overflow */
        }}
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "running";
        }}
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
