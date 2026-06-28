import { useState, useRef, useCallback, useEffect } from "react";
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
import { GripVertical, Plus, Trash2, AlignLeft, LayoutGrid, Columns3, Upload } from "lucide-react";
import { CaseStudyEditor } from "./case-study-editor";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageCard = {
  imageUrl: string | null;
  heading: string;
  body: string;
};

type FreeformSection = {
  id: string;
  type: "freeform";
  title: string;
};

type ImageGridSection = {
  id: string;
  type: "image-grid";
  columns: 2 | 3;
  items: ImageCard[];
};

type Section = FreeformSection | ImageGridSection;
type SectionTypeKey = "freeform" | "image-grid-2" | "image-grid-3";

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadSections(projectId: string): Section[] {
  try {
    const saved = localStorage.getItem(`sections-${projectId}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveSections(projectId: string, sections: Section[]) {
  localStorage.setItem(`sections-${projectId}`, JSON.stringify(sections));
}

function sectionContentKey(projectId: string, sectionId: string) {
  return `section-content-${projectId}-${sectionId}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Wireframe SVGs for empty state cards ────────────────────────────────────

function FreeformPreview() {
  return (
    <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
      <rect x="12" y="14" width="80" height="8" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="12" y="30" width="136" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="41" width="136" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="52" width="120" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="68" width="136" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="79" width="100" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="95" width="136" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
      <rect x="12" y="106" width="76" height="5" rx="2.5" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function TwoColPreview() {
  return (
    <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
      {/* Left card */}
      <rect x="10" y="10" width="66" height="44" rx="4" fill="currentColor" opacity="0.12" />
      <rect x="18" y="22" width="24" height="20" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="10" y="60" width="52" height="6" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="10" y="72" width="66" height="4" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="10" y="81" width="56" height="4" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="10" y="90" width="48" height="4" rx="2" fill="currentColor" opacity="0.15" />
      {/* Right card */}
      <rect x="84" y="10" width="66" height="44" rx="4" fill="currentColor" opacity="0.12" />
      <rect x="92" y="22" width="24" height="20" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="84" y="60" width="52" height="6" rx="3" fill="currentColor" opacity="0.35" />
      <rect x="84" y="72" width="66" height="4" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="84" y="81" width="56" height="4" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="84" y="90" width="48" height="4" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function ThreeColPreview() {
  return (
    <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
      {[0, 1, 2].map((i) => {
        const x = 8 + i * 50;
        return (
          <g key={i}>
            <rect x={x} y="10" width="42" height="34" rx="3" fill="currentColor" opacity="0.12" />
            <rect x={x + 8} y="18" width="14" height="14" rx="2" fill="currentColor" opacity="0.22" />
            <rect x={x} y="50" width="30" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
            <rect x={x} y="61" width="42" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
            <rect x={x} y="69" width="36" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
            <rect x={x} y="77" width="30" height="3.5" rx="1.75" fill="currentColor" opacity="0.15" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const LAYOUT_OPTIONS: {
  key: SectionTypeKey;
  label: string;
  sub: string;
  Preview: React.FC;
}[] = [
  {
    key: "freeform",
    label: "Freeform",
    sub: "Rich text, headings, lists",
    Preview: FreeformPreview,
  },
  {
    key: "image-grid-2",
    label: "2-Column",
    sub: "Image + caption, side by side",
    Preview: TwoColPreview,
  },
  {
    key: "image-grid-3",
    label: "3-Column",
    sub: "Three image + caption cards",
    Preview: ThreeColPreview,
  },
];

function EmptyState({ onAdd }: { onAdd: (type: SectionTypeKey) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 px-6 select-none"
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B5AFA5] dark:text-[#5A5450] font-['DM_Mono'] mb-5"
      >
        Choose a section type to begin
      </motion.p>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[580px]">
        {LAYOUT_OPTIONS.map(({ key, label, sub, Preview }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onAdd(key)}
            className="
              group flex flex-col rounded-2xl overflow-hidden
              bg-white dark:bg-[#232020]
              border border-black/[0.06] dark:border-white/[0.06]
              shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
              hover:shadow-[0_8px_24px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)]
              hover:-translate-y-0.5
              transition-all duration-200 ease-out
              cursor-pointer text-left
            "
            aria-label={`Add ${label} section`}
          >
            {/* Preview area */}
            <div className="w-full aspect-[5/3] bg-[#F7F4F0] dark:bg-[#1E1B1B] flex items-center justify-center p-4 text-[#1A1A1A] dark:text-[#F0EDE7] transition-colors">
              <Preview />
            </div>

            {/* Labels */}
            <div className="px-3.5 py-3 border-t border-black/[0.05] dark:border-white/[0.05]">
              <p className="text-[13px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight">
                {label}
              </p>
              <p className="text-[11px] text-[#9E9893] dark:text-[#6A6460] mt-0.5 leading-tight">
                {sub}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Inline editable text ─────────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  className,
  placeholder,
  tag: Tag = "p",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  tag?: "p" | "h2" | "h3" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const [localVal, setLocalVal] = useState(value);

  const handleInput = () => {
    const t = ref.current?.innerText ?? "";
    setLocalVal(t);
    onChange(t);
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleInput}
      className={`outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#C5BEB8] dark:empty:before:text-[#5A5450] cursor-text ${className ?? ""}`}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: localVal }}
    />
  );
}

// ─── Image upload slot ────────────────────────────────────────────────────────

function ImageSlot({
  imageUrl,
  onUpload,
}: {
  imageUrl: string | null;
  onUpload: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/img"
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
        <div className="w-full h-full bg-[#F0EDE7] dark:bg-[#2A2520] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/10 dark:border-white/10 group-hover/img:border-black/25 dark:group-hover/img:border-white/25 transition-colors">
          <Upload size={18} className="text-[#B5AFA5] dark:text-[#5A5450]" />
          <span className="text-[12px] text-[#B5AFA5] dark:text-[#5A5450]">Click or drop image</span>
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

function ImageGridBlock({ section, onUpdate }: { section: ImageGridSection; onUpdate: (updated: ImageGridSection) => void }) {
  const updateItem = (idx: number, patch: Partial<ImageCard>) => {
    const items = section.items.map((item, i) => i === idx ? { ...item, ...patch } : item);
    onUpdate({ ...section, items });
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

// ─── Sortable section wrapper ─────────────────────────────────────────────────

function SortableSection({
  section, projectId, onUpdate, onDelete, isOnly,
}: {
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
      {/* Drag + delete controls */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
        <button {...attributes} {...listeners}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#C5BEB8] hover:text-[#7A736C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing"
          title="Drag to reorder" aria-label="Drag to reorder section">
          <GripVertical size={14} />
        </button>
        {!isOnly && (
          <button onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#C5BEB8] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete section" aria-label="Delete section">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="px-6 md:px-10">
        {section.type === "freeform" ? (
          <FreeformBlock section={section} projectId={projectId} />
        ) : (
          <ImageGridBlock section={section} onUpdate={(updated) => onUpdate(updated)} />
        )}
      </div>
    </motion.div>
  );
}

// ─── Add section button (between existing sections) ────────────────────────────

const SECTION_TYPES = [
  { key: "freeform" as SectionTypeKey, icon: AlignLeft, label: "Freeform", description: "Rich text content" },
  { key: "image-grid-2" as SectionTypeKey, icon: LayoutGrid, label: "2-Column", description: "Image + caption" },
  { key: "image-grid-3" as SectionTypeKey, icon: Columns3, label: "3-Column", description: "Three image cards" },
];

function AddSectionButton({ onAdd }: { onAdd: (type: SectionTypeKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative flex justify-center my-1" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-[#C5BEB8] hover:text-[#7A736C] dark:text-[#4A4440] dark:hover:text-[#9E9893] px-3 py-1.5 rounded-full transition-all group"
        aria-label="Add section"
      >
        <Plus size={12} className="transition-transform group-hover:rotate-90 duration-200" />
        Add section
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 z-50 bg-white dark:bg-[#2A2520] border border-black/8 dark:border-white/8 rounded-2xl shadow-xl p-1.5 flex gap-1"
          >
            {SECTION_TYPES.map(({ key, icon: Icon, label, description }) => (
              <button key={key} onClick={() => { onAdd(key); setOpen(false); }}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 transition-colors text-center min-w-[88px] group/pick"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F0EDE7] dark:bg-[#1A1A1A] flex items-center justify-center text-[#7A736C] dark:text-[#9E9893] group-hover/pick:text-[#1A1A1A] dark:group-hover/pick:text-[#F0EDE7] transition-colors">
                  <Icon size={14} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">{label}</div>
                  <div className="text-[10px] text-[#9E9893] dark:text-[#7A736C] leading-tight mt-0.5">{description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section factory ──────────────────────────────────────────────────────────

function makeSection(type: SectionTypeKey): Section {
  const id = uid();
  if (type === "freeform") return { id, type: "freeform", title: "Section" };
  if (type === "image-grid-2") return {
    id, type: "image-grid", columns: 2,
    items: [
      { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice, whether you write longer paragraphs or just a few words." },
      { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice, whether you write longer paragraphs or just a few words." },
    ],
  };
  return {
    id, type: "image-grid", columns: 3,
    items: [
      { imageUrl: null, heading: "Step 1", body: "You can write here as much as you want, this text will always look nice." },
      { imageUrl: null, heading: "Step 2", body: "You can write here as much as you want, this text will always look nice." },
      { imageUrl: null, heading: "Step 3", body: "You can write here as much as you want, this text will always look nice." },
    ],
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

  const addSection = (type: SectionTypeKey) => {
    const section = makeSection(type);
    updateSections([...sections, section]);
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
                {sections.map((section) => (
                  <div key={section.id}>
                    <SortableSection
                      section={section}
                      projectId={projectId}
                      onUpdate={(updated) => updateSection(section.id, updated)}
                      onDelete={() => deleteSection(section.id)}
                      isOnly={sections.length === 1}
                    />
                    <AddSectionButton onAdd={addSection} />
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
