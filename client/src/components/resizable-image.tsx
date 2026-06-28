import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useRef, useCallback } from "react";

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
  const widthPct: number = node.attrs.width ?? 100;

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = widthPct;
      const containerEl = containerRef.current?.parentElement;
      const containerWidth = containerEl?.offsetWidth ?? 800;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        // Moving right → wider, left → narrower. ×2 because image is centered (both sides move).
        const delta = (dx / containerWidth) * 100 * 2;
        const next = Math.min(100, Math.max(20, Math.round(startWidth + delta)));
        updateAttributes({ width: next });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [widthPct, updateAttributes]
  );

  return (
    <NodeViewWrapper>
      <div
        ref={containerRef}
        className="relative my-5 select-none group/resizimg"
        style={{
          width: `${widthPct}%`,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        data-drag-handle
      >
        {/* The image */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          draggable={false}
          className="w-full h-auto rounded-xl block pointer-events-none"
          style={{ display: "block" }}
        />

        {/* Selection ring */}
        {selected && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-[#1A1A1A]/30 dark:ring-[#F0EDE7]/30 pointer-events-none" />
        )}

        {/* Width badge */}
        {selected && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium tabular-nums select-none pointer-events-none">
            {widthPct}%
          </div>
        )}

        {/* Left handle */}
        {selected && (
          <div
            onMouseDown={(e) => {
              // Left handle: invert direction
              e.preventDefault();
              e.stopPropagation();
              const startX = e.clientX;
              const startWidth = widthPct;
              const containerEl = containerRef.current?.parentElement;
              const containerWidth = containerEl?.offsetWidth ?? 800;
              const onMove = (ev: MouseEvent) => {
                const dx = ev.clientX - startX;
                const delta = (dx / containerWidth) * 100 * -2;
                const next = Math.min(100, Math.max(20, Math.round(startWidth + delta)));
                updateAttributes({ width: next });
              };
              const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
              w-3 h-10 rounded-full cursor-ew-resize
              bg-white dark:bg-[#2A2520]
              border border-black/15 dark:border-white/15
              shadow-[0_2px_6px_rgba(0,0,0,0.15)]
              flex items-center justify-center"
          >
            <div className="flex flex-col gap-[3px]">
              <div className="w-[1.5px] h-2 rounded-full bg-[#9E9893] dark:bg-[#7A736C]" />
            </div>
          </div>
        )}

        {/* Right handle */}
        {selected && (
          <div
            onMouseDown={startResize}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
              w-3 h-10 rounded-full cursor-ew-resize
              bg-white dark:bg-[#2A2520]
              border border-black/15 dark:border-white/15
              shadow-[0_2px_6px_rgba(0,0,0,0.15)]
              flex items-center justify-center"
          >
            <div className="flex flex-col gap-[3px]">
              <div className="w-[1.5px] h-2 rounded-full bg-[#9E9893] dark:bg-[#7A736C]" />
            </div>
          </div>
        )}
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
      width: { default: 100 }, // percentage 20–100
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src=""])',
        getAttrs: (el) => {
          const img = el as HTMLImageElement;
          const styleWidth = img.style.width;
          const pct = styleWidth ? parseInt(styleWidth) : 100;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: isNaN(pct) ? 100 : pct,
          };
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
