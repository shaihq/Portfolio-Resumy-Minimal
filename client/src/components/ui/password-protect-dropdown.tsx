import React, { useRef } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"

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
  hidden: { opacity: 0, scale: 0.96, y: -8 },
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

interface PasswordProtectDropdownProps {
  isOpen: boolean
  onToggle: () => void
  triggerClassName: string
  triggerContent: React.ReactNode
}

export function PasswordProtectDropdown({
  isOpen,
  onToggle,
  triggerClassName,
  triggerContent,
}: PasswordProtectDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useClickAway(dropdownRef, () => {
    if (isOpen) onToggle()
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onToggle()
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={onToggle}
          className={triggerClassName}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {triggerContent}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2.5 z-50 w-[320px]"
              onKeyDown={handleKeyDown}
              style={{ transformOrigin: "top right" }}
            >
              <div
                className="w-full rounded-[20px] overflow-hidden"
                style={{
                  background: "#1A1A1A",
                  boxShadow:
                    "0 0 0 0.5px rgba(255,255,255,0.07), 0 8px 24px rgba(0,0,0,0.28), 0 24px 48px rgba(0,0,0,0.18)",
                }}
              >
                {/* Image — flush at top, card clips the corners */}
                <motion.div variants={rowVariants}>
                  <img
                    src="/custompassword.png"
                    alt="Password protect preview"
                    className="w-full h-auto block"
                    draggable={false}
                  />
                </motion.div>

                {/* Content */}
                <div className="px-5 pt-4 pb-5 flex flex-col gap-2">
                  <motion.p
                    variants={rowVariants}
                    className="text-[17px] font-bold text-white tracking-[-0.4px] leading-snug"
                  >
                    Unlock password protection
                  </motion.p>
                  <motion.p
                    variants={rowVariants}
                    className="text-[14px] text-white/50 leading-snug tracking-[-0.1px]"
                  >
                    Protect your portfolio with a password
                  </motion.p>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5">
                  <motion.button
                    variants={rowVariants}
                    className="w-full h-[50px] rounded-[13px] text-[14px] font-bold text-[#111] tracking-[-0.2px] cursor-pointer"
                    style={{ background: "#D4FF4B" }}
                    whileHover={{ filter: "brightness(1.06)" }}
                    whileTap={{ scale: 0.98, filter: "brightness(0.94)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    Upgrade to unlock
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
