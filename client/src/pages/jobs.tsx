import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, ChevronRight, SlidersHorizontal, Sparkles, Bookmark, MapPin, Briefcase, Building2, ExternalLink, Video, CheckCircle2, XCircle, Clapperboard, Phone, ChevronLeft, Clock, Monitor, X, ArrowUpCircle, Calendar, Users, Mail, FileText, ThumbsUp, PenLine } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Gauge } from "@/components/ui/gauge-1";
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
import { unsafe_createClientWithApiKey, AnamEvent } from "@anam-ai/js-sdk";
import type { AnamClient, Message } from "@anam-ai/js-sdk";
import Lottie from "lottie-react";
import aiAssistantAnimation from "@/assets/AI-Assistant.json";

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
};

// Light-mode column colors — all stages share the same neutral card shade
const COL_BG: Record<string, string> = {
  picks:       "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  not_applied: "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  applied:     "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  interview:   "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
  offer:       "bg-[#E5E1DA] border border-[#D5CFC7] dark:bg-card dark:border-border",
};

const INITIAL_COLUMNS: Record<string, Job[]> = {
  picks: BASE_JOBS,
  not_applied: [],
  applied: [],
  interview: [],
  offer: [],
};

// ── Shared sub-components ──────────────────────────────────────────────────
const questions = [
  "What kind of work are you looking for — full-time, freelance, or something in between?",
  "Where would you want to be based? Remote, hybrid, or a specific city?",
  "Which industry excites you most right now?",
  "What's the one thing a role must have for you to say yes?",
  "Anything you'd want to avoid in your next job?",
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

// ── Transition screen ──────────────────────────────────────────────────────
function TransitionScreen({ onVoice, onType }: { onVoice: () => void; onType: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#F0EDE7] dark:bg-background px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-[#FF553E]/8 blur-[120px]" />
      </div>
      <motion.div className="relative z-10 max-w-md text-center space-y-6" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}>
        <motion.div className="flex justify-center mb-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <svg width="44" height="44" viewBox="0 0 37 37" fill="none">
            <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
            <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
          </svg>
        </motion.div>
        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">Let's find a job that actually fits you.</h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-light">Your portfolio and resume are already here.<br />I just need 5 minutes with you.</p>
        </div>
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <button data-testid="button-lets-talk" onClick={onVoice} className="flex items-center gap-2 bg-foreground text-background font-medium text-[14px] px-6 py-3 rounded-full hover:bg-foreground/90 transition-all active:scale-[0.97]">
            <Mic className="w-4 h-4" />Let's talk
          </button>
          <button data-testid="button-type-instead" onClick={onType} className="flex items-center gap-2 text-muted-foreground font-medium text-[14px] px-6 py-3 rounded-full border border-border hover:border-foreground/30 hover:text-foreground/80 transition-all active:scale-[0.97]">
            I'll type instead<ChevronRight className="w-4 h-4" />
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
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-[#F0EDE7] dark:bg-background px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
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
        <motion.button data-testid="button-mic" onClick={handleMic} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${listening ? "bg-[#FF553E] shadow-[0_0_40px_rgba(255,85,62,0.4)]" : "bg-foreground/10 border border-border hover:bg-foreground/15"}`} whileTap={{ scale: 0.93 }}>
          {listening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
        </motion.button>
        <p className="text-muted-foreground/60 text-[12px]">{listening ? "Tap to stop" : "Tap to speak"}</p>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <DotTrail current={current} total={questions.length} />
        <button data-testid="button-do-later-voice" onClick={onReset} className="text-muted-foreground/50 text-[12px] hover:text-muted-foreground transition-colors">I'll do it later</button>
      </div>
    </motion.div>
  );
}

// ── Type room ──────────────────────────────────────────────────────────────
function TypeRoom({ onDone, onReset }: { onDone: () => void; onReset: () => void }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); setInput(""); }, [current]);

  const advance = () => {
    if (!input.trim()) return;
    const next = current + 1;
    next >= questions.length ? onDone() : setCurrent(next);
  };

  return (
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-[#F0EDE7] dark:bg-background px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-[#FF553E]/6 blur-[120px]" />
      </div>
      <div />
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-10 w-full">
        <AnimatePresence mode="wait">
          <motion.p key={current} className="text-foreground text-[22px] font-medium leading-snug tracking-tight" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: "easeOut" }}>
            {questions[current]}
          </motion.p>
        </AnimatePresence>
        <div className="w-full flex items-center gap-3">
          <input ref={inputRef} data-testid="input-answer" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && advance()} placeholder="Type your answer…" className="flex-1 bg-foreground/5 border border-border rounded-2xl px-5 py-4 text-foreground text-[15px] placeholder:text-muted-foreground/50 outline-none focus:border-foreground/25 transition-colors" />
          <motion.button data-testid="button-next" onClick={advance} disabled={!input.trim()} className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center disabled:opacity-25 transition-opacity flex-shrink-0" whileTap={{ scale: 0.92 }}>
            <ArrowRight className="w-4 h-4 text-background" />
          </motion.button>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <DotTrail current={current} total={questions.length} />
        <button data-testid="button-do-later-type" onClick={onReset} className="text-muted-foreground/50 text-[12px] hover:text-muted-foreground transition-colors">I'll do it later</button>
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

// ── Thinking components ────────────────────────────────────────────────────
function ThoughtLine({ text, delay, dim }: { text: string; delay: number; dim?: boolean }) {
  return (
    <motion.div className={`flex items-start gap-2 text-[13px] leading-relaxed font-mono ${dim ? "text-muted-foreground/40" : "text-muted-foreground"}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.35, ease: "easeOut" }}>
      <span className="text-foreground/20 mt-0.5 flex-shrink-0">›</span>
      <span>{text}</span>
    </motion.div>
  );
}

