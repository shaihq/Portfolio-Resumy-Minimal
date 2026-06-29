import { useEffect, useState, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronLeft, Phone, Upload } from "lucide-react";
import { CaseStudyEditor } from "@/components/case-study-editor";
import { SectionManager } from "@/components/section-manager";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AtSignIcon } from "lucide-animated";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTemplate } from "@/hooks/use-template";
import { cn } from "@/lib/utils";
import profileImg from "@/assets/images/profile.png";
import project2 from "@/assets/images/project2.png";
import slateImage from "@/assets/images/image_1772894732476.png";
import contentImage from "@/assets/images/image_1772895554431.png";

const projectsData: Record<string, any> = {
  slate: {
    id: "slate",
    title: "Redesigning Quote Builder at Freshworks for 1,900+ Enterprise Users",
    subtitle: "Focused on enhancing the experience for customers in the U.S.",
    image: slateImage,
    details: { client: "Startup Co.", role: "Lead Designer", industry: "SaaS", platform: "Web app" },
    introduction: "Freshsales, part of the Freshworks family, is a CRM designed to help sales teams manage leads, track deals, and close more business with less effort. It offers tools like email tracking, deal pipelines, and AI-powered insights, all aimed at making the sales process smoother and more efficient.\n\nIn this project, I'm redesigning the quote builder experience. The focus is on making it simpler and more intuitive for users to create and share quotes effortlessly. It's a meaningful update to a feature that's central to the sales workflow.",
    examples: []
  },
  antimetal: {
    id: "antimetal",
    title: "Antimetal",
    subtitle: "A dynamic, animation-focused landing page highlighting creative transitions",
    image: project2,
    details: { client: "Creative Studio", role: "Design Director", industry: "Entertainment", platform: "Web app" },
    introduction: "Antimetal pushes the boundaries of digital design through bold, carefully-crafted animations. This project demonstrates how motion design can tell a story and create memorable user experiences. Every animation serves a purpose, contributing to the overall narrative.",
    examples: []
  }
};

// ─── Editable inline text ─────────────────────────────────────────────────────

function EditableField({ value, onChange, className, placeholder, tag = "span" }: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  tag?: "span" | "h1" | "p" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const committed = useRef(value);

  // Only push external value into DOM when the field isn't focused
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && committed.current !== value) {
      ref.current.textContent = value;
      committed.current = value;
    }
  }, [value]);

  const Tag = tag as any;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder ?? "Click to edit…"}
      onFocus={() => { committed.current = ref.current?.textContent ?? ""; }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = e.currentTarget.textContent ?? "";
        committed.current = v;
        onChange(v);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        // Enter blurs single-line tags
        if (e.key === "Enter" && tag !== "div" && tag !== "p") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={[
        "outline-none cursor-text rounded-sm transition-colors",
        "focus:bg-black/[0.04] dark:focus:bg-white/[0.06] focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10",
        "empty:after:content-[attr(data-placeholder)] empty:after:opacity-30 empty:after:pointer-events-none",
        className ?? "",
      ].join(" ")}
    >
      {value}
    </Tag>
  );
}

// ─── Thumbnail upload wrapper ─────────────────────────────────────────────────

