import { useState, useEffect, useRef, useCallback, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Sun, Moon, Briefcase, Monitor, Clock, Sparkles, Lock, MailCheck } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Gauge } from "@/components/ui/gauge-1";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import profileImg from "@assets/image_1772896095217.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";

const AI_PICKS = [
  { id: "1", company: "Linear", role: "Senior Product Designer", match: 96, reason: "Remote-first, full ownership, design system scope", logoColor: "#5E6AD2", logoLetter: "L", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "San Francisco, CA" },
  { id: "2", company: "Vercel", role: "Product Designer", match: 91, reason: "Developer-led culture, design-code bridge, async", logoColor: "#171717", logoLetter: "V", type: "Full-Time", workMode: "Remote", yearsExp: "3+ yrs", location: "New York, NY" },
  { id: "3", company: "Notion", role: "Product Designer", match: 88, reason: "Content-first, collaborative, B2B/consumer overlap", logoColor: "#191919", logoLetter: "N", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "San Francisco, CA" },
  { id: "4", company: "Figma", role: "UX Designer", match: 85, reason: "Design community influence, tool ecosystem impact", logoColor: "#F24E1E", logoLetter: "F", type: "Full-Time", workMode: "On-site", yearsExp: "3+ yrs", location: "San Francisco, CA" },
  { id: "5", company: "Loom", role: "Senior UX Designer", match: 82, reason: "Async-first, startup momentum, video-native product", logoColor: "#625DF5", logoLetter: "L", type: "Full-Time", workMode: "Remote", yearsExp: "5+ yrs", location: "Austin, TX" },
  { id: "6", company: "Stripe", role: "Product Designer", match: 79, reason: "High craft bar, complex systems, strong fintech brand", logoColor: "#6772E5", logoLetter: "S", type: "Full-Time", workMode: "Hybrid", yearsExp: "4+ yrs", location: "Seattle, WA" },
];

