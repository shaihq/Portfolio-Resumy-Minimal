import re

path = 'client/src/components/ui/publish-dropdown.tsx'

content = """import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"

function useClickAway(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

export function PublishDropdown() {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null) as any

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleCopy = () => {
    navigator.clipboard.writeText("shai.designfolio.me")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setIsOpen(false)
    }, 1500)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative" ref={dropdownRef}>
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-6 h-9 text-[13px] rounded-full hover:cursor-pointer transition-colors"
          data-testid="button-publish"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Publish
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: -4,
                transition: { duration: 0.15, ease: "easeIn" },
              }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[260px]"
              onKeyDown={handleKeyDown}
              style={{ transformOrigin: "top right" }}
            >
              <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-1.5 shadow-lg overflow-hidden">
                <div className="p-3 pb-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">
                        shai.designfolio.me
                      </span>
                      <span className="text-[11px] text-[#7A736C] dark:text-[#9E9893]">
                        Updated 29 days ago
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className={cn(
                        "h-8 w-8 rounded-xl shrink-0 transition-colors",
                        copied 
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20" 
                          : "bg-[#F5F5F5] dark:bg-[#3A3531] text-[#7A736C] dark:text-[#9E9893] hover:bg-[#E8E8E8] dark:hover:bg-[#4A4540] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
                      )}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={cn(
                      "w-full h-10 font-medium rounded-xl transition-all text-[13px]",
                      isPublishing
                        ? "bg-[#E8E8E8] dark:bg-[#3A3531] text-[#7A736C] dark:text-[#9E9893]"
                        : "bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] text-[#1A1A1A] dark:text-[#F0EDE7]"
                    )}
                  >
                    {isPublishing ? "Updating..." : "Update changes"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
"""

with open(path, 'w') as f:
    f.write(content)