function ThumbnailUpload({ imageUrl, onUpload, children, className }: {
  imageUrl: string;
  onUpload: (url: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const readFile = (file: File) => {
    const r = new FileReader();
    r.onload = (e) => { const u = e.target?.result as string; if (u) onUpload(u); };
    r.readAsDataURL(file);
  };
  return (
    <div
      className={cn("relative group/thumb cursor-pointer", className)}
      onClick={() => inputRef.current?.click()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) readFile(f); }}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/25 transition-all">
        <span className="opacity-0 group-hover/thumb:opacity-100 flex items-center gap-1.5 text-white text-[12px] font-medium bg-black/55 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm">
          <Upload size={11} /> Change photo
        </span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Project() {
  const [match, params] = useRoute("/project/:id");
  const [, navigate] = useLocation();
  const { activeTemplate } = useTemplate();
  const [isProjectPasswordEnabled, setIsProjectPasswordEnabled] = useState(false);
  const [heroView, setHeroView] = useState<"immersive" | "editorial">("immersive");
  const [thumbnailWidth, setThumbnailWidth] = useState<"full" | "contained">("full");
  const [thumbnailHeight, setThumbnailHeight] = useState<number | null>(null);
  const thumbnailImgRef = useRef<HTMLDivElement>(null);
  const [showHeightHandle, setShowHeightHandle] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [heightHandleHovered, setHeightHandleHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], ["0%", "30%"]);

  const projectId = (params?.id as string)?.toLowerCase();

  useEffect(() => { window.scrollTo(0, 0); }, [projectId]);

  if (!match) return null;

  const project = projectsData[projectId] || projectsData.slate;

  // ─── Editable metadata — persisted to localStorage ──────────────────────────
  const metaKey = `project-meta-v1-${projectId}`;
  const defaultMeta = {
    title:         project.title        as string,
    subtitle:      (project.subtitle ?? project.description ?? "") as string,
    imageUrl:      project.image        as string,
    // "Role" column
    roleLabel:     "Role",
    rolePrimary:   project.details.client as string,
    roleSecondary: project.details.role   as string,
    // "Timeline" column
    timelineLabel: "Timeline",
    timeline:      project.details.industry as string,
    // "Tools" column
    toolsLabel:    "Tools",
    tools:         project.details.platform as string,
    // "Team" column
    teamLabel:     "Team",
    teamPrimary:   "Designer: Me",
    teamSecondary: "Collaborators: PMs, Devs",
  };

  // Only user-uploaded images (base64 or http/https) should be restored from
  // localStorage. Vite-bundled asset URLs are hashed at build time and become
  // stale after every rebuild, causing the hero image to disappear silently.
  const isUserImage = (url: string) =>
    url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [meta, setMetaState] = useState<typeof defaultMeta>(() => {
    try {
      const saved = localStorage.getItem(metaKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Discard any stale bundled-asset imageUrl; always use the fresh import.
        const { imageUrl: savedImg, ...restParsed } = parsed;
        const mergedImage = savedImg && isUserImage(savedImg) ? { imageUrl: savedImg } : {};
        return { ...defaultMeta, ...restParsed, ...mergedImage };
      }
    } catch {}
    return defaultMeta;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateMeta = useCallback((patch: Partial<typeof defaultMeta>) => {
    setMetaState(prev => {
      const next = { ...prev, ...patch };
      try {
        // Never persist bundled asset URLs — only user-supplied images survive
        // across rebuilds. Strip imageUrl from the persisted value when it is
        // not a user-uploaded file so the fresh import is always used on load.
        // Never persist bundled asset URLs. Only user-uploaded data:/http(s)
        // images survive across rebuilds. Omit imageUrl when it is a Vite
        // hashed URL so the fresh import is always used on the next load.
        const { imageUrl: _img, ...rest } = next;
        const toSave = isUserImage(_img) ? { ...rest, imageUrl: _img } : rest;
        localStorage.setItem(metaKey, JSON.stringify(toSave));
      } catch {}
      return next;
    });
  }, [metaKey]);

  // ─── Animation variants ──────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const itemVariants: any = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // CHATFOLIO TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeTemplate === "Chatfolio") {
    return (
      <motion.div
        initial="hidden" animate="visible" variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A8CFF] selection:text-white transition-colors duration-700"
      >
        <div className="w-full max-w-2xl bg-[#F0EDE7] dark:bg-[#1A1A1A] flex flex-col min-h-screen relative pt-8 pb-24 px-4 sm:px-6">
          <motion.div variants={itemVariants} className="mb-6 pt-2">
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group">
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Projects
            </button>
          </motion.div>

          <div className="space-y-6">
            {/* Title + Image bubble */}
            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%] pt-4">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] p-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full flex flex-col gap-4">
                  <div className="flex flex-col text-left px-1">
                    <EditableField
                      value={meta.title} onChange={(v) => updateMeta({ title: v })} tag="h1" placeholder="Project title…"
                      className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-2"
                    />
                    <EditableField
                      value={meta.subtitle} onChange={(v) => updateMeta({ subtitle: v })} tag="p" placeholder="Short subtitle…"
                      className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed max-w-md"
                    />
                  </div>
                  <ThumbnailUpload imageUrl={meta.imageUrl} onUpload={(url) => updateMeta({ imageUrl: url })}
                    className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5">
                    <img src={meta.imageUrl} alt={meta.title} className="w-full h-full object-cover" />
                  </ThumbnailUpload>
                </div>
              </div>
            </motion.div>

            {/* "You" prompt */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <div className="flex flex-col gap-1 max-w-[85%] items-end">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] mr-1 font-medium">You</span>
                <div className="bg-[#1A8CFF] dark:bg-[#0073E6] text-white px-4 py-3 rounded-2xl rounded-br-sm text-[15px] leading-relaxed shadow-sm">
                  Can you share more details about this project?
                </div>
              </div>
            </motion.div>

            {/* Details bubble */}
            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] px-5 py-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full">
                  <p className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] mb-4">Sure! Here are the core details:</p>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {[
                      { label: meta.roleLabel, value: meta.rolePrimary, key: "rolePrimary" as const, labelKey: "roleLabel" as const },
                      { label: meta.timelineLabel, value: meta.timeline, key: "timeline" as const, labelKey: "timelineLabel" as const },
                      { label: meta.toolsLabel, value: meta.tools, key: "tools" as const, labelKey: "toolsLabel" as const },
                      { label: meta.teamLabel, value: meta.teamPrimary, key: "teamPrimary" as const, labelKey: "teamLabel" as const },
                    ].map(({ label, value, key, labelKey }) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <EditableField value={label} onChange={(v) => updateMeta({ [labelKey]: v })}
                          className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wide" />
                        <EditableField value={value} onChange={(v) => updateMeta({ [key]: v })}
                          className="text-[14px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* "Process" prompt + overview */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <div className="flex flex-col gap-1 max-w-[85%] items-end">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] mr-1 font-medium">You</span>
                <div className="bg-[#1A8CFF] dark:bg-[#0073E6] text-white px-4 py-3 rounded-2xl rounded-br-sm text-[15px] leading-relaxed shadow-sm">
                  What was the process like?
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] p-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full flex flex-col gap-5">
                  <div className="px-1 space-y-4">
                    {project.introduction.split("\n\n").map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <div className="w-full rounded-xl overflow-hidden bg-[#E7E3D9] dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5">
                    <img src={contentImage} alt="Project context" className="w-full h-auto mix-blend-multiply dark:mix-blend-normal opacity-90" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mt-12 mb-8">
              <Button onClick={() => navigate("/")} className="rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-200 h-12 px-8 shadow-sm">
                Back to Projects
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PROFESSIONAL TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeTemplate === "Professional") {
    return (
      <motion.div
        initial="hidden" animate="visible" variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#E37941] selection:text-white transition-colors duration-700"
      >
        <div className="w-full max-w-[750px] relative min-h-screen bg-[#EFECE6] dark:bg-[#1A1A1A] flex flex-col transition-colors duration-700 border-x border-[#D5D0C6] dark:border-[#3A352E]">
          <motion.div variants={itemVariants} className="border-b border-[#D5D0C6] dark:border-[#3A352E] flex justify-between items-center px-4 py-3 font-['JetBrains_Mono'] text-[13px] uppercase tracking-wide text-[#1A1A1A] dark:text-[#B5AFA5] bg-[#EFECE6] dark:bg-[#1A1A1A] sticky top-0 z-50">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:text-[#E37941] transition-colors">
              <ChevronLeft size={16} /> BACK
            </button>
            <div className="tracking-wider">PROJECT / {project.id}</div>
          </motion.div>

          <div className="p-4 md:p-6 space-y-10 pb-16">
            <motion.div variants={itemVariants}>
              <EditableField value={meta.title} onChange={(v) => updateMeta({ title: v })} tag="h1" placeholder="Project title…"
                className="font-['JetBrains_Mono'] text-[22px] md:text-[28px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-[1.2] mb-4 uppercase tracking-tight block w-full" />
              <EditableField value={meta.subtitle} onChange={(v) => updateMeta({ subtitle: v })} tag="p" placeholder="Short subtitle…"
                className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed block w-full" />
            </motion.div>

            {/* Hero image */}
            <motion.div variants={itemVariants} className="relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
              <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none" />
              <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30" />
              <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-4 md:p-5 relative overflow-hidden">
                <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]" />
                <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]" />
                <div className="absolute bottom-2.5 left-2.5 md:bottom-3 md:left-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]" />
                <div className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]" />
                <ThumbnailUpload imageUrl={meta.imageUrl} onUpload={(url) => updateMeta({ imageUrl: url })}
                  className="w-full aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                  <img src={meta.imageUrl} alt={meta.title} className="w-full h-full object-cover" />
                </ThumbnailUpload>
              </div>
            </motion.div>

            {/* Details grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-[#D5D0C6] dark:border-[#3A352E] py-6">
              {[
                { labelKey: "roleLabel" as const, label: meta.roleLabel, valueKey: "rolePrimary" as const, value: meta.rolePrimary },
                { labelKey: "timelineLabel" as const, label: meta.timelineLabel, valueKey: "timeline" as const, value: meta.timeline },
                { labelKey: "toolsLabel" as const, label: meta.toolsLabel, valueKey: "tools" as const, value: meta.tools },
                { labelKey: "teamLabel" as const, label: meta.teamLabel, valueKey: "teamPrimary" as const, value: meta.teamPrimary },
              ].map(({ labelKey, label, valueKey, value }) => (
                <div key={valueKey}>
                  <EditableField value={label} onChange={(v) => updateMeta({ [labelKey]: v })}
                    className="font-['JetBrains_Mono'] text-[11px] text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wider mb-2 block" />
                  <EditableField value={value} onChange={(v) => updateMeta({ [valueKey]: v })}
                    className="font-['JetBrains_Mono'] text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] uppercase block" />
                </div>
              ))}
            </motion.div>

            {/* Introduction */}
            <motion.div variants={itemVariants}>
              <h3 className="font-['JetBrains_Mono'] text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold mb-6 uppercase tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 bg-[#E37941]" /> Overview
              </h3>
              <div className="space-y-6">
                {project.introduction.split("\n\n").map((paragraph: string, idx: number) => (
                  <p key={idx} className="font-['Inter'] text-[#1A1A1A] dark:text-[#B5AFA5] text-[15px] leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="border border-[#D5D0C6] dark:border-[#3A352E] p-3 bg-[#DED9CE] dark:bg-[#2A2520]">
              <div className="border border-[#D5D0C6] dark:border-[#3A352E] relative overflow-hidden">
                <img src={contentImage} alt="Project details" className="w-full mix-blend-multiply dark:mix-blend-normal opacity-90 grayscale-[0.2]" style={{ filter: "contrast(1.1)" }} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-[#D5D0C6] dark:border-[#3A352E] flex justify-between items-center">
              <button onClick={() => navigate("/")} className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0EDE7] hover:text-[#E37941] dark:hover:text-[#E37941] transition-colors flex items-center gap-2">
                <ChevronLeft size={16} /> All Projects
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CREATIVE TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeTemplate === "Creative") {
    return (
      <div className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#E8CF82] selection:text-[#1A1A1A] transition-colors duration-700 p-4 md:p-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-[750px] flex flex-col gap-3 pb-20 pt-0">

          {/* Nav card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 py-2 px-4 flex justify-between items-center w-full">
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group">
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Projects
            </button>
            <div className="flex items-center gap-4">
              <div className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] opacity-50 hidden sm:block">PROJECT / {project.id}</div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A] dark:text-[#F0EDE7] transition-all focus-visible:ring-0 focus-visible:ring-offset-0" title="Lock Case Study">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenu>
                    <div className="flex flex-col gap-4 p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Label className="text-[14px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] cursor-pointer">Protect Project</Label>
                          <p className="text-[12px] text-[#7A736C] dark:text-[#9E9893] leading-snug">Require a password to view this project (e.g., for NDAs).</p>
                        </div>
                        <Switch checked={isProjectPasswordEnabled} onCheckedChange={setIsProjectPasswordEnabled} className="mt-0.5 data-[state=checked]:bg-[#1A1A1A] dark:data-[state=checked]:bg-[#F0EDE7]" />
                      </div>
                      <AnimatePresence>
                        {isProjectPasswordEnabled && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <Input id="proj-password" type="password" placeholder="Enter password"
                              className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </DropdownMenu>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="h-7 text-[12px] rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A] dark:text-[#F0EDE7] flex items-center gap-1.5 px-3 transition-all focus-visible:ring-0 focus-visible:ring-offset-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Analyze with AI
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Header + image card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-2 md:p-3 w-full">
            <div className="p-5 md:p-6 pb-7 md:pb-10">
              <EditableField value={meta.title} onChange={(v) => updateMeta({ title: v })} tag="h1" placeholder="Project title…"
                className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] tracking-tight leading-tight mb-5 block w-full" />
              <EditableField value={meta.subtitle} onChange={(v) => updateMeta({ subtitle: v })} tag="p" placeholder="Short subtitle…"
                className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed max-w-[600px] block" />
            </div>
            <ThumbnailUpload imageUrl={meta.imageUrl} onUpload={(url) => updateMeta({ imageUrl: url })}
              className="w-full rounded-[20px] overflow-hidden bg-[#F5F5F5] dark:bg-[#1A1A1A]">
              <img src={meta.imageUrl} alt={meta.title} className="w-full h-full object-cover" />
            </ThumbnailUpload>
          </motion.div>

          {/* Details card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-9 w-full">
            <h2 className="text-[#7A736C] dark:text-[#B5AFA5] mb-8" style={{ fontFamily: "DM Mono, monospace", fontSize: "14px", fontWeight: 500 }}>PROJECT DETAILS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { labelKey: "roleLabel" as const, label: meta.roleLabel, valueKey: "rolePrimary" as const, value: meta.rolePrimary, subKey: "roleSecondary" as const, sub: meta.roleSecondary },
                { labelKey: "timelineLabel" as const, label: meta.timelineLabel, valueKey: "timeline" as const, value: meta.timeline },
                { labelKey: "toolsLabel" as const, label: meta.toolsLabel, valueKey: "tools" as const, value: meta.tools },
                { labelKey: "teamLabel" as const, label: meta.teamLabel, valueKey: "teamPrimary" as const, value: meta.teamPrimary, subKey: "teamSecondary" as const, sub: meta.teamSecondary },
              ].map(({ labelKey, label, valueKey, value, subKey, sub }) => (
                <div key={valueKey} className="flex flex-col gap-2">
                  <EditableField value={label} onChange={(v) => updateMeta({ [labelKey]: v })}
                    className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wide block" />
                  <EditableField value={value} onChange={(v) => updateMeta({ [valueKey]: v })}
                    className="text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] block" />
                  {subKey && sub !== undefined && (
                    <EditableField value={sub} onChange={(v) => updateMeta({ [subKey]: v })}
                      className="text-[13px] text-[#7A736C] dark:text-[#B5AFA5] block" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Overview card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-9 w-full">
            <h2 className="text-[#7A736C] dark:text-[#B5AFA5] mb-8" style={{ fontFamily: "DM Mono, monospace", fontSize: "14px", fontWeight: 500 }}>OVERVIEW</h2>
            <div className="space-y-6 max-w-3xl">
              {project.introduction.split("\n\n").map((paragraph: string, idx: number) => (
                <p key={idx} className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[16px] leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Content visual */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-2 md:p-3 w-full">
            <div className="w-full rounded-[20px] overflow-hidden bg-[#E7E3D9] dark:bg-[#2A2520]">
              <img src={contentImage} alt="Project context" className="w-full mix-blend-multiply dark:mix-blend-normal opacity-90" />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-10 w-full text-center flex flex-col items-center">
            <h2 className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-8">Let's build something great.</h2>
            <div className="flex gap-5">
              <Button variant="outline" className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#2A2520] hover:bg-gray-50 dark:hover:bg-[#35302A] h-12 px-6">Copy Email</Button>
              <Button onClick={() => navigate("/")} className="rounded-xl bg-[#1A1A1A] text-white hover:bg-[#333] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-200 h-12 px-6">Back to Home</Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DEFAULT TEMPLATE (immersive + editorial hero, shared SectionManager body)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen bg-white dark:bg-[#1A1A1A] font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A1A1A] dark:selection:bg-[#F0EDE7] selection:text-[#F0EDE7] dark:selection:text-[#1A1A1A] transition-colors duration-700"
    >
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');` }} />

      <AnimatePresence mode="wait">
        {heroView === "immersive" ? (
          <motion.div key="immersive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* ── IMMERSIVE HERO ── */}
            <div ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
              {/* Full-bleed thumbnail — click to replace */}
              <ThumbnailUpload imageUrl={meta.imageUrl} onUpload={(url) => updateMeta({ imageUrl: url })}
                className="absolute inset-0 w-full h-full">
                <motion.img
                  src={meta.imageUrl} alt={meta.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ y: heroImageY, height: "130%", top: "-15%" }}
                />
              </ThumbnailUpload>
              <div className="absolute inset-0 bg-black/12 pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/backgrounds/grainsnow.avif')", backgroundSize: "200px 200px", backgroundRepeat: "repeat" }} />

              {/* Nav */}
              <div className="relative z-10 flex justify-center pt-7 pointer-events-none">
                <div className="w-full max-w-[1100px] px-6 md:px-12 flex items-center justify-between pointer-events-auto">
                  <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors group">
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Go Back
                  </button>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-5 text-[13px] font-medium text-white/80">
                      <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Work</button>
                      <button className="flex items-center gap-1 hover:text-white transition-colors"><span className="text-[10px]">✦</span> Resume</button>
                    </div>
                    <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-lg p-1 ml-2">
                      <button onClick={() => setHeroView("immersive")} title="Immersive view" className="w-7 h-7 rounded-md flex items-center justify-center transition-all bg-white/20">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1.5" fill="white" /></svg>
                      </button>
                      <button onClick={() => setHeroView("editorial")} title="Editorial view" className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="5" rx="1" fill="white" fillOpacity="0.5" /><rect x="1" y="8" width="7" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" /><rect x="1" y="11" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title + metadata overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-10 pointer-events-none">
                <div className="w-full max-w-[1100px] px-6 md:px-12 pointer-events-auto">
                  <EditableField value={meta.title} onChange={(v) => updateMeta({ title: v })} tag="h1" placeholder="Project title…"
                    className="text-[36px] md:text-[52px] font-bold text-white leading-[1.05] tracking-[-0.02em] mb-8 w-full block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5">
                    {/* Role */}
                    <div className="flex flex-col gap-1">
                      <EditableField value={meta.roleLabel} onChange={(v) => updateMeta({ roleLabel: v })}
                        className="text-[11px] font-medium text-white/50 uppercase tracking-widest block" />
                      <EditableField value={meta.rolePrimary} onChange={(v) => updateMeta({ rolePrimary: v })}
                        className="text-[15px] font-semibold text-white leading-snug block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                      <EditableField value={meta.roleSecondary} onChange={(v) => updateMeta({ roleSecondary: v })}
                        className="text-[14px] text-white/75 block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                    </div>
                    {/* Timeline */}
                    <div className="flex flex-col gap-1">
                      <EditableField value={meta.timelineLabel} onChange={(v) => updateMeta({ timelineLabel: v })}
                        className="text-[11px] font-medium text-white/50 uppercase tracking-widest block" />
                      <EditableField value={meta.timeline} onChange={(v) => updateMeta({ timeline: v })}
                        className="text-[15px] font-semibold text-white leading-snug block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                    </div>
                    {/* Tools */}
                    <div className="flex flex-col gap-1">
                      <EditableField value={meta.toolsLabel} onChange={(v) => updateMeta({ toolsLabel: v })}
                        className="text-[11px] font-medium text-white/50 uppercase tracking-widest block" />
                      <EditableField value={meta.tools} onChange={(v) => updateMeta({ tools: v })}
                        className="text-[15px] font-semibold text-white leading-snug block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                    </div>
                    {/* Team */}
                    <div className="flex flex-col gap-1">
                      <EditableField value={meta.teamLabel} onChange={(v) => updateMeta({ teamLabel: v })}
                        className="text-[11px] font-medium text-white/50 uppercase tracking-widest block" />
                      <EditableField value={meta.teamPrimary} onChange={(v) => updateMeta({ teamPrimary: v })}
                        className="text-[15px] font-semibold text-white leading-snug block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                      <EditableField value={meta.teamSecondary} onChange={(v) => updateMeta({ teamSecondary: v })}
                        className="text-[14px] text-white/75 block [&:focus]:bg-white/10 [&:focus]:ring-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="editorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* ── EDITORIAL HEADER ── */}
            <div className="sticky top-0 z-50 flex justify-center bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
              <div className="w-full max-w-[880px] px-6 md:px-10 flex items-center justify-between py-4">
                <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group">
                  <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Go Back
                </button>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893]">
                    <button onClick={() => navigate("/")} className="hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors">Work</button>
                    <button className="flex items-center gap-1 hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors"><span className="text-[10px]">✦</span> Resume</button>
                  </div>
                  <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 rounded-lg p-1 ml-2">
                    <button onClick={() => setHeroView("immersive")} title="Immersive view" className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1.5" fill="currentColor" className="text-[#7A736C] dark:text-[#9E9893]" fillOpacity="0.5" /></svg>
                    </button>
                    <button onClick={() => setHeroView("editorial")} title="Editorial view" className="w-7 h-7 rounded-md flex items-center justify-center transition-all bg-white dark:bg-[#2A2520] shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="5" rx="1" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" /><rect x="1" y="8" width="7" height="1.5" rx="0.75" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" fillOpacity="0.4" /><rect x="1" y="11" width="5" height="1.5" rx="0.75" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" fillOpacity="0.4" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[880px] mx-auto px-6 md:px-10">
              {/* Title + subtitle */}
              <div className="pt-14 pb-10">
                <EditableField value={meta.title} onChange={(v) => updateMeta({ title: v })} tag="h1" placeholder="Project title…"
                  className="text-[38px] md:text-[52px] font-bold text-[#1A1A1A] dark:text-[#F0EDE7] leading-[1.05] tracking-[-0.02em] mb-5 block w-full" />
                <EditableField value={meta.subtitle} onChange={(v) => updateMeta({ subtitle: v })} tag="p" placeholder="Short subtitle…"
                  className="text-[#7A736C] dark:text-[#B5AFA5] text-[18px] leading-relaxed max-w-2xl block font-[450]" />
              </div>

            </div>

            {/* Full-width thumbnail with width toggle */}
            <motion.div
              className="relative mx-auto group/widthpicker"
              animate={{ maxWidth: thumbnailWidth === "full" ? 10000 : 880 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Width toggle — slides in from left on hover */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 opacity-0 -translate-x-2 group-hover/widthpicker:opacity-100 group-hover/widthpicker:translate-x-0 transition-all duration-200 ease-out pointer-events-none group-hover/widthpicker:pointer-events-auto">
                <div className="flex flex-col gap-0.5 bg-white dark:bg-[#2A2520] rounded-xl shadow-lg border border-black/[0.06] dark:border-white/10 p-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setThumbnailWidth("full"); }}
                    title="Full width"
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      thumbnailWidth === "full"
                        ? "bg-[#1A1A1A] dark:bg-[#F0EDE7] text-white dark:text-[#1A1A1A]"
                        : "text-[#7A736C] dark:text-[#9E9893] hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    {/* Full-width icon: rectangle edge-to-edge */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="4" width="12" height="6" rx="1" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setThumbnailWidth("contained"); }}
                    title="Contained width"
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      thumbnailWidth === "contained"
                        ? "bg-[#1A1A1A] dark:bg-[#F0EDE7] text-white dark:text-[#1A1A1A]"
                        : "text-[#7A736C] dark:text-[#9E9893] hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    {/* Contained icon: smaller centered rectangle with margin bars */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3.5" y="4" width="7" height="6" rx="1" fill="currentColor" />
                      <rect x="1" y="5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.35" />
                      <rect x="11.5" y="5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.35" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image + resize handle — handle lives outside the overflow clip so border-radius never crops it */}
              <div
                className="relative"
                onMouseEnter={() => setShowHeightHandle(true)}
                onMouseLeave={() => { if (!isResizingHeight) { setShowHeightHandle(false); setHeightHandleHovered(false); } }}
              >
                {/* Border-radius + overflow clip layer */}
                <motion.div
                  animate={{ borderRadius: thumbnailWidth === "contained" ? 16 : 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    overflow: "hidden",
                    boxShadow: (heightHandleHovered || isResizingHeight)
                      ? (isResizingHeight
                          ? "0 0 0 2px rgba(99,102,241,0.45), 0 0 40px rgba(99,102,241,0.1)"
                          : "0 0 0 1.5px rgba(99,102,241,0.28), 0 0 24px rgba(99,102,241,0.08)")
                      : undefined,
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <ThumbnailUpload imageUrl={meta.imageUrl} onUpload={(url) => updateMeta({ imageUrl: url })}
                    className="w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                      <div ref={thumbnailImgRef} style={thumbnailHeight !== null ? { height: thumbnailHeight } : undefined}>
                        <img src={meta.imageUrl} alt={meta.title} className={thumbnailHeight !== null ? "w-full h-full object-cover" : "w-full"} />
                      </div>
                    </motion.div>
                  </ThumbnailUpload>
                </motion.div>

                {/* Height resize handle — same style as minimal template side handles, rotated horizontal */}
                <AnimatePresence>
                  {(showHeightHandle || isResizingHeight) && (
                    <motion.div
                      key="height-handle"
                      initial={{ opacity: 0, y: -8, scale: 0.82, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, y: -6, scale: 0.88, x: "-50%" }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      className="absolute flex items-center justify-center cursor-ns-resize select-none pointer-events-auto group/hh"
                      style={{ bottom: -22, left: "50%", width: 160, height: 44 }}
                      onMouseEnter={() => setHeightHandleHovered(true)}
                      onMouseLeave={() => setHeightHandleHovered(false)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startY = e.clientY;
                        const startH = thumbnailImgRef.current?.offsetHeight ?? thumbnailHeight ?? 0;
                        setIsResizingHeight(true);
                        const onMove = (ev: MouseEvent) => {
                          ev.preventDefault();
                          setThumbnailHeight(Math.max(120, Math.min(window.innerHeight * 0.95, startH + (ev.clientY - startY))));
                        };
                        const onUp = () => {
                          setIsResizingHeight(false);
                          document.removeEventListener("mousemove", onMove);
                          document.removeEventListener("mouseup", onUp);
                        };
                        document.addEventListener("mousemove", onMove);
                        document.addEventListener("mouseup", onUp);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={cn(
                          "w-full rounded-full flex flex-row items-center justify-center gap-[6px] transition-all duration-200 border border-white/[0.15]",
                          isResizingHeight
                            ? "bg-[#0D0D0D]/60 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(255,255,255,0.22)] scale-105"
                            : "bg-[#0D0D0D]/50 backdrop-blur-sm group-hover/hh:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_20px_rgba(255,255,255,0.18)] group-hover/hh:scale-105"
                        )}
                        style={{ height: 12 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={cn("rounded-full transition-colors duration-200", isResizingHeight ? "bg-white/90" : "bg-white/50 group-hover/hh:bg-white/75")} style={{ width: 4, height: 4 }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Metadata + divider — below thumbnail */}
            <div className="w-full max-w-[880px] mx-auto px-6 md:px-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 pt-10 pb-10">
                <div className="flex flex-col gap-1.5">
                  <EditableField value={meta.roleLabel} onChange={(v) => updateMeta({ roleLabel: v })}
                    className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest block" />
                  <EditableField value={meta.rolePrimary} onChange={(v) => updateMeta({ rolePrimary: v })}
                    className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug block" />
                  <EditableField value={meta.roleSecondary} onChange={(v) => updateMeta({ roleSecondary: v })}
                    className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] block" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <EditableField value={meta.timelineLabel} onChange={(v) => updateMeta({ timelineLabel: v })}
                    className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest block" />
                  <EditableField value={meta.timeline} onChange={(v) => updateMeta({ timeline: v })}
                    className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug block" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <EditableField value={meta.toolsLabel} onChange={(v) => updateMeta({ toolsLabel: v })}
                    className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest block" />
                  <EditableField value={meta.tools} onChange={(v) => updateMeta({ tools: v })}
                    className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug block" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <EditableField value={meta.teamLabel} onChange={(v) => updateMeta({ teamLabel: v })}
                    className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest block" />
                  <EditableField value={meta.teamPrimary} onChange={(v) => updateMeta({ teamPrimary: v })}
                    className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug block" />
                  <EditableField value={meta.teamSecondary} onChange={(v) => updateMeta({ teamSecondary: v })}
                    className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] block" />
                </div>
              </div>
              <div className="border-t border-black/[0.07] dark:border-white/[0.07]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BODY: shared between both views ── */}
      <div className={`w-full mx-auto flex flex-col font-['Inter'] ${heroView === "immersive" ? "max-w-[1100px] px-6 md:px-12" : "max-w-[880px] px-6 md:px-10"}`}>
        <SectionManager projectId={project.id} />

        {/* Contact CTA */}
        <motion.div variants={itemVariants} className="px-6 md:px-10 py-8 flex flex-col items-center text-center">
          <h1 className="text-[23px] font-['Cedarville_Cursive'] text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">Mike Starves</h1>
          <p className="text-[#1A1A1A] dark:text-[#F0EDE7] mb-4 text-[28px] font-semibold max-w-sm leading-tight">Got a project in mind or just curious? Let's talk.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2A2520] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto hover:cursor-pointer border-0">
              <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy mail</span>
              <AtSignIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2A2520] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto hover:cursor-pointer border-0">
              <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy phone</span>
              <Phone size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="px-6 md:px-10 py-5 text-center">
          <p className="text-[12px] text-[#7A736C] dark:text-[#9E9893]" style={{ fontWeight: 450 }}>© ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
