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
  GripVertical, Plus, Trash2, AlignLeft, LayoutGrid, Columns3, Upload, X, Code2,
} from "lucide-react";
import { CaseStudyEditor } from "./case-study-editor";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageCard = { imageUrl: string | null; heading: string; body: string };

type FreeformSection      = { id: string; type: "freeform"; title: string };
type ImageGridSection     = { id: string; type: "image-grid"; columns: 2 | 3; items: ImageCard[] };
type ImageTextSection     = {
  id: string; type: "image-text";
  layout: "image-left" | "image-right" | "image-top";
  imageUrl: string | null; heading: string; body: string;
};
type TextSplitSection     = { id: string; type: "text-split"; heading: string; body: string };
type TextThreeColSection  = { id: string; type: "text-3col"; columns: { heading: string; body: string }[] };
type TextHighlightsSection= { id: string; type: "text-highlights"; items: { title: string; detail: string }[] };
type TextAccordionSection  = { id: string; type: "text-accordion"; heading: string; items: { question: string; answer: string }[] };
type GalleryCarouselSection= { id: string; type: "gallery-carousel"; items: { imageUrl: string | null; caption: string }[] };
type GalleryScrollSection  = { id: string; type: "gallery-scroll";   items: { imageUrl: string | null }[] };

type Section = FreeformSection | ImageGridSection | ImageTextSection
             | TextSplitSection | TextThreeColSection | TextHighlightsSection | TextAccordionSection
             | GalleryCarouselSection | GalleryScrollSection
             | EmbedFigmaSection | EmbedYoutubeSection | EmbedCodeSection;

type EmbedFigmaSection   = { id: string; type: "embed-figma";   url: string };
type EmbedYoutubeSection = { id: string; type: "embed-youtube"; url: string };
type EmbedCodeSection    = { id: string; type: "embed-code";    code: string; language: string };

type SectionTypeKey =
  | "freeform"
  | "text-split" | "text-3col" | "text-highlights" | "text-accordion"
  | "image-grid-2" | "image-grid-3"
  | "image-text-left" | "image-text-right" | "image-text-top"
  | "gallery-carousel" | "gallery-scroll"
  | "embed-figma" | "embed-youtube" | "embed-code";

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

function MoreLayoutsPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {/* Top row: 3 mini thumbnails */}
      <rect x="8"  y="8"  width="50" height="38" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="18" y="18" width="14" height="11" rx="2" fill="currentColor" opacity="0.20" />
      <rect x="65" y="8"  width="50" height="38" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="75" y="18" width="14" height="11" rx="2" fill="currentColor" opacity="0.20" />
      <rect x="122" y="8"  width="50" height="38" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="132" y="18" width="14" height="11" rx="2" fill="currentColor" opacity="0.20" />
      {/* Bottom row: 2 wider thumbnails */}
      <rect x="8"  y="54" width="76" height="58" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="28" y="70" width="24" height="18" rx="2" fill="currentColor" opacity="0.20" />
      <rect x="8"  y="98" width="50" height="4"  rx="2" fill="currentColor" opacity="0.22" />
      <rect x="96" y="54" width="76" height="58" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="106" y="62" width="56" height="20" rx="3" fill="currentColor" opacity="0.13" />
      <rect x="126" y="70" width="16" height="12" rx="2" fill="currentColor" opacity="0.20" />
      <rect x="96"  y="98" width="50" height="4"  rx="2" fill="currentColor" opacity="0.22" />
      {/* Plus badge centre */}
      <circle cx="90" cy="83" r="10" fill="currentColor" opacity="0.12" />
      <rect x="87" y="82" width="6" height="2" rx="1" fill="currentColor" opacity="0.50" />
      <rect x="89" y="80" width="2" height="6" rx="1" fill="currentColor" opacity="0.50" />
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

// ─── Text-only layout preview SVGs ───────────────────────────────────────────

function TextSplitPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {/* Left: large heading */}
      <rect x="8"  y="30" width="68" height="9"  rx="3" fill="currentColor" opacity="0.40" />
      <rect x="8"  y="46" width="50" height="6"  rx="2.5" fill="currentColor" opacity="0.22" />
      {/* Right: body lines */}
      <rect x="96" y="20" width="76" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="30" width="76" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="40" width="60" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="50" width="72" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="60" width="52" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="70" width="68" height="4"  rx="2" fill="currentColor" opacity="0.18" />
      <rect x="96" y="80" width="44" height="4"  rx="2" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function TextThreeColPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {[0,1,2].map(i => {
        const x = 8 + i * 58;
        return (
          <g key={i}>
            <rect x={x}    y="14" width="44" height="7"  rx="3"   fill="currentColor" opacity="0.38" />
            <rect x={x}    y="28" width="50" height="3.5" rx="1.75" fill="currentColor" opacity="0.16" />
            <rect x={x}    y="36" width="42" height="3.5" rx="1.75" fill="currentColor" opacity="0.16" />
            <rect x={x}    y="44" width="48" height="3.5" rx="1.75" fill="currentColor" opacity="0.16" />
            <rect x={x}    y="52" width="36" height="3.5" rx="1.75" fill="currentColor" opacity="0.16" />
          </g>
        );
      })}
    </svg>
  );
}

function TextHighlightsPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {[0,1,2].map(i => {
        const x = 6 + i * 57;
        return (
          <g key={i}>
            <rect x={x} y="20" width="51" height="60" rx="6" fill="currentColor" opacity="0.09" />
            <rect x={x+6} y="33" width="32" height="6" rx="2.5" fill="currentColor" opacity="0.38" />
            <rect x={x+6} y="46" width="38" height="3.5" rx="1.75" fill="currentColor" opacity="0.18" />
            <rect x={x+6} y="54" width="28" height="3.5" rx="1.75" fill="currentColor" opacity="0.18" />
          </g>
        );
      })}
    </svg>
  );
}

function TextAccordionPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {/* Left heading */}
      <rect x="8"  y="38" width="60" height="9"  rx="3" fill="currentColor" opacity="0.38" />
      <rect x="8"  y="54" width="44" height="5"  rx="2" fill="currentColor" opacity="0.18" />
      {/* Right accordion rows */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="88" y={16 + i*24} width="84" height="0.75" rx="0.375" fill="currentColor" opacity="0.14" />
          <rect x="88" y={22 + i*24} width="52" height="5"  rx="2" fill="currentColor" opacity={i === 0 ? 0.38 : 0.22} />
          <rect x="164" y={23 + i*24} width="8" height="3" rx="1.5" fill="currentColor" opacity="0.30" />
          {i === 0 && <>
            <rect x="88" y="34" width="84" height="3" rx="1.5" fill="currentColor" opacity="0.13" />
            <rect x="88" y="41" width="66" height="3" rx="1.5" fill="currentColor" opacity="0.13" />
          </>}
        </g>
      ))}
    </svg>
  );
}

// ─── Gallery preview SVGs ─────────────────────────────────────────────────────

function GalleryCarouselPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {/* Main image */}
      <rect x="24" y="8" width="132" height="88" rx="6" fill="currentColor" opacity="0.11" />
      {/* Left arrow */}
      <circle cx="14" cy="52" r="8" fill="currentColor" opacity="0.10" />
      <polyline points="16,48 12,52 16,56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.40" />
      {/* Right arrow */}
      <circle cx="166" cy="52" r="8" fill="currentColor" opacity="0.10" />
      <polyline points="164,48 168,52 164,56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.40" />
      {/* Dots */}
      <circle cx="84" cy="108" r="3.5" fill="currentColor" opacity="0.50" />
      <circle cx="96" cy="108" r="3.5" fill="currentColor" opacity="0.18" />
      <circle cx="108" cy="108" r="3.5" fill="currentColor" opacity="0.18" />
    </svg>
  );
}

function GalleryScrollPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      {/* Side image left (peeking) */}
      <rect x="2"  y="18" width="44" height="84" rx="5" fill="currentColor" opacity="0.08" />
      {/* Center image (prominent) */}
      <rect x="52" y="8"  width="76" height="104" rx="6" fill="currentColor" opacity="0.14" />
      {/* Side image right (peeking) */}
      <rect x="134" y="18" width="44" height="84" rx="5" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

// ─── Embed preview SVGs ───────────────────────────────────────────────────────

function FigmaEmbedPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="8" y="8" width="164" height="104" rx="6" fill="currentColor" opacity="0.09" />
      <rect x="8" y="8" width="164" height="18" rx="6" fill="currentColor" opacity="0.10" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="24" y="14" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="34" y="14" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="26" y="36" width="128" height="62" rx="4" fill="currentColor" opacity="0.10" />
      <rect x="40" y="52" width="36" height="28" rx="3" fill="currentColor" opacity="0.18" />
      <rect x="84" y="52" width="56" height="7" rx="2" fill="currentColor" opacity="0.22" />
      <rect x="84" y="64" width="44" height="5" rx="2" fill="currentColor" opacity="0.14" />
      <rect x="84" y="73" width="50" height="5" rx="2" fill="currentColor" opacity="0.14" />
    </svg>
  );
}

function YoutubeEmbedPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="8" y="8" width="164" height="104" rx="6" fill="currentColor" opacity="0.10" />
      <circle cx="90" cy="56" r="18" fill="currentColor" opacity="0.16" />
      <polygon points="84,48 84,64 102,56" fill="currentColor" opacity="0.45" />
      <rect x="8" y="90" width="164" height="22" rx="0" fill="currentColor" opacity="0.07" />
      <rect x="14" y="96" width="60" height="5" rx="2" fill="currentColor" opacity="0.22" />
      <rect x="14" y="104" width="40" height="4" rx="2" fill="currentColor" opacity="0.14" />
    </svg>
  );
}

