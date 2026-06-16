import { Link, useLocation } from "wouter";
import { LayoutTemplate, Briefcase, ChevronLeft, Sun, Moon, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const navItems = [
  {
    icon: LayoutTemplate,
    label: "Portfolio Builder",
    href: "/",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/jobs",
  },
];

function DesignfolioLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
      <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
    </svg>
  );
}

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 220;

export function FloatingNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted
    ? resolvedTheme === "dark"
    : false;

  return (
    <motion.aside
      animate={{ width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 h-screen z-[200] flex flex-col bg-white dark:bg-[#1E1C1A] border-r border-black/[0.07] dark:border-white/[0.07] shadow-[1px_0_12px_rgba(0,0,0,0.04)] overflow-hidden select-none"
      style={{ minWidth: COLLAPSED_WIDTH }}
    >
      {/* ── Logo & Brand ── */}
      <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0">
        <div className="flex-shrink-0">
          <DesignfolioLogo />
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              key="brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-[15px] font-semibold text-foreground tracking-tight whitespace-nowrap overflow-hidden"
            >
              Designfolio
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-black/[0.06] dark:bg-white/[0.06] flex-shrink-0" />

      {/* ── Nav section label ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            key="nav-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap"
          >
            Navigation
          </motion.p>
        )}
      </AnimatePresence>
      {!open && <div className="pt-4" />}

      {/* ── Nav Items ── */}
      <nav className="flex flex-col gap-1 px-2 flex-shrink-0">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.button
                data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 text-left ${
                  isActive
                    ? "bg-[#FF553E]/[0.1] text-[#FF553E] dark:bg-[#FF553E]/[0.15] dark:text-[#FF7A62]"
                    : "text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.span
                      key={`label-${href}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`text-[13.5px] font-medium whitespace-nowrap overflow-hidden ${
                        isActive ? "text-[#FF553E] dark:text-[#FF7A62]" : ""
                      }`}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Bottom utilities ── */}
      <div className="px-2 pb-3 flex flex-col gap-1 flex-shrink-0">
        {/* Divider */}
        <div className="mx-2 mb-2 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-foreground transition-colors duration-150"
        >
          {isDark
            ? <Sun className="w-4 h-4 flex-shrink-0" />
            : <Moon className="w-4 h-4 flex-shrink-0" />}
          <AnimatePresence initial={false}>
            {open && (
              <motion.span
                key="theme-label"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden"
              >
                {isDark ? "Light mode" : "Dark mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Toggle collapse */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-foreground transition-colors duration-150"
        >
          <motion.div
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.span
                key="collapse-label"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