function CreativePortfolioPreview({ scrollRef }: { scrollRef: RefObject<HTMLDivElement> }) {
  const [tick, setTick] = useState(new Date());
  const [expandedCareer, setExpandedCareer] = useState<Record<number, boolean>>({});
  const [characterPosition, setCharacterPosition] = useState(0);
  const careerLadderRef = useRef<HTMLDivElement>(null);
  const ladderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const handleScroll = () => {
      if (!careerLadderRef.current || !ladderContainerRef.current) return;
      const ladderRect = careerLadderRef.current.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const containerHeight = ladderContainerRef.current.offsetHeight;
      const viewportRelativeTop = ladderRect.top - scrollerRect.top;
      const viewportRelativeBottom = ladderRect.bottom - scrollerRect.top;
      const scrollerHeight = scroller.clientHeight;
      if (viewportRelativeBottom < 0 || viewportRelativeTop > scrollerHeight) return;
      const progress = Math.min(1, Math.max(0, -viewportRelativeTop / (ladderRect.height - scrollerHeight * 0.5)));
      const maxPosition = containerHeight - 54;
      setCharacterPosition(Math.min(maxPosition, Math.max(0, progress * maxPosition)));
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return (
    <div className="w-full flex-1 flex flex-col gap-3 pb-20 pt-0 px-0 max-w-[640px] mx-auto">
      {/* Date/time bar */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0 }}
        className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[24px] border border-[#E5D7C4] dark:border-white/10 py-2 px-4 flex justify-between items-center w-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">
            {tick.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <div className="w-2 h-2 bg-[#E37941] rotate-45" />
          <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">
            {tick.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.15 }}
        className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 flex flex-col md:flex-row gap-6 items-start md:items-center w-full"
      >
        <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-black/5 dark:border-white/10 shadow-sm bg-[#A1C2D8]">
          <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] tracking-tight leading-tight">Hey I'm Matt.</h1>
          <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed max-w-[480px]">
            I'm a Design Engineer focused on crafting meaningful digital experiences where design meets code.
          </p>
        </div>
      </motion.div>

      {/* Marquee Tags */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.3 }}
        className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[24px] border border-[#E5D7C4] dark:border-white/10 py-2 overflow-hidden relative w-full"
      >
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 dark:from-[#2A2520]/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 dark:from-[#2A2520]/80 to-transparent z-10" />
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              {["Interaction Design","3D Design","User Research","UI/UX Design","Motion Design","Design Systems"].map((tag, j) => (
                <span key={j} className="flex items-center gap-4">
                  <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[12px] uppercase tracking-wider">{tag}</span>
                  <div className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/></svg>
                  </div>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.45 }}
        className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 w-full"
      >
        <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-3" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>PROJECTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 group/card cursor-pointer">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
              <img src={project1} alt="Project 1" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2 leading-snug line-clamp-2">
                Redesigning Quote Builder at Freshworks for 1,900+ Enterprise Users
              </h3>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-sm leading-relaxed line-clamp-2">
                A sleek and responsive landing page designed for modern startups to showcase their product.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 group/card cursor-pointer">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
              <img src={project2} alt="Project 2" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2 leading-snug line-clamp-2">
                Designfolio: No-Code Portfolio Builder for 9,000+ Users
              </h3>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-sm leading-relaxed line-clamp-2">
                Helping Product folks build bragworthy portfolio websites.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Ladder — exact replica from Creative template */}
      <motion.div
        ref={careerLadderRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.6 }}
        className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 md:p-6 w-full relative"
      >
        <h2 className="text-[#7A736C] dark:text-[#B5AFA5] mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>CAREER LADDER</h2>

        <div className="relative flex" ref={ladderContainerRef}>
          {/* Climbing character */}
          <motion.div
            className="absolute left-[1px] z-20 w-[40px] h-[54px]"
            style={{ top: characterPosition, willChange: 'transform' }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          >
            <img src="/character-me.svg" alt="Character climbing" className="w-full h-full object-contain" />
          </motion.div>
          {/* Ladder rungs */}
          <div className="absolute left-0 top-3 bottom-0 w-[42px] flex flex-col justify-between items-start border-x-[5px] border-[#F0EDE7] dark:border-[#3A352E] py-1 bg-transparent">
            {[...Array(38)].map((_, i) => (
              <div key={i} className="w-full h-[5px] bg-[#F0EDE7] dark:bg-[#3A352E]" />
            ))}
          </div>

          <div className="space-y-12 pl-16 relative z-10 w-full pt-1 pb-2">
            {/* Entry 1 */}
            <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">Senior Design Engineer @ Vercel</h3>
                <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                  2023 — Present
                </div>
              </div>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[14px] leading-relaxed">
                Leading design systems and interaction design across Vercel's core platform, shaping experiences used by millions of developers.
              </p>
              <motion.div
                initial={false}
                animate={{ height: expandedCareer[0] ? "auto" : 0, opacity: expandedCareer[0] ? 1 : 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="pt-4">
                  <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[14px]">
                    {["Design system architecture", "Developer-facing tooling UX", "Cross-functional design leadership"].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedCareer(prev => ({ ...prev, [0]: !prev[0] })); }}
                className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mt-3 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                {expandedCareer[0] ? 'View less' : 'View more'}
                <motion.svg animate={{ rotate: expandedCareer[0] ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </motion.svg>
              </button>
            </div>

            {/* Entry 2 */}
            <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">Product Designer @ Freshworks</h3>
                <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                  2021 — 2023
                </div>
              </div>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[14px] leading-relaxed">
                Redesigned the Quote Builder for 1,900+ enterprise users, reducing quote creation time by 40% through smarter interaction patterns.
              </p>
              <motion.div
                initial={false}
                animate={{ height: expandedCareer[1] ? "auto" : 0, opacity: expandedCareer[1] ? 1 : 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="pt-4">
                  <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[14px]">
                    {["Enterprise B2B product design", "User research & testing", "Component library ownership"].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedCareer(prev => ({ ...prev, [1]: !prev[1] })); }}
                className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mt-3 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                {expandedCareer[1] ? 'View less' : 'View more'}
                <motion.svg animate={{ rotate: expandedCareer[1] ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </motion.svg>
              </button>
            </div>

            {/* Entry 3 */}
            <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">UI Designer @ Razorpay</h3>
                <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                  2019 — 2021
                </div>
              </div>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[14px] leading-relaxed">
                Designed core payment flows and merchant dashboards, improving conversion rates across Razorpay's checkout product.
              </p>
              <motion.div
                initial={false}
                animate={{ height: expandedCareer[2] ? "auto" : 0, opacity: expandedCareer[2] ? 1 : 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="pt-4">
                  <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[14px]">
                    {["Payment UX & checkout flows", "Merchant dashboard design", "Fintech accessibility standards"].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedCareer(prev => ({ ...prev, [2]: !prev[2] })); }}
                className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mt-3 flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                {expandedCareer[2] ? 'View less' : 'View more'}
                <motion.svg animate={{ rotate: expandedCareer[2] ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </motion.svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", domain: "" });

  const toSlug = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const domainTouched = useRef(false);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const mobileSheetScrollRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState("My Portfolio");
  const [mobileSheetView, setMobileSheetView] = useState("My Portfolio");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showPreviewSheet, setShowPreviewSheet] = useState(false);
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(30);
    const id = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(id); return 0; }
        return v - 1;
      });
    }, 1000);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError(false);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    setOtpError(false);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError(true); return; }
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen w-full overflow-hidden"
    >
      {/* ── Left: Sign Up ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col md:justify-center w-full md:w-[560px] lg:w-[620px] shrink-0 h-full bg-[#FDFCF8] dark:bg-[#1A1A1A] overflow-y-auto px-10 md:px-16 z-10"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-12 py-5">
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="text-[13px] font-semibold text-[#1A1A1A]/50 dark:text-foreground/50 hover:text-[#1A1A1A] dark:hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#1D1B1A]/10 dark:border-white/10 text-[#1D1B1A]/50 dark:text-foreground/50 hover:text-[#1D1B1A] dark:hover:text-foreground hover:border-[#1D1B1A]/30 dark:hover:border-white/30 transition-all"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Form content — animated between signup and verify steps */}
        <div className="relative flex-1 md:flex-none flex flex-col md:justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {step === "signup" ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col gap-6 w-full max-w-[420px] mx-auto pt-24 pb-28 md:py-0 md:my-auto"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.4 }}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF553E]/10 px-3 py-1 text-[12px] font-semibold text-[#FF553E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF553E] animate-pulse" />
                    Your portfolio is ready
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <h1 className="text-[28px] font-semibold text-[#1A1A1A] dark:text-foreground tracking-tight leading-[1.15]">Sign up. Let's get you hired.</h1>
                  <p className="text-[14px] text-[#1A1A1A]/55 dark:text-foreground/55 leading-relaxed">Your portfolio and matched jobs are one click away.</p>
                </motion.div>

                {/* Mobile: view preview button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.13, duration: 0.4 }}
                  className="md:hidden"
                >
                  <button
                    data-testid="button-view-preview"
                    onClick={() => setShowPreviewSheet(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A]/70 dark:text-foreground/70 hover:border-[#1D1B1A]/25 dark:hover:border-white/20 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View your portfolio &amp; job matches
                  </button>
                </motion.div>

                {/* Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="flex flex-col gap-3"
                >
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1A1A]/60 dark:text-foreground/60 uppercase tracking-wider">
                      Full name
                    </label>
                    <input
                      data-testid="input-full-name"
                      type="text"
                      placeholder="Matt Chen"
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm((f) => ({
                          ...f,
                          name,
                          domain: domainTouched.current ? f.domain : toSlug(name),
                        }));
                      }}
                      className="w-full rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] px-4 py-3 text-[14px] text-[#1A1A1A] dark:text-foreground placeholder:text-[#1A1A1A]/30 dark:placeholder:text-foreground/30 outline-none focus:border-[#1D1B1A]/30 dark:focus:border-white/25 transition-colors"
                    />
                  </div>

                  {/* Domain — revealed once name has input */}
                  <AnimatePresence>
                    {form.name.trim().length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-semibold text-[#1A1A1A]/60 dark:text-foreground/60 uppercase tracking-wider">
                            Your portfolio URL
                          </label>
                          <div className="flex items-center rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] overflow-hidden focus-within:border-[#1D1B1A]/30 dark:focus-within:border-white/25 transition-colors">
                            <input
                              data-testid="input-domain"
                              type="text"
                              placeholder="yourname"
                              value={form.domain}
                              onChange={(e) => {
                                domainTouched.current = true;
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                                setForm((f) => ({ ...f, domain: slug }));
                              }}
                              className="flex-1 min-w-0 bg-transparent px-4 py-3 text-[14px] text-[#1A1A1A] dark:text-foreground placeholder:text-[#1A1A1A]/30 dark:placeholder:text-foreground/30 outline-none"
                            />
                            <span className="shrink-0 pr-4 text-[14px] text-[#1A1A1A]/40 dark:text-foreground/40 font-medium select-none">
                              .designfolio.me
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1A1A]/60 dark:text-foreground/60 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      data-testid="input-email"
                      type="email"
                      placeholder="matt@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] px-4 py-3 text-[14px] text-[#1A1A1A] dark:text-foreground placeholder:text-[#1A1A1A]/30 dark:placeholder:text-foreground/30 outline-none focus:border-[#1D1B1A]/30 dark:focus:border-white/25 transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1A1A]/60 dark:text-foreground/60 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        data-testid="input-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        className="w-full rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] px-4 py-3 pr-11 text-[14px] text-[#1A1A1A] dark:text-foreground placeholder:text-[#1A1A1A]/30 dark:placeholder:text-foreground/30 outline-none focus:border-[#1D1B1A]/30 dark:focus:border-white/25 transition-colors"
                      />
                      <button
                        data-testid="button-toggle-password"
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/35 dark:text-foreground/35 hover:text-[#1A1A1A]/70 dark:hover:text-foreground/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <button
                    data-testid="button-claim-portfolio"
                    onClick={() => { setStep("verify"); startResendCooldown(); }}
                    className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#1D1B1A] dark:bg-white px-6 py-3.5 text-[15px] font-semibold text-[#FDFCF8] dark:text-[#1A1A1A] transition-colors duration-300 hover:bg-[#FF553E] dark:hover:bg-[#FF553E] dark:hover:text-white"
                  >
                    Create my account
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                  </button>
                </motion.div>

                {/* Sign in link */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-center text-[13px] text-[#1A1A1A]/40 dark:text-foreground/40"
                >
                  Already have an account?{" "}
                  <button className="font-semibold text-[#1A1A1A]/70 dark:text-foreground/70 hover:text-[#1A1A1A] dark:hover:text-foreground transition-colors underline underline-offset-2">
                    Sign in
                  </button>
                </motion.p>
              </motion.div>
            ) : (
              /* ── Verify email step ────────────────────────── */
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col gap-7 w-full max-w-[420px] mx-auto pt-24 pb-28 md:py-0 md:my-auto"
              >
                {/* Icon + heading */}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF553E]/10 flex items-center justify-center">
                    <MailCheck className="w-5 h-5 text-[#FF553E]" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-[28px] font-semibold text-[#1A1A1A] dark:text-foreground tracking-tight leading-[1.15]">
                      Check your inbox
                    </h1>
                    <p className="text-[14px] text-[#1A1A1A]/55 dark:text-foreground/55 leading-relaxed">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-[#1A1A1A] dark:text-foreground">
                        {form.email || "your email"}
                      </span>
                      . Enter it below to unlock your portfolio.
                    </p>
                  </div>
                </div>

                {/* OTP inputs */}
                <div className="flex flex-col gap-3">
                  <label className="text-[12px] font-semibold text-[#1A1A1A]/60 dark:text-foreground/60 uppercase tracking-wider">
                    Verification code
                  </label>
                  <div className="flex gap-2.5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={cn(
                          "flex-1 min-w-0 h-14 rounded-xl border text-center text-[20px] font-semibold text-[#1A1A1A] dark:text-foreground bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] outline-none transition-all",
                          otpError
                            ? "border-[#FF553E] focus:border-[#FF553E]"
                            : "border-[#1D1B1A]/12 dark:border-white/12 focus:border-[#1D1B1A]/40 dark:focus:border-white/30",
                          digit && !otpError && "border-[#1D1B1A]/30 dark:border-white/25"
                        )}
                      />
                    ))}
                  </div>
                  <AnimatePresence>
                    {otpError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-[12px] text-[#FF553E] font-medium"
                      >
                        Enter all 6 digits to continue.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resend */}
                <p className="text-[13px] text-[#1A1A1A]/45 dark:text-foreground/45">
                  Didn't get it?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-[#1A1A1A]/35 dark:text-foreground/30">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      onClick={() => { setOtp(["", "", "", "", "", ""]); startResendCooldown(); otpRefs.current[0]?.focus(); }}
                      className="font-semibold text-[#FF553E] hover:text-[#e04430] transition-colors"
                    >
                      Resend code
                    </button>
                  )}
                </p>

                {/* CTA */}
                <button
                  data-testid="button-verify-otp"
                  onClick={handleVerify}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#1D1B1A] dark:bg-white px-6 py-3.5 text-[15px] font-semibold text-[#FDFCF8] dark:text-[#1A1A1A] transition-colors duration-300 hover:bg-[#FF553E] dark:hover:bg-[#FF553E] dark:hover:text-white"
                >
                  Unlock my portfolio
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </button>

                {/* Back */}
                <button
                  onClick={() => { setStep("signup"); setOtp(["", "", "", "", "", ""]); setOtpError(false); }}
                  className="text-center text-[13px] text-[#1A1A1A]/40 dark:text-foreground/40 hover:text-[#1A1A1A] dark:hover:text-foreground transition-colors"
                >
                  Wrong email? Go back and change it
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* ── Leave confirmation modal ──────────────────────── */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            onClick={() => setShowLeaveConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDFCF8] dark:bg-[#1E1C1A] rounded-[24px] border border-[#1D1B1A]/10 dark:border-white/10 p-7 w-full max-w-[360px] flex flex-col gap-5 shadow-2xl"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl bg-[#FF553E]/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF553E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[17px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">
                  Leave and lose your portfolio?
                </h2>
                <p className="text-[13px] text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed">
                  Your resume was just processed and your portfolio is ready. If you go back, you'll have to start over.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="w-full py-3 rounded-xl bg-[#1D1B1A] dark:bg-white text-[14px] font-semibold text-[#FDFCF8] dark:text-[#1A1A1A] transition-opacity hover:opacity-80"
                >
                  Stay and claim it
                </button>
                <button
                  onClick={() => navigate("/landing")}
                  className="w-full py-3 rounded-xl text-[14px] font-medium text-[#1A1A1A]/50 dark:text-foreground/40 hover:text-[#1A1A1A] dark:hover:text-foreground transition-colors"
                >
                  Leave anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Divider ───────────────────────────────────────── */}
      <div className="hidden md:block w-px bg-[#1D1B1A]/08 dark:bg-white/08 shrink-0" />
      {/* ── Right: Portfolio Preview ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="hidden md:flex flex-col flex-1 h-full bg-[#EFECE6] dark:bg-[#141414] overflow-hidden relative"
      >
        {/* Floating tab toggle with smudge fade */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="h-24 bg-gradient-to-b from-[#EFECE6] dark:from-[#141414] via-[#EFECE6]/85 dark:via-[#141414]/85 to-transparent" />
        </div>
        <div className="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-auto">
          <AnimatedTabs
            tabs={[{ label: "My Portfolio" }, { label: "My Jobs" }]}
            onChange={setActiveView}
          />
        </div>

        {/* Scrollable portfolio */}
        {activeView === "My Portfolio" ? (
          <div ref={previewScrollRef} className="flex-1 overflow-y-auto pt-20 pb-8 px-6">
            <CreativePortfolioPreview scrollRef={previewScrollRef} />
          </div>
        ) : (
          <div className="flex-1 relative overflow-hidden">
            <div className="h-full overflow-y-auto pt-20 pb-8 px-6">
            <div className="w-full max-w-[640px] mx-auto flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7A736C] dark:text-[#B5AFA5]" />
                <span className="text-[#7A736C] dark:text-[#B5AFA5]" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>AI PICKS · {AI_PICKS.length} MATCHES</span>
              </div>

              {AI_PICKS.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.07 }}
                  className={cn(
                    "bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 p-4 flex flex-col gap-3 relative",
                    i >= 2 && "select-none"
                  )}
                  style={i >= 2 ? {
                    filter: `blur(${Math.min(1.5 + (i - 2) * 1.2, 5)}px)`,
                    opacity: Math.max(0.72 - (i - 2) * 0.1, 0.3),
                    pointerEvents: "none",
                  } : undefined}
                >
                  {/* Top row: logo + company/location + match */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-[14px] font-bold"
                        style={{ backgroundColor: job.logoColor }}
                      >
                        {job.logoLetter}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">{job.company}</p>
                        <p className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] truncate">{job.location}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
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

                  {/* Role */}
                  <p className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">{job.role}</p>

                  {/* Reason */}
                  <p className="text-[12px] text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed italic">"{job.reason}"</p>

                  {/* Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                      <Briefcase className="w-2.5 h-2.5 shrink-0" />
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                      <Monitor className="w-2.5 h-2.5 shrink-0" />
                      {job.workMode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                      <Clock className="w-2.5 h-2.5 shrink-0" />
                      {job.yearsExp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            </div>
            {/* Fade gate — absolutely pinned to bottom of the panel */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#EFECE6] dark:from-[#141414] via-[#EFECE6]/90 dark:via-[#141414]/90 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#EFECE6] dark:from-[#141414] to-transparent pointer-events-none" />
      </motion.div>
      {/* ── Mobile Preview Bottom Sheet ───────────────────── */}
      <AnimatePresence>
        {showPreviewSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setShowPreviewSheet(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.9 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex flex-col bg-[#EFECE6] dark:bg-[#141414] rounded-t-[28px] overflow-hidden"
              style={{ height: "90dvh" }}
            >
              {/* Handle only */}
              <div className="shrink-0 pt-3 pb-1 flex justify-center">
                <div className="w-9 h-1 rounded-full bg-[#1D1B1A]/15 dark:bg-white/15" />
              </div>

              {/* Floating tab with smudge */}
              <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                <div className="h-28 bg-gradient-to-b from-[#EFECE6] dark:from-[#141414] via-[#EFECE6]/85 dark:via-[#141414]/85 to-transparent" />
              </div>
              <div className="absolute top-[28px] left-0 right-0 z-30 flex justify-center pointer-events-auto">
                <AnimatedTabs
                  tabs={[{ label: "My Portfolio" }, { label: "My Jobs" }]}
                  onChange={setMobileSheetView}
                />
              </div>

              {/* Scrollable content */}
              {mobileSheetView === "My Portfolio" ? (
                <div ref={mobileSheetScrollRef} className="flex-1 overflow-y-auto pt-[72px] pb-28 px-4">
                  <CreativePortfolioPreview scrollRef={mobileSheetScrollRef} />
                </div>
              ) : (
                <div className="flex-1 relative overflow-hidden">
                  <div className="h-full overflow-y-auto pt-[72px] pb-28 px-4">
                    <div className="w-full max-w-[560px] mx-auto flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#7A736C] dark:text-[#B5AFA5]" />
                        <span className="text-[#7A736C] dark:text-[#B5AFA5]" style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: '500' }}>AI PICKS · {AI_PICKS.length} MATCHES</span>
                      </div>
                      {AI_PICKS.map((job, i) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.06 }}
                          className={cn(
                            "bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 p-4 flex flex-col gap-3",
                            i >= 2 && "select-none"
                          )}
                          style={i >= 2 ? {
                            filter: `blur(${Math.min(1.5 + (i - 2) * 1.2, 5)}px)`,
                            opacity: Math.max(0.72 - (i - 2) * 0.1, 0.3),
                            pointerEvents: "none",
                          } : undefined}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-[14px] font-bold"
                                style={{ backgroundColor: job.logoColor }}
                              >
                                {job.logoLetter}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">{job.company}</p>
                                <p className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] truncate">{job.location}</p>
                              </div>
                            </div>
                            <div className="shrink-0">
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
                          <p className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">{job.role}</p>
                          <p className="text-[12px] text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed italic">"{job.reason}"</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                              <Briefcase className="w-2.5 h-2.5 shrink-0" />{job.type}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                              <Monitor className="w-2.5 h-2.5 shrink-0" />{job.workMode}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5] bg-black/[0.05] dark:bg-white/[0.06] rounded-md px-2 py-0.5">
                              <Clock className="w-2.5 h-2.5 shrink-0" />{job.yearsExp}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#EFECE6] dark:from-[#141414] via-[#EFECE6]/90 dark:via-[#141414]/90 to-transparent pointer-events-none flex flex-col items-center justify-end pb-4">
                    <div className="pointer-events-auto flex items-center gap-2 bg-[#1D1B1A] dark:bg-white/95 text-[#FDFCF8] dark:text-[#1A1A1A] rounded-full px-4 py-2.5 shadow-lg">
                      <Lock className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                      <span className="text-[12px] font-semibold whitespace-nowrap">Sign up to unlock all {AI_PICKS.length} matches & apply</span>
                      <ArrowRight className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom fade + close button */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#EFECE6] dark:from-[#141414] via-[#EFECE6]/90 dark:via-[#141414]/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-auto">
                <button
                  data-testid="button-close-preview-sheet"
                  onClick={() => setShowPreviewSheet(false)}
                  className="w-11 h-11 rounded-full bg-[#1D1B1A] dark:bg-white flex items-center justify-center text-[#FDFCF8] dark:text-[#1A1A1A] shadow-lg transition-opacity hover:opacity-80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
