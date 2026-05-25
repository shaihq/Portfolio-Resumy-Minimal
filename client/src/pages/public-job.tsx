import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useId, useEffect, useState, useRef, useCallback } from "react";
import {
  MapPin, Briefcase, Monitor, Clock, Calendar, ExternalLink,
  ArrowRight, Sparkles, Lock, X, CheckCircle2, Eye, EyeOff,
} from "lucide-react";
import { ColorOrb } from "@/components/ui/color-orb";
import { Folder } from "@/components/ui/folder";
import { cn } from "@/lib/utils";

// ── Shared job data ────────────────────────────────────────────────────────
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
  skills: string[];
  postedDate: string;
  contacts: { name: string; initials: string }[];
}

const ALL_JOBS: Job[] = [
  {
    id: "1", company: "Linear", role: "Senior Product Designer", match: 96, reason: "Remote-first, full ownership, design system scope",
    logoColor: "#5E6AD2", logoLetter: "L", source: "linkedin", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "San Francisco, CA",
    description: "We're looking for a Senior Product Designer to help shape the future of software project management. At Linear, design is a core part of how we build — you'll work directly with engineers and product leads to craft experiences that millions of developers and teams rely on daily.\n\nYou'll own end-to-end design for key product areas, from early exploration to final polish. We care deeply about craft, clarity, and shipping work that actually moves the needle.",
    requirements: ["5+ years of product design experience at a B2B or developer-focused company", "Strong systems thinking — you've built or significantly contributed to a design system", "Fluency in interaction design, information architecture, and visual polish", "Comfortable working directly with engineers and reviewing implementation", "A portfolio that shows both breadth of thinking and depth of execution"],
    skills: ["Figma", "Design Systems", "B2B", "Interaction Design", "Visual Design"],
    postedDate: "3 days ago", contacts: [{ name: "Sarah Chen", initials: "SC" }, { name: "Alex Park", initials: "AP" }],
  },
  {
    id: "2", company: "Vercel", role: "Product Designer", match: 91, reason: "Developer-led culture, design-code bridge, async",
    logoColor: "#171717", logoLetter: "V", source: "linkedin", type: "Full-Time", workMode: "Remote", yearsExp: "3+ yrs", location: "New York, NY",
    description: "Vercel is where the world's best frontend teams deploy their work. As a Product Designer, you'll sit at the intersection of developer tooling and consumer-grade UX — helping make complex infrastructure feel simple and powerful at once.\n\nYou'll collaborate with engineering and product management to define, design, and ship features across our dashboard, CLI, and onboarding flows. We move fast, write clearly, and care about the details.",
    requirements: ["3+ years designing developer tools, SaaS dashboards, or technical products", "Experience translating complex technical concepts into clear, intuitive UI", "Solid grasp of frontend fundamentals — HTML, CSS, component thinking", "Async-first work style with strong written communication", "Figma proficiency and experience collaborating closely with eng"],
    skills: ["Figma", "SaaS", "Developer Tools", "HTML/CSS", "Systems Design"],
    postedDate: "1 week ago", contacts: [{ name: "James Wu", initials: "JW" }, { name: "Priya Nair", initials: "PN" }],
  },
  {
    id: "3", company: "Notion", role: "Product Designer", match: 88, reason: "Content-first, collaborative, B2B/consumer overlap",
    logoColor: "#191919", logoLetter: "N", source: "indeed", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "San Francisco, CA",
    description: "Notion's mission is to make it possible for everyone to shape the tools that shape their work. As a Product Designer, you'll help design the blocks, templates, and collaborative surfaces that millions of knowledge workers use every day.\n\nYou'll partner with cross-functional teams across our core editor, AI features, and enterprise product lines. The role is highly collaborative — we work in small teams and ship continuously.",
    requirements: ["4+ years of product design with a focus on consumer or prosumer software", "Strong portfolio demonstrating a mastery of interaction and visual design", "Experience designing for complex, state-heavy UI (editors, databases, or similar)", "Collaborative mindset — you run great critique and give useful feedback", "Bonus: experience designing AI-powered features or workflows"],
    skills: ["Figma", "Interaction Design", "Visual Design", "AI Features", "Research"],
    postedDate: "2 weeks ago", contacts: [{ name: "Tom Baker", initials: "TB" }, { name: "Elena Costa", initials: "EC" }],
  },
  {
    id: "4", company: "Figma", role: "UX Designer", match: 85, reason: "Design community influence, tool ecosystem impact",
    logoColor: "#F24E1E", logoLetter: "F", source: "linkedin", type: "Full-Time", workMode: "On-site", yearsExp: "3+ yrs", location: "San Francisco, CA",
    description: "At Figma, we build the tools that designers use to build everything else. As a UX Designer, you'll work on the core product — including the canvas, multiplayer features, plugins, and components — alongside some of the sharpest design minds in the industry.\n\nThis is a role for someone who loves thinking about interaction models at a deep level and can articulate design decisions clearly across a large, cross-functional org.",
    requirements: ["3+ years of UX design experience with a strong portfolio", "Deep experience with complex, interaction-heavy applications", "Comfortable with design systems, component libraries, and design tokens", "Strong visual design sensibility and attention to typographic detail", "Ability to present work clearly and incorporate feedback constructively"],
    skills: ["Figma", "Design Systems", "Design Tokens", "UX Research", "Prototyping"],
    postedDate: "5 days ago", contacts: [{ name: "Chris Moon", initials: "CM" }, { name: "Dana Fox", initials: "DF" }],
  },
  {
    id: "5", company: "Loom", role: "Senior UX Designer", match: 82, reason: "Async-first, startup momentum, video-native product",
    logoColor: "#625DF5", logoLetter: "L", source: "indeed", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "Austin, TX",
    description: "Loom helps teams communicate more clearly through video. As a Senior UX Designer, you'll own the experience across our record, watch, and share flows — making async video feel as effortless as sending a message.\n\nYou'll work in a nimble team, move quickly, and have real influence over product direction. We're growing fast and this role will shape how millions of remote workers communicate.",
    requirements: ["5+ years of UX design experience, ideally at a startup or high-growth company", "Experience with video, media, or communication products is a strong plus", "Able to run your own research — user interviews, usability tests, synthesis", "Strong visual design chops — you don't hand off wireframes, you ship polished work", "Remote-first mindset, comfortable with async collaboration across time zones"],
    skills: ["UX Research", "Visual Design", "User Interviews", "Figma", "Async Collaboration"],
    postedDate: "1 week ago", contacts: [{ name: "Ryan Patel", initials: "RP" }],
  },
  {
    id: "6", company: "Stripe", role: "Product Designer", match: 79, reason: "High craft bar, complex systems, strong fintech brand",
    logoColor: "#6772E5", logoLetter: "S", source: "linkedin", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "Seattle, WA",
    description: "Stripe builds the economic infrastructure of the internet. As a Product Designer, you'll design mission-critical surfaces used by millions of businesses to accept payments, manage revenue, and run their finances.\n\nOur design bar is exceptionally high. You'll be expected to think in systems, write clearly, and obsess over the small details that make complex workflows feel manageable for a global developer audience.",
    requirements: ["4+ years of product design experience, ideally in fintech or developer tools", "Proven ability to design complex, multi-step workflows with clarity and precision", "Experience working with and contributing to large-scale design systems", "Strong written communication — Stripe is a writing-first culture", "Ability to navigate a large, collaborative org while maintaining design quality"],
    skills: ["Fintech", "Design Systems", "Complex Workflows", "Figma", "Written Communication"],
    postedDate: "3 weeks ago", contacts: [{ name: "Marcus Webb", initials: "MW" }, { name: "Anya Singh", initials: "AS" }],
  },
];

