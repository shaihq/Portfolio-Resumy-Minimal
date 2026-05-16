import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useTheme } from "next-themes";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, ArrowLeft, Search, ChevronRight, SlidersHorizontal, Sparkles, Bookmark, MapPin, Briefcase, Building2, ExternalLink, Video, Check, CheckCircle2, XCircle, Clapperboard, Phone, ChevronLeft, Clock, Monitor, X, SendHorizontal, Calendar, Users, Mail, FileText, ThumbsUp, PenLine, MessageSquare, Star, AlertTriangle, Crosshair, Maximize2, Minimize2, FlaskConical, Plus, Link2, PenSquare, ChevronDown, Lightbulb } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Gauge } from "@/components/ui/gauge-1";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { MatchGlowCard } from "@/components/ui/glowing-card";
import { ColorOrb } from "@/components/ui/color-orb";
import profileImg from "@/assets/images/profile.png";
import {
  Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent,
  KanbanItem, KanbanItemHandle, KanbanOverlay,
} from "@/components/ui/kanban";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";
import type { AnamClient, Message } from "@anam-ai/js-sdk";
import Lottie from "lottie-react";
import aiAssistantAnimation from "@/assets/AI-Assistant.json";
import { RadialIntro } from "@/components/ui/radial-intro";
import { UsageBadge } from "@/components/ui/bubble-button";

type Phase = "transition" | "voice" | "type" | "done" | "aha" | "dashboard";

// ── Data model ─────────────────────────────────────────────────────────────
interface Job {
  id: string;
  company: string;
  role: string;
  match: number;
  reason: string;
  logoColor: string;
  logoLetter: string;
  source: "linkedin" | "indeed";
  type: string;
  workMode: string;
  yearsExp: string;
  location: string;
  description: string;
  requirements: string[];
  postedDate: string;
  contacts: { name: string; initials: string }[];
}

const BASE_JOBS: Job[] = [
  {
    id: "1", company: "Linear", role: "Senior Product Designer", match: 96, reason: "Remote-first, full ownership, design system scope",
    logoColor: "#5E6AD2", logoLetter: "L", source: "linkedin", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "San Francisco, CA",
    description: "We're looking for a Senior Product Designer to help shape the future of software project management. At Linear, design is a core part of how we build — you'll work directly with engineers and product leads to craft experiences that millions of developers and teams rely on daily.\n\nYou'll own end-to-end design for key product areas, from early exploration to final polish. We care deeply about craft, clarity, and shipping work that actually moves the needle.",
    requirements: ["5+ years of product design experience at a B2B or developer-focused company", "Strong systems thinking — you've built or significantly contributed to a design system", "Fluency in interaction design, information architecture, and visual polish", "Comfortable working directly with engineers and reviewing implementation", "A portfolio that shows both breadth of thinking and depth of execution"],
    postedDate: "3 days ago", contacts: [{ name: "Sarah Chen", initials: "SC" }, { name: "Alex Park", initials: "AP" }],
  },
  {
    id: "2", company: "Vercel", role: "Product Designer", match: 91, reason: "Developer-led culture, design-code bridge, async",
    logoColor: "#171717", logoLetter: "V", source: "linkedin", type: "Full-Time", workMode: "Remote", yearsExp: "3+ yrs", location: "New York, NY",
    description: "Vercel is where the world's best frontend teams deploy their work. As a Product Designer, you'll sit at the intersection of developer tooling and consumer-grade UX — helping make complex infrastructure feel simple and powerful at once.\n\nYou'll collaborate with engineering and product management to define, design, and ship features across our dashboard, CLI, and onboarding flows. We move fast, write clearly, and care about the details.",
    requirements: ["3+ years designing developer tools, SaaS dashboards, or technical products", "Experience translating complex technical concepts into clear, intuitive UI", "Solid grasp of frontend fundamentals — HTML, CSS, component thinking", "Async-first work style with strong written communication", "Figma proficiency and experience collaborating closely with eng"],
    postedDate: "1 week ago", contacts: [{ name: "James Wu", initials: "JW" }, { name: "Priya Nair", initials: "PN" }],
  },
  {
    id: "3", company: "Notion", role: "Product Designer", match: 88, reason: "Content-first, collaborative, B2B/consumer overlap",
    logoColor: "#191919", logoLetter: "N", source: "indeed", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "San Francisco, CA",
    description: "Notion's mission is to make it possible for everyone to shape the tools that shape their work. As a Product Designer, you'll help design the blocks, templates, and collaborative surfaces that millions of knowledge workers use every day.\n\nYou'll partner with cross-functional teams across our core editor, AI features, and enterprise product lines. The role is highly collaborative — we work in small teams and ship continuously.",
    requirements: ["4+ years of product design with a focus on consumer or prosumer software", "Strong portfolio demonstrating a mastery of interaction and visual design", "Experience designing for complex, state-heavy UI (editors, databases, or similar)", "Collaborative mindset — you run great critique and give useful feedback", "Bonus: experience designing AI-powered features or workflows"],
    postedDate: "2 weeks ago", contacts: [{ name: "Tom Baker", initials: "TB" }, { name: "Elena Costa", initials: "EC" }],
  },
  {
    id: "4", company: "Figma", role: "UX Designer", match: 85, reason: "Design community influence, tool ecosystem impact",
    logoColor: "#F24E1E", logoLetter: "F", source: "linkedin", type: "Full-Time", workMode: "On-site", yearsExp: "3+ yrs", location: "San Francisco, CA",
    description: "At Figma, we build the tools that designers use to build everything else. As a UX Designer, you'll work on the core product — including the canvas, multiplayer features, plugins, and components — alongside some of the sharpest design minds in the industry.\n\nThis is a role for someone who loves thinking about interaction models at a deep level and can articulate design decisions clearly across a large, cross-functional org.",
    requirements: ["3+ years of UX design experience with a strong portfolio", "Deep experience with complex, interaction-heavy applications", "Comfortable with design systems, component libraries, and design tokens", "Strong visual design sensibility and attention to typographic detail", "Ability to present work clearly and incorporate feedback constructively"],
    postedDate: "5 days ago", contacts: [{ name: "Chris Moon", initials: "CM" }, { name: "Dana Fox", initials: "DF" }],
  },
  {
    id: "5", company: "Loom", role: "Senior UX Designer", match: 82, reason: "Async-first, startup momentum, video-native product",
    logoColor: "#625DF5", logoLetter: "L", source: "indeed", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "Austin, TX",
    description: "Loom helps teams communicate more clearly through video. As a Senior UX Designer, you'll own the experience across our record, watch, and share flows — making async video feel as effortless as sending a message.\n\nYou'll work in a nimble team, move quickly, and have real influence over product direction. We're growing fast and this role will shape how millions of remote workers communicate.",
    requirements: ["5+ years of UX design experience, ideally at a startup or high-growth company", "Experience with video, media, or communication products is a strong plus", "Able to run your own research — user interviews, usability tests, synthesis", "Strong visual design chops — you don't hand off wireframes, you ship polished work", "Remote-first mindset, comfortable with async collaboration across time zones"],
    postedDate: "1 week ago", contacts: [{ name: "Ryan Patel", initials: "RP" }],
  },
  {
    id: "6", company: "Stripe", role: "Product Designer", match: 79, reason: "High craft bar, complex systems, strong fintech brand",
    logoColor: "#6772E5", logoLetter: "S", source: "linkedin", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "Seattle, WA",
    description: "Stripe builds the economic infrastructure of the internet. As a Product Designer, you'll design mission-critical surfaces used by millions of businesses to accept payments, manage revenue, and run their finances.\n\nOur design bar is exceptionally high. You'll be expected to think in systems, write clearly, and obsess over the small details that make complex workflows feel manageable for a global developer audience.",
    requirements: ["4+ years of product design experience, ideally in fintech or developer tools", "Proven ability to design complex, multi-step workflows with clarity and precision", "Experience working with and contributing to large-scale design systems", "Strong written communication — Stripe is a writing-first culture", "Ability to navigate a large, collaborative org while maintaining design quality"],
    postedDate: "3 weeks ago", contacts: [{ name: "Marcus Webb", initials: "MW" }, { name: "Anya Singh", initials: "AS" }],
  },
];

const COL_ORDER = ["picks", "not_applied", "applied", "interview", "offer"];
const COL_LABELS: Record<string, string> = {
  picks: "AI Picks",
  not_applied: "Shortlisted",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  archived: "Archived",
};

// Light-mode column colors — all stages share the same neutral card shade
const COL_BG: Record<string, string> = {
  picks:       "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  not_applied: "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  applied:     "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  interview:   "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  offer:       "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  archived:    "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
};

const INITIAL_COLUMNS: Record<string, Job[]> = {
  picks: BASE_JOBS,
  not_applied: [],
  applied: [],
  interview: [],
  offer: [],
  archived: [],
};

// ── Orbit company logos (TransitionScreen background) ──────────────────────
const ORBIT_COMPANIES = [
  { id: 1, name: "Company 1", src: "/companylogo-new/companyradial01.svg" },
  { id: 2, name: "Company 2", src: "/companylogo-new/companyradial02.svg" },
  { id: 3, name: "Company 3", src: "/companylogo-new/companyradial03.svg" },
  { id: 4, name: "Company 4", src: "/companylogo-new/companyradial04.svg" },
  { id: 5, name: "Company 5", src: "/companylogo-new/companyradial05.svg" },
  { id: 6, name: "Company 6", src: "/companylogo-new/companyradial06.svg" },
  { id: 7, name: "Company 7", src: "/companylogo-new/companyradial07.svg" },
  { id: 8, name: "Company 8", src: "/companylogo-new/companyradial08.svg" },
];

// ── Shared sub-components ──────────────────────────────────────────────────
const questions = [
  "What role are you looking for next?",
  "Where are you open to working?",
  "What level are you targeting?",
];

const questionOptions: string[][] = [
  ["Engineering", "Product", "Design", "Data & Analytics", "Marketing", "Sales", "Operations"],
  ["My city only", "Open to relocating", "Remote only"],
  ["Mid-level", "Senior", "Lead / Staff", "Manager / Director"],
];

const levelOptions = [
  { title: "Mid-level", sub: "2–4 years", desc: "Growing into ownership." },
  { title: "Senior", sub: "5–8 years", desc: "Leading work independently." },
  { title: "Lead / Staff", sub: "8+ years", desc: "Setting direction for a team." },
  { title: "Manager / Director", sub: "", desc: "People management and strategy." },
];

