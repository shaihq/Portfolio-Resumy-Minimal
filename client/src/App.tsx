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
import { Home as HomeIcon, MonitorPlay, Sun, Moon, Sparkles, Check, X, Zap } from "lucide-react";
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
import { FloatingNav } from "@/components/floating-nav";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-[60px] left-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-white/70 hover:text-white transition-colors"
      aria-label="Toggle light/dark mode"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// Temporary dev navigation to easily switch pages in the Replit preview
function DevNav() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <Link
      href={isHome ? "/landing" : "/"}
      className="fixed bottom-6 left-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-white/70 hover:text-white transition-colors"
    >
      {isHome ? <MonitorPlay className="w-4 h-4" /> : <HomeIcon className="w-4 h-4" />}
    </Link>
  );
}

const FEATURES = [
  "Use your own custom domain",
  "Access all templates — now & forever",
  "Create unlimited projects (not just 2)",
  "Track views with built-in analytics",
  "Remove Designfolio branding",
  "Priority support",
];

const PLANS = {
  quarterly: { price: "₹1,249", period: "per month", sub: "billed ₹3,749 quarterly", saving: null,        cta: "Get PRO" },
  yearly:    { price: "₹917",   period: "per month", sub: "billed ₹10,999 yearly",   saving: "Save 28%",  cta: "Get PRO — Save 28% yearly" },
};

function ProButton() {
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<"quarterly" | "yearly">("yearly");
  const [btnHovered, setBtnHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[114px] left-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] rounded-full shadow-xl border border-white/10 text-amber-400 hover:text-amber-300 transition-colors"
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

            {/* Card */}
            <motion.div
              key="card"
              ref={ref}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-[160px] left-6 z-[120] w-[320px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/8 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="p-5">
                {/* Header */}
                <h2 className="text-[18px] font-bold text-foreground leading-snug tracking-tight mb-1">
                  Get Hired Faster
                </h2>
                <p className="text-[12.5px] text-foreground/50 leading-relaxed mb-4">
                  Your portfolio, resumes, AI job tools &amp; interview prep — all in one place.
                </p>

                {/* Billing toggle */}
                <div className="flex items-center bg-foreground/6 dark:bg-foreground/8 rounded-full p-[3px] mb-4">
                  {(["quarterly", "yearly"] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBilling(b)}
                      className={`flex-1 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                        billing === b
                          ? "bg-background text-foreground shadow-sm"
                          : "text-foreground/50 hover:text-foreground/70"
                      }`}
                    >
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </button>
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
                      <span className="text-[13px] text-foreground/50 font-normal">/ {plan.period}</span>
                    </div>
                    <p className="text-[11.5px] text-foreground/40 mt-1">{plan.sub}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Keyframes injection */}
                <style>{PRO_KEYFRAMES}</style>

                {/* CTA */}
                {billing === "yearly" ? (
                  <div
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    style={{
                      borderRadius: 14, padding: "2px", marginBottom: 16,
                      background: isDark
                        ? "conic-gradient(from var(--pro-angle, 0deg), #ffffff 0deg, #d0ccc6 6deg, #706c68 18deg, #302e2b 32deg, #1c1916 60deg, #1c1916 300deg, #302e2b 328deg, #706c68 342deg, #d0ccc6 354deg, #ffffff 360deg)"
                        : "conic-gradient(from var(--pro-angle, 0deg), #ffffff 0deg, #c8c4be 6deg, #686460 18deg, #282522 32deg, #1c1916 60deg, #1c1916 300deg, #282522 328deg, #686460 342deg, #c8c4be 354deg, #ffffff 360deg)",
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Router() {
  const [location] = useLocation();
  const showFloatingNav = location === "/" || location.startsWith("/jobs");

  return (
    <>
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/jobs" component={Jobs}/>
        <Route path="/landing" component={Landing}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/privacy-policy" component={PrivacyPolicy}/>
        <Route path="/project/:id" component={Project}/>
        <Route component={NotFound} />
      </Switch>
      {showFloatingNav && <FloatingNav />}
      <ThemeToggle />
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