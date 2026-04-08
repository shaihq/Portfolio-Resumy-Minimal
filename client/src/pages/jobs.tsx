import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, ChevronRight, Pencil } from "lucide-react";
import {
  Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent,
  KanbanItem, KanbanItemHandle, KanbanOverlay,
} from "@/components/ui/kanban";

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
}

const BASE_JOBS: Job[] = [
  { id: "1", company: "Linear", role: "Senior Product Designer", match: 96, reason: "Remote-first, full ownership, design system scope", logoColor: "#5E6AD2", logoLetter: "L", source: "linkedin" },
  { id: "2", company: "Vercel", role: "Product Designer", match: 91, reason: "Developer-led culture, design-code bridge, async", logoColor: "#171717", logoLetter: "V", source: "linkedin" },
  { id: "3", company: "Notion", role: "Product Designer", match: 88, reason: "Content-first, collaborative, B2B/consumer overlap", logoColor: "#191919", logoLetter: "N", source: "indeed" },
  { id: "4", company: "Figma", role: "UX Designer", match: 85, reason: "Design community influence, tool ecosystem impact", logoColor: "#F24E1E", logoLetter: "F", source: "linkedin" },
  { id: "5", company: "Loom", role: "Senior UX Designer", match: 82, reason: "Async-first, startup momentum, video-native product", logoColor: "#625DF5", logoLetter: "L", source: "indeed" },
  { id: "6", company: "Stripe", role: "Product Designer", match: 79, reason: "High craft bar, complex systems, strong fintech brand", logoColor: "#6772E5", logoLetter: "S", source: "linkedin" },
];

const COL_ORDER = ["picks", "not_applied", "applied", "interview", "offer"];
const COL_LABELS: Record<string, string> = {
  picks: "AI Picks",
  not_applied: "Not Applied",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
};

