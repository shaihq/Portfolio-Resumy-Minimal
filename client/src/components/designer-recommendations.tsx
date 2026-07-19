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

const PAPER_CLIP_PATH = `polygon(
  0% 3%, 2% 1%, 5% 2%, 9% 0%, 14% 2%, 20% 0%, 27% 2%, 34% 0%,
  41% 2%, 49% 0%, 56% 2%, 63% 0%, 70% 2%, 77% 0%, 83% 2%,
  89% 0%, 94% 2%, 97% 1%, 100% 3%,
  99% 22%, 100% 45%, 99% 68%, 100% 88%, 98% 97%, 100% 100%,
  96% 99%, 90% 100%, 84% 99%, 77% 100%, 70% 99%, 63% 100%,
  56% 99%, 49% 100%, 42% 99%, 35% 100%, 28% 99%, 21% 100%,
  15% 99%, 9% 100%, 4% 99%, 1% 100%, 0% 97%,
  1% 78%, 0% 56%, 1% 34%, 0% 12%
)`;

function LetterCard({ rec }: { rec: Recommendation }) {
  return (
    /* Outer wrapper — not clipped, holds the floating paperclip */
    <div style={{ flexShrink: 0, width: 460, position: "relative" }}>

      {/* Clip image — only bottom 20% peeks over the top of the card */}
      <img
        src="/clip.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(-80%)",
          width: 72,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Clipped card body */}
      <div
        style={{
          width: "100%",
          clipPath: PAPER_CLIP_PATH,
          backgroundColor: "#F8E3C4",
          backgroundImage: "url('/bgcard.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
          padding: "48px 36px 44px",
          position: "relative",
        }}
      >
        {/* Photo + name block */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div
            style={{
              background: "white",
              padding: "5px 5px 18px 5px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              transform: "rotate(-2deg)",
              flexShrink: 0,
            }}
          >
            <img
              src={rec.photo}
              alt={rec.name}
              draggable={false}
              style={{ width: 82, height: 82, objectFit: "cover", display: "block" }}
            />
          </div>

          <div>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: "#1A1A1A",
              marginBottom: 3,
            }}>
              {rec.name}
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13,
              color: "#6B5B45",
              lineHeight: 1.5,
              fontWeight: 400,
            }}>
              {rec.title}<br />{rec.company}
            </p>
          </div>
        </div>

        {/* Quote */}
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 16,
          lineHeight: 1.75,
          color: "#2D1F0E",
          margin: 0,
          fontWeight: 400,
        }}>
          "{rec.quote}"
        </p>
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
          animation: "rec-scroll 80s linear infinite",
          paddingBottom: 12,
          paddingTop: 40,
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
