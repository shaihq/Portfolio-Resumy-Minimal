import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useRef, useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";

// ─── React node view ──────────────────────────────────────────────────────────

function ResizableImageView({
  node,
  updateAttributes,
  selected,
}: {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const widthPct: number = node.attrs.width ?? 100;

  const visible = isHovered || selected;

  // ── Replace image ──────────────────────────────────────────────────────────
  const handleReplace = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (src) updateAttributes({ src, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  // ── Right-handle resize ────────────────────────────────────────────────────
  const startResizeRight = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = widthPct;
      const containerWidth = containerRef.current?.parentElement?.offsetWidth ?? 800;
      const onMove = (ev: MouseEvent) => {
        const delta = ((ev.clientX - startX) / containerWidth) * 100 * 2;
        updateAttributes({ width: Math.min(100, Math.max(20, Math.round(startWidth + delta))) });
      };
      const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [widthPct, updateAttributes]
  );

  // ── Left-handle resize ─────────────────────────────────────────────────────
  const startResizeLeft = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = widthPct;
      const containerWidth = containerRef.current?.parentElement?.offsetWidth ?? 800;
      const onMove = (ev: MouseEvent) => {
        const delta = ((ev.clientX - startX) / containerWidth) * 100 * -2;
        updateAttributes({ width: Math.min(100, Math.max(20, Math.round(startWidth + delta))) });
      };
      const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [widthPct, updateAttributes]
  );

  return (
    <NodeViewWrapper>
      <div
        ref={containerRef}
        className="relative my-5 select-none"
        style={{ width: `${widthPct}%`, marginLeft: "auto", marginRight: "auto" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          draggable={false}
          className="w-full h-auto rounded-xl block pointer-events-none"
        />

        {/* Selection / hover ring */}
        {visible && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#1A1A1A]/25 dark:ring-[#F0EDE7]/25 pointer-events-none transition-opacity" />
        )}

        {/* Replace button — top-right corner on hover */}
        {visible && (
          <button
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
            className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5
              px-3 py-1.5 rounded-full
              bg-black/60 backdrop-blur-sm
              text-white text-[11.5px] font-medium
              hover:bg-black/80 transition-colors"
          >
            <RefreshCw size={11} strokeWidth={2.5} />
            Replace
          </button>
        )}

        {/* Width badge — bottom center on hover */}
        {visible && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-[10px] font-medium tabular-nums pointer-events-none">
            {widthPct}%
          </div>
        )}

        {/* Left resize handle */}
        {visible && (
          <div
            onMouseDown={startResizeLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
              w-3 h-10 rounded-full cursor-ew-resize
              bg-white dark:bg-[#2A2520]
              border border-black/15 dark:border-white/15
              shadow-[0_2px_8px_rgba(0,0,0,0.18)]
              flex items-center justify-center"
          >
            <div className="w-[1.5px] h-3 rounded-full bg-[#9E9893]" />
          </div>
        )}

        {/* Right resize handle */}
        {visible && (
          <div
            onMouseDown={startResizeRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
              w-3 h-10 rounded-full cursor-ew-resize
              bg-white dark:bg-[#2A2520]
              border border-black/15 dark:border-white/15
              shadow-[0_2px_8px_rgba(0,0,0,0.18)]
              flex items-center justify-center"
          >
            <div className="w-[1.5px] h-3 rounded-full bg-[#9E9893]" />
          </div>
        )}

        {/* Hidden file input for replace */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleReplace(f);
            e.target.value = "";
          }}
        />
      </div>
    </NodeViewWrapper>
  );
}

// ─── Tiptap extension ─────────────────────────────────────────────────────────

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: 100 },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src=""])',
        getAttrs: (el) => {
          const img = el as HTMLImageElement;
          const pct = parseInt(img.style.width);
          return { src: img.getAttribute("src"), alt: img.getAttribute("alt"), width: isNaN(pct) ? 100 : pct };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;
    return [
      "div",
      { style: `width:${width ?? 100}%; margin:20px auto;` },
      ["img", mergeAttributes(rest, { style: "width:100%; height:auto; border-radius:12px; display:block;" })],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