function CodeEmbedPreview() {
  return (
    <svg viewBox="0 0 180 120" fill="none" className="w-full h-full">
      <rect x="8" y="8" width="164" height="104" rx="6" fill="currentColor" opacity="0.08" />
      <rect x="8" y="8" width="164" height="16" rx="6" fill="currentColor" opacity="0.12" />
      <circle cx="18" cy="16" r="3.5" fill="currentColor" opacity="0.30" />
      <circle cx="28" cy="16" r="3.5" fill="currentColor" opacity="0.30" />
      <circle cx="38" cy="16" r="3.5" fill="currentColor" opacity="0.30" />
      {/* code lines */}
      <rect x="16" y="34" width="28" height="4" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="48" y="34" width="44" height="4" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="24" y="44" width="36" height="4" rx="2" fill="currentColor" opacity="0.22" />
      <rect x="64" y="44" width="56" height="4" rx="2" fill="currentColor" opacity="0.14" />
      <rect x="24" y="54" width="20" height="4" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="48" y="54" width="68" height="4" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="16" y="64" width="48" height="4" rx="2" fill="currentColor" opacity="0.30" />
      <rect x="68" y="64" width="32" height="4" rx="2" fill="currentColor" opacity="0.16" />
      <rect x="24" y="74" width="60" height="4" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="16" y="84" width="28" height="4" rx="2" fill="currentColor" opacity="0.35" />
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
      { key: "freeform"        as SectionTypeKey, label: "Freeform",    sub: "Rich text, headings, images",      Preview: FreeformPreview },
      { key: "text-split"      as SectionTypeKey, label: "Split",       sub: "Heading left, body right",         Preview: TextSplitPreview },
      { key: "text-3col"       as SectionTypeKey, label: "3-Column",    sub: "Three columns of heading + text",  Preview: TextThreeColPreview },
      { key: "text-highlights" as SectionTypeKey, label: "Highlights",  sub: "Three stat or highlight cards",    Preview: TextHighlightsPreview },
      { key: "text-accordion"  as SectionTypeKey, label: "Accordion",   sub: "Heading with collapsible FAQ rows",Preview: TextAccordionPreview },
    ],
  },
  {
    key: "image-text",
    label: "Image & text",
    icon: LayoutGrid,
    layouts: [
      { key: "image-text-left"  as SectionTypeKey, label: "Image left",   sub: "Image on the left, text on the right",  Preview: ImageTextLeftPreview },
      { key: "image-text-right" as SectionTypeKey, label: "Image right",  sub: "Text on the left, image on the right",  Preview: ImageTextRightPreview },
      { key: "image-text-top"   as SectionTypeKey, label: "Image top",    sub: "Full-width image above the text",       Preview: ImageTextTopPreview },
      { key: "image-grid-2"     as SectionTypeKey, label: "2-Column",     sub: "Two image + caption cards",             Preview: TwoColPreview },
      { key: "image-grid-3"     as SectionTypeKey, label: "3-Column",     sub: "Three image + caption cards",           Preview: ThreeColPreview },
    ],
  },
  {
    key: "gallery",
    label: "Gallery & media",
    icon: Columns3,
    layouts: [
      { key: "gallery-carousel" as SectionTypeKey, label: "Carousel",     sub: "One image at a time with arrows",       Preview: GalleryCarouselPreview },
      { key: "gallery-scroll"   as SectionTypeKey, label: "Scroll gallery",sub: "Horizontal scroll, center image large",Preview: GalleryScrollPreview },
    ],
  },
  {
    key: "embeds",
    label: "Embeds",
    icon: Code2,
    layouts: [
      { key: "embed-figma"   as SectionTypeKey, label: "Figma",       sub: "Embed a Figma file or prototype",        Preview: FigmaEmbedPreview },
      { key: "embed-youtube" as SectionTypeKey, label: "YouTube",     sub: "Embed a YouTube video",                  Preview: YoutubeEmbedPreview },
      { key: "embed-code"    as SectionTypeKey, label: "Code",        sub: "Display a code snippet inline",          Preview: CodeEmbedPreview },
    ],
  },
];

// ─── Add section modal ────────────────────────────────────────────────────────