function Waveform({ listening }: { listening: boolean }) {
  const bars = Array.from({ length: 28 });
  return (
    <div className="flex items-center justify-center gap-[3px] h-14">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-foreground/60"
          animate={
            listening
              ? { height: [`${8 + Math.random() * 8}px`, `${20 + Math.random() * 30}px`, `${8 + Math.random() * 8}px`], opacity: [0.4, 1, 0.4] }
              : { height: "6px", opacity: 0.25 }
          }
          transition={
            listening
              ? { duration: 0.6 + Math.random() * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}

function DotTrail({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-foreground"
          animate={{ width: i === current ? 20 : 6, opacity: i < current ? 0.25 : i === current ? 1 : 0.12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}

// ── Animated job count ────────────────────────────────────────────────────
function AnimatedJobCount({ onDone }: { onDone?: () => void }) {
  const [count, setCount] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const doneFiredRef = useRef(false);

  useEffect(() => {
    const duration = 1800; // natural pacing
    const target = 1200;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);

      // fire at halfway
      if (!doneFiredRef.current && current >= target / 2) {
        doneFiredRef.current = true;
        onDone?.();
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
        setTimeout(() => setShowGradient(true), 80);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const display = count >= 1200 ? "1,200+" : count.toLocaleString();

  return (
    <span
      key={showGradient ? "g" : "n"}
      style={showGradient ? {
        display: "inline-block",
        whiteSpace: "nowrap",
        paddingRight: "0.08em",
        color: "transparent",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundImage: "linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 38%, #5D3560 52%, #E54D2E 62%, #F5A623 72%, hsl(var(--foreground)) 86%, hsl(var(--foreground)) 100%)",
        backgroundSize: "300% 100%",
        animation: "shimmer-text 3s ease-in-out forwards",
      } : { display: "inline-block", whiteSpace: "nowrap" }}
    >
      {display}
    </span>
  );
}

// ── Transition screen ──────────────────────────────────────────────────────
function TransitionScreen({ onVoice, onType, onSkip }: { onVoice: () => void; onType: () => void; onSkip: () => void }) {
  const [orbitVisible, setOrbitVisible] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#F0EDE7] dark:bg-[#1A1A1A] px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-[#FF553E]/8 blur-[120px]" />
      </div>

      {/* Radial orbit — mounts only after count reaches 1,200+ */}
      <AnimatePresence>
        {orbitVisible && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <RadialIntro orbitItems={ORBIT_COMPANIES} stageSize={640} imageSize={52} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="relative z-10 max-w-md text-center space-y-6" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}>
        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">
            We found <AnimatedJobCount onDone={() => setOrbitVisible(true)} /><br />
            jobs that match your profile.
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-light">Now let's find the ones worth your time. Answer 3 quick questions and we'll narrow it down to your best matches.</p>
        </div>
        <motion.div className="flex flex-col items-center gap-3 pt-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <button data-testid="button-lets-do-it" onClick={onType} className="cursor-pointer flex items-center gap-2 bg-foreground text-background font-medium text-[14px] px-7 py-3 rounded-full hover:bg-foreground/90 transition-all active:scale-[0.97]">
            Let's do it <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onSkip} className="cursor-pointer text-[13px] text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
            Skip
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Voice room ─────────────────────────────────────────────────────────────
function VoiceRoom({ onDone, onReset }: { onDone: () => void; onReset: () => void }) {
  const [current, setCurrent] = useState(0);
  const [listening, setListening] = useState(false);
  const [answered, setAnswered] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMic = () => {
    if (listening) {
      setListening(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      setTimeout(() => {
        const next = current + 1;
        setAnswered((p) => [...p, "..."]);
        next >= questions.length ? onDone() : setCurrent(next);
      }, 400);
    } else {
      setListening(true);
      timerRef.current = setTimeout(() => {
        setListening(false);
        const next = current + 1;
        setAnswered((p) => [...p, "..."]);
        next >= questions.length ? onDone() : setCurrent(next);
      }, 8000);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-[#F0EDE7] dark:bg-[#1A1A1A] px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-0 dark:opacity-100" animate={{ backgroundColor: listening ? "rgba(255,85,62,0.12)" : "rgba(255,85,62,0.06)" }} transition={{ duration: 0.8 }} />
      </div>
      <div />
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-10">
        <AnimatePresence mode="wait">
          <motion.p key={current} className="text-foreground text-[22px] font-medium leading-snug tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: "easeOut" }}>
            {questions[current]}
          </motion.p>
        </AnimatePresence>
        <Waveform listening={listening} />
        <motion.button data-testid="button-mic" onClick={handleMic} className={`cursor-pointer w-16 h-16 rounded-full flex items-center justify-center transition-all ${listening ? "bg-[#FF553E] shadow-[0_0_40px_rgba(255,85,62,0.4)]" : "bg-foreground/10 border border-border hover:bg-foreground/15"}`} whileTap={{ scale: 0.93 }}>
          {listening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
        </motion.button>
        <p className="text-muted-foreground/60 text-[12px]">{listening ? "Tap to stop" : "Tap to speak"}</p>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <DotTrail current={current} total={questions.length} />
        <button data-testid="button-do-later-voice" onClick={onReset} className="cursor-pointer text-muted-foreground/50 text-[12px] hover:text-muted-foreground transition-colors">I'll do it later</button>
      </div>
    </motion.div>
  );
}

const roleSuggestions = [
  "Product Designer",
  "UX Designer",
  "UI Designer",
  "UX Researcher",
  "Design Lead",
  "Interaction Designer",
];

// ── Type room ──────────────────────────────────────────────────────────────
function TypeRoom({ onDone, onReset }: { onDone: () => void; onReset: () => void }) {
  const [current, setCurrent] = useState(0);
  const [roleInput, setRoleInput] = useState("Senior Product Designer");
  const [locationChoice, setLocationChoice] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [levelChoice, setLevelChoice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (current === 0) setTimeout(() => inputRef.current?.focus(), 50);
  }, [current]);

  useEffect(() => {
    if (locationChoice && locationChoice !== "Remote only") {
      setTimeout(() => cityInputRef.current?.focus(), 50);
    }
  }, [locationChoice]);

  const goBack = () => setCurrent((c) => c - 1);

  const canNext = () => {
    if (current === 0) return roleInput.trim().length > 0;
    if (current === 1) {
      if (!locationChoice) return false;
      if (locationChoice === "Remote only") return true;
      return cityInput.trim().length > 0;
    }
    if (current === 2) return levelChoice !== null;
    return false;
  };

  const handleNext = () => {
    if (!canNext()) return;
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      onDone();
    }
  };

  const handleLocationOption = (option: string) => {
    if (locationChoice !== option) {
      setLocationChoice(option);
      setCityInput(
        option === "My city only" ? "Bengaluru" :
        option === "Open to relocating" ? "Mumbai, Pune, Bengaluru" : ""
      );
    }
  };

  const isLastStep = current === questions.length - 1;

  return (
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-[#F0EDE7] dark:bg-[#1A1A1A] px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-[#FF553E]/6 blur-[120px]" />
      </div>
      <div />
      {/* Question + answer area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-6 w-full">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.35 }}
          className="w-16 h-16"
        >
          <Lottie animationData={aiAssistantAnimation} loop={true} />
        </motion.div>

        <BlurredStagger
          key={current}
          text={questions[current]}
          className="text-foreground text-[22px] font-medium leading-snug tracking-tight"
        />

        <AnimatePresence mode="wait">
          {/* Q1 — Role */}
          {current === 0 && (
            <motion.div key="role-input" className="flex flex-col items-center gap-4 w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32 }}>
              <input
                ref={inputRef}
                data-testid="input-role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
                className="w-full bg-background/70 dark:bg-foreground/5 border border-border rounded-2xl px-5 py-4 text-foreground text-[15px] outline-none focus:border-foreground/30 transition-colors text-left"
              />
              <div className="flex flex-wrap justify-center gap-2">
                {roleSuggestions.map((s) => (
                  <button key={s} data-testid={`suggestion-${s.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setRoleInput(s)}
                    className={`cursor-pointer px-4 py-2 rounded-full border text-[13px] transition-all duration-200 ${roleInput === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground bg-background/50 dark:bg-foreground/5 hover:border-foreground/30 hover:text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Q2 — Location */}
          {current === 1 && (
            <motion.div key="location" className="flex flex-col items-center gap-5 w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32 }}>
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {questionOptions[1].map((option) => (
                  <motion.button
                    key={option}
                    data-testid={`option-${option.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    onClick={() => handleLocationOption(option)}
                    whileTap={{ scale: 0.96 }}
                    className={`cursor-pointer px-5 py-3 rounded-full border text-[14px] font-medium transition-all duration-200 ${
                      locationChoice === option
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background/60 dark:bg-foreground/5 border-border text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {locationChoice && locationChoice !== "Remote only" && (
                  <motion.div className="w-full flex flex-col gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}>
                    <p className="text-muted-foreground text-[13px] text-left">
                      {locationChoice === "My city only" ? "Which city?" : "Which cities are you open to?"}
                    </p>
                    <input
                      ref={cityInputRef}
                      data-testid="input-city"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      className="w-full bg-background/70 dark:bg-foreground/5 border border-border rounded-2xl px-5 py-4 text-foreground text-[15px] outline-none focus:border-foreground/30 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Q3 — Level */}
          {current === 2 && (
            <motion.div key="level" className="flex flex-col gap-3 w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32 }}>
              {levelOptions.map((opt) => {
                const isChosen = levelChoice === opt.title;
                return (
                  <motion.button
                    key={opt.title}
                    data-testid={`option-${opt.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    onClick={() => setLevelChoice(opt.title)}
                    whileTap={{ scale: 0.985 }}
                    className={`cursor-pointer w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                      isChosen
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background/60 dark:bg-foreground/5 border-border text-foreground hover:border-foreground/30"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{opt.title}</span>
                      <span className={`text-[13px] ${isChosen ? "text-background/70" : "text-muted-foreground"}`}>{opt.desc}</span>
                    </div>
                    {opt.sub && (
                      <span className={`text-[12px] font-medium flex-shrink-0 ml-4 ${isChosen ? "text-background/60" : "text-muted-foreground/60"}`}>{opt.sub}</span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Bottom nav */}
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-lg">
        <div className="flex items-center justify-between w-full gap-3">
          {/* Back */}
          <motion.button
            data-testid="button-back"
            onClick={goBack}
            whileTap={{ scale: 0.94 }}
            className={`cursor-pointer flex items-center gap-1.5 px-5 py-3 rounded-full border border-border text-[14px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-foreground/30 ${current === 0 ? "invisible" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <DotTrail current={current} total={questions.length} />

          {/* Next / Scan Jobs */}
          <motion.button
            data-testid={isLastStep ? "button-scan-jobs" : "button-next"}
            onClick={handleNext}
            disabled={!canNext()}
            whileTap={{ scale: 0.94 }}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-foreground text-background`}
          >
            {isLastStep ? (
              <>Scan Jobs <Search className="w-4 h-4" /></>
            ) : (
              <>Next <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>

        <button data-testid="button-do-later-type" onClick={onReset} className="cursor-pointer text-muted-foreground/50 text-[12px] hover:text-muted-foreground transition-colors">
          I'll do it later
        </button>
      </div>
    </motion.div>
  );
}

// ── Platform logos ─────────────────────────────────────────────────────────
function LinkedInLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M7.2 9.6H4.8V19.2H7.2V9.6ZM6 8.4C6.79 8.4 7.44 7.75 7.44 6.96C7.44 6.17 6.79 5.52 6 5.52C5.21 5.52 4.56 6.17 4.56 6.96C4.56 7.75 5.21 8.4 6 8.4ZM19.2 19.2H16.8V14.52C16.8 13.38 16.78 11.91 15.21 11.91C13.62 11.91 13.38 13.16 13.38 14.44V19.2H10.98V9.6H13.28V10.92H13.32C13.65 10.28 14.47 9.6 15.69 9.6C18.12 9.6 19.2 11.22 19.2 13.44V19.2Z" fill="white" />
    </svg>
  );
}

function IndeedLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#003A9B" />
      <path d="M12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5Z" fill="white" />
      <path d="M8 13H16V19H14.5V15H13V19H11V15H9.5V19H8V13Z" fill="white" />
    </svg>
  );
}

// ── Thinking screen ────────────────────────────────────────────────────────
type PlatformStatus = "waiting" | "scraping" | "done";

interface TimelineStep {
  icon: "search" | "radar" | "linkedin" | "indeed" | "filter" | "portfolio" | "rank";
  label: string;
  getDetail?: () => string | null;
}

function ThinkingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [liStatus, setLiStatus] = useState<PlatformStatus>("waiting");
  const [liCount, setLiCount] = useState<number | undefined>();
  const [indeedStatus, setIndeedStatus] = useState<PlatformStatus>("waiting");
  const [indeedCount, setIndeedCount] = useState<number | undefined>();

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleCount(1), 350),
      setTimeout(() => setVisibleCount(2), 1000),
      setTimeout(() => { setLiStatus("scraping"); setVisibleCount(3); }, 1800),
      setTimeout(() => { setIndeedStatus("scraping"); setVisibleCount(4); }, 3000),
      setTimeout(() => { setLiStatus("done"); setLiCount(214); }, 4200),
      setTimeout(() => { setIndeedStatus("done"); setIndeedCount(178); }, 5400),
      setTimeout(() => setVisibleCount(5), 5700),
      setTimeout(() => setVisibleCount(6), 6300),
      setTimeout(() => onComplete(), 7200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const steps: TimelineStep[] = [
    { icon: "search", label: "Reading your answers" },
    { icon: "filter", label: "Filtering for full-time, senior-level roles" },
    {
      icon: "linkedin",
      label: "Scanning LinkedIn",
      getDetail: () =>
        liStatus === "done" ? `${liCount} roles found` :
        liStatus === "scraping" ? "scanning…" : null,
    },
    {
      icon: "indeed",
      label: "Scanning Indeed",
      getDetail: () =>
        indeedStatus === "done" ? `${indeedCount} roles found` :
        indeedStatus === "scraping" ? "scanning…" : null,
    },
    { icon: "portfolio", label: "Cross-referencing your portfolio strengths" },
    { icon: "rank", label: "Ranking by alignment score" },
  ];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#F0EDE7] dark:bg-[#1A1A1A] px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <style>{`
        @keyframes thinking-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes thinking-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes timeline-dot-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[380px] rounded-full dark:bg-[#FF553E]/6 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-xs flex flex-col gap-8">

        {/* Header */}
        <motion.div
          className="flex items-start justify-between"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="orb-spinning"><ColorOrb dimension="18px" spinDuration={4} /></span>
              <p
                className="text-[18px] font-semibold tracking-tight"
                style={{
                  background: "linear-gradient(110deg, hsl(var(--foreground)) 20%, hsl(var(--muted-foreground)) 50%, hsl(var(--foreground)) 80%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "thinking-shimmer 2.8s linear infinite",
                }}
              >
                Finding your matches
              </p>
            </div>
            <p className="text-[12px] text-muted-foreground/50 leading-snug">
              Matching roles to your portfolio and preferences
            </p>
          </div>
          <span className="text-[12px] text-muted-foreground/35 font-mono tabular-nums mt-0.5 flex-shrink-0">
            {timer}s
          </span>
        </motion.div>

        {/* Timeline */}
        <div className="flex flex-col">
          {steps.map((step, i) => {
            if (i >= visibleCount) return null;
            const isActive = i === visibleCount - 1;
            const isDone = i < visibleCount - 1;
            const isLast = i === steps.length - 1;
            const detail = step.getDetail?.() ?? null;
            const isScanning = (i === 2 && liStatus === "scraping") || (i === 3 && indeedStatus === "scraping");

            return (
              <motion.div
                key={i}
                className="flex gap-3.5"
                initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Dot + vertical line */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 16 }}>
                  <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
                    {isActive ? (
                      <>
                        {/* Outer pulse ring */}
                        <motion.div
                          className="absolute rounded-full border border-[#FF553E]/40"
                          style={{ width: 14, height: 14 }}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                        {/* Inner dot */}
                        <div
                          className="w-2 h-2 rounded-full bg-[#FF553E]"
                          style={{ animation: "thinking-pulse 1.4s ease-in-out infinite" }}
                        />
                      </>
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                        style={{ background: isDone ? "hsl(var(--muted-foreground) / 0.35)" : "hsl(var(--border))" }}
                      />
                    )}
                  </div>
                  {!isLast && (
                    <motion.div
                      className="w-px"
                      style={{
                        height: 28,
                        background: isDone
                          ? "linear-gradient(to bottom, hsl(var(--muted-foreground) / 0.2), hsl(var(--muted-foreground) / 0.1))"
                          : "linear-gradient(to bottom, hsl(var(--border) / 0.5), transparent)",
                      }}
                      initial={{ scaleY: 0, originY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className={`${isLast ? "pb-0" : "pb-1"} flex flex-col gap-0.5`} style={{ paddingTop: 1 }}>
                  <p
                    className="text-[13.5px] leading-snug transition-colors duration-500"
                    style={{
                      color: isActive
                        ? "hsl(var(--foreground))"
                        : isDone
                        ? "hsl(var(--muted-foreground) / 0.55)"
                        : "hsl(var(--foreground))",
                      fontWeight: isActive ? 500 : isDone ? 400 : 500,
                    }}
                  >
                    {step.label}
                  </p>

                  <AnimatePresence mode="wait">
                    {detail && (
                      <motion.p
                        key={detail}
                        className="text-[11.5px]"
                        style={{
                          color: detail.includes("found")
                            ? "hsl(142 60% 42%)"
                            : "hsl(var(--muted-foreground) / 0.5)",
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {isScanning && !detail.includes("found") && (
                          <span className="inline-flex gap-[3px] items-center mr-1">
                            {[0, 1, 2].map((j) => (
                              <motion.span
                                key={j}
                                className="inline-block w-[3px] h-[3px] rounded-full bg-current"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: j * 0.2 }}
                              />
                            ))}
                          </span>
                        )}
                        {detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Mock interview dialog ──────────────────────────────────────────────────
type PermState = "idle" | "granted" | "denied";

function PermissionCard({
  icon: Icon,
  label,
  description,
  state,
  onRequest,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  state: PermState;
  onRequest: () => void;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-black/[0.05] dark:bg-white/[0.05] flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-foreground/60" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-foreground mb-0.5">{label}</div>
        <div className="text-[13px] text-foreground/50 leading-[1.5]">{description}</div>
      </div>
      <div className="flex-shrink-0 mt-0.5">
        {state === "granted" ? (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Allowed
          </div>
        ) : state === "denied" ? (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-red-500">
            <XCircle className="w-4 h-4" />
            Denied
          </div>
        ) : (
          <button
            onClick={onRequest}
            className="h-8 px-3.5 rounded-full border border-black/10 dark:border-white/10 text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
          >
            Request
          </button>
        )}
      </div>
    </div>
  );
}

function MockInterviewDialog({ job, open, onClose, onStart }: { job: Job | null; open: boolean; onClose: () => void; onStart: () => void }) {
  const [camPerm, setCamPerm] = useState<PermState>("idle");
  const [micPerm, setMicPerm] = useState<PermState>("idle");

  const requestPerm = async (kind: "camera" | "mic") => {
    try {
      const constraints = kind === "camera" ? { video: true } : { audio: true };
      await navigator.mediaDevices.getUserMedia(constraints);
      kind === "camera" ? setCamPerm("granted") : setMicPerm("granted");
    } catch {
      kind === "camera" ? setCamPerm("denied") : setMicPerm("denied");
    }
  };

  // Reset on open
  useEffect(() => {
    if (open) { setCamPerm("idle"); setMicPerm("idle"); }
  }, [open]);

  if (!job) return null;
  const bothGranted = camPerm === "granted" && micPerm === "granted";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent aria-describedby={undefined} className="bg-white dark:bg-[#2A2520] border border-black/[0.08] dark:border-white/[0.08] p-0 gap-0 max-w-[440px] rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
              style={{ backgroundColor: job.logoColor }}
            >
              {job.logoLetter}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[17px] font-semibold leading-tight m-0 truncate">
                Ready to practise?
              </DialogTitle>
              <p className="text-[13px] text-foreground/50 mt-0.5 truncate">{job.role} · {job.company}</p>
            </div>
          </div>
          <p className="text-[14px] text-foreground/50 leading-[1.6] mt-4">
            Grant camera and microphone access below so your mock interview session can run smoothly.
          </p>
        </DialogHeader>

        {/* Permissions */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-[12px] font-semibold text-foreground/40 uppercase tracking-widest mb-4">Permissions required</p>
          <PermissionCard
            icon={Video}
            label="Camera"
            description="Used to record your expressions and body language during the interview."
            state={camPerm}
            onRequest={() => requestPerm("camera")}
          />
          <PermissionCard
            icon={Mic}
            label="Microphone"
            description="Used to capture your answers and generate real-time interview feedback."
            state={micPerm}
            onRequest={() => requestPerm("mic")}
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            disabled={!bothGranted}
            onClick={() => { onClose(); onStart(); }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[14px] font-medium transition-opacity disabled:opacity-30"
          >
            <Clapperboard className="w-4 h-4" />
            Start mock interview
          </button>
          {!bothGranted && (
            <p className="text-center text-[12px] text-foreground/35 mt-2.5">Allow both permissions to continue</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Job Dialog ─────────────────────────────────────────────────────────

function AddJobDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"linkedin" | "manual">("linkedin");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualArrangement, setManualArrangement] = useState("");
  const [manualSalary, setManualSalary] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setTab("linkedin");
      setLinkedinUrl("");
      setManualRole("");
      setManualCompany("");
      setManualLocation("");
      setManualArrangement("");
      setManualSalary("");
      setManualDescription("");
    }
  }, [open]);

  const isLinkedinValid = linkedinUrl.trim().startsWith("http") && linkedinUrl.includes("linkedin.com");
  const isManualValid = manualRole.trim().length > 0 && manualCompany.trim().length > 0;

  const inputBase = "w-full h-10 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] px-3.5 text-[14px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition";
  const labelBase = "block text-[12px] font-semibold text-foreground/40 uppercase tracking-widest mb-1.5";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent aria-describedby={undefined} className="bg-white dark:bg-[#2A2520] border border-black/[0.08] dark:border-white/[0.08] p-0 gap-0 max-w-[460px] rounded-2xl overflow-hidden">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[18px] font-semibold leading-tight m-0">
                Add a job
              </DialogTitle>
              <p className="text-[13px] text-foreground/45 mt-1 leading-snug">
                {tab === "linkedin"
                  ? "Paste a LinkedIn URL — we'll fetch and score it for you."
                  : "Fill in the details and we'll add it to your board."}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-1 mx-6 mt-5 p-1 bg-black/[0.04] dark:bg-white/[0.05] rounded-xl">
          <button
            onClick={() => setTab("linkedin")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[13px] font-medium transition-all ${
              tab === "linkedin"
                ? "bg-white dark:bg-white/[0.1] text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            <FaLinkedin className="w-3.5 h-3.5" />
            From LinkedIn
          </button>
          <button
            onClick={() => setTab("manual")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[13px] font-medium transition-all ${
              tab === "manual"
                ? "bg-white dark:bg-white/[0.1] text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            <PenSquare className="w-3.5 h-3.5" />
            Add manually
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6">
          {tab === "linkedin" ? (
            <div className="space-y-5">
              <div>
                <label className={labelBase}>LinkedIn job URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/jobs/view/…"
                    className={`${inputBase} pl-10`}
                    autoFocus
                  />
                </div>
                <p className="text-[12px] text-foreground/35 mt-2 leading-relaxed">
                  Open the job on LinkedIn, copy the URL from your browser, and paste it here.
                </p>
              </div>

              <button
                disabled={!isLinkedinValid}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[14px] font-medium transition-opacity disabled:opacity-30"
              >
                <Sparkles className="w-4 h-4" />
                Fetch &amp; score job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelBase}>Role title <span className="text-foreground/30 normal-case tracking-normal font-normal">*</span></label>
                  <input
                    type="text"
                    value={manualRole}
                    onChange={(e) => setManualRole(e.target.value)}
                    placeholder="e.g. Senior Product Designer"
                    className={inputBase}
                    autoFocus
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelBase}>Company <span className="text-foreground/30 normal-case tracking-normal font-normal">*</span></label>
                  <input
                    type="text"
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="e.g. Figma"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Location</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Arrangement</label>
                  <div className="relative">
                    <select
                      value={manualArrangement}
                      onChange={(e) => setManualArrangement(e.target.value)}
                      className={`${inputBase} appearance-none pr-8`}
                    >
                      <option value="">Select…</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelBase}>Salary / range</label>
                  <input
                    type="text"
                    value={manualSalary}
                    onChange={(e) => setManualSalary(e.target.value)}
                    placeholder="e.g. £80k – £100k"
                    className={inputBase}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelBase}>Job description</label>
                  <textarea
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Paste the job description here for AI scoring and interview prep…"
                    rows={4}
                    className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition resize-none"
                  />
                </div>
              </div>

              <button
                disabled={!isManualValid}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[14px] font-medium transition-opacity disabled:opacity-30 mt-1"
              >
                <Plus className="w-4 h-4" />
                Add to board
              </button>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}

// ── Mock interview room ────────────────────────────────────────────────────

function MockInterviewRoom({ job, onEnd }: { job: Job; onEnd: () => void }) {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const anamClientRef = useRef<AnamClient | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);

  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<"connecting" | "ready" | "error">("connecting");
  const [transcript, setTranscript] = useState<Message[]>([]);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userStreamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        if (!mounted) return;

        const tokenRes = await fetch("/api/anam/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: job.company,
            role: job.role,
            description: job.description,
          }),
        });
        if (!tokenRes.ok) throw new Error("Failed to get interview session token");
        const { sessionToken } = await tokenRes.json();
        const client = createClient(sessionToken);
        anamClientRef.current = client;

        client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages: Message[]) => {
          if (mounted) setTranscript([...messages]);
        });

        client.addListener(AnamEvent.VIDEO_PLAY_STARTED, () => {
          if (mounted) setStatus("ready");
        });

        client.addListener(AnamEvent.CONNECTION_CLOSED, () => {
          if (mounted) setStatus("error");
        });

        await client.streamToVideoElement("anam-avatar-video", stream);
      } catch {
        if (mounted) setStatus("error");
      }
    };

    start();
    return () => {
      mounted = false;
      anamClientRef.current?.stopStreaming();
      userStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMute = () => {
    if (muted) {
      anamClientRef.current?.unmuteInputAudio();
    } else {
      anamClientRef.current?.muteInputAudio();
    }
    setMuted((m) => !m);
  };

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#111111] flex flex-col z-[400]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Video panels */}
      <div className="flex-1 flex gap-3 p-4 min-h-0">
        {/* AI avatar — anam streams into this video element */}
        <div className="flex-1 bg-[#1C1C1E] rounded-2xl relative overflow-hidden">
          {status === "connecting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
              <p className="text-white/35 text-[13px] mt-3">Connecting to Kevin…</p>
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <p className="text-red-400/80 text-[13px]">Connection failed. Please try again.</p>
            </div>
          )}
          <video
            id="anam-avatar-video"
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl" />
          <div className="absolute bottom-3 left-4 text-white/70 text-[13px] font-medium">Kevin · AI Interviewer</div>
        </div>

        {/* User camera */}
        <div className="flex-1 bg-[#1C1C1E] rounded-2xl relative overflow-hidden">
          <video ref={userVideoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl" />
          <div className="absolute bottom-3 left-4 text-white/70 text-[13px] font-medium">You</div>
          {muted && (
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-500/90 flex items-center justify-center">
              <MicOff className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div ref={transcriptRef} className="h-[160px] overflow-y-auto scrollbar-hide px-4 py-3 space-y-2.5 border-t border-white/[0.06]">
        {transcript.length === 0 && (
          <p className="text-white/25 text-[13px] text-center pt-6">Transcript will appear here…</p>
        )}
        {transcript.map((msg) => {
          const isPersona = msg.role === "persona";
          return (
            <div key={msg.id} className={`flex gap-2.5 items-start ${!isPersona ? "flex-row-reverse" : ""}`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isPersona ? "bg-indigo-600" : "bg-white/20"}`}>
                {isPersona ? "K" : "Y"}
              </div>
              <p className={`text-[13px] leading-[1.55] max-w-[70%] ${isPersona ? "text-white/80" : "text-white/60"}`}>
                {msg.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom navbar */}
      <div className="h-[56px] bg-[#1C1C1E] border-t border-white/[0.08] flex items-center justify-between px-4 flex-shrink-0">
        <button
          onClick={onEnd}
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[14px]">Interview Room</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[11px] font-bold select-none">
            MB
          </div>

          <button
            onClick={toggleMute}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${muted ? "bg-red-500/20 text-red-400" : "text-white/50 hover:text-white/80"}`}
          >
            {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            End
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Interview report ────────────────────────────────────────────────────────

interface CompletedReport {
  date: string;
  report: InterviewReportData;
}

interface InterviewReportData {
  communicationScore: number;
  clarity: number;
  confidence: number;
  pacing: number;
  strongestAnswer: { question: string; highlight: string };
  watchOutFor: string[];
  roleSpecificGaps: string[];
}

const MOCK_REPORTS: Record<string, InterviewReportData> = {
  "1": {
    communicationScore: 78,
    clarity: 82,
    confidence: 71,
    pacing: 80,
    strongestAnswer: {
      question: "Walk me through a design system you've owned end-to-end.",
      highlight: "Your answer showed clear ownership, measurable impact (30% faster prototyping), and a strong rationale for the decisions you made. Lead with this in the real interview.",
    },
    watchOutFor: [
      'You hedged twice with \u201cI think maybe\u2026\u201d when describing your process. Own your decisions \u2014 Linear values directness.',
      "Your answer on cross-functional collaboration ran long. Tighten it to two concrete examples and stop.",
    ],
    roleSpecificGaps: [
      "You didn't connect your work to developer experience — a core value at Linear. Prepare a story that bridges design decisions to engineering velocity.",
      "When asked about metrics, you stayed qualitative. Bring at least one data point on adoption or error reduction from your design system work.",
    ],
  },
  "2": {
    communicationScore: 83,
    clarity: 88,
    confidence: 79,
    pacing: 82,
    strongestAnswer: {
      question: "How do you make complex technical concepts feel simple in UI?",
      highlight: "Concrete examples from real projects, clear before/after framing, and you named the mental model you used. This is a strong answer for a Vercel role — use it early.",
    },
    watchOutFor: [
      "You rushed through the onboarding flow example. Slow down — that story has more signal in it than you gave it time for.",
      'Avoid saying \u201cit depends\u201d without immediately following it with a framework. It reads as evasive without structure.',
    ],
    roleSpecificGaps: [
      "Vercel cares about async-first communication. Your answers were strong verbally but you didn't demonstrate how you document or write for async teams. Prepare a brief example.",
      "You didn't mention any frontend fundamentals. Even a brief reference to CSS, component thinking, or dev handoff would close this gap.",
    ],
  },
};

const FALLBACK_REPORT: InterviewReportData = {
  communicationScore: 75,
  clarity: 78,
  confidence: 70,
  pacing: 77,
  strongestAnswer: {
    question: "Tell me about a project you're most proud of.",
    highlight: "You structured the answer well and showed clear ownership of outcomes. This is your strongest signal — make sure it opens your real interview.",
  },
  watchOutFor: [
    'You used filler phrases (\u201clike\u201d, \u201cyou know\u201d) more frequently under pressure. Record yourself and listen back \u2014 it\u2019s an easy fix with practice.',
    "One answer went over three minutes. The real interview will move faster; aim for 90 seconds per response.",
  ],
  roleSpecificGaps: [
    "Your answers didn't reference this company's specific product or customer. Research their recent launches and weave in one specific reference.",
    "You didn't mention your approach to feedback or iteration cycles — both came up implicitly in questions. Prepare a short answer for each.",
  ],
};

function getMockReport(jobId: string): InterviewReportData {
  return MOCK_REPORTS[jobId] ?? FALLBACK_REPORT;
}

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-[12px] text-foreground/50 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
      <span className="w-8 text-right text-[12px] font-semibold text-foreground/70">{value}</span>
    </div>
  );
}

function InterviewReport({ job, report: reportProp, onClose }: { job: Job; report?: InterviewReportData; onClose: () => void }) {
  const report = reportProp ?? getMockReport(job.id);

  return (
    <motion.div
      className="fixed inset-0 z-[400] bg-[#F0EDE7] dark:bg-[#1A1A1A] flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
            style={{ backgroundColor: job.logoColor }}
          >
            {job.logoLetter}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-foreground leading-tight truncate">{job.role}</div>
            <div className="text-[12px] text-foreground/45 truncate">{job.company}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-foreground/40 font-medium">Interview Report</span>
          <button
            data-testid="button-close-report"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[680px] mx-auto px-6 py-8 space-y-5">

          {/* Communication Score card */}
          <motion.div
            className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-border p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-foreground/40" />
              <span className="text-[13px] font-semibold text-foreground/70">Communication score</span>
            </div>
            <div className="flex items-end gap-4 mb-5">
              <span className="text-[48px] font-bold text-foreground leading-none">{report.communicationScore}</span>
              <span className="text-[16px] text-foreground/35 mb-1.5">/&nbsp;100</span>
            </div>
            <div className="space-y-3">
              <ScoreBar value={report.clarity} label="Clarity" />
              <ScoreBar value={report.confidence} label="Confidence" />
              <ScoreBar value={report.pacing} label="Pacing" />
            </div>
          </motion.div>

          {/* Strongest Answer */}
          <motion.div
            className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-border p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] font-semibold text-foreground/70">Strongest answer</span>
            </div>
            <p className="text-[13px] font-medium text-foreground/60 mb-2 italic">"{report.strongestAnswer.question}"</p>
            <p className="text-[14px] text-foreground/80 leading-[1.65]">{report.strongestAnswer.highlight}</p>
          </motion.div>

          {/* Watch out for */}
          <motion.div
            className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-border p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.19 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-[13px] font-semibold text-foreground/70">Watch out for</span>
            </div>
            <div className="space-y-3">
              {report.watchOutFor.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 mt-[3px] w-5 h-5 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-400">{i + 1}</span>
                  </div>
                  <p className="text-[14px] text-foreground/75 leading-[1.65]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Role-specific gaps */}
          <motion.div
            className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-border p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crosshair className="w-4 h-4 text-foreground/40" />
              <span className="text-[13px] font-semibold text-foreground/70">Role-specific gaps</span>
              <span className="text-[11px] text-foreground/35 ml-1">{job.company}</span>
            </div>
            <div className="space-y-3">
              {report.roleSpecificGaps.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 mt-[3px] w-1 rounded-full bg-foreground/15 self-stretch min-h-[20px]" />
                  <p className="text-[14px] text-foreground/75 leading-[1.65]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-card/60 backdrop-blur-sm">
        <p className="text-[12px] text-foreground/35">Generated after your mock session · {job.company}</p>
        <button
          data-testid="button-done-report"
          onClick={onClose}
          className="flex items-center gap-1.5 h-9 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[13px] font-medium transition-opacity hover:opacity-80"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}

// ── Job detail sheet ───────────────────────────────────────────────────────
// ── Match score breakdown ──────────────────────────────────────────────────
const BREAKDOWN_BARS = 34;
// Interpolate between two hex colours (e.g. "#4ade80" → "#10b981")
function lerpHex(a: string, b: string, t: number): string {
  const h = (s: string) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
  const [ar,ag,ab] = h(a), [br,bg,bb] = h(b);
  const r = Math.round(ar + (br-ar)*t), g = Math.round(ag + (bg-ag)*t), bv = Math.round(ab + (bb-ab)*t);
  return `#${[r,g,bv].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
}

const SCORE_TIERS = [
  { min: 90, label: "Excellent match", accent: "#22c55e", lightText: "#15803d", darkText: "#4ade80", lightBg: "rgba(34,197,94,0.09)",  darkBg: "rgba(34,197,94,0.13)",  bright: "#4ade80", lightMid: "#10b981", darkMid: "#16a34a" },
  { min: 80, label: "Strong match",    accent: "#10b981", lightText: "#047857", darkText: "#34d399", lightBg: "rgba(16,185,129,0.09)", darkBg: "rgba(16,185,129,0.13)", bright: "#4ade80", lightMid: "#10b981", darkMid: "#16a34a" },
  { min: 70, label: "Good match",      accent: "#f59e0b", lightText: "#b45309", darkText: "#fbbf24", lightBg: "rgba(245,158,11,0.09)", darkBg: "rgba(245,158,11,0.13)", bright: "#fde68a", lightMid: "#f97316", darkMid: "#ea580c" },
  { min: 60, label: "Fair match",      accent: "#f97316", lightText: "#c2410c", darkText: "#fb923c", lightBg: "rgba(249,115,22,0.09)", darkBg: "rgba(249,115,22,0.13)", bright: "#fde68a", lightMid: "#f97316", darkMid: "#ea580c" },
  { min:  0, label: "Partial match",   accent: "#ef4444", lightText: "#b91c1c", darkText: "#f87171", lightBg: "rgba(239,68,68,0.09)",  darkBg: "rgba(239,68,68,0.13)",  bright: "#fca5a5", lightMid: "#ef4444", darkMid: "#b91c1c" },
];

type SubBreakdown = { label: string; target: number; aligns: string[]; gaps: string[] };

const BREAKDOWNS: Record<string, SubBreakdown[]> = {
  "1": [
    { label: "Role Requirements",   target: 94, aligns: ["End-to-end ownership", "Design system contribution", "Engineer collaboration"], gaps: [] },
    { label: "Job Criteria",        target: 97, aligns: ["Remote-first role", "Full-time position", "SF-compatible"], gaps: [] },
    { label: "Must-Have Match",     target: 95, aligns: ["5+ years experience", "Figma proficiency", "Interaction design"], gaps: ["Enterprise SaaS scale"] },
    { label: "Qualification Match", target: 92, aligns: ["Portfolio depth & breadth", "Systems thinking"], gaps: ["B2B analytics background"] },
  ],
  "2": [
    { label: "Role Requirements",   target: 88, aligns: ["Dashboard design", "Developer tool UX", "Frontend fundamentals"], gaps: ["CLI interface experience"] },
    { label: "Job Criteria",        target: 94, aligns: ["Remote", "Full-time", "Async-first mindset"], gaps: [] },
    { label: "Must-Have Match",     target: 91, aligns: ["3+ years experience", "Figma", "Complex SaaS design"], gaps: [] },
    { label: "Qualification Match", target: 86, aligns: ["Async communication"], gaps: ["Infrastructure product exp", "Technical SaaS depth"] },
  ],
  "3": [
    { label: "Role Requirements",   target: 85, aligns: ["Interaction mastery", "Collaborative mindset", "State-heavy UI design"], gaps: ["AI workflow experience"] },
    { label: "Job Criteria",        target: 91, aligns: ["Hybrid compatible", "Full-time", "SF-based"], gaps: [] },
    { label: "Must-Have Match",     target: 88, aligns: ["4+ years experience", "Editor & database UI"], gaps: ["AI feature design"] },
    { label: "Qualification Match", target: 84, aligns: ["Consumer software portfolio"], gaps: ["AI product experience", "Prosumer tools depth"] },
  ],
  "4": [
    { label: "Role Requirements",   target: 83, aligns: ["Interaction design depth", "Design systems", "Visual quality"], gaps: ["Multiplayer feature design"] },
    { label: "Job Criteria",        target: 88, aligns: ["Full-time", "Strong portfolio"], gaps: ["On-site SF requirement"] },
    { label: "Must-Have Match",     target: 85, aligns: ["3+ years experience", "Design tokens", "Feedback integration"], gaps: ["Canvas product design"] },
    { label: "Qualification Match", target: 81, aligns: ["Portfolio polish", "Typographic detail"], gaps: ["Plugin ecosystem experience"] },
  ],
  "5": [
    { label: "Role Requirements",   target: 79, aligns: ["5+ years experience", "Remote mindset", "Self-run research"], gaps: ["Video product experience", "Media workflows"] },
    { label: "Job Criteria",        target: 85, aligns: ["Remote", "Full-time"], gaps: [] },
    { label: "Must-Have Match",     target: 81, aligns: ["Polished visual design", "Async collaboration"], gaps: ["Video/media product exp", "Communication tooling"] },
    { label: "Qualification Match", target: 78, aligns: ["UX research skills"], gaps: ["Video UX background", "Growth startup experience"] },
  ],
  "6": [
    { label: "Role Requirements",   target: 76, aligns: ["Complex workflow design", "Design system contribution", "Written clarity"], gaps: ["Fintech experience", "Financial product UX"] },
    { label: "Job Criteria",        target: 83, aligns: ["Hybrid compatible", "Full-time"], gaps: ["Seattle on-site days"] },
    { label: "Must-Have Match",     target: 78, aligns: ["4+ years experience", "Multi-step workflow design"], gaps: ["Fintech/developer tools", "Writing-first culture fit"] },
    { label: "Qualification Match", target: 74, aligns: ["Large design system experience"], gaps: ["Financial infrastructure background", "Global B2B design"] },
  ],
};

function MatchBreakdown({ job, open }: { job: Job; open: boolean }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [expandedSection, setExpandedSection] = useState<"signals" | "missing" | null>(null);

  const subs: SubBreakdown[] = BREAKDOWNS[job.id] ?? [
    { label: "Role Requirements",   target: 80, aligns: [], gaps: [] },
    { label: "Job Criteria",        target: 80, aligns: [], gaps: [] },
    { label: "Must-Have Match",     target: 80, aligns: [], gaps: [] },
    { label: "Qualification Match", target: 80, aligns: [], gaps: [] },
  ];

  const allGaps   = [...new Set(subs.flatMap(s => s.gaps))].slice(0, 3);
  const allAligns = [...new Set(subs.flatMap(s => s.aligns))].slice(0, 3);
  const s = job.match;

  const headline =
    s >= 85 ? "You're an excellent match for this role." :
    s >= 65 ? "You're a strong match — excellence is within reach." :
              "You're in the mix, with some key areas to work on.";

  // 3 zones — colors mirror sgPalette exactly (bright → mid gradient, same as the gauge arc)
  // Bar widths proportional to score range sizes: 64 / 20 / 16
  const zones = [
    { label: "Weak",      pct: 64, barStart: 0,  barEnd: 64,
      brightL: "#fca5a5", midL: "#ef4444",
      brightD: "#fca5a5", midD: "#b91c1c",
      fadedL: "rgba(239,68,68,0.13)", fadedD: "rgba(185,28,28,0.14)" },
    { label: "Strong",    pct: 20, barStart: 64, barEnd: 84,
      brightL: "#fde68a", midL: "#f97316",
      brightD: "#fde68a", midD: "#ea580c",
      fadedL: "rgba(249,115,22,0.13)", fadedD: "rgba(234,88,12,0.14)" },
    { label: "Excellent", pct: 16, barStart: 84, barEnd: 100,
      brightL: "#4ade80", midL: "#10b981",
      brightD: "#4ade80", midD: "#16a34a",
      fadedL: "rgba(16,185,129,0.13)", fadedD: "rgba(22,163,74,0.14)" },
  ];

  // Map score → bar % (proportional to zone widths)
  function scoreToBarPct(score: number): number {
    if (score <= 64) return (score / 64) * 64;
    if (score <= 84) return 64 + ((score - 65) / 19) * 20;
    return 84 + ((score - 85) / 15) * 16;
  }

  const markerBarPct = Math.max(1, Math.min(98.5, scoreToBarPct(s)));

  return (
    <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.07] px-4 pt-4 pb-0 overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.028)" }}>
      {/* Headline */}
      <p className="text-[14.5px] font-semibold text-foreground leading-snug mb-4">{headline}</p>

      {/* Zoned bar + YOU marker */}
      <div className="relative mt-7">
        {/* YOU label chip */}
        <div
          className="absolute flex flex-col items-center pointer-events-none"
          style={{
            left: open ? `${markerBarPct}%` : "0%",
            transform: "translateX(-50%)",
            transition: open ? "left 1s cubic-bezier(0.22,1,0.36,1) 0.15s" : "none",
            bottom: "calc(100% + 5px)",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)",
              lineHeight: 1,
              userSelect: "none",
              textTransform: "uppercase",
            }}
          >
            you
          </span>
        </div>

        {/* Bar segments — vivid up to marker, faded after */}
        <div className="relative flex h-[14px] rounded-lg overflow-hidden gap-[2px]">
          {zones.map((z) => {
            const filledBars = Math.max(0, Math.min(markerBarPct, z.barEnd) - z.barStart);
            const fadedBars  = z.pct - filledBars;
            const bright     = isDark ? z.brightD : z.brightL;
            const mid        = isDark ? z.midD    : z.midL;
            const vividGrad  = `linear-gradient(to right, ${bright}, ${mid})`;
            const fadedColor = isDark ? z.fadedD  : z.fadedL;
            return (
              <div key={z.label} style={{ width: `${z.pct}%`, display: "flex" }}>
                {filledBars > 0 && <div style={{ flex: filledBars, background: vividGrad }} />}
                {fadedBars  > 0 && <div style={{ flex: fadedBars,  background: fadedColor }} />}
              </div>
            );
          })}

          {/* 3D gloss overlay — top highlight + bottom shadow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.08) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.14)",
            }}
          />
        </div>

        {/* Tick line — rendered after the bar so it paints on top */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: open ? `${markerBarPct}%` : "0%",
            transform: "translateX(-50%)",
            transition: open ? "left 1s cubic-bezier(0.22,1,0.36,1) 0.15s" : "none",
            top: -3,
            bottom: -3,
            width: 2.5,
            borderRadius: 2,
            background: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.50)",
            boxShadow: isDark
              ? "0 0 6px 1px rgba(255,255,255,0.22)"
              : "0 0 6px 1px rgba(0,0,0,0.14)",
          }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex mt-1">
        {zones.map((z) => (
          <div key={z.label} style={{ width: `${z.pct}%` }}>
            <span className="text-[9.5px] text-foreground/50 whitespace-nowrap">{z.label}</span>
          </div>
        ))}
      </div>

      {/* Signals + Missing — single accordion, flush edge-to-edge */}
      {(allAligns.length > 0 || allGaps.length > 0) && (
        <div
          className="mt-3.5 -mx-4 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden"
          style={{ background: isDark ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.038)" }}
        >
          {/* Strongest signals row */}
          {allAligns.length > 0 && (
            <>
              <button
                onClick={() => setExpandedSection(expandedSection === "signals" ? null : "signals")}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left cursor-pointer hover:bg-black/[0.06] dark:hover:bg-white/[0.09] transition-colors duration-150"
              >
                <span className="text-[9.5px] font-semibold uppercase tracking-widest text-foreground/40">Strongest signals</span>
                <ChevronDown
                  className="w-3 h-3 text-foreground/30 transition-transform duration-200 flex-shrink-0"
                  style={{ transform: expandedSection === "signals" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <AnimatePresence initial={false}>
                {expandedSection === "signals" && (
                  <motion.div
                    key="signals-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="px-3 pb-2.5 space-y-1.5">
                      {allAligns.map((a) => (
                        <li key={a} className="flex items-start gap-2">
                          <Check className="w-3 h-3 mt-[2px] text-foreground/40 flex-shrink-0" />
                          <span className="text-[11.5px] text-foreground/60 leading-snug">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Divider between sections */}
          {allAligns.length > 0 && allGaps.length > 0 && (
            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
          )}

          {/* Missing row */}
          {allGaps.length > 0 && (
            <>
              <button
                onClick={() => setExpandedSection(expandedSection === "missing" ? null : "missing")}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left cursor-pointer hover:bg-black/[0.06] dark:hover:bg-white/[0.09] transition-colors duration-150"
              >
                <span className="text-[9.5px] font-semibold uppercase tracking-widest text-foreground/40">Missing</span>
                <ChevronDown
                  className="w-3 h-3 text-foreground/30 transition-transform duration-200 flex-shrink-0"
                  style={{ transform: expandedSection === "missing" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <AnimatePresence initial={false}>
                {expandedSection === "missing" && (
                  <motion.div
                    key="missing-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="px-3 pb-2.5 space-y-1.5">
                      {allGaps.map((g) => (
                        <li key={g} className="flex items-start gap-2">
                          <X className="w-3 h-3 mt-[2px] text-foreground/30 flex-shrink-0" />
                          <span className="text-[11.5px] text-foreground/45 leading-snug">{g}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function JobDetailSheet({ job, open, onClose, pastReports, onViewReport }: { job: Job | null; open: boolean; onClose: () => void; pastReports?: CompletedReport[]; onViewReport?: (report: CompletedReport) => void }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const lastJobRef = useRef<Job | null>(null);
  if (job) lastJobRef.current = job;
  const displayJob = job ?? lastJobRef.current;
  const scrollRef = useRef<HTMLDivElement>(null);
  const mockInterviewsRef = useRef<HTMLDivElement>(null);

  const scrollToMockInterviews = () => {
    if (scrollRef.current && mockInterviewsRef.current) {
      const container = scrollRef.current;
      const target = mockInterviewsRef.current;
      const targetTop = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 12;
      container.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  };

  if (!displayJob) return null;
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()} modal={false}>
      <SheetContent
        className="inset-y-3 right-3 h-[calc(100vh-24px)] rounded-2xl shadow-2xl !border border-black/[0.09] dark:border-white/[0.09] bg-white dark:bg-[#2A2520] p-0 flex flex-col w-[560px] sm:max-w-[560px] overflow-hidden"
        hasOverlay={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center m-0 space-y-0 h-[65px]">
          <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-base font-semibold m-0 truncate pr-10">{displayJob.role}</SheetTitle>
        </SheetHeader>

        {/* Scrollable body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {/* Company hero */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: displayJob.logoColor }}
                >
                  {displayJob.logoLetter}
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">{displayJob.company}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-sm text-foreground/50">
                    <MapPin className="w-3.5 h-3.5" />
                    {displayJob.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Property rows */}
            <div className="mt-5 space-y-3.5">
              {/* Posted */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-[124px] flex-shrink-0">
                  <Calendar className="w-4 h-4 text-foreground/30" />
                  <span className="text-sm text-foreground/40">Posted</span>
                </div>
                <span className="text-sm text-foreground/70">{displayJob.postedDate}</span>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-[124px] flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-foreground/30" />
                  <span className="text-sm text-foreground/40">Type</span>
                </div>
                <span className="inline-flex items-center text-sm text-foreground/65 border border-black/[0.09] dark:border-white/[0.09] rounded-md px-2.5 py-0.5">{displayJob.type}</span>
              </div>

              {/* Work mode */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-[124px] flex-shrink-0">
                  <Monitor className="w-4 h-4 text-foreground/30" />
                  <span className="text-sm text-foreground/40">Work mode</span>
                </div>
                <span className="inline-flex items-center text-sm text-foreground/65 border border-black/[0.09] dark:border-white/[0.09] rounded-md px-2.5 py-0.5">{displayJob.workMode}</span>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-[124px] flex-shrink-0">
                  <Clock className="w-4 h-4 text-foreground/30" />
                  <span className="text-sm text-foreground/40">Experience</span>
                </div>
                <span className="inline-flex items-center text-sm text-foreground/65 border border-black/[0.09] dark:border-white/[0.09] rounded-md px-2.5 py-0.5">{displayJob.yearsExp}</span>
              </div>

              {/* Match breakdown card */}
              <MatchBreakdown job={displayJob} open={open} />

              {/* Action buttons — Mock interview · Resume · Cover letter · Fit analysis */}
              <div className="space-y-1.5">
                {/* Mock interview — primary recommended action */}
                <button
                  data-testid="button-jump-mock-interviews"
                  onClick={scrollToMockInterviews}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-foreground/[0.07] hover:bg-foreground/[0.10] border border-foreground/[0.10] transition-colors group text-left"
                >
                  <div className="w-5 h-5 rounded-md bg-foreground/[0.10] flex items-center justify-center flex-shrink-0">
                    <Clapperboard className="w-3 h-3 text-foreground/60" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors leading-none">Practice with a mock interview</span>
                    <span className="text-[9.5px] font-medium text-foreground/40 leading-none whitespace-nowrap">✦ Recommended</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
                </button>

                {/* Tailor resume */}
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-black/[0.05] dark:border-white/[0.05] transition-colors group text-left">
                  <div className="w-5 h-5 rounded-md bg-foreground/[0.07] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3 h-3 text-foreground/40" />
                  </div>
                  <span className="flex-1 text-[12px] font-medium text-foreground/65 group-hover:text-foreground/85 transition-colors leading-none">Tailor resume to this role</span>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-foreground/45 transition-colors flex-shrink-0" />
                </button>

                {/* Cover letter */}
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-black/[0.05] dark:border-white/[0.05] transition-colors group text-left">
                  <div className="w-5 h-5 rounded-md bg-foreground/[0.07] flex items-center justify-center flex-shrink-0">
                    <PenLine className="w-3 h-3 text-foreground/40" />
                  </div>
                  <span className="flex-1 text-[12px] font-medium text-foreground/65 group-hover:text-foreground/85 transition-colors leading-none">Write a job-specific cover letter</span>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-foreground/45 transition-colors flex-shrink-0" />
                </button>

                {/* Fit analysis */}
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-black/[0.05] dark:border-white/[0.05] transition-colors group text-left">
                  <div className="w-5 h-5 rounded-md bg-foreground/[0.07] flex items-center justify-center flex-shrink-0">
                    <Crosshair className="w-3 h-3 text-foreground/40" />
                  </div>
                  <span className="flex-1 text-[12px] font-medium text-foreground/65 group-hover:text-foreground/85 transition-colors leading-none">Run a deep fit analysis</span>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-foreground/45 transition-colors flex-shrink-0" />
                </button>
              </div>

            </div>

          </div>

          {/* Description */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground/40 uppercase tracking-widest mb-3">About the role</h3>
            {displayJob.description.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-foreground/75 leading-[1.7] mb-3 last:mb-0">{para}</p>
            ))}
          </div>

          {/* Requirements */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground/40 uppercase tracking-widest mb-3">Requirements</h3>
            <ul className="space-y-2.5">
              {displayJob.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75 leading-[1.6]">
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-foreground/25 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Past mock interviews */}
          <div ref={mockInterviewsRef} className="px-5 py-5 pb-8">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/35">Mock interviews</span>
              {(pastReports ?? []).length > 0 && (
                <span className="text-[11px] text-foreground/35">{(pastReports ?? []).length} session{(pastReports ?? []).length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-0" />

            {(pastReports ?? []).length === 0 ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                  <Clapperboard className="w-3.5 h-3.5 text-foreground/25" />
                </div>
                <p className="text-[13px] text-foreground/35 leading-snug">No mock sessions yet. Take one to get an actionable debrief.</p>
              </div>
            ) : (
              <div>
                {(pastReports ?? []).map((entry, i) => {
                  const d = new Date(entry.date);
                  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  const score = entry.report.communicationScore;
                  const scoreColor = score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 65 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400";
                  return (
                    <div key={i}>
                      <button
                        data-testid={`button-view-report-${displayJob.id}-${i}`}
                        onClick={() => onViewReport?.(entry)}
                        className="w-full flex items-center justify-between gap-3 py-3 group text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] group-hover:bg-foreground/[0.07] transition-colors flex items-center justify-center flex-shrink-0">
                            <Clapperboard className="w-3.5 h-3.5 text-foreground/35" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-foreground/75 leading-none">Session {(pastReports ?? []).length - i}</div>
                            <div className="text-[11px] text-foreground/35 mt-0.5">{dateStr} · {timeStr}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[15px] font-bold ${scoreColor}`}>{score}</span>
                          <span className="text-[11px] text-foreground/30">/100</span>
                          <ChevronRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-foreground/45 transition-colors" />
                        </div>
                      </button>
                      {i < (pastReports ?? []).length - 1 && (
                        <div className="h-px bg-black/[0.04] dark:bg-white/[0.04]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-black/[0.06] dark:border-white/[0.06] flex-shrink-0">
          <button
            data-testid={`button-apply-${displayJob.id}`}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Apply on {displayJob.source === "linkedin" ? "LinkedIn" : "Indeed"}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Job card (shared) ──────────────────────────────────────────────────────
// Semi-circle gauge — mirrors the LiquidGauge style from bubble-button.tsx
const SG_A0    = 225;  // start deg (bottom-left, ~7-8 o'clock)
const SG_A1    = 135;  // end deg   (bottom-right, ~4-5 o'clock)
const SG_SWEEP = 270;  // 270° arc, 90° gap at the bottom
const SG_CX    = 18;
const SG_CY    = 16;
const SG_R     = 12;
const SG_SW    = 3;
const SG_VBW   = SG_CX * 2;
const SG_VBH   = SG_CY + SG_R * 0.52 + 7;

function sgPt(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: SG_CX + SG_R * Math.sin(rad), y: SG_CY - SG_R * Math.cos(rad) };
}
function sgArc(a1: number, a2: number) {
  const s = sgPt(a1);
  const e = sgPt(a2);
  const sw = ((a2 - a1) + 360) % 360;
  if (sw < 0.1) return "";
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${SG_R} ${SG_R} 0 ${sw > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}
function sgPalette(score: number, isDark: boolean) {
  if (score >= 85) return { bright: "#4ade80", mid: isDark ? "#16a34a" : "#10b981" };
  if (score >= 70) return { bright: "#fde68a", mid: isDark ? "#ea580c" : "#f97316" };
  return { bright: "#fca5a5", mid: isDark ? "#b91c1c" : "#ef4444" };
}

function ScoreGauge({ value, isDark, scale = 1.55 }: { value: number; isDark: boolean; scale?: number }) {
  const uid = useId().replace(/:/g, "");
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const c = sgPalette(value, isDark);
  const filledSweep = SG_SWEEP * pct;
  const filledEnd   = (SG_A0 + filledSweep) % 360;
  const track  = sgArc(SG_A0, SG_A1);
  const filled = filledSweep > 0.5 ? sgArc(SG_A0, filledEnd) : "";
  const arcLen  = (filledSweep * Math.PI / 180) * SG_R;
  const trackSurface = isDark ? "hsl(20,8%,20%)" : "rgba(210,205,198,0.90)";
  const scoreColor   = isDark ? "rgba(240,237,232,0.88)" : "#1A1A1A";

  const [displayNum, setDisplayNum] = useState(0);
  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayNum(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const svgW = SG_VBW * scale;
  const svgH = SG_VBH * scale;

  return (
    <div style={{ flexShrink: 0 }}>
      <svg
        viewBox={`0 0 ${SG_VBW} ${SG_VBH}`}
        width={svgW}
        height={svgH}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`sg-fg-${uid}`} gradientUnits="userSpaceOnUse"
            x1={SG_CX} y1={SG_CY - SG_R} x2={SG_CX} y2={SG_CY + SG_R * 0.5}>
            <stop offset="0%"   stopColor={c.bright} />
            <stop offset="100%" stopColor={c.mid}    />
          </linearGradient>
        </defs>

        {/* Track */}
        <path d={track} fill="none" stroke={trackSurface} strokeWidth={SG_SW} strokeLinecap="round" />

        {/* Filled arc */}
        {filled && (
          <motion.path
            d={filled}
            fill="none"
            stroke={`url(#sg-fg-${uid})`}
            strokeWidth={SG_SW}
            strokeLinecap="round"
            strokeDasharray={arcLen}
            initial={{ strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        )}

        {/* Score value — counts up */}
        <text
          x={SG_CX}
          y={SG_CY + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={scoreColor}
          fontSize="7"
          fontWeight="700"
          style={{ userSelect: "none", letterSpacing: "-0.3px", fontFamily: "inherit" }}
        >
          {displayNum}
        </text>
      </svg>

    </div>
  );
}

function getScoreColor(score: number, isDark: boolean): { primary: string; gradientEnd: string } {
  if (isDark) {
    if (score >= 85) return { primary: "#059669", gradientEnd: "#34d399" };
    if (score >= 70) return { primary: "#ea580c", gradientEnd: "#fbbf24" };
    return { primary: "#dc2626", gradientEnd: "#f87171" };
  }
  if (score >= 85) return { primary: "#10b981", gradientEnd: "#34d399" };
  if (score >= 70) return { primary: "#f97316", gradientEnd: "#fbbf24" };
  return { primary: "#ef4444", gradientEnd: "#f87171" };
}

function JobCard({ job, onShortlist, onOpen, onMockInterview, onAskScout }: { job: Job; onShortlist?: () => void; onOpen?: () => void; onMockInterview?: () => void; onAskScout?: () => void }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [dismissOpen, setDismissOpen] = useState(false);
  const dismissRef = useRef<HTMLDivElement>(null);
  const [gaugeHovered, setGaugeHovered] = useState(false);

  const gaugeAligns = [...new Set((BREAKDOWNS[job.id] ?? []).flatMap(s => s.aligns))].slice(0, 3);
  const gaugeGaps   = [...new Set((BREAKDOWNS[job.id] ?? []).flatMap(s => s.gaps))].slice(0, 2);

  useEffect(() => {
    if (!dismissOpen) return;
    const handler = (e: MouseEvent) => {
      if (dismissRef.current && !dismissRef.current.contains(e.target as Node)) {
        setDismissOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dismissOpen]);

  return (
    <div
      data-testid={`card-job-${job.id}`}
      className="flex flex-col gap-3 p-3 rounded-xl border border-black/[0.04] dark:border-[#302B28] bg-white dark:bg-[#28231E] select-none shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-all duration-150 hover:-translate-y-0.5 hover:border-black/[0.1] dark:hover:border-[#4A4440] hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.55)]"
    >
      {/* Row 1: Logo + Title/Company-location + Gauge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold mt-0.5 shadow-sm"
            style={{ backgroundColor: job.logoColor }}
          >
            {job.logoLetter}
          </div>
          <div className="min-w-0 flex-1">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
              className="text-[15px] font-semibold text-foreground leading-snug text-left hover:text-foreground/60 transition-colors cursor-pointer w-full"
            >
              {job.role}
            </button>
            <div className="text-[12px] text-foreground/45 mt-0.5 truncate">{job.company} · {job.location}</div>
          </div>
        </div>

        {/* Gauge + hover popover */}
        <div
          className="relative flex-shrink-0 mt-0.5"
          onMouseEnter={() => setGaugeHovered(true)}
          onMouseLeave={() => setGaugeHovered(false)}
        >
          <ScoreGauge value={job.match} isDark={isDark} />

          {/* Popover */}
          {(gaugeAligns.length > 0 || gaugeGaps.length > 0) && (
            <div
              className="absolute right-full top-0 mr-2 z-50 pointer-events-none"
              style={{
                opacity: gaugeHovered ? 1 : 0,
                transform: gaugeHovered ? "translateY(0)" : "translateY(4px)",
                transition: "opacity 0.18s ease, transform 0.18s ease",
              }}
            >
              <div
                className="w-[172px] rounded-xl border border-black/[0.07] dark:border-white/[0.09] px-3 py-2.5 flex flex-col gap-2"
                style={{
                  background: isDark ? "rgba(30,26,22,0.97)" : "rgba(255,255,255,0.97)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0,0,0,0.45)"
                    : "0 4px 20px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {gaugeAligns.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {gaugeAligns.map((a) => (
                      <div key={a} className="flex items-start gap-1.5">
                        <Check className="w-2.5 h-2.5 mt-[2px] flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-[11px] text-foreground/65 leading-snug">{a}</span>
                      </div>
                    ))}
                  </div>
                )}
                {gaugeAligns.length > 0 && gaugeGaps.length > 0 && (
                  <div className="h-px bg-black/[0.06] dark:bg-white/[0.07]" />
                )}
                {gaugeGaps.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {gaugeGaps.map((g) => (
                      <div key={g} className="flex items-start gap-1.5">
                        <X className="w-2.5 h-2.5 mt-[2px] flex-shrink-0 text-foreground/30" />
                        <span className="text-[11px] text-foreground/40 leading-snug">{g}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wide text-[#3D3630] dark:text-white/55 bg-[#EAE5DF] dark:bg-[#1F1C1C] rounded-md px-2 py-1 whitespace-nowrap">
          {job.location}
        </span>
        <span className="inline-flex items-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wide text-[#3D3630] dark:text-white/55 bg-[#EAE5DF] dark:bg-[#1F1C1C] rounded-md px-2 py-1 whitespace-nowrap">
          {job.type}
        </span>
        <span className="inline-flex items-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wide text-[#3D3630] dark:text-white/55 bg-[#EAE5DF] dark:bg-[#1F1C1C] rounded-md px-2 py-1 whitespace-nowrap">
          {job.workMode}
        </span>
      </div>

      {/* Action row */}
      {onShortlist ? (
        <div className="flex items-center gap-1.5">
          {/* Shortlist — navbar pill style, icon left */}
          <button
            data-testid={`button-shortlist-${job.id}`}
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-medium text-foreground/65 hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.18] transition-colors"
          >
            <Bookmark className="w-3 h-3" />
            Shortlist
          </button>

          {/* Ask Scout — navbar pill style, icon left */}
          {onAskScout && (
            <button
              data-testid={`button-ask-scout-${job.id}`}
              onClick={(e) => { e.stopPropagation(); onAskScout(); }}
              className="orb-activates-on-hover flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-medium text-foreground/65 hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.18] transition-colors"
            >
              <ColorOrb dimension="12px" spinDuration={8} />
              Ask Scout
            </button>
          )}

          {/* Expand — icon only, pushed right */}
          <button
            data-testid={`button-expand-${job.id}`}
            onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
            className="ml-auto flex items-center justify-center w-7 h-7 text-foreground/30 hover:text-foreground/60 transition-colors rounded-full"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          {/* Mock interview — navbar pill style, icon left */}
          {onMockInterview && (
            <button
              data-testid={`button-mock-interview-${job.id}`}
              onClick={(e) => { e.stopPropagation(); onMockInterview(); }}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-medium text-foreground/65 hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.18] transition-colors"
            >
              <Clapperboard className="w-3 h-3" />
              Mock interview
            </button>
          )}

          {/* Ask Scout — navbar pill style, icon left */}
          {onAskScout && (
            <button
              data-testid={`button-ask-scout-${job.id}`}
              onClick={(e) => { e.stopPropagation(); onAskScout(); }}
              className="orb-activates-on-hover flex items-center gap-1.5 h-8 px-3 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-medium text-foreground/65 hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.18] transition-colors"
            >
              <ColorOrb dimension="12px" spinDuration={8} />
              Ask Scout
            </button>
          )}

          {/* Expand — icon only, pushed right */}
          <button
            data-testid={`button-expand-other-${job.id}`}
            onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
            className="ml-auto flex items-center justify-center w-7 h-7 text-foreground/30 hover:text-foreground/60 transition-colors rounded-full"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Scout chat ─────────────────────────────────────────────────────────────
const SCOUT_SUGGESTIONS = [
  "Why is this a good fit for me?",
  "Give me resume tips for this role.",
  "What's the culture like here?",
  "Show me similar roles I might like.",
];

const SCOUT_RESPONSES: Record<string, string> = {
  "Why is this a good fit for me?": "Based on your senior-level background and preference for remote-first environments, this role aligns well. The scope of ownership and design system work matches your experience and career goals closely.",
  "Give me resume tips for this role.": "Highlight end-to-end design ownership, design system contributions, and close collaboration with engineering. Tailor your summary to emphasize the product areas most relevant to this company's focus.",
  "What's the culture like here?": "This company is known for a high craft bar and a strong design culture. Teams are small and move fast, with designers having real influence over product direction — not just execution.",
  "Show me similar roles I might like.": "Based on this role's profile, you might also enjoy similar positions at Notion, Linear, Vercel, or Figma — all share a design-first culture with remote or hybrid flexibility.",
};

interface ChatMsg { role: "ai" | "user"; text: string; }

function ScoutChat({ job, onClose }: { job: Job; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleSuggestions = showAll ? SCOUT_SUGGESTIONS : SCOUT_SUGGESTIONS.slice(0, 3);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const response = SCOUT_RESPONSES[text] ?? "Great question. Based on this role and your profile, I'd look at how your past work maps to their requirements — especially any areas where you've driven end-to-end design decisions.";
    setMessages(prev => [
      ...prev,
      { role: "user", text },
      { role: "ai", text: response },
    ]);
    setHasStarted(true);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Backdrop — only when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[3px] pointer-events-auto"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ layout: { type: "spring", bounce: 0.18, duration: 0.5 }, opacity: { duration: 0.22 }, y: { duration: 0.22 }, scale: { duration: 0.22 } }}
        className={`absolute pointer-events-auto flex flex-col overflow-hidden bg-white dark:bg-[#141414] border border-black/[0.1] dark:border-white/[0.12] shadow-2xl rounded-2xl ${
          expanded
            ? "inset-y-[6%] inset-x-0 mx-auto w-full max-w-[620px]"
            : "bottom-4 right-4 w-[360px] h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border-b border-black/[0.08] dark:border-white/[0.1]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="orb-spinning"><ColorOrb dimension="14px" spinDuration={6} /></span>
            <span className="text-[14px] font-semibold text-foreground">Scout</span>
            <span className="text-[13px] text-foreground/50 truncate">· {job.role} at {job.company}</span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
            <button
              data-testid="button-scout-expand"
              onClick={() => setExpanded(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
            >
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              data-testid="button-close-scout"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              /* ── Initial: orb + prompt + suggestions ── */
              (<motion.div
                key="initial"
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Orb + prompt — centered */}
                <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4">
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="orb-always-active"
                  >
                    <ColorOrb dimension={expanded ? "60px" : "40px"} spinDuration={5} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.35 }}
                    className={`text-center font-light text-foreground/55 mt-5 leading-[1.5] max-w-[240px] ${expanded ? "text-[20px]" : "text-[15px]"}`}
                  >
                    What do you want to know about {job.company}?
                  </motion.p>
                </div>
                {/* Suggestions — right-aligned, staggered */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2 px-4 pb-4">
                  {visibleSuggestions.map((s, i) => (
                    <motion.button
                      key={s}
                      data-testid={`button-scout-suggestion-${i}`}
                      onClick={() => send(s)}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.18, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-[#F3F3F2] dark:bg-[#242424] rounded-2xl px-4 py-2.5 text-[14px] text-foreground/70 border border-black/[0.06] dark:border-white/[0.08] hover:text-foreground transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                  {!showAll && SCOUT_SUGGESTIONS.length > 3 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => setShowAll(true)}
                      className="text-[13px] text-foreground/28 hover:text-foreground/45 transition-colors mt-0.5 pr-1"
                    >
                      Show more
                    </motion.button>
                  )}
                </div>
              </motion.div>)
            ) : (
              /* ── Chat state ── */
              (<motion.div
                key="chat"
                className="absolute inset-0 flex flex-col min-h-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
                  {messages.map((msg, i) => {
                    const isLastAi = msg.role === "ai" && messages.slice(i + 1).every(m => m.role !== "ai");
                    return (
                      <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "ai" && (
                          <div className="flex-shrink-0 mb-0.5 w-5 h-5 flex items-center justify-center">
                            {isLastAi ? (
                              <span className="orb-spinning">
                                <ColorOrb dimension="20px" spinDuration={6} />
                              </span>
                            ) : (
                              <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-dashed border-foreground/20" />
                            )}
                          </div>
                        )}
                        <div className={`text-[14px] leading-[1.6] rounded-2xl px-3.5 py-2.5 max-w-[80%] ${
                          msg.role === "user"
                            ? "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#141414] rounded-br-sm"
                            : "bg-[#F3F3F2] dark:bg-[#242424] text-foreground/85 border border-black/[0.06] dark:border-white/[0.08] rounded-bl-sm"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </motion.div>)
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-black/[0.08] dark:border-white/[0.1]">
          <div className="flex items-center gap-2 bg-[#F3F3F2] dark:bg-[#242424] rounded-xl border border-black/[0.07] dark:border-white/[0.08] px-3 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(input); }}
              placeholder={hasStarted ? "Ask a follow-up…" : "Or type your own question…"}
              className="flex-1 text-[14px] text-foreground placeholder:text-foreground/30 bg-transparent outline-none"
            />
            <button
              data-testid="button-scout-send"
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground disabled:opacity-20 transition-opacity flex-shrink-0"
            >
              <SendHorizontal className="w-3.5 h-3.5 text-background" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ── Offer Decision Scout ───────────────────────────────────────────────────
const buildOfferSteps = (a: string, b: string) => [
  { key: "ctc",    q: "What's your current CTC?" },
  { key: "offerA", q: `Let's figure this out together. What's ${a} actually offering you — base salary, and anything else on top?` },
  { key: "offerB", q: `Got it. And ${b}?` },
  { key: "feel",   q: "Okay. Now the part that data can't tell me — how did each interview actually feel?" },
  { key: "regret", q: "One more. Right now, what's the thing you'd most regret optimising for the wrong way?", suggestions: ["Money short-term", "Career growth", "Work environment", "Job security"] },
] as const;

type OfferMsg =
  | { role: "ai";   text: string }
  | { role: "user"; text: string }
  | { role: "result"; winner: string; analysis: string; regretNote: string; take: string };

function buildResult(a: string, b: string, answers: Record<string, string>) {
  const regret = answers.regret ?? "Career growth";
  const growthFirst = regret === "Career growth" || regret === "Work environment";
  const winner = growthFirst ? b : a;
  return {
    winner,
    analysis: `Here's what stands out. ${a} has the stronger short-term comp package, but ${b}'s trajectory — especially given how you described the interview — is worth more than it looks on paper right now.`,
    regretNote: `Your answer about \u201c${regret}\u201d tells me something. You\u2019re not just optimising for the number on the letter. That\u2019s the right instinct.`,
    take: growthFirst
      ? `If you\u2019re still building leverage and want to compound your career upside, ${b} is the stronger move — even if the immediate number is a little lower.`
      : `If financial security is the real constraint right now, ${a} makes sense. The gap in comp is meaningful, and certainty has real value.`,
  };
}

function OfferDecisionScout({ jobs, onClose }: { jobs: Job[]; onClose: () => void }) {
  const compA = jobs[0]?.company ?? "Company A";
  const compB = jobs[1]?.company ?? "Company B";
  const steps = buildOfferSteps(compA, compB);

  const [messages, setMessages] = useState<OfferMsg[]>([{ role: "ai", text: steps[0].q }]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    const cur = steps[step];
    const newAnswers = { ...answers, [cur.key]: text };
    setAnswers(newAnswers);
    const next = step + 1;
    const userMsg: OfferMsg = { role: "user", text };
    if (next >= steps.length) {
      const r = buildResult(compA, compB, newAnswers);
      setMessages(prev => [...prev, userMsg, { role: "result", ...r }]);
      setDone(true);
    } else {
      setMessages(prev => [...prev, userMsg, { role: "ai", text: steps[next].q }]);
      setStep(next);
    }
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const curStep = steps[step] as (typeof steps)[number];
  const hasSuggestions = !done && "suggestions" in curStep;

  return createPortal(
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <AnimatePresence>
        {expanded && (
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[3px] pointer-events-auto"
            onClick={() => setExpanded(false)} />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ layout: { type: "spring", bounce: 0.18, duration: 0.5 }, opacity: { duration: 0.22 }, y: { duration: 0.22 }, scale: { duration: 0.22 } }}
        className={`absolute pointer-events-auto flex flex-col overflow-hidden bg-white dark:bg-[#141414] border border-black/[0.1] dark:border-white/[0.12] shadow-2xl rounded-2xl ${expanded ? "inset-y-[6%] inset-x-0 mx-auto w-full max-w-[620px]" : "bottom-4 right-4 w-[390px] h-[530px]"}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border-b border-black/[0.08] dark:border-white/[0.1]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="orb-spinning"><ColorOrb dimension="14px" spinDuration={6} /></span>
            <span className="text-[14px] font-semibold text-foreground">Scout</span>
            <span className="text-[13px] text-foreground/50 truncate">· Comparing {compA} vs {compB}</span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
            <button onClick={() => setExpanded(v => !v)} className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors">
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/40 hover:text-foreground/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-[3px] flex-1 rounded-full transition-all duration-400 ${i < step || done ? "bg-foreground/35" : i === step && !done ? "bg-foreground/70" : "bg-foreground/12"}`} />
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          {messages.map((msg, i) => {
            if (msg.role === "result") {
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-[#F3F3F2] dark:bg-[#1C1C1C] rounded-2xl p-4 border border-black/[0.07] dark:border-white/[0.1] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="orb-spinning"><ColorOrb dimension="16px" spinDuration={5} /></span>
                    <span className="text-[12px] font-semibold tracking-widest text-foreground/55 uppercase">Scout's Take</span>
                  </div>
                  <div className="flex items-center gap-2 bg-foreground/[0.08] dark:bg-white/[0.1] rounded-xl px-3 py-2">
                    <span className="text-[13px] text-foreground/55">Lean toward</span>
                    <span className="text-[14px] font-semibold text-foreground">{msg.winner}</span>
                  </div>
                  <p className="text-[14px] text-foreground/75 leading-relaxed">{msg.analysis}</p>
                  <p className="text-[14px] text-foreground/60 leading-relaxed">{msg.regretNote}</p>
                  <div className="border-t border-black/[0.08] dark:border-white/[0.1] pt-3">
                    <p className="text-[14px] font-medium text-foreground/80 leading-relaxed">{msg.take}</p>
                  </div>
                </motion.div>
              );
            }
            const isLastAi = msg.role === "ai" && messages.slice(i + 1).every(m => m.role !== "ai");
            return (
              <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="flex-shrink-0 mb-0.5 w-5 h-5 flex items-center justify-center">
                    {isLastAi
                      ? <span className="orb-spinning"><ColorOrb dimension="20px" spinDuration={6} /></span>
                      : <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-dashed border-foreground/20" />}
                  </div>
                )}
                <div className={`text-[14px] leading-[1.6] rounded-2xl px-3.5 py-2.5 max-w-[82%] ${msg.role === "user" ? "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#141414] rounded-br-sm" : "bg-[#F3F3F2] dark:bg-[#242424] text-foreground/85 border border-black/[0.06] dark:border-white/[0.08] rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input / suggestions / close */}
        <div className="flex-shrink-0 border-t border-black/[0.08] dark:border-white/[0.1]">
          {done ? (
            <div className="px-3 pb-3 pt-2">
              <button onClick={onClose} className="w-full text-[14px] text-foreground/50 hover:text-foreground/80 transition-colors py-2 text-center">
                Close
              </button>
            </div>
          ) : hasSuggestions ? (
            <div className="px-3 py-3 flex flex-col items-end gap-2">
              {(curStep as { suggestions: readonly string[] }).suggestions.map((s) => (
                <button key={s} onClick={() => submit(s)}
                  className="bg-[#F3F3F2] dark:bg-[#242424] rounded-2xl px-4 py-2.5 text-[14px] text-foreground/70 border border-black/[0.06] dark:border-white/[0.08] hover:text-foreground transition-colors">
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 pb-3 pt-2">
              <div className="flex items-center gap-2 bg-[#F3F3F2] dark:bg-[#242424] rounded-xl border border-black/[0.07] dark:border-white/[0.08] px-3 py-2.5">
                <input ref={inputRef} type="text" value={input} autoFocus
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") submit(input); }}
                  placeholder="Type your answer…"
                  className="flex-1 text-[14px] text-foreground placeholder:text-foreground/40 bg-transparent outline-none" />
                <button onClick={() => submit(input)} disabled={!input.trim()}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-foreground disabled:opacity-20 transition-opacity flex-shrink-0">
                  <SendHorizontal className="w-3.5 h-3.5 text-background" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ── Pipeline column ────────────────────────────────────────────────────────
function PipelineCol({ colId, jobs, onShortlist, onOpenJob, onMockInterview, onAskScout, onDecide, onToggleCollapse, collapsed, colIndex = 0 }: { colId: string; jobs: Job[]; onShortlist: (id: string) => void; onOpenJob: (id: string) => void; onMockInterview: (id: string) => void; onAskScout: (id: string) => void; onDecide?: () => void; onToggleCollapse?: () => void; collapsed?: boolean; colIndex?: number }) {
  const isPicks = colId === "picks";
  const isInterview = colId === "interview";

  const offerThreshold = colId === "offer" && jobs.length >= 2 && !!onDecide;
  const [bannerReady, setBannerReady] = useState(false);
  useEffect(() => {
    if (!offerThreshold) { setBannerReady(false); return; }
    const t = setTimeout(() => setBannerReady(true), 1200);
    return () => clearTimeout(t);
  }, [offerThreshold]);

  const cardList = (
    <AnimatePresence initial={false}>
      {jobs.map((job) => (
        <KanbanItem key={job.id} value={job.id} className="rounded-lg">
          <KanbanItemHandle className="w-full rounded-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 64, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <JobCard job={job} onShortlist={isPicks ? () => onShortlist(job.id) : undefined} onOpen={() => onOpenJob(job.id)} onMockInterview={isInterview ? () => onMockInterview(job.id) : undefined} onAskScout={() => onAskScout(job.id)} />
            </motion.div>
          </KanbanItemHandle>
        </KanbanItem>
      ))}
      {jobs.length === 0 && (
        <div className="flex items-center justify-center py-10 rounded-lg border border-dashed border-black/10 dark:border-border/50 mx-0.5">
          <p className="text-[11px] text-muted-foreground/40 text-center leading-relaxed">
            Drag a role here<br />to track it
          </p>
        </div>
      )}
    </AnimatePresence>
  );

  // Archived column — unified morph layout: both states are always rendered as
  // absolute overlays; only opacity changes simultaneously with the width animation.
  if (onToggleCollapse) {
    const morphEase = [0.22, 1, 0.36, 1] as const;
    const morphDur = 0.42;
    return (
      <KanbanColumn value={colId} className="relative flex-1 rounded-xl bg-[#E2DDD6] dark:bg-[#141414] overflow-hidden h-full">

        {/* ── Expanded state (full column) ── */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: morphDur, ease: morphEase }}
          style={{ pointerEvents: collapsed ? "none" : "auto" }}
        >
          <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-shrink-0 select-none">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-wider text-foreground/55 dark:text-foreground/45">
              {COL_LABELS[colId]}
            </span>
            {jobs.length > 0 && (
              <span className="text-[10px] font-semibold text-foreground/40 bg-black/[0.08] dark:bg-white/[0.08] rounded-full px-1.5 py-0.5 leading-none">
                {jobs.length}
              </span>
            )}
            <button
              onClick={onToggleCollapse}
              className="cursor-pointer ml-auto w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Collapse"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-foreground/40" />
            </button>
          </div>
          <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto scrollbar-hide px-3 pt-1 pb-4 min-h-[60px]">
            {cardList}
          </KanbanColumnContent>
        </motion.div>

        {/* ── Collapsed state (thin strip) ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center py-3 gap-2"
          animate={{ opacity: collapsed ? 1 : 0 }}
          transition={{ duration: morphDur, ease: morphEase }}
          style={{ pointerEvents: collapsed ? "auto" : "none" }}
        >
          <button
            onClick={onToggleCollapse}
            className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
            title="Expand"
          >
            <ChevronRight className="w-3.5 h-3.5 text-foreground/50" />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
            <span
              className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-wider text-foreground/45 select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {COL_LABELS[colId]}
            </span>
            {jobs.length > 0 && (
              <span className="text-[10px] font-semibold text-foreground/40 bg-black/[0.08] dark:bg-white/[0.08] rounded-full px-1.5 py-0.5 leading-none">
                {jobs.length}
              </span>
            )}
          </div>
        </motion.div>

      </KanbanColumn>
    );
  }

  if (isPicks) {
    return (
      <KanbanColumn value={colId} className="flex flex-col min-w-[350px] flex-1 rounded-xl bg-[#E8E3DC] dark:bg-[#141414] overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-shrink-0 select-none">
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-wider text-foreground/55 dark:text-foreground/45">{COL_LABELS[colId]}</span>
          {jobs.length > 0 && (
            <span className="text-[10px] font-semibold text-foreground/40 bg-black/[0.08] dark:bg-white/[0.08] rounded-full px-1.5 py-0.5 leading-none">{jobs.length}</span>
          )}
        </div>
        <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto scrollbar-hide px-3 pt-1 pb-4 min-h-[60px]">
          {cardList}
        </KanbanColumnContent>
      </KanbanColumn>
    );
  }

  return (
    <KanbanColumn value={colId} className="flex flex-col min-w-[350px] flex-1 rounded-xl bg-[#E2DDD6] dark:bg-[#141414] overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-shrink-0 select-none">
        <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-wider text-foreground/55 dark:text-foreground/45">{COL_LABELS[colId]}</span>
        {jobs.length > 0 && (
          <span className="text-[10px] font-semibold text-foreground/40 bg-black/[0.08] dark:bg-white/[0.08] rounded-full px-1.5 py-0.5 leading-none">{jobs.length}</span>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="cursor-pointer ml-auto w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Collapse Archived"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-foreground/40" />
          </button>
        )}
      </div>

      {bannerReady && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-2 mb-1.5 flex-shrink-0"
          >
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-card border border-black/[0.06] dark:border-border shadow-sm">
              {/* Soft light smudge at top */}
              <div className="absolute inset-x-0 top-0 h-10 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(192,74,56,0.18) 0%, rgba(245,166,35,0.10) 40%, transparent 100%)" }} />
              <div className="px-3.5 pt-4 pb-3.5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-[44px] h-[44px] flex-shrink-0">
                    <Lottie animationData={aiAssistantAnimation} loop={true} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground/85 leading-tight">Two offers. Big decision.</p>
                    <p className="text-[12px] font-normal text-foreground/45 mt-0.5 leading-snug">Let Scout help you think it through.</p>
                  </div>
                </div>
                <button
                  data-testid="button-offer-decide"
                  onClick={onDecide}
                  className="w-full flex items-center justify-center gap-1.5 bg-foreground text-background text-[12px] font-medium h-8 rounded-lg hover:opacity-85 transition-opacity"
                >
                  Help me decide
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto scrollbar-hide px-3 pt-1 pb-4 min-h-[60px]">
        {cardList}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

// ── Criteria Dropdown ──────────────────────────────────────────────────────
const ROLE_SUGGESTIONS = ["Product Designer", "UX Researcher", "Design Lead", "Motion Designer"];

function CriteriaDropdown({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState("Software engineers");
  const [location, setLocation] = useState("Remote · United States");

  return (
    <div className="w-full min-w-[300px] rounded-2xl border border-black/[0.07] dark:border-white/[0.09] bg-white dark:bg-[#1E1B18] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-black/[0.05] dark:border-white/[0.06]">
        <p className="text-[11px] text-foreground/40">Edit below to refresh your AI picks</p>
      </div>

      {/* Inputs */}
      <div className="px-4 pt-3.5 pb-3 flex flex-col gap-3">
        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-foreground/40 uppercase tracking-wide">Role</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Product Designer"
            className="w-full h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.05] text-[13px] text-foreground placeholder:text-foreground/30 outline-none focus:border-black/[0.18] dark:focus:border-white/[0.22] transition-colors"
          />
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {ROLE_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setRole(suggestion)}
                className="h-6 px-2.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.04] text-[11px] text-foreground/55 hover:text-foreground hover:border-black/[0.16] dark:hover:border-white/[0.2] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-foreground/40 uppercase tracking-wide">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/35 pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York"
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.05] text-[13px] text-foreground placeholder:text-foreground/30 outline-none focus:border-black/[0.18] dark:focus:border-white/[0.22] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 pt-2 pb-3">
        <button
          onClick={onClose}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-[13px] font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <Search className="w-3.5 h-3.5" />
          Rescan jobs
        </button>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
  const [columns, setColumns] = useState<Record<string, Job[]>>(INITIAL_COLUMNS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [interviewJobId, setInterviewJobId] = useState<string | null>(null);
  const [roomJobId, setRoomJobId] = useState<string | null>(null);
  const [reportJobId, setReportJobId] = useState<string | null>(null);
  const [completedReports, setCompletedReports] = useState<Record<string, CompletedReport[]>>({});
  const [viewingReport, setViewingReport] = useState<{ job: Job; entry: CompletedReport } | null>(null);
  const [scoutJobId, setScoutJobId] = useState<string | null>(null);
  const [offerDecisionOpen, setOfferDecisionOpen] = useState(false);
  const [archivedCollapsed, setArchivedCollapsed] = useState(false);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const criteriaRef = useRef<HTMLDivElement>(null);
  // 4-phase: list → shrinking → settled (snapped left, columns hidden) → split (columns reveal)
  const [phase, setPhase] = useState<"list" | "shrinking" | "settled" | "split">("list");
  const picksRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!criteriaOpen) return;
    const handler = (e: MouseEvent) => {
      if (criteriaRef.current && !criteriaRef.current.contains(e.target as Node)) {
        setCriteriaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [criteriaOpen]);

  // Computed margin-left to visually center the 520px AI Picks column within the content area.
  // Using explicit px (not "auto") so it can be CSS-transitioned smoothly.
  const [centerMargin, setCenterMargin] = useState(0);
  useEffect(() => {
    const compute = () => {
      // KanbanBoard has pl-[108px] (108px) + pr-4 (16px); available width = viewport - 124
      const available = window.innerWidth - 108 - 16;
      setCenterMargin(Math.max(0, Math.floor((available - 520) / 2)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const allJobs = Object.values(columns).flat();
  const findJob = (id: string) => allJobs.find((j) => j.id === id);

  const selectedJob = selectedJobId ? allJobs.find((j) => j.id === selectedJobId) ?? null : null;
  const interviewJob = interviewJobId ? allJobs.find((j) => j.id === interviewJobId) ?? null : null;
  const roomJob = roomJobId ? allJobs.find((j) => j.id === roomJobId) ?? null : null;
  const reportJob = reportJobId ? allJobs.find((j) => j.id === reportJobId) ?? null : null;
  const scoutJob = scoutJobId ? allJobs.find((j) => j.id === scoutJobId) ?? null : null;

  const getJobId = useCallback((job: Job) => job.id, []);

  const handleShortlist = useCallback((id: string) => {
    setColumns(prev => {
      const fromCol = Object.keys(prev).find(col => prev[col].some(j => j.id === id));
      if (!fromCol) return prev;
      const job = prev[fromCol].find(j => j.id === id)!;
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(j => j.id !== id),
        not_applied: [{ ...job }, ...prev.not_applied],
      };
    });
    if (phase !== "list") return;

    // Wait for the card exit animation to finish (~450ms) before starting column motion
    const CARD_EXIT_MS = 480;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    const dur = "0.65s";

    setTimeout(() => {
      const el = picksRef.current;
      const filterEl = filterBarRef.current;

      // Phase 1: animate width 520→350 AND marginLeft centerMargin→0 simultaneously
      if (el) {
        const currentWidth = el.getBoundingClientRect().width;
        el.style.transition = "none";
        el.style.flex = "none";
        el.style.width = `${currentWidth}px`;
        el.style.marginLeft = `${centerMargin}px`;
        void el.offsetWidth; // force reflow
        el.style.transition = `width ${dur} ${ease}, margin-left ${dur} ${ease}`;
        el.style.width = "350px";
        el.style.marginLeft = "0px";
      }
      if (filterEl) {
        filterEl.style.transition = "none";
        filterEl.style.marginLeft = `${centerMargin}px`;
        void filterEl.offsetWidth;
        filterEl.style.transition = `margin-left ${dur} ${ease}`;
        filterEl.style.marginLeft = "0px";
      }
      setPhase("shrinking");

      // Phase 2: slide done → clear imperative styles, lock into flex layout
      setTimeout(() => {
        if (el) { el.style.transition = ""; el.style.width = ""; el.style.flex = ""; el.style.marginLeft = ""; }
        if (filterEl) { filterEl.style.transition = ""; filterEl.style.marginLeft = ""; }
        setPhase("settled");
      }, 700);

      // Phase 3: brief breath then stagger-reveal pipeline columns
      setTimeout(() => {
        setPhase("split");
      }, 960);
    }, CARD_EXIT_MS);
  }, [phase, centerMargin]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col bg-[#F0EDE7] dark:bg-[#1A1A1A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top filter bar — centered in list mode, left-aligned in split */}
      <div className="flex items-center flex-shrink-0 pl-[108px] pr-4 mt-6 mb-2">
        <div
          ref={filterBarRef}
          className="flex items-center gap-2"
          style={{ marginLeft: (phase === "list" || phase === "shrinking") ? centerMargin : 0 }}
        >
          {/* Prompt pill */}
          <div ref={criteriaRef} className="relative">
            <button
              onClick={() => setCriteriaOpen(v => !v)}
              className={`flex items-center gap-2.5 bg-white dark:bg-card border h-9 text-sm text-foreground min-w-0 max-w-[380px] select-none rounded-full pl-1.5 pr-4 transition-colors ${criteriaOpen ? "border-black/20 dark:border-white/20" : "border-black/8 dark:border-border hover:border-black/15 dark:hover:border-white/15"}`}
            >
              <div className="w-6 h-6 flex-shrink-0 rounded-full bg-foreground/[0.07] dark:bg-white/[0.08] flex items-center justify-center">
                <Search className="w-3 h-3 text-foreground/55" />
              </div>
              <span className="truncate text-foreground/70">Software engineers · remote-first · senior-level</span>
            </button>

            {/* Criteria dropdown */}
            <div
              className="absolute left-0 top-full mt-2 z-50 w-full"
              style={{
                opacity: criteriaOpen ? 1 : 0,
                transform: criteriaOpen ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.98)",
                pointerEvents: criteriaOpen ? "auto" : "none",
                transition: "opacity 0.16s ease, transform 0.16s ease",
                transformOrigin: "top left",
              }}
            >
              <CriteriaDropdown onClose={() => setCriteriaOpen(false)} />
            </div>
          </div>

          {/* Filters button */}
          <button
            data-testid="button-filters"
            className="flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full border border-black/8 dark:border-border bg-white dark:bg-card text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-semibold">4</span>
          </button>

          {/* Criteria button */}
          <button
            data-testid="button-criteria"
            className="flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full border border-black/8 dark:border-border bg-white dark:bg-card text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Criteria
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-semibold">3</span>
          </button>
        </div>

        {/* Add Job button + AI Balance */}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setAddJobOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full border border-black/8 dark:border-border bg-white dark:bg-card text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add job
          </button>
          <UsageBadge
            icon={<FlaskConical className="w-3.5 h-3.5 opacity-70" />}
            planName="AI Balance"
            usage={20}
            limit={30}
            tooltipContent={
              <p>30 AI credits remaining.<br />Used for mock interviews &amp; scout chats.</p>
            }
          />
        </div>

      </div>

      {/* Single always-mounted kanban board — AI Picks stays, others reveal */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <Kanban value={columns} onValueChange={setColumns} getItemValue={getJobId} className="h-full">
          <KanbanBoard className="flex h-full pt-4 pr-4 pb-4 pl-[108px]">

            {/* AI Picks — centered at 520px in list mode, shrinks & snaps left on shortlist */}
            <div
              ref={picksRef}
              style={{
                flex: (phase === "split" || phase === "settled") ? "0 0 350px" : "none",
                width: (phase === "split" || phase === "settled") ? undefined : "520px",
                marginLeft: (phase === "split" || phase === "settled") ? 0 : centerMargin,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <PipelineCol
                colId="picks"
                colIndex={0}
                jobs={columns.picks ?? []}
                onShortlist={handleShortlist}
                onOpenJob={setSelectedJobId}
                onMockInterview={setInterviewJobId}
                onAskScout={setScoutJobId}
              />
            </div>

            {/* Other pipeline columns — clip-reveal after shrink completes, staggered */}
            {COL_ORDER.filter(c => c !== "picks").map((colId, i) => (
              <motion.div
                key={colId}
                className="overflow-hidden flex-shrink-0 h-full"
                initial={{ maxWidth: 0, opacity: 0 }}
                animate={{
                  maxWidth: phase === "split" ? 362 : 0,
                  opacity: phase === "split" ? 1 : 0,
                }}
                transition={{
                  maxWidth: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: phase === "split" ? i * 0.12 : 0 },
                  opacity:  { duration: 0.4,  ease: "easeOut",           delay: phase === "split" ? i * 0.12 + 0.1 : 0 },
                }}
              >
                {/* inner div at fixed width so content never squishes */}
                <div className="flex flex-col w-[350px] ml-3 h-full">
                  <PipelineCol
                    colId={colId}
                    colIndex={i + 1}
                    jobs={columns[colId] ?? []}
                    onShortlist={handleShortlist}
                    onOpenJob={setSelectedJobId}
                    onMockInterview={setInterviewJobId}
                    onAskScout={setScoutJobId}
                    onDecide={colId === "offer" ? () => setOfferDecisionOpen(true) : undefined}
                  />
                </div>
              </motion.div>
            ))}

            {/* Archived column — always last, collapsible */}
            <motion.div
              className="overflow-hidden flex-shrink-0 h-full"
              initial={{ maxWidth: 0, opacity: 0 }}
              animate={{
                maxWidth: phase === "split" ? 362 : 0,
                opacity: phase === "split" ? 1 : 0,
              }}
              transition={{
                maxWidth: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: phase === "split" ? COL_ORDER.filter(c => c !== "picks").length * 0.12 : 0 },
                opacity:  { duration: 0.4,  ease: "easeOut",           delay: phase === "split" ? COL_ORDER.filter(c => c !== "picks").length * 0.12 + 0.1 : 0 },
              }}
            >
              <motion.div
                className="flex flex-col h-full ml-3 overflow-hidden"
                animate={{ width: archivedCollapsed ? 43 : 350 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <PipelineCol
                  colId="archived"
                  colIndex={COL_ORDER.length}
                  jobs={columns.archived ?? []}
                  onShortlist={handleShortlist}
                  onOpenJob={setSelectedJobId}
                  onMockInterview={setInterviewJobId}
                  onAskScout={setScoutJobId}
                  collapsed={archivedCollapsed}
                  onToggleCollapse={() => setArchivedCollapsed(v => !v)}
                />
              </motion.div>
            </motion.div>

            {/* Trailing spacer — flex right-padding workaround for overflow-x-auto */}
            <div className="flex-shrink-0 w-10 h-full" />

          </KanbanBoard>

          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === "item") {
                const job = findJob(value as string);
                if (job) {
                  return (
                    <div className="rounded-lg shadow-xl ring-1 ring-foreground/10 opacity-95 rotate-1 scale-[1.02]">
                      <JobCard job={job} />
                    </div>
                  );
                }
              }
              return <div className="rounded-xl bg-muted/60 border border-border w-full h-full" />;
            }}
          </KanbanOverlay>
        </Kanban>
      </div>

      <JobDetailSheet
        job={selectedJob}
        open={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
        pastReports={selectedJob ? (completedReports[selectedJob.id] ?? []).slice().reverse() : []}
        onViewReport={(entry) => {
          if (selectedJob) setViewingReport({ job: selectedJob, entry });
        }}
      />
      <MockInterviewDialog
        job={interviewJob}
        open={!!interviewJobId}
        onClose={() => setInterviewJobId(null)}
        onStart={() => { setRoomJobId(interviewJobId); setInterviewJobId(null); }}
      />
      <AddJobDialog open={addJobOpen} onClose={() => setAddJobOpen(false)} />

      {createPortal(
        <AnimatePresence>
          {roomJob && (
            <MockInterviewRoom
              key={roomJob.id}
              job={roomJob}
              onEnd={() => {
                const finishedId = roomJobId;
                setRoomJobId(null);
                if (finishedId) setReportJobId(finishedId);
              }}
            />
          )}
          {reportJob && (
            <InterviewReport
              key={`report-${reportJob.id}`}
              job={reportJob}
              onClose={() => {
                const finishedJob = reportJob;
                const generatedReport = getMockReport(finishedJob.id);
                setCompletedReports(prev => ({
                  ...prev,
                  [finishedJob.id]: [...(prev[finishedJob.id] ?? []), { date: new Date().toISOString(), report: generatedReport }],
                }));
                setReportJobId(null);
              }}
            />
          )}
          {viewingReport && (
            <InterviewReport
              key={`viewing-${viewingReport.job.id}-${viewingReport.entry.date}`}
              job={viewingReport.job}
              report={viewingReport.entry.report}
              onClose={() => setViewingReport(null)}
            />
          )}
          {scoutJob && (
            <ScoutChat key={scoutJob.id} job={scoutJob} onClose={() => setScoutJobId(null)} />
          )}
          {offerDecisionOpen && (
            <OfferDecisionScout
              key="offer-decision"
              jobs={columns["offer"] ?? []}
              onClose={() => setOfferDecisionOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}

// ── Aha moment modal ────────────────────────────────────────────────────────
function AhaMomentModal({ onConfirm }: { onConfirm: () => void }) {
  const [count, setCount] = useState(0);
  const target = 392;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(ease(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => { frame = requestAnimationFrame(tick); }, 420);
    return () => { clearTimeout(delay); cancelAnimationFrame(frame); };
  }, []);


  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Blurred dark scrim — you see the kanban ghosted behind */}
      <motion.div
        className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-[420px] bg-[#F5F2ED] rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.28)] overflow-hidden"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top warm beige band */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#D4C5A9]/30 to-transparent pointer-events-none" />

        {/* Lottie animation */}
        <div className="flex justify-center pt-8 pb-3">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.5, type: "spring", bounce: 0.4 }}
            className="w-[88px] h-[88px]"
          >
            <Lottie animationData={aiAssistantAnimation} loop={true} />
          </motion.div>
        </div>

        {/* Hero text */}
        <motion.div
          className="text-center px-8 pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 className="text-[26px] font-bold text-foreground leading-tight tracking-tight">
            We found{" "}
            <motion.span
              className="text-transparent bg-clip-text inline-block"
              style={{
                backgroundImage: "linear-gradient(to right, #5D3560 0%, #C04A38 40%, #E8882A 70%, #F5A623 100%)",
                backgroundSize: "200% auto",
                backgroundPosition: "0% center",
              }}
              initial={{ opacity: 0, backgroundPosition: "100% center" }}
              animate={{ opacity: 1, backgroundPosition: "0% center" }}
              transition={{ delay: 0.4, duration: 1.4, ease: "easeOut" }}
            >
              {count.toLocaleString()}
            </motion.span>{" "}
            roles<br />that actually fit you.
          </h2>
          <p className="text-[13px] text-foreground/45 mt-2 leading-relaxed">
            Each one ranked by how well it matches your background.
          </p>
        </motion.div>

        {/* Preferences summary */}
        <motion.div
          className="mx-5 mb-5 rounded-2xl border border-black/[0.07] bg-white/70 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
        >
          <div className="px-4 py-2.5 border-b border-black/[0.05]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/30">Filtered for you</span>
          </div>
          {[
            { label: "Type", value: "Full-time" },
            { label: "Location", value: "Remote · US" },
            { label: "Level", value: "Senior" },
            { label: "Ranked by", value: "Portfolio match" },
          ].map((p, i, arr) => (
            <div key={p.label} className={`flex items-center justify-between px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-black/[0.04]" : ""}`}>
              <span className="text-[13px] text-foreground/45">{p.label}</span>
              <span className="text-[13px] font-medium text-foreground/80">{p.value}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="px-5 pb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.56, duration: 0.4 }}
        >
          <motion.button
            onClick={onConfirm}
            className="w-full h-[50px] rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20"
            whileTap={{ scale: 0.97 }}
          >
            Let's go
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Jobs() {
  const [phase, setPhase] = useState<Phase>("transition");

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "transition" && (
          <TransitionScreen key="transition" onVoice={() => setPhase("voice")} onType={() => setPhase("type")} onSkip={() => setPhase("dashboard")} />
        )}
        {phase === "voice" && (
          <VoiceRoom key="voice" onDone={() => setPhase("done")} onReset={() => setPhase("transition")} />
        )}
        {phase === "type" && (
          <TypeRoom key="type" onDone={() => setPhase("done")} onReset={() => setPhase("transition")} />
        )}
        {phase === "done" && (
          <ThinkingScreen key="done" onComplete={() => setPhase("aha")} />
        )}
      </AnimatePresence>

      {/* Dashboard lives behind the aha modal — you see it blurred through the scrim */}
      {(phase === "aha" || phase === "dashboard") && <Dashboard />}

      {/* Aha moment overlay */}
      <AnimatePresence>
        {phase === "aha" && (
          <AhaMomentModal onConfirm={() => setPhase("dashboard")} />
        )}
      </AnimatePresence>
    </>
  );
}
