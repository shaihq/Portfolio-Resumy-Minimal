"use client"

import React, { Fragment } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ChevronDown, Briefcase, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

interface Category {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

const categories: Category[] = [
  { id: "portfolio", label: "Portfolio builder", icon: Briefcase, color: "#1A1A1A" },
  { id: "other", label: "Other AI tools", icon: Sparkles, color: "#A06CD5" },
]

const IconWrapper = ({
  icon: Icon,
}: { icon: React.ElementType }) => (
  <div className="w-4 h-4 mr-2.5 relative flex items-center justify-center shrink-0">
    <Icon className="w-4 h-4" />
  </div>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function FluidDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(categories[0])
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative"
        ref={dropdownRef}
      >
          <Button
            variant="secondary"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] font-medium px-3 text-sm rounded-full flex items-center gap-1 hover:cursor-pointer transition-all duration-200"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center">
              <IconWrapper icon={selectedCategory.icon} />
              {selectedCategory.label}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-4 h-4 shrink-0 ml-1"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 1, y: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 0,
                  height: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                className="absolute -left-1.5 top-full mt-2 z-50 min-w-[200px]"
                onKeyDown={handleKeyDown}
              >
                <motion.div
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-1.5 shadow-lg overflow-hidden"
                  initial={{ borderRadius: 12 }}
                  animate={{
                    borderRadius: 16,
                    transition: { duration: 0.2 },
                  }}
                  style={{ transformOrigin: "top" }}
                >
                  <motion.div 
                    className="relative flex flex-col" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                  >
                    <motion.div
                      className="absolute top-0 left-0 right-0 bg-black/5 dark:bg-white/5 rounded-xl z-0"
                      initial={false}
                      animate={{
                        y: categories.findIndex((c) => (hoveredCategory || selectedCategory.id) === c.id) * 44,
                        height: 44,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                    {categories.map((category) => {
                      const isActive = (hoveredCategory || selectedCategory.id) === category.id;
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsOpen(false)
                          }}
                          onHoverStart={() => setHoveredCategory(category.id)}
                          onHoverEnd={() => setHoveredCategory(null)}
                          className={cn(
                            "relative z-10 flex w-full items-center justify-start px-3 h-[44px] text-[13px] font-medium rounded-xl text-left",
                            "transition-colors duration-150",
                            "focus:outline-none cursor-pointer",
                            isActive
                              ? "text-[#1A1A1A] dark:text-[#F0EDE7]"
                              : "text-[#7A736C] dark:text-[#9E9893]",
                          )}
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                        >
                          <div className="flex items-center justify-start w-full">
                            <IconWrapper icon={category.icon} />
                            {category.label}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </MotionConfig>
  )
}