type PlatformStatus = "waiting" | "scraping" | "done";

function PlatformCard({ logo, name, status, count, delay }: { logo: React.ReactNode; name: string; status: PlatformStatus; count?: number; delay: number }) {
  return (
    <motion.div className="flex-1 min-w-0 border border-black/8 dark:border-border rounded-2xl p-4 flex flex-col gap-3 bg-white dark:bg-muted/30" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className="flex items-center gap-2">
        {logo}
        <span className="text-foreground/70 text-[13px] font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {status === "waiting" && <span className="text-muted-foreground/50 text-[12px]">Queued</span>}
        {status === "scraping" && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[3px]">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-1 h-1 rounded-full bg-[#FF553E]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
            <span className="text-[#FF553E] text-[12px]">Scraping…</span>
          </div>
        )}
        {status === "done" && (
          <motion.div className="flex items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.4 }} />
            <span className="text-emerald-500 text-[12px]">{count} roles found</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Thinking screen ────────────────────────────────────────────────────────
function ThinkingScreen({ onComplete }: { onComplete: () => void }) {
  const thoughts = [
    { text: "Reading your answers…", delay: 0.3 },
    { text: "Remote-first preference detected.", delay: 0.85 },
    { text: "Filtering for full-time, senior-level roles.", delay: 1.4 },
    { text: "Excluding agency & contract-only listings.", delay: 1.95 },
    { text: "Weighting for culture fit over title match.", delay: 2.5 },
    { text: "Cross-referencing with your portfolio strengths.", delay: 3.1 },
    { text: "Ranking by alignment score…", delay: 3.7 },
  ];

  const [liStatus, setLiStatus] = useState<PlatformStatus>("waiting");
  const [liCount, setLiCount] = useState<number | undefined>();
  const [indeedStatus, setIndeedStatus] = useState<PlatformStatus>("waiting");
  const [indeedCount, setIndeedCount] = useState<number | undefined>();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setLiStatus("scraping"), 1800);
    const t2 = setTimeout(() => { setLiStatus("done"); setLiCount(214); }, 4200);
    const t3 = setTimeout(() => setIndeedStatus("scraping"), 3000);
    const t4 = setTimeout(() => { setIndeedStatus("done"); setIndeedCount(178); }, 5400);
    const t5 = setTimeout(() => onComplete(), 7200);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F0EDE7] dark:bg-background px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-[#FF553E]/7 blur-[130px]" />
      </div>
      <div className="relative z-10 w-full max-w-md flex flex-col gap-5">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex gap-[5px] items-center">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FF553E]" animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }} />
            ))}
          </div>
          <h2 className="text-foreground text-[17px] font-semibold tracking-tight">Got it. We're on it.</h2>
        </motion.div>

        <motion.div className="border border-black/8 dark:border-border rounded-2xl overflow-hidden bg-white dark:bg-muted/20" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <button onClick={() => setIsExpanded((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 border-b border-black/8 dark:border-border hover:bg-black/[0.03] dark:hover:bg-muted/30 transition-colors" data-testid="button-thinking-toggle">
            <div className="flex items-center gap-2">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }} />
              <span className="text-muted-foreground text-[12px] font-medium tracking-wide uppercase">Thinking</span>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.25 }} className="text-foreground/20">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div className="px-4 py-3 flex flex-col gap-2" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                {thoughts.map((t, i) => <ThoughtLine key={i} text={t.text} delay={t.delay} dim={i < thoughts.length - 2} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <PlatformCard logo={<LinkedInLogo size={22} />} name="LinkedIn" status={liStatus} count={liCount} delay={0.4} />
          <PlatformCard logo={<IndeedLogo size={22} />} name="Indeed" status={indeedStatus} count={indeedCount} delay={0.55} />
        </motion.div>

        <motion.p className="text-muted-foreground/50 text-[12px] text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
          Matching roles to your portfolio and preferences
        </motion.p>
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

// ── Mock interview room ────────────────────────────────────────────────────
const ANAM_API_KEY = "MTI0ZDNkNjctYjQ0ZS00ZjMzLWJmOTAtYjViZWJjYzdmNWM5OllrU0hvQXVNRkI0TFZQMVMrdXdXbWZoMUY5UGxUQzAzNkExWHlTd213V0E9";

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

        const client = unsafe_createClientWithApiKey(ANAM_API_KEY, {
          personaId: "cedce154-128d-4814-ba32-3d79c6a8fedd",
          name: "Kevin",
          avatarId: "ccf00c0e-7302-455b-ace2-057e0cf58127",
          voiceId: "13ba97ac-88e3-454f-8a49-6f9479dd4586",
          systemPrompt: `You are Kevin, a warm and professional UX interviewer at ${job.company} interviewing a candidate for the role of ${job.role}. Run the session in three phases, moving naturally from one to the next:

Phase 1 — Introductions: Introduce yourself briefly, then invite the candidate to introduce themselves. Ask a follow-up question about their background or what drew them to UX design. Keep it conversational, not interrogative.

Phase 2 — Experience deep-dive: Ask one focused question about a past project — something that reveals how they think about users, constraints, and decisions. Listen and respond naturally to what they share.

Phase 3 — UX whiteboarding challenge: Present a realistic design challenge relevant to ${job.role} work (e.g. "Redesign the airport security experience for first-time travellers" or "Design a feature that helps remote teams build trust"). Walk them through it like a real whiteboard session — ask about their approach, how they'd define the problem, who the users are, what constraints matter, and what the key design decisions would be. Prompt them to think out loud. Give light, encouraging reactions to keep the energy up.

Keep all responses concise and spoken-word natural. One question or prompt at a time. Never list multiple questions at once.`,
        });
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

// ── Job detail sheet ───────────────────────────────────────────────────────
function JobDetailSheet({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  const lastJobRef = useRef<Job | null>(null);
  if (job) lastJobRef.current = job;
  const displayJob = job ?? lastJobRef.current;
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
        <div className="flex-1 overflow-y-auto">
          {/* Company hero */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-start justify-between gap-3">
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
              <div className="flex flex-col items-center flex-shrink-0">
                <Gauge
                  value={displayJob.match}
                  size={48}
                  strokeWidth={8}
                  gapPercent={3}
                  primary="success"
                  secondary="rgba(0,0,0,0.06)"
                  showValue={true}
                  showPercentage={false}
                  className={{ textClassName: "fill-emerald-600 dark:fill-emerald-400" }}
                />
                <span className="text-sm text-foreground/40 mt-0.5">match</span>
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

              {/* AI Agent */}
              <div className="pt-1">
                <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.07] overflow-hidden bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.03] dark:to-transparent">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 pt-3.5 pb-3">
                    <div className="w-5 h-5 rounded-md bg-foreground/[0.08] flex items-center justify-center">
                      <Sparkles className="w-3 h-3 fill-foreground/50 text-foreground/50" />
                    </div>
                    <span className="text-[12px] font-semibold text-foreground/65 tracking-tight">AI Agent</span>
                    <span className="ml-auto text-[10px] font-medium text-foreground/30 bg-foreground/[0.05] rounded-full px-2 py-0.5">3 actions</span>
                  </div>

                  {/* Featured action */}
                  <div className="h-px bg-black/[0.05] dark:bg-white/[0.05]" />
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group text-left">
                    <div className="w-9 h-9 rounded-xl bg-foreground/[0.08] group-hover:bg-foreground/[0.11] transition-colors flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-foreground/55" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-foreground/80 leading-none">Customize Your Resume</div>
                      <div className="text-[11px] text-foreground/40 mt-1 leading-snug">AI rewrites your CV to match this role's exact requirements</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/45 transition-colors flex-shrink-0" />
                  </button>

                  {/* Two secondary actions */}
                  <div className="h-px bg-black/[0.05] dark:bg-white/[0.05]" />
                  <div className="grid grid-cols-2 divide-x divide-black/[0.05] dark:divide-white/[0.05]">
                    <button className="flex items-start gap-2.5 px-4 py-3.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group text-left">
                      <PenLine className="w-3.5 h-3.5 text-foreground/35 flex-shrink-0 mt-0.5 group-hover:text-foreground/55 transition-colors" />
                      <div>
                        <div className="text-[12px] font-semibold text-foreground/70 leading-none">Cover Letter</div>
                        <div className="text-[10px] text-foreground/35 mt-1 leading-snug">Drafted in seconds</div>
                      </div>
                    </button>
                    <button className="flex items-start gap-2.5 px-4 py-3.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group text-left">
                      <ThumbsUp className="w-3.5 h-3.5 text-foreground/35 flex-shrink-0 mt-0.5 group-hover:text-foreground/55 transition-colors" />
                      <div>
                        <div className="text-[12px] font-semibold text-foreground/70 leading-none">Fit Analysis</div>
                        <div className="text-[10px] text-foreground/35 mt-1 leading-snug">Strengths & gaps</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Connections — full-width, no card stacking */}
              <div className="pt-1">
                {/* Section label + tip */}
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/35">Insider connections</span>
                  <span className="text-[11px] text-foreground/35">Email gets <span className="font-medium text-foreground/50">3× more replies</span></span>
                </div>
                {/* Hairline */}
                <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-0" />
                {/* Contact list — separator between items */}
                {(displayJob.contacts ?? []).map((c, i) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-foreground/[0.08] flex items-center justify-center text-[10px] font-semibold text-foreground/50 flex-shrink-0">
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-foreground/80 leading-none">{c.name}</div>
                          <div className="text-[11px] text-foreground/35 mt-0.5">{displayJob.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={`mailto:${c.name.toLowerCase().replace(" ", ".")}@${displayJob.company.toLowerCase()}.com`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium text-foreground/50 hover:text-foreground/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all"
                          title={`Email ${c.name}`}
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </a>
                        <a
                          href={`https://linkedin.com/in/${c.name.toLowerCase().replace(" ", "-")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium text-foreground/50 hover:text-[#0077B5] hover:bg-[#0077B5]/[0.07] transition-all"
                          title={`${c.name} on LinkedIn`}
                        >
                          <FaLinkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      </div>
                    </div>
                    {i < (displayJob.contacts ?? []).length - 1 && (
                      <div className="h-px bg-black/[0.04] dark:bg-white/[0.04]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI reason */}
            <MatchGlowCard reason={displayJob.reason} className="mt-4" />
          </div>

          {/* Description */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-foreground/40 uppercase tracking-widest mb-3">About the role</h3>
            {displayJob.description.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-foreground/75 leading-[1.7] mb-3 last:mb-0">{para}</p>
            ))}
          </div>

          {/* Requirements */}
          <div className="px-5 py-5 pb-8">
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
function JobCard({ job, onShortlist, onOpen, onMockInterview, onAskScout }: { job: Job; onShortlist?: () => void; onOpen?: () => void; onMockInterview?: () => void; onAskScout?: () => void }) {
  const [dismissOpen, setDismissOpen] = useState(false);
  const dismissRef = useRef<HTMLDivElement>(null);

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
      className="flex flex-col gap-3 p-3 rounded-lg border border-black/[0.06] bg-white dark:bg-background dark:border-border select-none"
    >
      {/* Row 1: Title */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
        className="text-[15px] font-semibold text-foreground leading-snug text-left hover:text-foreground/60 transition-colors cursor-pointer"
      >
        {job.role}
      </button>

      {/* Row 2: Pills */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/55 bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-1.5 py-0.5 whitespace-nowrap">
          <Briefcase className="w-2.5 h-2.5 flex-shrink-0" />
          {job.type}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/55 bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-1.5 py-0.5 whitespace-nowrap">
          <Monitor className="w-2.5 h-2.5 flex-shrink-0" />
          {job.workMode}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/55 bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-1.5 py-0.5 whitespace-nowrap">
          <Clock className="w-2.5 h-2.5 flex-shrink-0" />
          {job.yearsExp}
        </span>
      </div>

      {/* Row 3: Company + gauge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
            style={{ backgroundColor: job.logoColor }}
          >
            {job.logoLetter}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-foreground/70 truncate">{job.company}</div>
            <div className="text-[12px] text-foreground/40 truncate">{job.location}</div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center">
          <Gauge
            value={job.match}
            size={42}
            strokeWidth={8}
            gapPercent={3}
            primary="success"
            secondary="rgba(0,0,0,0.06)"
            showValue={true}
            showPercentage={false}
            transition={{ delay: 200 }}
            className={{ textClassName: "fill-emerald-600 dark:fill-emerald-400" }}
          />
        </div>
      </div>

      {/* Row 4: Dismiss + Shortlist buttons — only shown in AI Picks */}
      {onShortlist && (
        <div className="flex items-center gap-1.5">
          {/* Dismiss button with dropdown */}
          <div className="relative flex-shrink-0" ref={dismissRef}>
            <button
              data-testid={`button-dismiss-${job.id}`}
              onClick={(e) => { e.stopPropagation(); setDismissOpen(v => !v); }}
              className="flex items-center justify-center w-8 h-8 text-foreground/40 bg-black/[0.04] hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 rounded-md transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
            {dismissOpen && (
              <div className="absolute bottom-full left-0 mb-1.5 bg-white dark:bg-card rounded-lg shadow-lg border border-black/[0.08] dark:border-border py-1 min-w-[148px] z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); setDismissOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-foreground/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                >
                  Already applied
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDismissOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-foreground/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                >
                  Not Interested
                </button>
              </div>
            )}
          </div>

          {/* Shortlist button — improved hover */}
          <button
            data-testid={`button-shortlist-${job.id}`}
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="flex items-center justify-center gap-1.5 flex-1 text-[12px] font-semibold text-foreground/50 bg-black/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] rounded-md px-2 py-2 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Shortlist
          </button>
        </div>
      )}

      {/* Mock interview button — only shown in Interview column */}
      {onMockInterview && (
        <button
          data-testid={`button-mock-interview-${job.id}`}
          onClick={(e) => { e.stopPropagation(); onMockInterview(); }}
          className="flex items-center justify-center gap-1.5 w-full text-[12px] font-semibold text-foreground/60 bg-black/[0.04] hover:bg-black/[0.08] rounded-md px-2 py-2 transition-colors"
        >
          <Clapperboard className="w-3.5 h-3.5" />
          Take mock interview
        </button>
      )}

      {/* Ask Scout button — always visible */}
      {onAskScout && (
        <button
          data-testid={`button-ask-scout-${job.id}`}
          onClick={(e) => { e.stopPropagation(); onAskScout(); }}
          className="orb-activates-on-hover flex items-center justify-center w-full text-[12px] font-semibold text-foreground/65 hover:text-foreground/90 bg-black/[0.04] hover:bg-black/[0.08] rounded-full py-1.5"
        >
          <ColorOrb dimension="14px" spinDuration={8} />
          Ask Scout
        </button>
      )}
    </div>
  );
}

// ── Scout chat ─────────────────────────────────────────────────────────────
const SCOUT_SUGGESTIONS = [
  "Tell me why this job is a good fit for me.",
  "Give me resume tips to apply here.",
  "What's the culture like at this company?",
  "Show me similar roles I might like.",
];

const SCOUT_RESPONSES: Record<string, string> = {
  "Tell me why this job is a good fit for me.": "Based on your senior-level background and preference for remote-first environments, this role aligns well. The scope of ownership and design system work matches your experience and career goals closely.",
  "Give me resume tips to apply here.": "Highlight end-to-end design ownership, design system contributions, and close collaboration with engineering. Tailor your summary to emphasize the product areas most relevant to this company's focus.",
  "What's the culture like at this company?": "This company is known for a high craft bar and a strong design culture. Teams are small and move fast, with designers having real influence over product direction — not just execution.",
  "Show me similar roles I might like.": "Based on this role's profile, you might also enjoy similar positions at Notion, Linear, Vercel, or Figma — all share a design-first culture with remote or hybrid flexibility.",
};

interface ChatMsg { role: "ai" | "user"; text: string; }

function ScoutChat({ job, onClose }: { job: Job; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: `I see you're asking about the ${job.role} role at ${job.company}. What would you like to know?` },
  ]);
  const [input, setInput] = useState("");
  const [suggestionsGone, setSuggestionsGone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const response = SCOUT_RESPONSES[text] ?? "Great question. Based on this role and your profile, I'd look at how your past work maps to their requirements — especially any areas where you've driven end-to-end design decisions.";
    setMessages(prev => [
      ...prev,
      { role: "user", text },
      { role: "ai", text: response },
    ]);
    setSuggestionsGone(true);
    setInput("");
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-4 right-4 w-[340px] bg-white dark:bg-card rounded-2xl shadow-2xl border border-black/[0.08] dark:border-border flex flex-col z-[200]"
      style={{ maxHeight: "520px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] dark:border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-foreground" />
          <span className="text-[14px] font-semibold text-foreground">Scout</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-md text-foreground/40 hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`text-[13px] leading-relaxed rounded-xl px-3 py-2 max-w-[88%] ${
              msg.role === "user"
                ? "bg-foreground text-background"
                : "bg-black/[0.04] dark:bg-white/[0.06] text-foreground/80"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {!suggestionsGone && (
          <div className="space-y-1.5 pt-0.5">
            {SCOUT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-[12px] text-foreground/70 border border-black/[0.10] dark:border-border rounded-lg px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-2"
              >
                <span>{s}</span>
                <ArrowUpCircle className="w-3.5 h-3.5 flex-shrink-0 text-foreground/30" />
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-black/[0.06] dark:border-border flex-shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(input); }}
          placeholder="Ask me anything..."
          className="flex-1 text-[13px] text-foreground placeholder:text-foreground/30 bg-transparent outline-none py-1"
        />
        <button
          onClick={() => send(input)}
          className="flex items-center justify-center w-7 h-7 rounded-full border border-black/[0.12] dark:border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors flex-shrink-0"
        >
          <ArrowUpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>,
    document.body
  );
}

// ── Pipeline column ────────────────────────────────────────────────────────
function PipelineCol({ colId, jobs, onShortlist, onOpenJob, onMockInterview, onAskScout, colIndex = 0 }: { colId: string; jobs: Job[]; onShortlist: (id: string) => void; onOpenJob: (id: string) => void; onMockInterview: (id: string) => void; onAskScout: (id: string) => void; colIndex?: number }) {
  const isPicks = colId === "picks";
  const isInterview = colId === "interview";

  const cardList = (
    <AnimatePresence mode="popLayout" initial={false}>
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          layout
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, x: 64, scale: 0.93, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ layout: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }, duration: 0.28, ease: "easeOut" }}
        >
          <KanbanItem value={job.id} className="rounded-lg">
            <KanbanItemHandle className="w-full rounded-lg">
              <JobCard job={job} onShortlist={isPicks ? () => onShortlist(job.id) : undefined} onOpen={() => onOpenJob(job.id)} onMockInterview={isInterview ? () => onMockInterview(job.id) : undefined} onAskScout={() => onAskScout(job.id)} />
            </KanbanItemHandle>
          </KanbanItem>
        </motion.div>
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

  if (isPicks) {
    return (
      <KanbanColumn value={colId} className="flex flex-col min-w-[350px] flex-1 rounded-xl bg-[#EAE6DF] dark:bg-card border border-[#DDD8D0] dark:border-border overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-3 pb-1 flex-shrink-0 select-none">
          <span className="text-[13px] font-semibold text-foreground/80">{COL_LABELS[colId]}</span>
          {jobs.length > 0 && (
            <span className="text-[11px] text-foreground/40 bg-black/8 rounded-full px-1.5 py-0.5 leading-none">{jobs.length}</span>
          )}
        </div>
        <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto scrollbar-hide px-2 pt-2 pb-3 min-h-[60px]">
          {cardList}
        </KanbanColumnContent>
      </KanbanColumn>
    );
  }

  return (
    <KanbanColumn value={colId} className="flex flex-col min-w-[350px] flex-1 rounded-xl bg-[#E8E4DD] dark:bg-card border border-[#DDD8D0] dark:border-border overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-1 flex-shrink-0 select-none">
        <span className="text-[13px] font-semibold text-foreground/80">{COL_LABELS[colId]}</span>
        {jobs.length > 0 && (
          <span className="text-[11px] text-foreground/40 bg-black/8 rounded-full px-1.5 py-0.5 leading-none">{jobs.length}</span>
        )}
      </div>
      <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto scrollbar-hide px-2 pt-2 pb-3 min-h-[60px]">
        {cardList}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
  const [columns, setColumns] = useState<Record<string, Job[]>>(INITIAL_COLUMNS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [interviewJobId, setInterviewJobId] = useState<string | null>(null);
  const [roomJobId, setRoomJobId] = useState<string | null>(null);
  const [scoutJobId, setScoutJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "split">("list");

  const allJobs = Object.values(columns).flat();
  const findJob = (id: string) => allJobs.find((j) => j.id === id);

  const selectedJob = selectedJobId ? allJobs.find((j) => j.id === selectedJobId) ?? null : null;
  const interviewJob = interviewJobId ? allJobs.find((j) => j.id === interviewJobId) ?? null : null;
  const roomJob = roomJobId ? allJobs.find((j) => j.id === roomJobId) ?? null : null;
  const scoutJob = scoutJobId ? allJobs.find((j) => j.id === scoutJobId) ?? null : null;

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
    if (viewMode === "list") setViewMode("split");
  }, [viewMode]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col bg-[#F0EDE7] dark:bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top filter bar — single row */}
      <div className="flex items-center gap-2 flex-shrink-0 pl-[108px] pr-4 mt-6 mb-2">
        {/* Prompt pill — left-anchored with avatar */}
        <div className="flex items-center gap-2.5 bg-white dark:bg-card border border-black/8 dark:border-border rounded-full pl-1.5 pr-4 h-9 text-sm text-foreground min-w-0 max-w-[380px] select-none">
          <Avatar className="w-6 h-6 flex-shrink-0 border border-black/10 dark:border-white/10">
            <AvatarImage src={profileImg} alt="Profile" />
            <AvatarFallback className="text-[10px]">MB</AvatarFallback>
          </Avatar>
          <span className="truncate">Software engineers · remote-first · senior-level</span>
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

      {/* Single always-mounted kanban board — AI Picks stays, others reveal */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <Kanban value={columns} onValueChange={setColumns} getItemValue={(job: Job) => job.id} className="h-full">
          <KanbanBoard className="flex h-full pt-4 pr-4 pb-4 pl-[108px]">

            {/* AI Picks — always visible, fills width until other columns appear */}
            <div className="flex-1 min-w-[350px] h-full">
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

            {/* Other pipeline columns — clip-reveal from right, staggered */}
            {COL_ORDER.filter(c => c !== "picks").map((colId, i) => (
              <motion.div
                key={colId}
                className="overflow-hidden flex-shrink-0 h-full"
                initial={{ maxWidth: 0, opacity: 0 }}
                animate={{
                  maxWidth: viewMode === "split" ? 362 : 0,
                  opacity: viewMode === "split" ? 1 : 0,
                }}
                transition={{
                  maxWidth: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: viewMode === "split" ? i * 0.12 : 0 },
                  opacity:  { duration: 0.45, ease: "easeOut",          delay: viewMode === "split" ? i * 0.12 + 0.12 : 0 },
                }}
              >
                {/* inner div at fixed width so content never squishes */}
                <div className="w-[350px] ml-3 h-full">
                  <PipelineCol
                    colId={colId}
                    colIndex={i + 1}
                    jobs={columns[colId] ?? []}
                    onShortlist={handleShortlist}
                    onOpenJob={setSelectedJobId}
                    onMockInterview={setInterviewJobId}
                    onAskScout={setScoutJobId}
                  />
                </div>
              </motion.div>
            ))}

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

      <JobDetailSheet job={selectedJob} open={!!selectedJobId} onClose={() => setSelectedJobId(null)} />
      <MockInterviewDialog
        job={interviewJob}
        open={!!interviewJobId}
        onClose={() => setInterviewJobId(null)}
        onStart={() => { setRoomJobId(interviewJobId); setInterviewJobId(null); }}
      />

      {createPortal(
        <AnimatePresence>
          {roomJob && (
            <MockInterviewRoom key={roomJob.id} job={roomJob} onEnd={() => setRoomJobId(null)} />
          )}
          {scoutJob && (
            <ScoutChat key={scoutJob.id} job={scoutJob} onClose={() => setScoutJobId(null)} />
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
          <TransitionScreen key="transition" onVoice={() => setPhase("voice")} onType={() => setPhase("type")} />
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
