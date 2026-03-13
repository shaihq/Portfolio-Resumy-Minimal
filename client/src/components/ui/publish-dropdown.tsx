import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Copy, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function PublishDropdown() {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-6 h-9 text-sm rounded-full hover:cursor-pointer transition-colors"
          data-testid="button-publish"
        >
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-[280px] p-5 rounded-[24px] bg-white dark:bg-[#1C1A19] border border-black/10 dark:border-white/10 shadow-xl"
        sideOffset={12}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[16px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">
                shai.designfolio.me
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className={cn(
                  "h-8 w-8 rounded-[10px] shrink-0 transition-all",
                  copied 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20" 
                    : "bg-[#F5F5F5] dark:bg-[#2A2520] text-[#7A736C] dark:text-[#9E9893] hover:bg-[#E8E8E8] dark:hover:bg-[#3A3531] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
                )}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <span className="text-[13px] text-[#7A736C] dark:text-[#9E9893]">
              Updated: 29 days ago
            </span>
          </div>
          
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={cn(
              "w-full h-12 font-medium rounded-xl transition-all text-[15px]",
              isPublishing
                ? "bg-[#E8E8E8] dark:bg-[#2A2520] text-[#7A736C] dark:text-[#9E9893]"
                : "bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#E8E8E8] dark:hover:bg-[#D4D4D4] text-[#1A1A1A]"
            )}
          >
            {isPublishing ? "Updating..." : "Update changes"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
