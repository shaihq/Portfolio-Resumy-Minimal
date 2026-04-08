import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, ChevronRight, SlidersHorizontal, Sparkles, Bookmark, X, MapPin, Briefcase, Building2, ExternalLink } from "lucide-react";
import { Gauge } from "@/components/ui/gauge-1";
import profileImg from "@/assets/images/profile.png";
import {
  Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent,
  KanbanItem, KanbanItemHandle, KanbanOverlay,
} from "@/components/ui/kanban";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Phase = "transition" | "voice" | "type" | "done" | "dashboard";

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
  location: string;
  description: string;
  requirements: string[];
}

const BASE_JOBS: Job[] = [
  {
    id: "1", company: "Linear", role: "Senior Product Designer", match: 96, reason: "Remote-first, full ownership, design system scope",
    logoColor: "#5E6AD2", logoLetter: "L", source: "linkedin", type: "Full-Time", workMode: "Remote", location: "San Francisco, CA",
    description: "We're looking for a Senior Product Designer to help shape the future of software project management. At Linear, design is a core part of how we build — you'll work directly with engineers and product leads to craft experiences that millions of developers and teams rely on daily.\n\nYou'll own end-to-end design for key product areas, from early exploration to final polish. We care deeply about craft, clarity, and shipping work that actually moves the needle.",
    requirements: ["5+ years of product design experience at a B2B or developer-focused company", "Strong systems thinking — you've built or significantly contributed to a design system", "Fluency in interaction design, information architecture, and visual polish", "Comfortable working directly with engineers and reviewing implementation", "A portfolio that shows both breadth of thinking and depth of execution"],
  },
  {
    id: "2", company: "Vercel", role: "Product Designer", match: 91, reason: "Developer-led culture, design-code bridge, async",
    logoColor: "#171717", logoLetter: "V", source: "linkedin", type: "Full-Time", workMode: "Remote", location: "New York, NY",
    description: "Vercel is where the world's best frontend teams deploy their work. As a Product Designer, you'll sit at the intersection of developer tooling and consumer-grade UX — helping make complex infrastructure feel simple and powerful at once.\n\nYou'll collaborate with engineering and product management to define, design, and ship features across our dashboard, CLI, and onboarding flows. We move fast, write clearly, and care about the details.",
    requirements: ["3+ years designing developer tools, SaaS dashboards, or technical products", "Experience translating complex technical concepts into clear, intuitive UI", "Solid grasp of frontend fundamentals — HTML, CSS, component thinking", "Async-first work style with strong written communication", "Figma proficiency and experience collaborating closely with eng"],
  },
  {
    id: "3", company: "Notion", role: "Product Designer", match: 88, reason: "Content-first, collaborative, B2B/consumer overlap",
    logoColor: "#191919", logoLetter: "N", source: "indeed", type: "Full-Time", workMode: "Hybrid", location: "San Francisco, CA",
    description: "Notion's mission is to make it possible for everyone to shape the tools that shape their work. As a Product Designer, you'll help design the blocks, templates, and collaborative surfaces that millions of knowledge workers use every day.\n\nYou'll partner with cross-functional teams across our core editor, AI features, and enterprise product lines. The role is highly collaborative — we work in small teams and ship continuously.",
    requirements: ["4+ years of product design with a focus on consumer or prosumer software", "Strong portfolio demonstrating a mastery of interaction and visual design", "Experience designing for complex, state-heavy UI (editors, databases, or similar)", "Collaborative mindset — you run great critique and give useful feedback", "Bonus: experience designing AI-powered features or workflows"],
  },
  {
    id: "4", company: "Figma", role: "UX Designer", match: 85, reason: "Design community influence, tool ecosystem impact",
    logoColor: "#F24E1E", logoLetter: "F", source: "linkedin", type: "Full-Time", workMode: "On-site", location: "San Francisco, CA",
    description: "At Figma, we build the tools that designers use to build everything else. As a UX Designer, you'll work on the core product — including the canvas, multiplayer features, plugins, and components — alongside some of the sharpest design minds in the industry.\n\nThis is a role for someone who loves thinking about interaction models at a deep level and can articulate design decisions clearly across a large, cross-functional org.",
    requirements: ["3+ years of UX design experience with a strong portfolio", "Deep experience with complex, interaction-heavy applications", "Comfortable with design systems, component libraries, and design tokens", "Strong visual design sensibility and attention to typographic detail", "Ability to present work clearly and incorporate feedback constructively"],
  },
  {
    id: "5", company: "Loom", role: "Senior UX Designer", match: 82, reason: "Async-first, startup momentum, video-native product",
    logoColor: "#625DF5", logoLetter: "L", source: "indeed", type: "Full-Time", workMode: "Remote", location: "Austin, TX",
    description: "Loom helps teams communicate more clearly through video. As a Senior UX Designer, you'll own the experience across our record, watch, and share flows — making async video feel as effortless as sending a message.\n\nYou'll work in a nimble team, move quickly, and have real influence over product direction. We're growing fast and this role will shape how millions of remote workers communicate.",
    requirements: ["5+ years of UX design experience, ideally at a startup or high-growth company", "Experience with video, media, or communication products is a strong plus", "Able to run your own research — user interviews, usability tests, synthesis", "Strong visual design chops — you don't hand off wireframes, you ship polished work", "Remote-first mindset, comfortable with async collaboration across time zones"],
  },
  {
    id: "6", company: "Stripe", role: "Product Designer", match: 79, reason: "High craft bar, complex systems, strong fintech brand",
    logoColor: "#6772E5", logoLetter: "S", source: "linkedin", type: "Full-Time", workMode: "Hybrid", location: "Seattle, WA",
    description: "Stripe builds the economic infrastructure of the internet. As a Product Designer, you'll design mission-critical surfaces used by millions of businesses to accept payments, manage revenue, and run their finances.\n\nOur design bar is exceptionally high. You'll be expected to think in systems, write clearly, and obsess over the small details that make complex workflows feel manageable for a global developer audience.",
    requirements: ["4+ years of product design experience, ideally in fintech or developer tools", "Proven ability to design complex, multi-step workflows with clarity and precision", "Experience working with and contributing to large-scale design systems", "Strong written communication — Stripe is a writing-first culture", "Ability to navigate a large, collaborative org while maintaining design quality"],
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

// ── Job detail sheet ───────────────────────────────────────────────────────
function JobDetailSheet({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  if (!job) return null;
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()} modal={false}>
      <SheetContent
        className="border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-0 flex flex-col w-[420px] sm:max-w-[420px]"
        hasOverlay={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center justify-between m-0 space-y-0 h-[65px]">
          <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] font-medium m-0 truncate pr-4">{job.role}</SheetTitle>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Company hero */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
                  style={{ backgroundColor: job.logoColor }}
                >
                  {job.logoLetter}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-foreground">{job.company}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-[13px] text-foreground/50">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <Gauge
                  value={job.match}
                  size={48}
                  strokeWidth={8}
                  gapPercent={3}
                  primary="success"
                  secondary="rgba(0,0,0,0.06)"
                  showValue={true}
                  showPercentage={false}
                  className={{ textClassName: "fill-emerald-600 dark:fill-emerald-400" }}
                />
                <span className="text-[11px] text-foreground/40 mt-0.5">match</span>
              </div>
            </div>

            {/* Pills */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground/60 bg-black/[0.05] rounded-md px-2.5 py-1">
                <Briefcase className="w-3 h-3" />{job.type}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground/60 bg-black/[0.05] rounded-md px-2.5 py-1">
                <Building2 className="w-3 h-3" />{job.workMode}
              </span>
            </div>

            {/* AI reason */}
            <div className="mt-4 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Why it's a match</span>
              </div>
              <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">{job.reason}</p>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h3 className="text-[12px] font-semibold text-foreground/40 uppercase tracking-widest mb-3">About the role</h3>
            {job.description.split("\n\n").map((para, i) => (
              <p key={i} className="text-[14px] text-foreground/80 leading-[1.7] mb-3 last:mb-0">{para}</p>
            ))}
          </div>

          {/* Requirements */}
          <div className="px-5 py-5 pb-8">
            <h3 className="text-[12px] font-semibold text-foreground/40 uppercase tracking-widest mb-3">Requirements</h3>
            <ul className="space-y-2.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground/80 leading-[1.6]">
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
            data-testid={`button-apply-${job.id}`}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[14px] font-medium hover:opacity-80 transition-opacity"
          >
            Apply on {job.source === "linkedin" ? "LinkedIn" : "Indeed"}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Job card (shared) ──────────────────────────────────────────────────────
function JobCard({ job, onShortlist, onOpen }: { job: Job; onShortlist?: () => void; onOpen?: () => void }) {
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
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[12px] font-medium text-foreground/60 bg-black/[0.05] rounded-md px-2 py-0.5">{job.type}</span>
        <span className="text-[12px] font-medium text-foreground/60 bg-black/[0.05] rounded-md px-2 py-0.5">{job.workMode}</span>
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

      {/* Row 4: Shortlist button — only shown in AI Picks */}
      {onShortlist && (
        <button
          data-testid={`button-shortlist-${job.id}`}
          onClick={(e) => { e.stopPropagation(); onShortlist(); }}
          className="flex items-center justify-center gap-1.5 w-full text-[12px] font-semibold text-foreground/50 bg-black/[0.04] hover:bg-black/[0.08] rounded-md px-2 py-2 transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5" />
          Shortlist
        </button>
      )}
    </div>
  );
}

// ── Pipeline column ────────────────────────────────────────────────────────
function PipelineCol({ colId, jobs, onShortlist, onOpenJob }: { colId: string; jobs: Job[]; onShortlist: (id: string) => void; onOpenJob: (id: string) => void }) {
  const isPicks = colId === "picks";

  const cardList = (
    <>
      {jobs.map((job) => (
        <motion.div key={job.id} layout transition={{ layout: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } }}>
          <KanbanItem value={job.id} className="rounded-lg">
            <KanbanItemHandle className="w-full rounded-lg">
              <JobCard job={job} onShortlist={isPicks ? () => onShortlist(job.id) : undefined} onOpen={() => onOpenJob(job.id)} />
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
    </>
  );

  if (isPicks) {
    return (
      <KanbanColumn value={colId} className="flex flex-col min-w-[220px] flex-1 rounded-xl bg-[#EAE6DF] dark:bg-card border border-[#DDD8D0] dark:border-border overflow-hidden">
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
    <KanbanColumn value={colId} className="flex flex-col min-w-[220px] flex-1 rounded-xl bg-[#E8E4DD] dark:bg-card border border-[#DDD8D0] dark:border-border overflow-hidden">
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

  const allJobs = Object.values(columns).flat();
  const findJob = (id: string) => allJobs.find((j) => j.id === id);
  const findColForJob = (id: string) =>
    Object.entries(columns).find(([, jobs]) => jobs.some((j) => j.id === id))?.[0];

  const selectedJob = selectedJobId ? allJobs.find((j) => j.id === selectedJobId) ?? null : null;

  const handleShortlist = useCallback((id: string) => {
    setColumns(prev => {
      const fromCol = Object.keys(prev).find(col => prev[col].some(j => j.id === id));
      if (!fromCol) return prev;
      const job = prev[fromCol].find(j => j.id === id)!;
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(j => j.id !== id),
        not_applied: [...prev.not_applied, job],
      };
    });
  }, []);

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

      {/* Flat kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <Kanban value={columns} onValueChange={setColumns} getItemValue={(job: Job) => job.id} className="h-full">
          <KanbanBoard className="flex gap-3 h-full pt-4 pr-4 pb-4 pl-[108px] min-w-max">
            {COL_ORDER.map((colId) => (
              <PipelineCol key={colId} colId={colId} jobs={columns[colId] ?? []} onShortlist={handleShortlist} onOpenJob={setSelectedJobId} />
            ))}
          </KanbanBoard>

          {/* Drag overlay — renders real card clone following the cursor */}
          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === "item") {
                const job = findJob(value as string);
                const colId = findColForJob(value as string);
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
    </motion.div>
  );
}

// ── Main Jobs page ─────────────────────────────────────────────────────────
export default function Jobs() {
  const [phase, setPhase] = useState<Phase>("transition");

  return (
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
        <ThinkingScreen key="done" onComplete={() => setPhase("dashboard")} />
      )}
      {phase === "dashboard" && (
        <Dashboard key="dashboard" />
      )}
    </AnimatePresence>
  );
}
