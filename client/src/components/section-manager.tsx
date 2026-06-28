import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  GripVertical, Plus, Trash2, AlignLeft, LayoutGrid, Columns3, Upload, X,
} from "lucide-react";
import { CaseStudyEditor } from "./case-study-editor";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageCard = { imageUrl: string | null; heading: string; body: string };

type FreeformSection   = { id: string; type: "freeform"; title: string };
type ImageGridSection  = { id: string; type: "image-grid"; columns: 2 | 3; items: ImageCard[] };
type ImageTextSection  = {
  id: string;
  type: "image-text";
  layout: "image-left" | "image-right" | "image-top";
  imageUrl: string | null;
  heading: string;
  body: string;
};

type Section = FreeformSection | ImageGridSection | ImageTextSection;
type SectionTypeKey = "freeform" | "image-grid-2" | "image-grid-3" | "image-text-left" | "image-text-right" | "image-text-top";

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadSections(_projectId: string): Section[] { return []; }
function saveSections(_projectId: string, _sections: Section[]) {}
function sectionContentKey(projectId: string, sectionId: string) {
  return `section-content-${projectId}-${sectionId}`;
}
function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Wireframe SVG previews ───────────────────────────────────────────────────

function FreeformPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="12" y="10" width="72" height="7" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="12" y="24" width="156" height="4.5" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="12" y="33" width="136" height="4.5" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="12" y="46" width="156" height="38" rx="4" fill="currentColor" opacity="0.12" />
      <rect x="74" y="58" width="24" height="16" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="12" y="92" width="156" height="4.5" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="12" y="101" width="110" height="4.5" rx="2" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function TwoColPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {[0, 1].map(i => {
        const x = 10 + i * 90;
        return (
          <g key={i}>
            <rect x={x} y="10" width="76" height="48" rx="4" fill="currentColor" opacity="0.12" />
            <rect x={x + 26} y="24" width="24" height="18" rx="2" fill="currentColor" opacity="0.22" />
            <rect x={x} y="64" width="55" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
            <rect x={x} y="74" width="76" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
            <rect x={x} y="82" width="64" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
            <rect x={x} y="90" width="52" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
          </g>
        );
      })}
    </svg>
  );
}

function ThreeColPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {[0, 1, 2].map(i => {
        const x = 8 + i * 58;
        return (
          <g key={i}>
            <rect x={x} y="10" width="50" height="38" rx="3" fill="currentColor" opacity="0.12" />
            <rect x={x + 13} y="20" width="14" height="14" rx="2" fill="currentColor" opacity="0.22" />
            <rect x={x} y="54" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
            <rect x={x} y="64" width="50" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
            <rect x={x} y="72" width="42" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
          </g>
        );
      })}
    </svg>
  );
}

function ImageTextLeftPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="10" y="12" width="80" height="96" rx="5" fill="currentColor" opacity="0.13" />
      <rect x="30" y="40" width="40" height="32" rx="3" fill="currentColor" opacity="0.22" />
      <rect x="100" y="28" width="70" height="8" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="100" y="44" width="70" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="100" y="53" width="60" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="100" y="62" width="68" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="100" y="71" width="50" height="4" rx="2" fill="currentColor" opacity="0.16" />
    </svg>
  );
}

function ImageTextRightPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="10" y="28" width="70" height="8" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="10" y="44" width="70" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="10" y="53" width="60" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="10" y="62" width="68" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="10" y="71" width="50" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="90" y="12" width="80" height="96" rx="5" fill="currentColor" opacity="0.13" />
      <rect x="110" y="40" width="40" height="32" rx="3" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

function ImageTextTopPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="10" y="8" width="160" height="60" rx="5" fill="currentColor" opacity="0.13" />
      <rect x="70" y="26" width="40" height="28" rx="3" fill="currentColor" opacity="0.22" />
      <rect x="10" y="78" width="90" height="7" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="10" y="91" width="160" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="10" y="100" width="130" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="10" y="109" width="100" height="4" rx="2" fill="currentColor" opacity="0.16" />
    </svg>
  );
}

// ─── Modal categories & layouts ───────────────────────────────────────────────

const MODAL_CATEGORIES = [
  {
    key: "text",
    label: "Text",
    icon: AlignLeft,
    layouts: [
      { key: "freeform" as SectionTypeKey, label: "Freeform", sub: "Text, headings, images", Preview: FreeformPreview },
    ],
  },
  {
    key: "image-text",
    label: "Image & text",
    icon: LayoutGrid,
    layouts: [
      { key: "image-text-left"  as SectionTypeKey, label: "Image left",  sub: "Image on the left, text on the right", Preview: ImageTextLeftPreview },
      { key: "image-text-right" as SectionTypeKey, label: "Image right", sub: "Text on the left, image on the right", Preview: ImageTextRightPreview },
      { key: "image-text-top"   as SectionTypeKey, label: "Image top",   sub: "Full-width image above the text",      Preview: ImageTextTopPreview },
    ],
  },
  {
    key: "gallery",
    label: "Gallery & media",
    icon: Columns3,
    layouts: [
      { key: "image-grid-2" as SectionTypeKey, label: "2-Column", sub: "Two image + caption cards", Preview: TwoColPreview },
      { key: "image-grid-3" as SectionTypeKey, label: "3-Column", sub: "Three image + caption cards", Preview: ThreeColPreview },
    ],
  },
];

