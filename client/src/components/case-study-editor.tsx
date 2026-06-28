import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote } from "lucide-react";
import { useEffect, useState } from "react";

interface CaseStudyEditorProps {
  initialContent: string;
  storageKey: string;
  className?: string;
}

function paragraphsToHtml(text: string): string {
  return text
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export function CaseStudyEditor({ initialContent, storageKey, className }: CaseStudyEditorProps) {
  const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
  const [focused, setFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: "Write your case study here…",
      }),
    ],
    content: saved ?? paragraphsToHtml(initialContent),
    editorProps: {
      attributes: {
        class: "outline-none focus:outline-none",
        spellcheck: "true",
      },
    },
    onUpdate({ editor }) {
      localStorage.setItem(storageKey, editor.getHTML());
    },
    onFocus() {
      setFocused(true);
    },
    onBlur() {
      setFocused(false);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  const ToolbarBtn = ({
    active,
    onMouseDown,
    title,
    children,
  }: {
    active?: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={onMouseDown}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-[#1A1A1A] dark:bg-[#F0EDE7] text-[#F0EDE7] dark:text-[#1A1A1A]"
          : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Floating toolbar — appears on focus */}
      <div
        className={`flex items-center gap-0.5 mb-4 px-1.5 py-1.5 bg-white dark:bg-[#2A2520] border border-black/8 dark:border-white/8 rounded-xl shadow-sm w-fit transition-all duration-200 ${
          focused ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <ToolbarBtn
          active={editor.isActive("bold")}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          title="Bold"
        >
          <Bold size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("italic")}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          title="Italic"
        >
          <Italic size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
        <ToolbarBtn
          active={editor.isActive("heading", { level: 2 })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          title="Heading"
        >
          <Heading2 size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("heading", { level: 3 })}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          title="Sub-heading"
        >
          <Heading3 size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />
        <ToolbarBtn
          active={editor.isActive("bulletList")}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          title="Bullet list"
        >
          <List size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("orderedList")}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          title="Numbered list"
        >
          <ListOrdered size={13} strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("blockquote")}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
          title="Quote"
        >
          <Quote size={13} strokeWidth={2.5} />
        </ToolbarBtn>
      </div>

      <EditorContent
        editor={editor}
        className="
          [&_.tiptap]:outline-none [&_.tiptap]:min-h-[120px] [&_.tiptap]:cursor-text
          [&_.tiptap_p]:text-[#7A736C] [&_.tiptap_p]:dark:text-[#B5AFA5] [&_.tiptap_p]:leading-[1.7] [&_.tiptap_p]:text-[17px] [&_.tiptap_p]:mb-4 [&_.tiptap_p]:[font-weight:450]
          [&_.tiptap_h2]:text-[22px] [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:text-[#1A1A1A] [&_.tiptap_h2]:dark:text-[#F0EDE7] [&_.tiptap_h2]:tracking-tight [&_.tiptap_h2]:mb-3 [&_.tiptap_h2]:mt-8 [&_.tiptap_h2]:leading-snug
          [&_.tiptap_h3]:text-[17px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-[#1A1A1A] [&_.tiptap_h3]:dark:text-[#F0EDE7] [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:mt-6 [&_.tiptap_h3]:leading-snug
          [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:mb-4 [&_.tiptap_ul]:space-y-1
          [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:mb-4 [&_.tiptap_ol]:space-y-1
          [&_.tiptap_li]:text-[#7A736C] [&_.tiptap_li]:dark:text-[#B5AFA5] [&_.tiptap_li]:text-[17px] [&_.tiptap_li]:leading-[1.7] [&_.tiptap_li]:[font-weight:450]
          [&_.tiptap_blockquote]:border-l-2 [&_.tiptap_blockquote]:border-[#1A1A1A]/20 [&_.tiptap_blockquote]:dark:border-[#F0EDE7]/20 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-[#9E9893] [&_.tiptap_blockquote]:dark:text-[#7A736C] [&_.tiptap_blockquote]:mb-4
          [&_.tiptap_strong]:font-semibold [&_.tiptap_strong]:text-[#1A1A1A] [&_.tiptap_strong]:dark:text-[#F0EDE7]
          [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:first-child::before]:text-[#C5BEB8] [&_.tiptap_.is-editor-empty:first-child::before]:dark:text-[#5A5450] [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:h-0
          cursor-text
        "
      />
    </div>
  );
}