// ── Designfolio logo ───────────────────────────────────────────────────────
function DesignfolioLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
        <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
      </svg>
      <span className="text-[15px] font-semibold text-foreground tracking-tight">Designfolio</span>
    </div>
  );
}

// ── Property pill ──────────────────────────────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wide text-[#3D3630] dark:text-white/55 bg-[#EAE5DF] dark:bg-[#1F1C1C] rounded-md px-2.5 py-1 whitespace-nowrap">
      {children}
    </span>
  );
}

// ── Gauge geometry (same convention as bubble-button.tsx) ─────────────────
const GA0 = 240, GA1 = 120, GCX = 50, GCY = 52, GR = 34, GSW = 7;
const GVW = 100, GVH = 72;

function gpt(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: GCX + GR * Math.sin(r), y: GCY - GR * Math.cos(r) };
}
function garc(a1: number, a2: number) {
  const s = gpt(a1), e = gpt(a2);
  const sw = ((a2 - a1) + 360) % 360;
  if (sw < 0.1) return "";
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${GR} ${GR} 0 ${sw > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

// ── Score reveal gauge — arc filled to score, number blurred ──────────────
function ScoreRevealGauge({ score, isDark }: { score: number; isDark: boolean }) {
  const uid = useId().replace(/:/g, "");
  const trackPath = garc(GA0, GA1);
  const scoreFraction = score / 100;
  // Arc filled only up to the score position
  const scoreEndAngle = GA0 + scoreFraction * 240;
  const scorePath = garc(GA0, scoreEndAngle);
  const pointerDot = gpt(scoreEndAngle);
  const xL = gpt(GA0).x, xR = gpt(GA1).x;
  const trackColor = isDark ? "hsl(20,8%,18%)" : "rgba(215,210,203,0.85)";

  return (
    <svg
      viewBox={`0 0 ${GVW} ${GVH}`}
      width={GVW * 1.7}
      height={GVH * 1.7}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <linearGradient id={`rb-reveal-${uid}`} gradientUnits="userSpaceOnUse" x1={xL} y1="0" x2={xR} y2="0">
          <stop offset="0%"   stopColor="#ef4444" />
          <stop offset="28%"  stopColor="#f97316" />
          <stop offset="52%"  stopColor="#eab308" />
          <stop offset="78%"  stopColor="#84cc16" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id={`blur-score-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.8" />
        </filter>
        <filter id={`glow-dot-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track (grey) */}
      <path d={trackPath} fill="none" stroke={trackColor} strokeWidth={GSW} strokeLinecap="round" />

      {/* Filled arc up to score */}
      <motion.path
        d={scorePath}
        fill="none"
        stroke={`url(#rb-reveal-${uid})`}
        strokeWidth={GSW - 1}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />

      {/* Shine on filled arc */}
      <motion.path
        d={scorePath}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={(GSW - 1) * 0.45}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />

      {/* Pointer dot at score position */}
      <motion.circle
        cx={pointerDot.x}
        cy={pointerDot.y}
        r={GSW * 0.52}
        fill="white"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth={0.7}
        filter={`url(#glow-dot-${uid})`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.35, ease: "backOut" }}
      />

      {/* Blurred score number */}
      <motion.text
        x={GCX}
        y={GCY - 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isDark ? "rgba(240,237,232,0.9)" : "#1A1A1A"}
        fontSize="22"
        fontWeight="900"
        filter={`url(#blur-score-${uid})`}
        style={{ userSelect: "none", fontFamily: "inherit", letterSpacing: "-0.5px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.75, 1] }}
        transition={{ delay: 0.5, duration: 1.2, times: [0, 0.4, 0.7, 1] }}
      >
        {score}
      </motion.text>
    </svg>
  );
}

// ── "Your Score" — rainbow arc + ? + dot ──────────────────────────────────
function YourScoreGauge({ isDark }: { isDark: boolean }) {
  const uid = useId().replace(/:/g, "");
  const trackPath = garc(GA0, GA1);
  const topDot = gpt(0);
  const trackColor = isDark ? "hsl(20,8%,18%)" : "rgba(215,210,203,0.85)";
  const xL = gpt(GA0).x, xR = gpt(GA1).x;

  return (
    <svg viewBox={`0 0 ${GVW} ${GVH}`} width={GVW} height={GVH} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={`rb-${uid}`} gradientUnits="userSpaceOnUse" x1={xL} y1="0" x2={xR} y2="0">
          <stop offset="0%"   stopColor="#ef4444" />
          <stop offset="28%"  stopColor="#f97316" />
          <stop offset="52%"  stopColor="#eab308" />
          <stop offset="78%"  stopColor="#84cc16" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={trackPath} fill="none" stroke={trackColor} strokeWidth={GSW} strokeLinecap="round" />
      <motion.path
        d={trackPath} fill="none" stroke={`url(#rb-${uid})`} strokeWidth={GSW - 1} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
      <motion.path
        d={trackPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={(GSW - 1) * 0.5} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />
      <motion.circle
        cx={topDot.x} cy={topDot.y} r={GSW * 0.48} fill="white" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.3, ease: "backOut" }}
      />
      <motion.text
        x={GCX} y={GCY - 2} textAnchor="middle" dominantBaseline="middle"
        fill={isDark ? "rgba(240,237,232,0.85)" : "#1A1A1A"}
        fontSize="22" fontWeight="800"
        style={{ userSelect: "none", fontFamily: "inherit", letterSpacing: "-0.5px" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        ?
      </motion.text>
    </svg>
  );
}

// ── "Top Applicants" — grey flat arc + — ─────────────────────────────────
function TopApplicantsGauge({ isDark }: { isDark: boolean }) {
  const trackPath = garc(GA0, GA1);
  const trackColor = isDark ? "hsl(20,8%,22%)" : "rgba(215,210,203,0.85)";
  const dashColor  = isDark ? "hsl(20,8%,30%)" : "rgba(190,185,178,0.95)";

  return (
    <svg viewBox={`0 0 ${GVW} ${GVH}`} width={GVW} height={GVH} style={{ overflow: "visible", display: "block" }}>
      <path d={trackPath} fill="none" stroke={trackColor} strokeWidth={GSW} strokeLinecap="round" />
      <path d={trackPath} fill="none" stroke={dashColor} strokeWidth={GSW - 2} strokeLinecap="round" />
      <text
        x={GCX} y={GCY - 2} textAnchor="middle" dominantBaseline="middle"
        fill={isDark ? "rgba(240,237,232,0.25)" : "rgba(26,26,26,0.22)"}
        fontSize="22" fontWeight="700"
        style={{ userSelect: "none", fontFamily: "inherit" }}
      >
        —
      </text>
    </svg>
  );
}

// ── Boost card (right sidebar) ─────────────────────────────────────────────
function BoostCard({ job, onCta, isDark }: { job: Job; onCta: () => void; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 lg:sticky lg:top-[74px]"
    >
      <div className="flex items-start justify-between gap-2 mb-5">
        <h3 className="text-[14px] font-semibold text-foreground leading-snug">Boost your interview chances</h3>
        <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20 rounded-full px-2 py-0.5 mt-0.5">
          FREE
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 mb-4 px-0.5">
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <YourScoreGauge isDark={isDark} />
          <span className="text-[11px] text-foreground/50 font-medium tracking-tight">Your Score</span>
        </div>
        <div className="flex items-center gap-[2px] opacity-20 mb-6 flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <svg key={i} width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                className="text-foreground" />
            </svg>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <TopApplicantsGauge isDark={isDark} />
          <span className="text-[11px] text-foreground/50 font-medium tracking-tight">Top Applicants</span>
        </div>
      </div>

      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-4" />

      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Lock className="w-3 h-3 text-foreground/35" />
          <span className="text-[11px] font-semibold text-foreground/50 uppercase tracking-widest">Must-Have Skills</span>
        </div>
        <div className="relative">
          <div className="flex flex-wrap gap-1.5 select-none pointer-events-none" style={{ filter: "blur(4px)" }}>
            {job.skills.map((s) => (
              <span key={s} className="inline-flex items-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wide text-[#3D3630] dark:text-white/55 bg-[#EAE5DF] dark:bg-[#1F1C1C] rounded-md px-2 py-1 whitespace-nowrap">
                {s}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onCta}
              className="flex items-center gap-1.5 bg-white/70 dark:bg-[#28231E]/80 backdrop-blur-[2px] rounded-lg px-3 py-1.5 border border-black/[0.06] dark:border-white/[0.07] hover:bg-white/90 dark:hover:bg-[#28231E]/95 transition-colors"
            >
              <Lock className="w-3 h-3 text-foreground/50" />
              <span className="text-[11px] font-semibold text-foreground/55">Sign up to unlock</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onCta}
        className="w-full flex items-center justify-center gap-2 h-10 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[13px] font-semibold hover:opacity-80 transition-opacity"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Find my Score
      </button>

      <p className="text-[11px] text-foreground/35 text-center mt-3 leading-relaxed">
        Connect your portfolio to see how you rank against top applicants.
      </p>
    </motion.div>
  );
}

// ── Not found ──────────────────────────────────────────────────────────────
function JobNotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-foreground/[0.06] flex items-center justify-center mx-auto mb-5">
          <Briefcase className="w-5 h-5 text-foreground/30" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Job not found</h1>
        <p className="text-sm text-foreground/50 leading-relaxed mb-6">This link may have expired or the job is no longer available.</p>
        <button
          onClick={() => navigate("/landing")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Go to Designfolio
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Score Modal ────────────────────────────────────────────────────────────
type ModalStage = "upload" | "processing" | "signup";

function ScoreModal({
  job,
  isDark,
  onClose,
  onComplete,
}: {
  job: Job;
  isDark: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<ModalStage>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [aiStatusIndex, setAiStatusIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiStatuses = [
    "Reading your resume...",
    "Extracting skills & experience...",
    "Checking fit for this role...",
    `Scoring against ${job.company}'s requirements...`,
  ];

  const handleFile = useCallback((file: File | undefined) => {
    if (!file || file.type !== "application/pdf") return;
    setStage("processing");
  }, []);

  useEffect(() => {
    if (stage !== "processing") return;
    setAiStatusIndex(0);
    const interval = setInterval(() => {
      setAiStatusIndex((i) => (i + 1) % aiStatuses.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "processing") return;
    const timer = setTimeout(() => setStage("signup"), 6200);
    return () => clearTimeout(timer);
  }, [stage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <motion.div
      key="score-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{
        backgroundColor: isDark ? "rgba(10,9,8,0.75)" : "rgba(29,27,26,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        key="score-modal-card"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[580px] rounded-3xl border border-[#E2E1DA] dark:border-white/10 bg-[#FDFCF8] dark:bg-[#1C1A19] shadow-2xl overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1D1B1A]/[0.06] dark:bg-white/[0.08] text-[#1D1B1A]/50 dark:text-foreground/50 hover:bg-[#1D1B1A]/[0.12] dark:hover:bg-white/[0.14] hover:text-[#1D1B1A] dark:hover:text-foreground transition-all duration-150"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>

        <div className="p-7 md:p-9">
          <AnimatePresence mode="wait">

            {/* ── Stage: Upload ── */}
            {stage === "upload" && (
              <motion.div
                key="stage-upload"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Job context badge */}
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: job.logoColor }}
                  >
                    {job.logoLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#1D1B1A]/40 dark:text-foreground/40 uppercase tracking-widest truncate">
                      {job.company} · {job.role}
                    </p>
                  </div>
                </div>

                <div className="mb-7">
                  <h2 className="text-[22px] font-bold text-[#1D1B1A] dark:text-foreground tracking-tight leading-tight mb-1.5">
                    See if you're a match
                  </h2>
                  <p className="text-[14px] text-[#1D1B1A]/55 dark:text-foreground/55 leading-relaxed">
                    Upload your resume and we'll instantly score how well you fit this role — for free.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Dropzone */}
                  <div
                    className={cn(
                      "group/dropzone w-full cursor-pointer flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 transition-all duration-200",
                      isDragging
                        ? "border-[#FF553E] bg-[#FF553E]/5"
                        : "border-[#1D1B1A]/20 dark:border-white/20 bg-[#1D1B1A]/[0.025] dark:bg-white/[0.04] hover:border-[#1D1B1A]/40 dark:hover:border-white/35 hover:bg-[#1D1B1A]/[0.04] dark:hover:bg-white/[0.06]"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <Folder isDragging={isDragging} />
                    <div className="text-center">
                      <p className={cn("text-[14px] font-semibold leading-none mb-1 transition-colors duration-200", isDragging ? "text-[#FF553E]" : "text-[#1D1B1A] dark:text-foreground")}>
                        {isDragging ? "Drop it here" : "Click to upload Resume"}
                      </p>
                      <p className="text-[12px] text-[#1D1B1A]/40 dark:text-foreground/40">PDF format only · Max 5MB</p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl bg-[#1D1B1A] dark:bg-white text-[#FDFCF8] dark:text-[#1D1B1A] py-3.5 text-[15px] font-semibold transition-colors duration-300 hover:bg-[#FF553E] dark:hover:bg-[#FF553E] dark:hover:text-white"
                  >
                    Upload Resume
                  </button>

                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {["Data never sold", "Delete anytime"].map((label) => (
                      <span key={label} className="flex items-center gap-1 text-[11px] text-[#1D1B1A]/35 dark:text-foreground/35 font-medium">
                        <CheckCircle2 className="w-3 h-3 shrink-0" strokeWidth={2} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Stage: Processing ── */}
            {stage === "processing" && (
              <motion.div
                key="stage-processing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="orb-always-active flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1D1B1A]/25 dark:border-white/25 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.05] px-6 py-16"
              >
                <ColorOrb dimension="32px" spinDuration={5} />
                <div className="flex flex-col items-center gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={aiStatusIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-[14px] font-semibold leading-none text-[#1D1B1A] dark:text-foreground text-center"
                    >
                      {aiStatuses[aiStatusIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[12px] text-[#1D1B1A]/40 dark:text-foreground/40 leading-none mt-1">
                    This takes a few seconds…
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Stage: Signup ── */}
            {stage === "signup" && (
              <motion.div
                key="stage-signup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Score reveal hero */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center gap-2 rounded-2xl bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] border border-[#1D1B1A]/[0.07] dark:border-white/[0.07] pt-7 pb-5 mb-6 overflow-hidden"
                >
                  {/* Subtle glow behind gauge */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 70%)",
                    }}
                  />

                  {/* Company context */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-4 h-4 rounded-[4px] flex items-center justify-center text-white text-[8px] font-black flex-shrink-0"
                      style={{ backgroundColor: job.logoColor }}
                    >
                      {job.logoLetter}
                    </div>
                    <span className="text-[10px] font-semibold text-[#1D1B1A]/40 dark:text-foreground/40 uppercase tracking-widest">
                      {job.company} · {job.role}
                    </span>
                  </div>

                  {/* Big gauge */}
                  <ScoreRevealGauge score={job.match} isDark={isDark} />

                  {/* Label + lock */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#1D1B1A]/35 dark:text-foreground/35" />
                      <span className="text-[12px] font-semibold text-[#1D1B1A]/50 dark:text-foreground/50">
                        Your match score
                      </span>
                    </div>
                    {/* Blurred teaser stat */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-[11px] text-[#1D1B1A]/40 dark:text-foreground/40"
                      style={{ filter: "blur(4px)", userSelect: "none" }}
                    >
                      You match {job.skills.length} of {job.skills.length} must-have skills
                    </motion.p>
                  </div>
                </motion.div>

                {/* Headline */}
                <div className="mb-5">
                  <h2 className="text-[21px] font-bold text-[#1D1B1A] dark:text-foreground tracking-tight leading-tight mb-1.5">
                    Your score is waiting
                  </h2>
                  <p className="text-[13.5px] text-[#1D1B1A]/50 dark:text-foreground/50 leading-relaxed">
                    Sign up free to reveal your full breakdown and see how you rank against other applicants.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full h-11 rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-white dark:bg-white/[0.05] px-4 text-[14px] text-[#1D1B1A] dark:text-foreground placeholder:text-[#1D1B1A]/30 dark:placeholder:text-foreground/30 focus:outline-none focus:border-[#1D1B1A]/35 dark:focus:border-white/30 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full h-11 rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-white dark:bg-white/[0.05] px-4 text-[14px] text-[#1D1B1A] dark:text-foreground placeholder:text-[#1D1B1A]/30 dark:placeholder:text-foreground/30 focus:outline-none focus:border-[#1D1B1A]/35 dark:focus:border-white/30 transition-colors"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      className="w-full h-11 rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-white dark:bg-white/[0.05] px-4 pr-11 text-[14px] text-[#1D1B1A] dark:text-foreground placeholder:text-[#1D1B1A]/30 dark:placeholder:text-foreground/30 focus:outline-none focus:border-[#1D1B1A]/35 dark:focus:border-white/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1B1A]/35 dark:text-foreground/35 hover:text-[#1D1B1A]/60 dark:hover:text-foreground/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#1D1B1A] dark:bg-white text-[#FDFCF8] dark:text-[#1D1B1A] py-3.5 text-[15px] font-semibold mt-0.5 flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-[#FF553E] dark:hover:bg-[#FF553E] dark:hover:text-white"
                  >
                    Reveal my Score
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-[#1D1B1A]/28 dark:text-foreground/28 text-center leading-relaxed pt-0.5">
                    By signing up you agree to our{" "}
                    <a href="#" className="underline underline-offset-2 hover:text-[#1D1B1A]/55 dark:hover:text-foreground/55">Terms</a>
                    {" "}and{" "}
                    <a href="#" className="underline underline-offset-2 hover:text-[#1D1B1A]/55 dark:hover:text-foreground/55">Privacy Policy</a>.
                  </p>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function PublicJob() {
  const [, params] = useRoute("/job/:id");
  const [, navigate] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const job = ALL_JOBS.find((j) => j.id === params?.id);
  if (!job) return <JobNotFound />;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 h-[58px] flex items-center justify-between gap-4">
          <button onClick={() => navigate("/landing")} className="hover:opacity-70 transition-opacity">
            <DesignfolioLogo />
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/signup")}
              className="hidden sm:flex items-center h-8 px-4 rounded-full border border-black/[0.10] dark:border-white/[0.12] text-[13px] font-medium text-foreground/65 hover:text-foreground hover:border-black/[0.20] dark:hover:border-white/[0.25] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[13px] font-medium hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Designfolio
            </button>
          </div>
        </div>
      </header>

      {/* ── Two-column body ── */}
      <main className="max-w-5xl mx-auto px-5 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_284px] gap-5 items-start">

          {/* ── LEFT: Main content ── */}
          <div className="min-w-0 space-y-4">

            {/* Job hero */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-base font-bold shadow-sm"
                  style={{ backgroundColor: job.logoColor }}
                >
                  {job.logoLetter}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-1">{job.company}</div>
                  <h1 className="text-[22px] font-semibold text-foreground leading-tight truncate">{job.role}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <Pill><MapPin className="w-3 h-3 mr-1" />{job.location}</Pill>
                <Pill><Briefcase className="w-3 h-3 mr-1" />{job.type}</Pill>
                <Pill><Monitor className="w-3 h-3 mr-1" />{job.workMode}</Pill>
                <Pill><Clock className="w-3 h-3 mr-1" />{job.yearsExp}</Pill>
                <Pill><Calendar className="w-3 h-3 mr-1" />{job.postedDate}</Pill>
              </div>

              <div className="mt-6">
                <button className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity">
                  Apply Now
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* About the role */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
              className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6"
            >
              <h2 className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-4">About the role</h2>
              {job.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-foreground/75 leading-[1.75] mb-3 last:mb-0">{para}</p>
              ))}
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.10 }}
              className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6"
            >
              <h2 className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/75 leading-[1.65]">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-foreground/25 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Hiring team */}
            {job.contacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
                className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6"
              >
                <h2 className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-4">Hiring team</h2>
                <div className="flex flex-wrap gap-3">
                  {job.contacts.map((c) => (
                    <div key={c.name} className="flex items-center gap-2.5 bg-[#F5F2EE] dark:bg-[#221E1B] rounded-xl px-3.5 py-2.5 border border-black/[0.05] dark:border-white/[0.05]">
                      <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-foreground/60">{c.initials}</span>
                      </div>
                      <span className="text-[13px] text-foreground/70 font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="min-w-0">
            <BoostCard job={job} onCta={() => setShowScoreModal(true)} isDark={isDark} />
          </div>

        </div>
      </main>

      {/* ── Score Modal ── */}
      <AnimatePresence>
        {showScoreModal && (
          <ScoreModal
            job={job}
            isDark={isDark}
            onClose={() => setShowScoreModal(false)}
            onComplete={() => navigate("/signup")}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
