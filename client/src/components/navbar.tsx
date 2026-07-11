import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChartSpline, Eye, PaintRoller, Check, Menu, Pipette, ChevronDown, Sparkles } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import profileImg from "@/assets/images/profile.png";
import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/use-mobile";
import { useTemplate } from "@/hooks/use-template";
import type { BackgroundMode } from "@/hooks/use-template";

import SwitchToggleThemeDemo from "@/components/ui/toggle-theme";
import { FluidDropdown } from "@/components/ui/fluid-dropdown";
import { PublishDropdown } from "@/components/ui/publish-dropdown";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";

export default function Navbar() {
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const [customColor, setCustomColor] = useState("#D4C5F9");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { activeTemplate, setActiveTemplate, activeBackground, setActiveBackground, backgroundMode, setBackgroundMode, typographySize, setTypographySize } = useTemplate();
  const [themePanelTab, setThemePanelTab] = useState<"themes" | "backgrounds">("themes");
  const [showMoreBackgrounds, setShowMoreBackgrounds] = useState(false);
  const { resolvedTheme } = useTheme();
  const navIsDark = navMounted && resolvedTheme === "dark";

  useEffect(() => { setNavMounted(true); }, []);

  const BACKGROUNDS = [
    { id: "wall1", src: "/backgrounds/wall1.png", label: "Meadow" },
    { id: "wall2", src: "/backgrounds/wall2.png", label: "Wall" },
  ];

  const PASTELS = [
    { id: "none",     color: "transparent", darkColor: "transparent", label: "None" },
    { id: "blush",    color: "#FFD6E0", darkColor: "#3D1F2A", label: "Blush" },
    { id: "lavender", color: "#E2D9F3", darkColor: "#2A1F3D", label: "Lavender" },
    { id: "sage",     color: "#C8E6C9", darkColor: "#1A2E20", label: "Sage" },
    { id: "sky",      color: "#C5E3F7", darkColor: "#1A2A3D", label: "Sky" },
    { id: "peach",    color: "#FFE0C8", darkColor: "#3D2A1A", label: "Peach" },
    { id: "butter",   color: "#FFF4C2", darkColor: "#2E2A10", label: "Butter" },
    { id: "mint",     color: "#C8F0E8", darkColor: "#1A2E2A", label: "Mint" },
    { id: "lilac",    color: "#EDD5F0", darkColor: "#2E1F3D", label: "Lilac" },
  ];

  useEffect(() => {
    const checkOverlay = () => setIsOverlay(window.innerWidth < 1024);
    checkOverlay();
    window.addEventListener('resize', checkOverlay);
    return () => window.removeEventListener('resize', checkOverlay);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (isThemePanelOpen) {
        root.classList.add('theme-panel-open');
      } else {
        root.classList.remove('theme-panel-open');
      }
    }
    return () => {
      if (root) root.classList.remove('theme-panel-open');
    };
  }, [isThemePanelOpen]);

  useEffect(() => {
    if (isThemePanelOpen) {
      window.dispatchEvent(new CustomEvent('panelOpened', { detail: 'theme' }));
    }
  }, [isThemePanelOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      window.dispatchEvent(new CustomEvent('panelOpened', { detail: 'mobile-menu' }));
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handlePanelOpened = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== 'theme') {
        setIsThemePanelOpen(false);
      }
      if (customEvent.detail !== 'mobile-menu' && customEvent.detail !== 'fluid-dropdown-open') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('panelOpened', handlePanelOpened);
    return () => window.removeEventListener('panelOpened', handlePanelOpened);
  }, []);

  return (
    <TooltipProvider>
      <div className="fixed top-0 left-[72px] right-0 z-50 flex justify-center pointer-events-none pt-4 px-4">
        <nav className="bg-white dark:bg-[#2A2520] border border-black/8 dark:border-white/10 rounded-full shadow-sm pointer-events-auto w-fit">
          <div className="px-2 py-2 flex items-center gap-2">

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] h-10 w-10 rounded-full hover:cursor-pointer"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl bg-white dark:bg-[#2A2520] border-t border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col gap-4">
                  <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsThemePanelOpen(true);
                    }}
                  >
                    <PaintRoller className="mr-2 h-4 w-4" />
                    Themes settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ChartSpline className="mr-2 h-4 w-4" />
                    Insights
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <div className="flex w-full items-center justify-between gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 mt-2">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">
                        shai.designfolio.me
                      </span>
                      <span className="text-[11px] text-[#7A736C] dark:text-[#9E9893]">
                        Updated 29 days ago
                      </span>
                    </div>
                    <Button 
                      className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-4 h-8 text-xs rounded-lg whitespace-nowrap flex-shrink-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="secondary" 
              className="group bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 px-3 rounded-full hover:cursor-pointer gap-1.5 text-[13px] font-medium"
              data-testid="button-insights"
            >
              <ChartSpline size={15} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 flex-shrink-0" />
              Insights
            </Button>
            <Sheet modal={false} open={isThemePanelOpen} onOpenChange={setIsThemePanelOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="group bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 px-3 rounded-full hover:cursor-pointer gap-1.5 text-[13px] font-medium"
                  data-testid="button-themes"
                >
                  <PaintRoller size={15} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 flex-shrink-0" />
                  Themes
                </Button>
              </SheetTrigger>
              <SheetContent 
                className="border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-0 flex flex-col" 
                hasOverlay={isOverlay}
                onInteractOutside={(e) => {
                  if (!isOverlay) {
                    e.preventDefault();
                  }
                }}
              >
                <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center m-0 space-y-0 h-[65px]">
                  <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] font-medium m-0">Themes settings</SheetTitle>
                </SheetHeader>

                {/* Tabs */}
                <div className="flex border-b border-black/10 dark:border-white/10 flex-shrink-0 px-5">
                  {(["themes", "backgrounds"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setThemePanelTab(tab)}
                      className={cn(
                        "py-3 px-1 mr-5 text-[13px] font-medium border-b-[2px] transition-colors capitalize",
                        themePanelTab === tab
                          ? "border-[#FF5A36] text-[#1A1A1A] dark:text-[#F0EDE7]"
                          : "border-transparent text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  {themePanelTab === "themes" ? (
                    <div className="space-y-8">
                      <SwitchToggleThemeDemo />
                      {activeTemplate === "Minimal" && (
                        <div className="space-y-3 pt-2">
                          <div className="text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] px-1">Typography</div>
                          <div className="grid grid-cols-2 gap-2">
                            {(
                              [
                                { value: "compact", label: "Compact", description: "Tight, focused sizing" },
                                { value: "expressive", label: "Expressive", description: "Bolder type hierarchy" },
                              ] as { value: "compact" | "expressive"; label: string; description: string }[]
                            ).map((opt) => {
                              const isActive = typographySize === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => setTypographySize(opt.value)}
                                  className={cn(
                                    "relative flex flex-col gap-1 px-3 py-3 rounded-2xl border text-left transition-all focus:outline-none cursor-pointer",
                                    isActive
                                      ? "border-[#FF5A36] bg-[#FF5A36]/5 dark:bg-[#FF5A36]/10"
                                      : "border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                                  )}
                                >
                                  <span className={cn(
                                    "text-[13px] font-medium transition-colors",
                                    isActive ? "text-[#FF5A36]" : "text-[#1A1A1A] dark:text-[#F0EDE7]"
                                  )}>{opt.label}</span>
                                  <span className="text-[11px] text-[#7A736C] dark:text-[#9E9893] leading-tight">{opt.description}</span>
                                  {isActive && (
                                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#FF5A36] flex items-center justify-center">
                                      <Check size={9} strokeWidth={3.5} className="text-white" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 pt-2">
                        <div className="text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] px-1">Templates</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-4">
                          {["Minimal", "Professional", "Creative", "Chatfolio", "Designer"].map((template) => {
                            const isSelected = activeTemplate === template;
                            return (
                              <div key={template} className="flex flex-col gap-3 items-center">
                                <div className="relative w-full">
                                  <button 
                                    onClick={() => setActiveTemplate(template)}
                                    className={cn(
                                      "w-full aspect-square rounded-[24px] transition-all focus:outline-none cursor-pointer group",
                                      isSelected 
                                        ? "border-[2.5px] border-[#FF5A36] p-1.5" 
                                        : "border-[2.5px] border-transparent p-1.5 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-full h-full rounded-[14px] overflow-hidden transition-all shadow-sm border border-black/5 dark:border-white/5 relative",
                                      isSelected 
                                        ? "bg-[#F0EDE7] dark:bg-[#3A3531]" 
                                        : "bg-[#F5F5F5] dark:bg-[#2A2520] group-hover:shadow-md"
                                    )}>
                                      <div className="absolute inset-0 p-3 flex flex-col gap-2 opacity-40">
                                        <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-full bg-black/20 dark:bg-white/20" />
                                          <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                                        </div>
                                        <div className="w-full h-12 mt-1 rounded-md bg-black/10 dark:bg-white/10" />
                                        <div className="flex gap-2 mt-auto">
                                          <div className="w-full h-8 rounded-md bg-black/10 dark:bg-white/10" />
                                          <div className="w-full h-8 rounded-md bg-black/10 dark:bg-white/10" />
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                  {isSelected && (
                                    <div className="absolute -bottom-1 -left-1 bg-[#FF5A36] text-white rounded-full p-1.5 shadow-sm flex items-center justify-center border-[2px] border-white dark:border-[#2A2520] z-10">
                                      <Check size={14} strokeWidth={3.5} />
                                    </div>
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[14px] text-center transition-colors font-medium",
                                  isSelected 
                                    ? "text-[#FF5A36]" 
                                    : "text-[#7A736C] dark:text-[#9E9893]"
                                )}>
                                  {template}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 pt-1">

                      {/* Display mode toggle */}
                      <div className="space-y-2">
                        <p className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] px-1">Display mode</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              { value: "header", label: "Header only", description: "Image in top section" },
                              { value: "full-page", label: "Full page", description: "Image behind all sections" },
                            ] as { value: BackgroundMode; label: string; description: string }[]
                          ).map((mode) => {
                            const isActive = backgroundMode === mode.value;
                            return (
                              <button
                                key={mode.value}
                                onClick={() => setBackgroundMode(mode.value)}
                                className={cn(
                                  "relative flex flex-col gap-1 px-3 py-3 rounded-2xl border text-left transition-all focus:outline-none cursor-pointer",
                                  isActive
                                    ? "border-black/20 dark:border-white/20 bg-black/4 dark:bg-white/6"
                                    : "border-black/8 dark:border-white/8 hover:border-black/15 dark:hover:border-white/15 bg-transparent"
                                )}
                              >
                                {/* Mini visual preview */}
                                <div className="w-full rounded-lg overflow-hidden mb-1 border border-black/8 dark:border-white/8" style={{ aspectRatio: "16/7" }}>
                                  {mode.value === "header" ? (
                                    <div className="w-full h-full flex flex-col">
                                      <div className="flex-[0_0_45%] bg-gradient-to-br from-amber-200/60 to-orange-200/60 dark:from-amber-900/40 dark:to-orange-900/40" />
                                      <div className="flex-1 bg-[#F0EDE7] dark:bg-[#2A2520]" />
                                    </div>
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-amber-200/60 to-orange-200/60 dark:from-amber-900/40 dark:to-orange-900/40 relative">
                                      <div className="absolute inset-x-2 top-2 bottom-2 rounded bg-white/30 dark:bg-black/20 backdrop-blur-[1px]" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-[12px] font-medium leading-tight text-[#1A1A1A] dark:text-[#F0EDE7]">
                                  {mode.label}
                                </span>
                                <span className="text-[11px] text-[#7A736C] dark:text-[#9E9893] leading-tight">
                                  {mode.description}
                                </span>
                                {isActive && (
                                  <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#1A1A1A] dark:bg-[#F0EDE7] flex items-center justify-center">
                                    <Check size={8} strokeWidth={3} className="text-white dark:text-[#1A1A1A]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-black/8 dark:bg-white/8" />

                      {/* Background options */}
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] px-1">Background</p>
                        <div className="grid grid-cols-2 gap-3">

                          {/* Image options */}
                          {BACKGROUNDS.map((bg) => {
                            const isSelected = activeBackground === bg.src;
                            return (
                              <div key={bg.id} className="flex flex-col gap-2 items-center">
                                <div className="relative w-full">
                                  <button
                                    onClick={() => setActiveBackground(bg.src)}
                                    className={cn(
                                      "w-full rounded-[18px] transition-all focus:outline-none cursor-pointer overflow-hidden",
                                      isSelected
                                        ? "ring-[2.5px] ring-[#FF5A36] ring-offset-2 ring-offset-white dark:ring-offset-[#2A2520]"
                                        : "ring-[2px] ring-transparent hover:ring-black/10 dark:hover:ring-white/10"
                                    )}
                                    style={{ aspectRatio: "16/9" }}
                                  >
                                    <img
                                      src={bg.src}
                                      alt={bg.label}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                  {isSelected && (
                                    <div className="absolute -bottom-1 -left-1 bg-[#FF5A36] text-white rounded-full p-1.5 shadow-sm flex items-center justify-center border-[2px] border-white dark:border-[#2A2520] z-10">
                                      <Check size={14} strokeWidth={3.5} />
                                    </div>
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[13px] text-center font-medium transition-colors",
                                  isSelected ? "text-[#FF5A36]" : "text-[#7A736C] dark:text-[#9E9893]"
                                )}>
                                  {bg.label}
                                </span>
                              </div>
                            );
                          })}

                          {/* Coming soon placeholder + reveal trigger */}
                          <div className="flex flex-col gap-2 items-center">
                            <div
                              className="w-full rounded-[18px] border border-dashed border-black/12 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] flex flex-col items-center justify-center gap-1 text-center px-2"
                              style={{ aspectRatio: "16/9" }}
                            >
                              <Sparkles size={14} className="text-[#B0A99F] dark:text-[#6E6862]" />
                              <span className="text-[10px] font-medium text-[#B0A99F] dark:text-[#6E6862]">
                                Coming soon
                              </span>
                            </div>
                            <span className="text-[13px] text-center font-medium text-[#7A736C] dark:text-[#9E9893]">
                              New backdrop
                            </span>
                          </div>

                          <AnimatePresence mode="popLayout" initial={false}>
                            {!showMoreBackgrounds ? (
                              <motion.div
                                key="view-more-trigger"
                                layout
                                initial={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                                className="flex flex-col gap-2 items-center"
                              >
                                <button
                                  onClick={() => setShowMoreBackgrounds(true)}
                                  className="w-full rounded-[18px] border border-black/8 dark:border-white/8 hover:border-black/15 dark:hover:border-white/15 bg-transparent flex flex-col items-center justify-center gap-1 cursor-pointer transition-all focus:outline-none"
                                  style={{ aspectRatio: "16/9" }}
                                >
                                  <ChevronDown size={16} className="text-[#1A1A1A] dark:text-[#F0EDE7]" />
                                  <span className="text-[11px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">
                                    View 5 more
                                  </span>
                                </button>
                                <span className="text-[13px] text-center font-medium text-transparent select-none">
                                  spacer
                                </span>
                              </motion.div>
                            ) : (
                              Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                  key={`coming-soon-${i}`}
                                  layout
                                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] }}
                                  className="flex flex-col gap-2 items-center"
                                >
                                  <div
                                    className="w-full rounded-[18px] border border-dashed border-black/12 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] flex flex-col items-center justify-center gap-1 text-center px-2"
                                    style={{ aspectRatio: "16/9" }}
                                  >
                                    <Sparkles size={14} className="text-[#B0A99F] dark:text-[#6E6862]" />
                                    <span className="text-[10px] font-medium text-[#B0A99F] dark:text-[#6E6862]">
                                      Coming soon
                                    </span>
                                  </div>
                                  <span className="text-[13px] text-center font-medium text-[#7A736C] dark:text-[#9E9893]">
                                    New backdrop
                                  </span>
                                </motion.div>
                              ))
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-black/8 dark:bg-white/8" />

                      {/* Colors */}
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] px-1">Colors</p>
                        <div className="grid grid-cols-4 gap-2">
                          {PASTELS.map((p) => {
                            const isSelected = activeBackground === p.color;
                            const isNone = p.id === "none";
                            return (
                              <div key={p.id} className="flex flex-col gap-1.5 items-center">
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveBackground(p.color)}
                                    title={p.label}
                                    className={cn(
                                      "w-10 h-10 rounded-full transition-all focus:outline-none cursor-pointer border-[2px] overflow-hidden relative",
                                      isSelected
                                        ? "border-[#FF5A36] scale-110 shadow-md"
                                        : "border-black/10 dark:border-white/10 hover:scale-105 hover:shadow-sm"
                                    )}
                                  >
                                    {isNone ? (
                                      /* Transparent / none — white base with a red diagonal slash */
                                      <div className="absolute inset-0 bg-white dark:bg-[#2A2520]">
                                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" preserveAspectRatio="none">
                                          <line x1="4" y1="36" x2="36" y2="4" stroke="#FF5A36" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <>
                                        {/* Light half — top-left triangle */}
                                        <div
                                          className="absolute inset-0"
                                          style={{
                                            backgroundColor: p.color,
                                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                                          }}
                                        />
                                        {/* Dark half — bottom-right triangle */}
                                        <div
                                          className="absolute inset-0"
                                          style={{
                                            backgroundColor: p.darkColor,
                                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                                          }}
                                        />
                                      </>
                                    )}
                                  </button>
                                  {isSelected && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#FF5A36] text-white rounded-full flex items-center justify-center border border-white dark:border-[#2A2520]">
                                      <Check size={8} strokeWidth={3.5} />
                                    </div>
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[10px] text-center font-medium transition-colors leading-tight",
                                  isSelected ? "text-[#FF5A36]" : "text-[#7A736C] dark:text-[#9E9893]"
                                )}>
                                  {p.label}
                                </span>
                              </div>
                            );
                          })}

                          {/* Custom color picker */}
                          {(() => {
                            const presetColors = new Set(PASTELS.map((p) => p.color));
                            const isCustomActive =
                              !activeBackground.startsWith("/") &&
                              activeBackground !== "default" &&
                              !presetColors.has(activeBackground);
                            return (
                              <div className="flex flex-col gap-1.5 items-center">
                                <div className="relative">
                                  <button
                                    onClick={() => colorInputRef.current?.click()}
                                    title="Custom color"
                                    className={cn(
                                      "w-10 h-10 rounded-full transition-all focus:outline-none cursor-pointer border-[2px] overflow-hidden relative",
                                      isCustomActive
                                        ? "border-[#FF5A36] scale-110 shadow-md"
                                        : "border-black/10 dark:border-white/10 hover:scale-105 hover:shadow-sm"
                                    )}
                                  >
                                    {isCustomActive ? (
                                      /* Show the chosen custom color */
                                      <div className="absolute inset-0" style={{ backgroundColor: activeBackground }} />
                                    ) : (
                                      /* Rainbow spectrum swatch */
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          background:
                                            "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff, #ff6b6b)",
                                        }}
                                      />
                                    )}
                                  </button>
                                  {isCustomActive && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#FF5A36] text-white rounded-full flex items-center justify-center border border-white dark:border-[#2A2520]">
                                      <Check size={8} strokeWidth={3.5} />
                                    </div>
                                  )}
                                  {/* Hidden native color input */}
                                  <input
                                    ref={colorInputRef}
                                    type="color"
                                    value={isCustomActive ? activeBackground : customColor}
                                    onChange={(e) => {
                                      setCustomColor(e.target.value);
                                      setActiveBackground(e.target.value);
                                    }}
                                    className="sr-only"
                                    aria-label="Pick a custom background color"
                                  />
                                </div>
                                <span className={cn(
                                  "text-[10px] text-center font-medium transition-colors leading-tight",
                                  isCustomActive ? "text-[#FF5A36]" : "text-[#7A736C] dark:text-[#9E9893]"
                                )}>
                                  Custom
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              variant="secondary" 
              size="icon"
              className="group bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 w-9 rounded-full hover:cursor-pointer"
              data-testid="button-preview"
            >
              <Eye size={16} className="transition-transform duration-300 group-hover:scale-125" />
            </Button>
            <PublishDropdown />
          </div>
        </div>
      </nav>
    </div>
    </TooltipProvider>
  );
}
