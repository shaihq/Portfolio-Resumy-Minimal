import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin, Briefcase, Monitor, Clock, Calendar, ExternalLink,
  Check, ArrowRight, Sparkles,
} from "lucide-react";

// ── Shared job data (mirrors jobs.tsx) ────────────────────────────────────
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

const ALL_JOBS: Job[] = [
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

// ── Designfolio wordmark ───────────────────────────────────────────────────
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

// ── Not found state ────────────────────────────────────────────────────────
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

// ── Main public job view ───────────────────────────────────────────────────
export default function PublicJob() {
  const [, params] = useRoute("/job/:id");
  const [, navigate] = useLocation();

  const job = ALL_JOBS.find((j) => j.id === params?.id);

  if (!job) return <JobNotFound />;

  const sourceLabel = job.source === "linkedin" ? "LinkedIn" : "Indeed";

  return (
    <div className="min-h-screen bg-background">

      {/* ── Minimal navbar ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-5 h-[58px] flex items-center justify-between gap-4">
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

      {/* ── Page body ── */}
      <main className="max-w-3xl mx-auto px-5 py-10 pb-32">

        {/* ── Job hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6 mb-4"
        >
          {/* Company row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-base font-bold shadow-sm"
                style={{ backgroundColor: job.logoColor }}
              >
                {job.logoLetter}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-1">{job.company}</div>
                <h1 className="text-[22px] font-semibold text-foreground leading-tight">{job.role}</h1>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Pill><MapPin className="w-3 h-3 mr-1" />{job.location}</Pill>
            <Pill><Briefcase className="w-3 h-3 mr-1" />{job.type}</Pill>
            <Pill><Monitor className="w-3 h-3 mr-1" />{job.workMode}</Pill>
            <Pill><Clock className="w-3 h-3 mr-1" />{job.yearsExp}</Pill>
            <Pill><Calendar className="w-3 h-3 mr-1" />{job.postedDate}</Pill>
          </div>

          {/* Apply CTA */}
          <div className="mt-6 flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity">
              Apply on {sourceLabel}
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* ── About the role ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6 mb-4"
        >
          <h2 className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest mb-4">About the role</h2>
          {job.description.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-foreground/75 leading-[1.75] mb-3 last:mb-0">{para}</p>
          ))}
        </motion.div>

        {/* ── Requirements ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="bg-white dark:bg-[#28231E] rounded-2xl border border-black/[0.05] dark:border-[#302B28] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6 mb-4"
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

        {/* ── Hiring contacts ── */}
        {job.contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
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
      </main>

      {/* ── Sticky CTA banner ── */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        {/* Gradient fade */}
        <div className="h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="bg-background border-t border-black/[0.07] dark:border-white/[0.07] px-5 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Want jobs matched to your portfolio?</p>
              <p className="text-[12px] text-foreground/50 mt-0.5">
                Designfolio finds roles that actually fit — and helps you apply faster.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Social proof chips */}
              <div className="hidden sm:flex items-center gap-1.5 mr-1">
                {["96%", "91%", "88%"].map((n) => (
                  <span key={n} className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20 rounded-full px-2 py-0.5">
                    <Check className="w-2.5 h-2.5" />{n} match
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 h-9 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[13px] font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get started free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
