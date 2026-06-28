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
import { GripVertical, Plus, Trash2, AlignLeft, LayoutGrid, Columns3, Upload, X } from "lucide-react";
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

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadSections(projectId: string, defaultIntroContent: string): Section[] {
  try {
    const saved = localStorage.getItem(`sections-${projectId}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [{ id: "intro", type: "freeform", title: "Introduction" }];
}

function saveSections(projectId: string, sections: Section[]) {
  localStorage.setItem(`sections-${projectId}`, JSON.stringify(sections));
}

function sectionContentKey(projectId: string, sectionId: string) {
  if (sectionId === "intro") return `case-study-${projectId}-intro`;
  return `section-content-${projectId}-${sectionId}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/img"
      onDrop={handleDrop}
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

// ─── Freeform section ─────────────────────────────────────────────────────────

function FreeformBlock({
  section,
  projectId,
  onUpdateTitle,
}: {
  section: FreeformSection;
  projectId: string;
  onUpdateTitle: (title: string) => void;
}) {
  return (
    <div className="py-14">
      <EditableText
        value={section.title}
        onChange={onUpdateTitle}
        tag="h2"
        placeholder="Section title"
        className="text-[11px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-wider mb-6"
      />
      <CaseStudyEditor
        initialContent=""
        storageKey={sectionContentKey(projectId, section.id)}
      />
    </div>
  );
}

// ─── Image grid section ───────────────────────────────────────────────────────

function ImageGridBlock({
  section,
  onUpdate,
}: {
  section: ImageGridSection;
  onUpdate: (updated: ImageGridSection) => void;
}) {
  const updateItem = (idx: number, patch: Partial<ImageCard>) => {
    const items = section.items.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    onUpdate({ ...section, items });
  };

  return (
    <div className="py-10">
      <div
        className={`grid gap-6 ${
          section.columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {section.items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <ImageSlot
              imageUrl={item.imageUrl}
              onUpload={(url) => updateItem(idx, { imageUrl: url })}
            />
            <EditableText
              value={item.heading}
              onChange={(v) => updateItem(idx, { heading: v })}
              tag="h3"
              placeholder="This is your heading"
              className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug"
            />
            <EditableText
              value={item.body}
              onChange={(v) => updateItem(idx, { body: v })}
              tag="p"
              placeholder="You can write here as much as you want, this text will always look nice."
              className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.65]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sortable section wrapper ─────────────────────────────────────────────────

function SortableSection({
  section,
  projectId,
  onUpdate,
  onDelete,
  isOnly,
}: {
  section: Section;
  projectId: string;
  onUpdate: (updated: Section) => void;
  onDelete: () => void;
  isOnly: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style as any} className="relative group/section">
      {/* Controls: drag + delete */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#B5AFA5] hover:text-[#7A736C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
        {!isOnly && (
          <button
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#B5AFA5] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete section"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Section content */}
      <div className="px-6 md:px-10">
        {section.type === "freeform" ? (
          <FreeformBlock
            section={section}
            projectId={projectId}
            onUpdateTitle={(title) => onUpdate({ ...section, title })}
          />
        ) : (
          <ImageGridBlock
            section={section}
            onUpdate={(updated) => onUpdate(updated)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Add section picker ────────────────────────────────────────────────────────

const SECTION_TYPES = [
  {
    key: "freeform",
    icon: AlignLeft,
    label: "Freeform",
    description: "Title + rich text content",
  },
  {
    key: "image-grid-2",
    icon: LayoutGrid,
    label: "2-Column",
    description: "Image + caption side by side",
  },
  {
    key: "image-grid-3",
    icon: Columns3,
    label: "3-Column",
    description: "Three image + caption cards",
  },
] as const;

function AddSectionButton({ onAdd }: { onAdd: (type: (typeof SECTION_TYPES)[number]["key"]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative flex justify-center my-2" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[12px] font-medium text-[#B5AFA5] hover:text-[#7A736C] dark:text-[#5A5450] dark:hover:text-[#9E9893] bg-transparent hover:bg-black/4 dark:hover:bg-white/4 px-3 py-1.5 rounded-full transition-all group"
      >
        <Plus size={13} className="transition-transform group-hover:rotate-90 duration-200" />
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
              <button
                key={key}
                onClick={() => { onAdd(key); setOpen(false); }}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 transition-colors text-center min-w-[90px] group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0EDE7] dark:bg-[#1A1A1A] flex items-center justify-center text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] transition-colors">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">{label}</div>
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

// ─── Main SectionManager ──────────────────────────────────────────────────────

export function SectionManager({
  projectId,
  initialIntroContent,
}: {
  projectId: string;
  initialIntroContent: string;
}) {
  const [sections, setSections] = useState<Section[]>(() =>
    loadSections(projectId, initialIntroContent)
  );

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

  const addSection = (type: (typeof SECTION_TYPES)[number]["key"]) => {
    const id = uid();
    let section: Section;

    if (type === "freeform") {
      section = { id, type: "freeform", title: "New Section" };
    } else if (type === "image-grid-2") {
      section = {
        id,
        type: "image-grid",
        columns: 2,
        items: [
          { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice, whether you write longer paragraphs or just a few words." },
          { imageUrl: null, heading: "This is your heading", body: "You can write here as much as you want, this text will always look nice, whether you write longer paragraphs or just a few words." },
        ],
      };
    } else {
      section = {
        id,
        type: "image-grid",
        columns: 3,
        items: [
          { imageUrl: null, heading: "Step 1", body: "You can write here as much as you want, this text will always look nice." },
          { imageUrl: null, heading: "Step 2", body: "You can write here as much as you want, this text will always look nice." },
          { imageUrl: null, heading: "Step 3", body: "You can write here as much as you want, this text will always look nice." },
        ],
      };
    }

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
        <div className="relative">
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
        </div>
      </SortableContext>
    </DndContext>
  );
}
