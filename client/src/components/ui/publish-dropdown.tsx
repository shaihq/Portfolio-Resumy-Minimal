import React, { useState, useRef } from "react"
import { Link2, Pencil, Globe, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ZapIcon, type ZapIconHandle } from "lucide-animated"
import { Button } from "@/components/ui/button"

function useClickAway(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
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

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 28,
      mass: 0.75,
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.14, ease: "easeIn" },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 420, damping: 30 },
  },
}

export function PublishDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const zapRef = useRef<ZapIconHandle>(null)

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => zapRef.current?.startAnimation()}
          onMouseLeave={() => zapRef.current?.stopAnimation()}
          className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium pl-4 pr-5 h-9 text-[13px] rounded-full hover:cursor-pointer transition-colors gap-1.5 inline-flex items-center"
          data-testid="button-publish"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <ZapIcon ref={zapRef} size={14} />
          Publish
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2.5 z-50 w-[312px]"
              onKeyDown={handleKeyDown}
              style={{ transformOrigin: "top right" }}
            >
              <div
                className="w-full rounded-[20px] overflow-hidden"
                style={{
                  background: "#1C1C1E",
                  boxShadow:
                    "0 0 0 0.5px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.28), 0 24px 48px rgba(0,0,0,0.18)",
                }}
              >
                {/* Main body */}
                <div className="px-5 pt-5 pb-5 flex flex-col gap-3.5">

                  {/* Heading */}
                  <motion.p
                    variants={rowVariants}
                    className="text-[17px] font-semibold text-white tracking-[-0.3px] leading-tight"
                  >
                    Ready to publish
                  </motion.p>

                  {/* URL row */}
                  <motion.div
                    variants={rowVariants}
                    className="flex items-center gap-2.5 rounded-[13px] px-3.5 py-2.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <Link2
                      size={14}
                      className="text-white/35 shrink-0"
                      strokeWidth={2}
                    />
                    <span className="flex-1 text-[13px] text-white/55 font-medium tracking-tight min-w-0 truncate">
                      uxfol.io/
                      <span className="text-white/80">31a071c3</span>
                    </span>
                    <motion.button
                      className="h-7 w-7 rounded-[9px] flex items-center justify-center cursor-pointer shrink-0"
                      style={{ background: "rgba(255,255,255,0.09)" }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                      whileTap={{ scale: 0.93 }}
                      aria-label="Edit URL slug"
                    >
                      <Pencil size={12} className="text-white/60" strokeWidth={2} />
                    </motion.button>
                  </motion.div>

                  {/* CTA */}
                  <motion.button
                    variants={rowVariants}
                    className="w-full h-[50px] rounded-[13px] text-[14px] font-semibold text-[#111] tracking-[-0.2px] cursor-pointer"
                    style={{ background: "#D4FF4B" }}
                    whileHover={{ filter: "brightness(1.06)" }}
                    whileTap={{ scale: 0.98, filter: "brightness(0.96)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    Upgrade to publish
                  </motion.button>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.07)",
                    margin: "0 0",
                  }}
                />

                {/* Footer row */}
                <motion.div
                  variants={rowVariants}
                  className="px-5 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe
                      size={15}
                      className="text-white/30 shrink-0"
                      strokeWidth={1.75}
                    />
                    <span className="text-[13px] text-white/35 font-medium truncate">
                      Get a custom domain
                    </span>
                  </div>

                  <motion.button
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold cursor-pointer shrink-0"
                    style={{
                      background: "rgba(212,255,75,0.1)",
                      color: "#C8F03A",
                      border: "1px solid rgba(212,255,75,0.18)",
                    }}
                    whileHover={{
                      background: "rgba(212,255,75,0.16)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    aria-label="Upgrade to unlock custom domain"
                  >
                    <Lock size={11} strokeWidth={2.5} />
                    Upgrade to unlock
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
