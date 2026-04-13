import { cn } from "@/lib/utils";

interface FolderProps {
  isDragging?: boolean;
  className?: string;
}

export function Folder({ isDragging = false, className }: FolderProps) {
  return (
    <div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: 40, height: 28, perspective: "280px" }}
    >
      {/* work-5: folder back body + left tab */}
      <div
        className={cn(
          "absolute inset-0 rounded-[4px] rounded-tl-none origin-top transition-all ease duration-300 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.22)]",
          isDragging ? "bg-[#FF553E]" : "bg-amber-600"
        )}
      >
        <div
          className={cn(
            "absolute bottom-full left-0 h-[7px] w-[14px] rounded-t-[3px]",
            isDragging ? "bg-[#FF553E]" : "bg-amber-600"
          )}
        />
        <div
          className={cn(
            "absolute h-[4px] w-[4px]",
            isDragging ? "bg-[#FF553E]" : "bg-amber-600"
          )}
          style={{
            bottom: "100%",
            left: 13,
            clipPath: "polygon(0 35%, 0% 100%, 50% 100%)",
          }}
        />
      </div>

      {/* work-4: paper back */}
      <div className="absolute inset-[2px] bg-zinc-400 rounded-[3px] transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]" />
      {/* work-3: paper middle */}
      <div className="absolute inset-[2px] bg-zinc-300 rounded-[3px] transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />
      {/* work-2: paper front */}
      <div className="absolute inset-[2px] bg-zinc-200 rounded-[3px] transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />

      {/* work-1: folder front body + right tab */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[25px] rounded-[4px] rounded-tr-none origin-bottom transition-all ease duration-300",
          isDragging
            ? "bg-[#FF553E]"
            : "bg-gradient-to-t from-amber-500 to-amber-400"
        )}
      >
        <div
          className={cn(
            "absolute bottom-full right-0 h-[7px] w-[24px] rounded-t-[3px]",
            isDragging ? "bg-[#FF553E]" : "bg-amber-400"
          )}
        />
        <div
          className={cn(
            "absolute h-[4px] w-[4px]",
            isDragging ? "bg-[#FF553E]" : "bg-amber-400"
          )}
          style={{
            bottom: "100%",
            right: 23,
            clipPath: "polygon(100% 14%, 50% 100%, 100% 100%)",
          }}
        />
      </div>
    </div>
  );
}