// Light-mode pastel column colors (dark mode falls back to card token)
const COL_BG: Record<string, string> = {
  picks:       "bg-[#D9EEE6] dark:bg-card",
  not_applied: "bg-[#E8E4F4] dark:bg-card",
  applied:     "bg-[#E8F3DA] dark:bg-card",
  interview:   "bg-[#FBEEDD] dark:bg-card",
  offer:       "bg-[#DAE9F5] dark:bg-card",
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
      className="fixed inset-0 flex flex-col items-center justify-center bg-background px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/8 blur-[120px]" />
      </div>
      <motion.div className="relative z-10 max-w-md text-center space-y-6" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}>
        <motion.div className="flex justify-center mb-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <svg width="44" height="44" viewBox="0 0 37 37" fill="none">
            <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
            <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
          </svg>
        </motion.div>
        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">Your portfolio's ready.<br />Your resume's in.</h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-light">Now let's find work that actually fits.</p>
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
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-background px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px]" animate={{ backgroundColor: listening ? "rgba(255,85,62,0.12)" : "rgba(255,85,62,0.06)" }} transition={{ duration: 0.8 }} />
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
    <motion.div className="fixed inset-0 flex flex-col items-center justify-between bg-background px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/6 blur-[120px]" />
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
    <motion.div className="flex-1 min-w-0 border border-border rounded-2xl p-4 flex flex-col gap-3 bg-muted/30" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
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
    <motion.div className="fixed inset-0 flex flex-col items-center justify-center bg-background px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/7 blur-[130px]" />
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

        <motion.div className="border border-border rounded-2xl overflow-hidden bg-muted/20" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <button onClick={() => setIsExpanded((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors" data-testid="button-thinking-toggle">
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

// ── Job card (shared) ──────────────────────────────────────────────────────
function JobCard({ job, isPicks }: { job: Job; isPicks?: boolean }) {
  return (
    <div
      data-testid={`card-job-${job.id}`}
      className="flex flex-col gap-2 p-3 rounded-lg border border-black/[0.06] bg-white dark:bg-background dark:border-border select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
            style={{ backgroundColor: job.logoColor }}
          >
            {job.logoLetter}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-foreground leading-tight truncate">{job.role}</div>
            <div className="text-[11px] text-muted-foreground truncate">{job.company}</div>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0 pt-0.5">
          {job.match}%
        </span>
      </div>
      {isPicks && (
        <>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed pl-9 truncate">{job.reason}</p>
          <div className="pl-9">
            {job.source === "linkedin"
              ? <span className="inline-flex items-center gap-1 text-[10px] text-[#0A66C2] font-medium"><LinkedInLogo size={10} /> LinkedIn</span>
              : <span className="inline-flex items-center gap-1 text-[10px] text-[#003A9B] font-medium"><IndeedLogo size={10} /> Indeed</span>
            }
          </div>
        </>
      )}
    </div>
  );
}

// ── Pipeline column card ───────────────────────────────────────────────────
function PipelineCol({ colId, jobs }: { colId: string; jobs: Job[] }) {
  const isPicks = colId === "picks";
  return (
    <KanbanColumn
      value={colId}
      className={`rounded-xl flex flex-col min-w-[220px] flex-1 ${COL_BG[colId]}`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">{COL_LABELS[colId]}</span>
          {jobs.length > 0 && (
            <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 leading-none">
              {jobs.length}
            </span>
          )}
        </div>
        {isPicks && (
          <div className="flex items-center gap-1">
            <LinkedInLogo size={13} />
            <IndeedLogo size={13} />
          </div>
        )}
      </div>

      {/* Items */}
      <KanbanColumnContent value={colId} className="flex-1 overflow-y-auto px-2 pb-3 min-h-[60px]">
        {jobs.length === 0 && (
          <div className="flex items-center justify-center py-10 rounded-lg border border-dashed border-black/10 dark:border-border/50 mx-0.5">
            <p className="text-[11px] text-muted-foreground/40 text-center leading-relaxed">
              Drag a role here<br />to track it
            </p>
          </div>
        )}
        {jobs.map((job) => (
          <KanbanItem key={job.id} value={job.id} className="rounded-lg">
            <KanbanItemHandle className="w-full rounded-lg">
              <JobCard job={job} isPicks={isPicks} />
            </KanbanItemHandle>
          </KanbanItem>
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
  const [columns, setColumns] = useState<Record<string, Job[]>>(INITIAL_COLUMNS);

  const allJobs = Object.values(columns).flat();
  const findJob = (id: string) => allJobs.find((j) => j.id === id);
  const findColForJob = (id: string) =>
    Object.entries(columns).find(([, jobs]) => jobs.some((j) => j.id === id))?.[0];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col bg-[#F5F3EE] dark:bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top criteria bar */}
      <div className="flex-shrink-0 h-11 border-b border-black/[0.07] dark:border-border flex items-center gap-3 pl-[84px] pr-4">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground flex-1 min-w-0">
          <span className="font-medium text-foreground/60">Ranked by:</span>
          <span className="truncate">remote-preferred · ownership-hungry · stability-seeking</span>
        </div>
        <button data-testid="button-edit-criteria" className="flex-shrink-0 flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-3 h-3" />Edit
        </button>
      </div>

      {/* Flat kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <Kanban value={columns} onValueChange={setColumns} getItemValue={(job: Job) => job.id}>
          <KanbanBoard className="flex gap-3 h-full pt-4 pr-4 pb-4 pl-[108px] min-w-max">
            {COL_ORDER.map((colId) => (
              <PipelineCol key={colId} colId={colId} jobs={columns[colId] ?? []} />
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
                      <JobCard job={job} isPicks={colId === "picks"} />
                    </div>
                  );
                }
              }
              return <div className="rounded-xl bg-muted/60 border border-border w-full h-full" />;
            }}
          </KanbanOverlay>
        </Kanban>
      </div>
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
