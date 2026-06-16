import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TemplateProvider } from "@/hooks/use-template";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Project from "@/pages/project";
import Jobs from "@/pages/jobs";
import { useEffect, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Home as HomeIcon, MonitorPlay, Sparkles, Check, X, Zap, ChevronDown, HelpCircle, Rocket, Gem, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRO_KEYFRAMES = `
  @property --pro-angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }
  @keyframes rotate-pro-gradient {
    to { --pro-angle: 360deg; }
  }
`;

import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import PrivacyPolicy from "@/pages/privacy-policy";
import PublicJob from "@/pages/public-job";
import AITools from "@/pages/ai-tools";
import { FloatingNav } from "@/components/floating-nav";


// Temporary dev navigation to easily switch pages in the Replit preview
function DevNav() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <Link
      href={isHome ? "/landing" : "/"}
      className="fixed bottom-6 right-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-white/70 hover:text-white transition-colors"
    >
      {isHome ? <MonitorPlay className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
    </Link>
  );
}

const FEATURES = [
  "Write unlimited case studies",
  "Custom domain",
  "All premium templates",
  "Use AI to find jobs",
  "Tailored resumes & cover letters",
  "AI-powered job insights",
  "Mock interviews",
  "AI case study analysis",
];

const PLANS = {
  monthly:   { price: "₹999",   period: "month",    sub: "billed monthly",           slashed: null,       cta: "Get Monthly Access" },
  quarterly: { price: "₹2,499", period: "quarter",  sub: "₹833/month · billed quarterly", slashed: null,  cta: "Get Quarterly Access" },
  lifetime:  { price: "₹8,999", period: "one-time", sub: "Pay once. Use it throughout your career.", slashed: "₹11,999",  cta: "Get Lifetime Access" },
};

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You keep access to Pro until the end of your current billing cycle. No questions asked.",
  },
  {
    q: "What happens to my portfolio if I downgrade to Free?",
    a: "Your portfolio stays live. You'll be limited to 2 case studies; extras stay hidden until you upgrade again. Custom domain support will also be removed.",
  },
  {
    q: "What does AI case study analysis mean?",
    a: "Our AI reviews your case studies and gives you targeted feedback on structure, storytelling, depth of process, and how recruiters are likely to perceive them.",
  },
  {
    q: "Which plans include AI job matching?",
    a: "AI job matching, tailored resumes, cover letters, mock interviews, and job insights are all exclusive to Pro — available on both Quarterly and Yearly billing.",
  },
  {
    q: "Is there a free trial?",
    a: "No free trial right now, but the Free plan lets you explore the portfolio builder with up to 2 case studies before you decide to upgrade.",
  },
];

function UpgradeButton() {
  const [location] = useLocation();
  if (location !== "/") return null;
  return (
    <button
      className="fixed top-[18px] right-5 z-40 flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-[12px] font-semibold tracking-wide cursor-pointer select-none
        bg-gradient-to-b from-white to-[#EAE5DE] dark:from-[#2A2A2A] dark:to-[#202020]
        border border-black/[0.09] dark:border-white/[0.08]
        shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.06)]
        dark:shadow-[0_2px_10px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.05)]
        text-[#1A1A1A] dark:text-[#EFEFEF]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.06)]
        dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.07)]
        active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.07)]
        hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
    >
      <Gem size={12} className="text-violet-500 dark:text-violet-400 flex-shrink-0" />
      Upgrade
    </button>
  );
}