function AddSectionModal({ onAdd, onClose }: { onAdd: (type: SectionTypeKey) => void; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("text");

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
          {/* Standalone Freeform shortcut */}
          <button
            onClick={() => { onAdd("freeform"); onClose(); }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left w-full text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-white/60 dark:hover:bg-white/5"
          >
            <AlignLeft size={14} strokeWidth={2} />
            Freeform
          </button>
          <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mx-1 my-1.5" />
          {MODAL_CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left w-full
                ${activeCategory === key
                  ? "bg-white dark:bg-[#2A2720] text-[#1A1A1A] dark:text-[#F0EDE7]"
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
  const isMobile = useIsMobile();

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
      label: "More layouts",
      sub: "Image grid, image + text & more",
      Preview: MoreLayoutsPreview,
      action: () => setModalOpen(true),
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
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * (isMobile ? 0.22 : 0.06) }}
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

// ─── Text-only section blocks ─────────────────────────────────────────────────

function TextSplitBlock({ section, onUpdate }: { section: TextSplitSection; onUpdate: (u: TextSplitSection) => void }) {
  return (
    <div className="py-10 flex flex-col sm:flex-row gap-10 items-start">
      <div className="w-full sm:w-[42%] shrink-0">
        <EditableText value={section.heading} onChange={(v) => onUpdate({ ...section, heading: v })} tag="h2"
          placeholder="This is your heading"
          className="text-[28px] sm:text-[32px] font-bold text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight tracking-tight" />
      </div>
      <div className="w-full sm:flex-1">
        <EditableText value={section.body} onChange={(v) => onUpdate({ ...section, body: v })} tag="p"
          placeholder="You can write here as much as you want, this text will always look nice."
          className="text-[16px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.7] [font-weight:450]" />
      </div>
    </div>
  );
}

function TextThreeColBlock({ section, onUpdate }: { section: TextThreeColSection; onUpdate: (u: TextThreeColSection) => void }) {
  const updateCol = (idx: number, patch: Partial<{ heading: string; body: string }>) =>
    onUpdate({ ...section, columns: section.columns.map((c, i) => i === idx ? { ...c, ...patch } : c) });
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {section.columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <EditableText value={col.heading} onChange={(v) => updateCol(idx, { heading: v })} tag="h3"
              placeholder="This is your heading"
              className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug" />
            <EditableText value={col.body} onChange={(v) => updateCol(idx, { body: v })} tag="p"
              placeholder="You can write here as much as you want."
              className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.65]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TextHighlightsBlock({ section, onUpdate }: { section: TextHighlightsSection; onUpdate: (u: TextHighlightsSection) => void }) {
  const updateItem = (idx: number, patch: Partial<{ title: string; detail: string }>) =>
    onUpdate({ ...section, items: section.items.map((it, i) => i === idx ? { ...it, ...patch } : it) });
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {section.items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 bg-[#F7F5F2] dark:bg-[#222222] rounded-2xl p-6">
            <EditableText value={item.title} onChange={(v) => updateItem(idx, { title: v })} tag="h3"
              placeholder="Highlight"
              className="text-[17px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug" />
            <EditableText value={item.detail} onChange={(v) => updateItem(idx, { detail: v })} tag="p"
              placeholder="Add some details here"
              className="text-[13.5px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.6]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TextAccordionBlock({ section, onUpdate }: { section: TextAccordionSection; onUpdate: (u: TextAccordionSection) => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const updateItem = (idx: number, patch: Partial<{ question: string; answer: string }>) =>
    onUpdate({ ...section, items: section.items.map((it, i) => i === idx ? { ...it, ...patch } : it) });
  return (
    <div className="py-10 flex flex-col sm:flex-row gap-10 items-start">
      <div className="w-full sm:w-[36%] shrink-0">
        <EditableText value={section.heading} onChange={(v) => onUpdate({ ...section, heading: v })} tag="h2"
          placeholder="This is your heading"
          className="text-[26px] sm:text-[30px] font-bold text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight tracking-tight" />
      </div>
      <div className="w-full sm:flex-1 flex flex-col divide-y divide-black/[0.07] dark:divide-white/[0.07]">
        {section.items.map((item, idx) => (
          <div key={idx} className="py-4">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between gap-3 text-left group"
            >
              <EditableText value={item.question} onChange={(v) => updateItem(idx, { question: v })} tag="span"
                placeholder={`Accordion ${idx + 1}`}
                className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] flex-1" />
              <span className="text-[#9E9893] shrink-0 transition-transform duration-200" style={{ transform: openIdx === idx ? "rotate(180deg)" : "rotate(0deg)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <EditableText value={item.answer} onChange={(v) => updateItem(idx, { answer: v })} tag="p"
                      placeholder="You can write here as much as you want."
                      className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5] leading-[1.65]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery section blocks ───────────────────────────────────────────────────

function GalleryCarouselBlock({ section, onUpdate }: { section: GalleryCarouselSection; onUpdate: (u: GalleryCarouselSection) => void }) {
  const [idx, setIdx] = useState(0);
  const total = section.items.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);
  const current = section.items[idx];
  const updateItem = (i: number, patch: Partial<GalleryCarouselSection["items"][number]>) =>
    onUpdate({ ...section, items: section.items.map((it, j) => j === i ? { ...it, ...patch } : it) });

  return (
    <div className="py-10">
      <div className="relative flex items-center gap-4">
        {/* Prev */}
        <button onClick={prev}
          className="shrink-0 w-9 h-9 rounded-full border border-black/[0.10] dark:border-white/[0.10] bg-white dark:bg-[#232323] flex items-center justify-center text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-[#F0EDE7] dark:hover:bg-[#2A2A2A] transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {/* Image */}
        <div className="flex-1">
          <ImageSlot
            imageUrl={current.imageUrl}
            onUpload={(url) => updateItem(idx, { imageUrl: url })}
            className="w-full aspect-[16/10] rounded-xl"
          />
          {/* Caption */}
          <div className="mt-3 text-center">
            <EditableText value={current.caption} onChange={(v) => updateItem(idx, { caption: v })} tag="p"
              placeholder="Add a caption…"
              className="text-[13px] text-[#9E9893] dark:text-[#6A6460] leading-snug text-center" />
          </div>
        </div>

        {/* Next */}
        <button onClick={next}
          className="shrink-0 w-9 h-9 rounded-full border border-black/[0.10] dark:border-white/[0.10] bg-white dark:bg-[#232323] flex items-center justify-center text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-[#F0EDE7] dark:hover:bg-[#2A2A2A] transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {section.items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-200 ${i === idx ? "w-4 h-2 bg-[#1A1A1A] dark:bg-[#F0EDE7]" : "w-2 h-2 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryScrollBlock({ section, onUpdate }: { section: GalleryScrollSection; onUpdate: (u: GalleryScrollSection) => void }) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const xRef         = useRef(0);
  const pausedRef    = useRef(false);
  const animRef      = useRef<number>(0);
  const SPEED        = 0.3; // px per frame — slow, cinematic
  const GAP          = 20; // must match gap-5 below

  const updateItem = (i: number, imageUrl: string | null) =>
    onUpdate({ ...section, items: section.items.map((it, j) => j === i ? { ...it, imageUrl } : it) });

  const readFile = (file: File, cb: (url: string) => void) => {
    const r = new FileReader();
    r.onload = (e) => { const u = e.target?.result as string; if (u) cb(u); };
    r.readAsDataURL(file);
  };

  // Transform-based infinite scroll — no scrollLeft resets, no jitter.
  // Moves the track leftward; once we've travelled exactly firstCopyWidth, snap back to 0.
  useEffect(() => {
    const shouldAnimate = section.items.length >= 2;
    if (!shouldAnimate) return;
    const tick = () => {
      if (!pausedRef.current && trackRef.current && firstCopyRef.current) {
        xRef.current -= SPEED;
        // boundary = first copy width + one inter-copy gap so the seam is pixel-perfect
        const boundary = firstCopyRef.current.offsetWidth + GAP;
        if (xRef.current <= -boundary) xRef.current = 0;
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [section.items.length]);

  /** A single upload slot — `label` makes it keyboard & screen-reader accessible */
  function SlotLabel({ idx, children }: { idx: number; children: React.ReactNode }) {
    const inputId = `gs-inp-${section.id}-${idx}`;
    return (
      <label htmlFor={inputId} className="block cursor-pointer">
        {children}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, (u) => updateItem(idx, u)); }}
        />
      </label>
    );
  }

  function ScrollCard({ item, idx }: { item: { imageUrl: string | null }; idx: number }) {
    return (
      <SlotLabel idx={idx}>
        {item.imageUrl ? (
          <div className="relative group/img w-[380px] rounded-xl overflow-hidden">
            <img src={item.imageUrl} alt="" className="w-[380px] h-auto block" />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover/img:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full transition-all">
                Replace image
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-[380px] h-60 rounded-xl bg-[#F0EDE7] dark:bg-[#2A2520] border-2 border-dashed border-[#C5BEB8] dark:border-[#3A3530] hover:border-[#9E9893] dark:hover:border-[#5A5450] focus-within:border-[#9E9893] dark:focus-within:border-[#5A5450] transition-colors flex flex-col items-center justify-center gap-3"
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) readFile(f, (u) => updateItem(idx, u)); }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload size={20} className="text-[#B5AFA5] dark:text-[#5A5450]" />
            <span className="text-[13px] font-medium text-[#9E9893] dark:text-[#5A5450]">Click or drop image</span>
          </div>
        )}
      </SlotLabel>
    );
  }

  return (
    <div className="py-10 -mx-6">
      {/* overflow-hidden + mask gives edge fades — background-agnostic */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
        }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* transform track — holds two copies for seamless loop */}
        <div ref={trackRef} className="flex gap-5 px-6 w-max" style={{ willChange: "transform" }}>
          {/* first copy — measured for loop boundary */}
          <div ref={firstCopyRef} className="flex gap-5">
            {section.items.map((item, i) => <ScrollCard key={i} item={item} idx={i} />)}
          </div>
          {/* second copy — display-only mirror */}
          <div className="flex gap-5" aria-hidden="true">
            {section.items.map((item, i) =>
              item.imageUrl
                ? <img key={i} src={item.imageUrl} alt="" className="shrink-0 w-[380px] h-auto block rounded-xl" />
                : <div key={i} className="shrink-0 w-[380px] h-60 rounded-xl bg-[#F0EDE7] dark:bg-[#2A2520] border-2 border-dashed border-[#C5BEB8] dark:border-[#3A3530]" />
            )}
          </div>
        </div>
      </div>
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
        {section.type === "freeform"          && <FreeformBlock         section={section} projectId={projectId} />}
        {section.type === "image-grid"        && <ImageGridBlock        section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "image-text"        && <ImageTextBlock        section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "text-split"        && <TextSplitBlock        section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "text-3col"         && <TextThreeColBlock     section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "text-highlights"   && <TextHighlightsBlock   section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "text-accordion"    && <TextAccordionBlock    section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "gallery-carousel"  && <GalleryCarouselBlock  section={section} onUpdate={(u) => onUpdate(u)} />}
        {section.type === "gallery-scroll"    && <GalleryScrollBlock    section={section} onUpdate={(u) => onUpdate(u)} />}
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
  const bodyPlaceholder = "You can write here as much as you want, this text will always look nice, whether you write longer paragraphs or just a few words.";
  if (type === "freeform") return { id, type: "freeform", title: "Section" };
  if (type === "text-split") return { id, type: "text-split", heading: "This is your heading", body: bodyPlaceholder };
  if (type === "text-3col") return {
    id, type: "text-3col",
    columns: [
      { heading: "This is your heading", body: bodyPlaceholder },
      { heading: "This is your heading", body: bodyPlaceholder },
      { heading: "This is your heading", body: bodyPlaceholder },
    ],
  };
  if (type === "text-highlights") return {
    id, type: "text-highlights",
    items: [
      { title: "Highlight 1", detail: "Add some details here" },
      { title: "Highlight 2", detail: "Add some details here" },
      { title: "Highlight 3", detail: "Add some details here" },
    ],
  };
  if (type === "text-accordion") return {
    id, type: "text-accordion",
    heading: "This is your heading",
    items: [
      { question: "Accordion 1", answer: bodyPlaceholder },
      { question: "Accordion 2", answer: "" },
      { question: "Accordion 3", answer: "" },
      { question: "Accordion 4", answer: "" },
    ],
  };
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
  if (type === "gallery-carousel") return {
    id, type: "gallery-carousel",
    items: [
      { imageUrl: null, caption: "" },
      { imageUrl: null, caption: "" },
      { imageUrl: null, caption: "" },
    ],
  };
  if (type === "gallery-scroll") return {
    id, type: "gallery-scroll",
    items: [
      { imageUrl: null },
      { imageUrl: null },
      { imageUrl: null },
      { imageUrl: null },
    ],
  };
  const layoutMap: Record<string, ImageTextSection["layout"]> = {
    "image-text-left": "image-left", "image-text-right": "image-right", "image-text-top": "image-top",
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