// ─── Add section modal ────────────────────────────────────────────────────────

function AddSectionModal({ onAdd, onClose }: { onAdd: (type: SectionTypeKey) => void; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("image-text");

  const currentLayouts = MODAL_CATEGORIES.find(c => c.key === activeCategory)?.layouts ?? [];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-3xl h-[520px] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#18160F]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Left sidebar */}
        <div className="w-52 shrink-0 flex flex-col border-r border-black/8 dark:border-white/8 bg-[#F7F5F0] dark:bg-[#1C1A13] py-5 px-3 gap-1">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#B5AFA5] dark:text-[#5A5450] px-2 mb-2">
            Add section
          </p>
          {MODAL_CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left w-full
                ${activeCategory === key
                  ? "bg-white dark:bg-[#2A2720] text-[#1A1A1A] dark:text-[#F0EDE7] shadow-sm"
                  : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-white/60 dark:hover:bg-white/5"
                }`}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 dark:border-white/8">
            <p className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">
              {MODAL_CATEGORIES.find(c => c.key === activeCategory)?.label}
            </p>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Layout cards */}
          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="grid grid-cols-2 gap-3"
              >
                {currentLayouts.map(({ key, label, sub, Preview }) => (
                  <button
                    key={key}
                    onClick={() => { onAdd(key); onClose(); }}
                    className="
                      group flex flex-col rounded-xl overflow-hidden text-left
                      bg-[#F7F5F0] dark:bg-[#221F18]
                      border border-black/[0.07] dark:border-white/[0.07]
                      hover:border-black/20 dark:hover:border-white/15
                      hover:shadow-md
                      transition-all duration-200 cursor-pointer
                    "
                  >
                    <div className="w-full aspect-[16/9] flex items-center justify-center p-5 text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <Preview />
                    </div>
                    <div className="px-4 py-3 border-t border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#1C1A13]">
                      <p className="text-[13px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight">
                        {label}
                      </p>
                      <p className="text-[11px] text-[#9E9893] dark:text-[#6A6460] mt-0.5 leading-tight">
                        {sub}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: (type: SectionTypeKey) => void }) {
  const [modalOpen, setModalOpen] = useState(false);

  const cards: { label: string; sub: string; Preview: () => ReactNode; action: () => void }[] = [
    {
      label: "Freeform",
      sub: "Text, headings, images",
      Preview: FreeformPreview,
      action: () => onAdd("freeform"),
    },
    {
      label: "2-Column",
      sub: "Image + caption, side by side",
      Preview: TwoColPreview,
      action: () => onAdd("image-grid-2"),
    },
    {
      label: "3-Column",
      sub: "Three image + caption cards",
      Preview: ThreeColPreview,
      action: () => onAdd("image-grid-3"),
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center py-20 select-none"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B5AFA5] dark:text-[#5A5450] font-['DM_Mono'] mb-8">
          Choose a section type to begin
        </p>

        <div className="flex items-stretch gap-3 w-full max-w-[780px]">
          {cards.map(({ label, sub, Preview, action }, i) => (
            <motion.button
              key={label}
              onClick={action}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className="group flex-1 flex flex-col rounded-2xl overflow-hidden border border-black/[0.07] dark:border-white/[0.07] bg-[#F7F5F2] dark:bg-[#222222] hover:border-black/[0.18] dark:hover:border-white/[0.18] hover:shadow-md active:scale-[0.98] transition-all duration-200 text-left"
            >
              {/* Preview area */}
              <div className="flex-1 p-5 pb-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                <div className="w-full aspect-[3/2]">
                  <Preview />
                </div>
              </div>

              {/* Label */}
              <div className="px-5 pb-5 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
                <p className="text-[13px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-0.5">{label}</p>
                <p className="text-[11.5px] text-[#9E9893] dark:text-[#6A6460] leading-snug">{sub}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* More layouts link */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-5 flex items-center gap-1.5 text-[11.5px] text-[#9E9893] dark:text-[#5A5450] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors duration-150 font-medium"
        >
          <Plus size={12} />
          More layouts
        </button>
      </motion.div>

      <AnimatePresence>
        {modalOpen && <AddSectionModal onAdd={onAdd} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Inline editable text ─────────────────────────────────────────────────────

function EditableText({
  value, onChange, className, placeholder, tag: Tag = "p",
}: {
  value: string; onChange: (v: string) => void;
  className?: string; placeholder?: string;
  tag?: "p" | "h2" | "h3" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { if (ref.current) ref.current.innerText = value; }, []);

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={() => onChange(ref.current?.innerText ?? "")}
      onBlur={() => onChange(ref.current?.innerText ?? "")}
      className={`outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#C5BEB8] dark:empty:before:text-[#5A5450] cursor-text ${className ?? ""}`}
      data-placeholder={placeholder}
    />
  );
}

// ─── Image upload slot ────────────────────────────────────────────────────────

function ImageSlot({ imageUrl, onUpload, className }: { imageUrl: string | null; onUpload: (url: string) => void; className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { const r = e.target?.result as string; if (r) onUpload(r); };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer group/img ${className ?? "w-full aspect-[4/3]"}`}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover/img:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full transition-all">
              Replace image
            </span>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-[#F0EDE7] dark:bg-[#2A2520] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#C5BEB8] dark:border-[#3A3530] group-hover/img:border-[#9E9893] dark:group-hover/img:border-[#5A5450] transition-colors rounded-xl">
          <Upload size={20} className="text-[#B5AFA5] dark:text-[#5A5450]" />
          <span className="text-[13px] font-medium text-center text-[#9E9893] dark:text-[#5A5450] leading-snug">Click or drop image</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ─── Freeform section ─────────────────────────────────────────────────────────

function FreeformBlock({ section, projectId }: { section: FreeformSection; projectId: string }) {
  return (
    <div className="py-14">
      <CaseStudyEditor initialContent="" storageKey={sectionContentKey(projectId, section.id)} />
    </div>
  );
}

// ─── Image grid section ───────────────────────────────────────────────────────

function ImageGridBlock({ section, onUpdate }: { section: ImageGridSection; onUpdate: (u: ImageGridSection) => void }) {
  const updateItem = (idx: number, patch: Partial<ImageCard>) => {
    onUpdate({ ...section, items: section.items.map((item, i) => i === idx ? { ...item, ...patch } : item) });
  };

  return (
    <div className="py-10">
      <div className={`grid gap-6 ${section.columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
        {section.items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <ImageSlot imageUrl={item.imageUrl} onUpload={(url) => updateItem(idx, { imageUrl: url })} />
            <EditableText value={item.heading} onChange={(v) => updateItem(idx, { heading: v })} tag="h3"
              placeholder="This is your heading"
              className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug" />
            <EditableText value={item.body} onChange={(v) => updateItem(idx, { body: v })} tag="p"
              placeholder="You can write here as much as you want."
              className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.65]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Image + text section ─────────────────────────────────────────────────────

function ImageTextBlock({ section, onUpdate }: { section: ImageTextSection; onUpdate: (u: ImageTextSection) => void }) {
  const isTop = section.layout === "image-top";
  const isLeft = section.layout === "image-left";

  const imageSlot = (
    <ImageSlot
      imageUrl={section.imageUrl}
      onUpload={(url) => onUpdate({ ...section, imageUrl: url })}
      className={isTop ? "w-full aspect-[21/9]" : "w-full h-full min-h-[260px]"}
    />
  );

  const textBlock = (
    <div className="flex flex-col gap-4 justify-center">
      <EditableText
        value={section.heading}
        onChange={(v) => onUpdate({ ...section, heading: v })}
        tag="h2"
        placeholder="Write your important statement here"
        className="text-[26px] sm:text-[30px] font-bold text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight tracking-tight"
      />
      <EditableText
        value={section.body}
        onChange={(v) => onUpdate({ ...section, body: v })}
        tag="p"
        placeholder="You can write here as much as you want. This text will always look nice, whether you write longer paragraphs or just a few words."
        className="text-[16px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.7] [font-weight:450]"
      />
    </div>
  );

  if (isTop) {
    return (
      <div className="py-10 flex flex-col gap-8">
        {imageSlot}
        {textBlock}
      </div>
    );
  }

  return (
    <div className={`py-10 flex flex-col sm:flex-row gap-10 items-start ${isLeft ? "" : "sm:flex-row-reverse"}`}>
      <div className="w-full sm:w-1/2 shrink-0">{imageSlot}</div>
      <div className="w-full sm:w-1/2">{textBlock}</div>
    </div>
  );
}

// ─── Sortable section wrapper ─────────────────────────────────────────────────

function SortableSection({ section, projectId, onUpdate, onDelete, isOnly }: {
  section: Section; projectId: string;
  onUpdate: (updated: Section) => void;
  onDelete: () => void; isOnly: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : "auto" };

  return (
    <motion.div
      ref={setNodeRef}
      style={style as any}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative group/section"
    >
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
        <button {...attributes} {...listeners}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-black/8 dark:hover:bg-white/8 transition-colors cursor-grab active:cursor-grabbing shadow-sm bg-white/80 dark:bg-[#2A2520]/80 border border-black/8 dark:border-white/8"
          title="Drag to reorder" aria-label="Drag to reorder section">
          <GripVertical size={17} />
        </button>
        {!isOnly && (
          <button onClick={onDelete}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#9E9893] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shadow-sm bg-white/80 dark:bg-[#2A2520]/80 border border-black/8 dark:border-white/8"
            title="Delete section" aria-label="Delete section">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div>
        {section.type === "freeform" && <FreeformBlock section={section} projectId={projectId} />}
        {section.type === "image-grid" && <ImageGridBlock section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "image-text" && <ImageTextBlock section={section} onUpdate={(u) => onUpdate(u)} />}
      </div>
    </motion.div>
  );
}

// ─── Add section button (between sections) ─────────────────────────────────────

function AddSectionButton({ onAdd }: { onAdd: (type: SectionTypeKey) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative w-full py-4 flex items-center justify-center">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px bg-black/[0.08] dark:bg-white/[0.08]"
          style={{ left: "50%", transform: "translateX(-50%) translateY(-50%)", width: "100vw" }}
        />
        <button
          onClick={() => setOpen(true)}
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] dark:bg-[#F0EDE7] text-white dark:text-[#1A1A1A] text-[12.5px] font-medium shadow-sm hover:opacity-80 active:scale-95 transition-all duration-150"
          aria-label="Add section"
        >
          <Plus size={13} />
          Add section
        </button>
      </div>

      <AnimatePresence>
        {open && <AddSectionModal onAdd={onAdd} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Section factory ──────────────────────────────────────────────────────────

function makeSection(type: SectionTypeKey): Section {
  const id = uid();
  if (type === "freeform") return { id, type: "freeform", title: "Section" };
  if (type === "image-grid-2") return {
    id, type: "image-grid", columns: 2,
    items: [
      { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice." },
      { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice." },
    ],
  };
  if (type === "image-grid-3") return {
    id, type: "image-grid", columns: 3,
    items: [
      { imageUrl: null, heading: "Step 1", body: "You can write here as much as you want." },
      { imageUrl: null, heading: "Step 2", body: "You can write here as much as you want." },
      { imageUrl: null, heading: "Step 3", body: "You can write here as much as you want." },
    ],
  };
  // image-text layouts
  const layoutMap: Record<string, ImageTextSection["layout"]> = {
    "image-text-left": "image-left",
    "image-text-right": "image-right",
    "image-text-top": "image-top",
  };
  return {
    id, type: "image-text",
    layout: layoutMap[type] ?? "image-left",
    imageUrl: null,
    heading: "Write your important statement here",
    body: "You can write here as much as you want. This text will always look nice, whether you write longer paragraphs or just a few words.",
  };
}

// ─── Main SectionManager ──────────────────────────────────────────────────────

export function SectionManager({ projectId }: { projectId: string }) {
  const [sections, setSections] = useState<Section[]>(() => loadSections(projectId));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateSections = useCallback((next: Section[]) => {
    setSections(next);
    saveSections(projectId, next);
  }, [projectId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((prev) => {
        const oldIdx = prev.findIndex((s) => s.id === active.id);
        const newIdx = prev.findIndex((s) => s.id === over.id);
        const next = arrayMove(prev, oldIdx, newIdx);
        saveSections(projectId, next);
        return next;
      });
    }
  };

  const addSection = (type: SectionTypeKey, afterIndex?: number) => {
    const section = makeSection(type);
    if (afterIndex === undefined || afterIndex >= sections.length - 1) {
      updateSections([...sections, section]);
    } else {
      const next = [...sections];
      next.splice(afterIndex + 1, 0, section);
      updateSections(next);
    }
  };

  const updateSection = (id: string, updated: Section) => {
    updateSections(sections.map((s) => (s.id === id ? updated : s)));
  };

  const deleteSection = (id: string) => {
    updateSections(sections.filter((s) => s.id !== id));
    localStorage.removeItem(sectionContentKey(projectId, id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence mode="wait">
          {sections.length === 0 ? (
            <EmptyState key="empty" onAdd={addSection} />
          ) : (
            <motion.div key="sections" className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <AnimatePresence>
                {sections.map((section, index) => (
                  <div key={section.id}>
                    <SortableSection
                      section={section}
                      projectId={projectId}
                      onUpdate={(updated) => updateSection(section.id, updated)}
                      onDelete={() => deleteSection(section.id)}
                      isOnly={sections.length === 1}
                    />
                    <AddSectionButton onAdd={(type) => addSection(type, index)} />
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}
