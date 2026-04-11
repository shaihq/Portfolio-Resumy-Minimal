import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import profileImg from "@assets/image_1772896095217.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";

function CreativePortfolioPreview() {
  const [tick, setTick] = useState(new Date());
  const [expandedCareer, setExpandedCareer] = useState<Record<number, boolean>>({});
  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tags = [
    "Interaction Design", "3D Design", "User Research", "UI/UX Design",
    "Motion Design", "Product Strategy", "Design Systems", "Prototyping",
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-[520px] mx-auto px-2">
      {/* Date/time bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
        className="bg-white/85 dark:bg-[#2A2520]/85 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 py-2 px-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-[13px]">
            {tick.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <div className="w-1.5 h-1.5 bg-[#E37941] rotate-45" />
          <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-[13px]">
            {tick.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#E37941] opacity-80" />
          <span className="text-[11px] font-medium text-[#7A736C] dark:text-[#B5AFA5]">Live</span>
        </div>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
        className="bg-white/85 dark:bg-[#2A2520]/85 backdrop-blur-md rounded-[28px] border border-[#E5D7C4] dark:border-white/10 p-4 flex flex-row gap-4 items-center"
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-black/5 dark:border-white/10 bg-[#A1C2D8]">
          <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] tracking-tight leading-tight">
            Hey I'm Matt.
          </h1>
          <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[13px] leading-relaxed">
            Design Engineer crafting meaningful digital experiences where design meets code.
          </p>
        </div>
      </motion.div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.3 }}
        className="bg-white/85 dark:bg-[#2A2520]/85 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 py-2.5 overflow-hidden relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/85 dark:from-[#2A2520]/85 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/85 dark:from-[#2A2520]/85 to-transparent z-10" />
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ ease: "linear", duration: 18, repeat: Infinity }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              {tags.map((tag, j) => (
                <span key={j} className="flex items-center gap-4">
                  <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[11px] uppercase tracking-wider">{tag}</span>
                  <svg className="w-2.5 h-2.5 text-[#1A1A1A] dark:text-[#F0EDE7] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.4 }}
        className="bg-white/85 dark:bg-[#2A2520]/85 backdrop-blur-md rounded-[28px] border border-[#E5D7C4] dark:border-white/10 p-4"
      >
        <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[11px] font-mono uppercase tracking-wider mb-3">Projects</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 group/card cursor-pointer">
            <div className="rounded-xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10">
              <img src={project1} alt="Project 1" className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
            </div>
            <div>
              <h3 className="text-[12px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug line-clamp-2">
                Redesigning Quote Builder at Freshworks
              </h3>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[11px] mt-0.5 line-clamp-1">
                Enterprise UX · 1,900+ users
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 group/card cursor-pointer">
            <div className="rounded-xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10">
              <img src={project2} alt="Project 2" className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
            </div>
            <div>
              <h3 className="text-[12px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug line-clamp-2">
                Designfolio: No-Code Portfolio Builder
              </h3>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[11px] mt-0.5 line-clamp-1">
                9,000+ users worldwide
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Ladder — exact replica from Creative template */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
        className="bg-white/85 dark:bg-[#2A2520]/85 backdrop-blur-md rounded-[28px] border border-[#E5D7C4] dark:border-white/10 p-4 md:p-6 w-full relative"
      >
        <h2 className="text-[#7A736C] dark:text-[#B5AFA5] mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>CAREER LADDER</h2>

        <div className="relative flex">
          {/* Climbing character */}
          <div className="absolute left-[1px] z-20 w-[40px] h-[54px]" style={{ top: 0, willChange: 'transform' }}>
            <img src="/character-me.svg" alt="Character climbing" className="w-full h-full object-contain" />
          </div>
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
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
        className="relative flex flex-col justify-center w-full md:w-[560px] lg:w-[620px] shrink-0 h-full bg-[#FDFCF8] dark:bg-[#1A1A1A] px-10 md:px-16 z-10"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-12 py-5">
          <button
            onClick={() => navigate("/landing")}
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

        {/* Form content */}
        <div className="flex flex-col gap-6 w-full max-w-[420px]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
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
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-[28px] font-semibold text-[#1A1A1A] dark:text-foreground tracking-tight leading-[1.15]">
              Claim it and go live.
            </h1>
            <p className="text-[14px] text-[#1A1A1A]/55 dark:text-foreground/55 leading-relaxed">
              We built your portfolio from your resume. Create an account to publish it and start getting shortlisted.
            </p>
          </motion.div>

          {/* Fields */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
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
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-[#1D1B1A]/12 dark:border-white/12 bg-[#1D1B1A]/[0.03] dark:bg-white/[0.04] px-4 py-3 text-[14px] text-[#1A1A1A] dark:text-foreground placeholder:text-[#1A1A1A]/30 dark:placeholder:text-foreground/30 outline-none focus:border-[#1D1B1A]/30 dark:focus:border-white/25 transition-colors"
              />
            </div>

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
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <button
              data-testid="button-claim-portfolio"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#1D1B1A] dark:bg-white px-6 py-3.5 text-[15px] font-semibold text-[#FDFCF8] dark:text-[#1A1A1A] transition-colors duration-300 hover:bg-[#FF553E] dark:hover:bg-[#FF553E] dark:hover:text-white"
            >
              Claim my portfolio
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
          </motion.div>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center text-[13px] text-[#1A1A1A]/40 dark:text-foreground/40"
          >
            Already have an account?{" "}
            <button className="font-semibold text-[#1A1A1A]/70 dark:text-foreground/70 hover:text-[#1A1A1A] dark:hover:text-foreground transition-colors underline underline-offset-2">
              Sign in
            </button>
          </motion.p>
        </div>
      </motion.div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="hidden md:block w-px bg-[#1D1B1A]/08 dark:bg-white/08 shrink-0" />

      {/* ── Right: Portfolio Preview ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="hidden md:flex flex-col flex-1 h-full bg-[#EFECE6] dark:bg-[#141414] overflow-hidden relative"
      >
        {/* Scrollable portfolio */}
        <div className="flex-1 overflow-y-auto pt-6 pb-8 px-6">
          <CreativePortfolioPreview />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#EFECE6] dark:from-[#141414] to-transparent pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