function ProButton() {
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "quarterly" | "lifetime">("lifetime");
  const [btnHovered, setBtnHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const plan = PLANS[billing];

  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset FAQ when modal closes
  useEffect(() => {
    if (!open) { setShowFaq(false); setOpenFaqIndex(null); }
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[60px] right-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-amber-400 hover:text-amber-300 transition-colors"
        aria-label="Upgrade to Pro"
      >
        <Sparkles className="w-4 h-4" />
      </button>
      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            {/* Card — morphs wider when FAQ opens */}
            <motion.div
              key="card"
              ref={ref}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, width: showFaq ? 640 : 320 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex"
              style={{ width: 320 }}
            >
              {/* ── Left panel: pricing (always visible) ── */}
              <div className="w-[320px] flex-shrink-0">
                {/* Urgency banner */}
                <div className="px-4 py-2.5 flex items-center gap-2.5 border-b border-foreground/[0.07]"
                  style={{ background: "linear-gradient(90deg, rgba(232,89,58,0.08) 0%, rgba(255,154,60,0.05) 60%, transparent 100%)" }}>
                  <span className="relative flex-shrink-0 flex h-[7px] w-[7px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ backgroundColor: "#E8593A" }} />
                    <span className="relative inline-flex rounded-full h-[7px] w-[7px]" style={{ backgroundColor: "#E8593A" }} />
                  </span>
                  <p className="text-[11px] leading-none text-foreground/50">
                    Current pricing ends next month.{" "}
                    <span className="text-foreground/80 font-semibold">Lock in today's price.</span>
                  </p>
                </div>

                <div className="p-5 relative">
                  {/* Close */}
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/8 transition-colors z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Header */}
                  <h2 className="text-[18px] font-bold text-foreground leading-snug tracking-tight mb-1">Career OS for Job Seekers</h2>
                  <p className="text-[12.5px] text-foreground/50 leading-relaxed mb-4">Build your portfolio, tailor every application, find jobs, and prepare for interviews—all in one place.</p>

                  {/* Billing toggle */}
                  <div className="flex items-center bg-foreground/6 dark:bg-foreground/8 rounded-full p-[3px] mb-4 mt-3 overflow-visible">
                    {(["monthly", "quarterly", "lifetime"] as const).map((b) => (
                      <span key={b} className="relative flex-1">
                        {b === "lifetime" && (
                          <span
                            className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-[3.5px] rounded-full text-[8.5px] font-semibold uppercase select-none"
                            style={{
                              background: "linear-gradient(180deg, #383838 0%, #1c1c1c 100%)",
                              color: "rgba(255,255,255,0.82)",
                              letterSpacing: "0.09em",
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.13), 0 2px 5px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(0,0,0,0.35)",
                            }}
                          >Best Value</span>
                        )}
                        <button
                          onClick={() => setBilling(b)}
                          className={`w-full py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 ${
                            billing === b
                              ? "bg-background text-foreground shadow-sm"
                              : "text-foreground/50 hover:text-foreground/70"
                          }`}
                        >
                          {b.charAt(0).toUpperCase() + b.slice(1)}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billing}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                      className="mb-4"
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[30px] font-bold text-foreground tracking-tight leading-none">{plan.price}</span>
                        {plan.slashed && (
                          <span className="text-[13px] text-foreground/35 font-normal line-through">{plan.slashed}</span>
                        )}
                        <span className="text-[13px] text-foreground/50 font-normal">/ {plan.period}</span>
                      </div>
                      <p className="text-[11.5px] text-foreground/40 mt-1">{plan.sub}</p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Keyframes injection */}
                  <style>{PRO_KEYFRAMES}</style>

                  {/* Animated quote banner */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billing + "-quote"}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                    >
                      <div className="flex items-center gap-2.5 mb-3 px-3 py-2.5 rounded-xl border border-foreground/[0.1] bg-foreground/[0.04]"
                        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 3px rgba(0,0,0,0.07)" }}>
                        <span className="flex-shrink-0 w-[22px] h-[22px] rounded-md flex items-center justify-center" style={{ background: "rgba(232,89,58,0.12)" }}>
                          {billing === "lifetime" && <Gem className="w-3 h-3" style={{ color: "#E8593A" }} />}
                          {billing === "monthly" && <Sprout className="w-3 h-3" style={{ color: "#E8593A" }} />}
                          {billing === "quarterly" && <Rocket className="w-3 h-3" style={{ color: "#E8593A" }} />}
                        </span>
                        <p className="text-[11.5px] text-foreground/75 leading-snug">
                          {billing === "lifetime" && "78% of paying members choose Lifetime."}
                          {billing === "monthly" && "Start building today. Upgrade anytime."}
                          {billing === "quarterly" && "Enough time to build, apply, interview, and get hired."}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* CTA */}
                  {billing === "lifetime" ? (
                    <div
                      onMouseEnter={() => setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      style={{
                        borderRadius: 14, padding: "2px", marginBottom: 16,
                        background: "conic-gradient(from var(--pro-angle, 0deg), #FFD580 0deg, #FF9A3C 40deg, #E8593A 90deg, #C0392B 150deg, #7A1A0A 180deg, #7A1A0A 200deg, #C0392B 240deg, #E8593A 290deg, #FF9A3C 330deg, #FFD580 360deg)",
                        animation: "rotate-pro-gradient 3s linear infinite",
                        cursor: "pointer",
                        transform: btnHovered ? "scale(1.02)" : "scale(1)",
                        transition: "transform 220ms cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    >
                      <div
                        onClick={() => setOpen(false)}
                        style={{
                          background: btnHovered ? "#d44e30" : "#E8593A",
                          borderRadius: 12,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 6, padding: "11px 0",
                          fontSize: 13, fontWeight: 600, color: "white",
                          transition: "background 180ms ease",
                        }}
                      >
                        <Zap size={13} />
                        {plan.cta}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="w-full py-3 rounded-xl bg-[#E8593A] hover:bg-[#d44e30] text-white text-[13px] font-semibold transition-colors mb-4"
                      onClick={() => setOpen(false)}
                    >
                      {plan.cta}
                    </button>
                  )}

                  {/* Features */}
                  <div className="flex flex-col gap-2.5">
                    {FEATURES.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                        </span>
                        <span className="text-[12.5px] text-foreground/75 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* FAQ chip */}
                  <div className="flex mt-3">
                    <button
                      onClick={() => setShowFaq((s) => !s)}
                      className={`flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-[5px] border transition-all duration-200 ${
                        showFaq
                          ? "border-foreground/20 bg-foreground/6 text-foreground/60"
                          : "border-border/50 bg-transparent text-foreground/40 hover:text-foreground/60 hover:border-border"
                      }`}
                    >
                      <HelpCircle className="w-3 h-3 flex-shrink-0" />
                      Have more doubts? FAQ
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right panel: FAQ accordion ── */}
              <AnimatePresence>
                {showFaq && (
                  <motion.div
                    key="faq-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: 0.14 }}
                    className="w-[320px] flex-shrink-0 border-l border-border/60 flex flex-col"
                  >
                    <div className="p-5 pb-3 border-b border-border/40">
                      <p className="text-[13px] font-semibold text-foreground tracking-tight">FAQ</p>
                    </div>
                    <div className="overflow-y-auto flex-1" style={{ maxHeight: 420 }}>
                      {FAQS.map((item, i) => (
                        <div key={i} className="border-b border-border/30 last:border-0">
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                            className="w-full flex items-start justify-between gap-3 px-5 py-3.5 text-left group"
                          >
                            <span className="text-[12px] font-medium text-foreground/80 leading-snug group-hover:text-foreground transition-colors">
                              {item.q}
                            </span>
                            <motion.span
                              animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="flex-shrink-0 mt-[1px]"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-foreground/35" />
                            </motion.span>
                          </button>
                          <AnimatePresence initial={false}>
                            {openFaqIndex === i && (
                              <motion.div
                                key="answer"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <p className="px-5 pb-3.5 text-[11.5px] text-foreground/50 leading-relaxed">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Router() {
  const [location] = useLocation();
  const showFloatingNav = location === "/" || location.startsWith("/jobs") || location.startsWith("/tools");

  return (
    <>
      {showFloatingNav && <FloatingNav />}
      <div
        className={
          showFloatingNav
            ? "fixed top-2 bottom-2 left-[72px] right-2 bg-background overflow-y-auto rounded-[32px]"
            : ""
        }
      >
        <Switch>
          <Route path="/" component={Home}/>
          <Route path="/jobs" component={Jobs}/>
          <Route path="/tools" component={AITools}/>
          <Route path="/job/:id" component={PublicJob}/>
          <Route path="/landing" component={Landing}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/privacy-policy" component={PrivacyPolicy}/>
          <Route path="/project/:id" component={Project}/>
          <Route component={NotFound} />
        </Switch>
      </div>
      <UpgradeButton />
      <DevNav />
      <ProButton />
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TemplateProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TemplateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;