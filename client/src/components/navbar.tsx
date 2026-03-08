import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, ChartSpline, Eye, PaintRoller } from "lucide-react";
import profileImg from "@/assets/images/profile.png";
import { useIsMobile } from "@/hooks/use-mobile";
import SwitchToggleThemeDemo from "@/components/ui/toggle-theme";
import { navPreset } from "@/tokens/components";
import { navIconHover } from "@/tokens/animation";
import { componentLayout } from "@/tokens/spacing";

export default function Navbar() {
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkOverlay = () => setIsOverlay(window.innerWidth < 1024);
    checkOverlay();
    window.addEventListener("resize", checkOverlay);
    return () => window.removeEventListener("resize", checkOverlay);
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      if (isThemePanelOpen) {
        root.classList.add("theme-panel-open");
      } else {
        root.classList.remove("theme-panel-open");
      }
    }
    return () => {
      if (root) root.classList.remove("theme-panel-open");
    };
  }, [isThemePanelOpen]);

  return (
    <TooltipProvider>
      <div className={navPreset.wrapper}>
        <nav className={navPreset.bar}>
          <div className={navPreset.inner}>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg
                width="37"
                height="37"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="37" height="37" rx="18.5" fill="#FF553E" />
                <path
                  d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z"
                  fill="white"
                />
              </svg>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className={navPreset.dropdownTrigger}
                  >
                    Portfolio builder
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>Portfolio Builder</DropdownMenuItem>
                  <DropdownMenuItem>Other AI tools</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={navPreset.iconButton}
                    data-testid="button-insights"
                  >
                    <ChartSpline size={18} className={navIconHover.className} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className={navPreset.tooltip}>
                  Insights
                </TooltipContent>
              </Tooltip>
              <Sheet
                modal={false}
                open={isThemePanelOpen}
                onOpenChange={setIsThemePanelOpen}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={navPreset.iconButton}
                        data-testid="button-themes"
                      >
                        <PaintRoller
                          size={18}
                          className={navIconHover.className}
                        />
                      </Button>
                    </SheetTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className={navPreset.tooltip}>
                    Themes
                  </TooltipContent>
                </Tooltip>
                <SheetContent
                  className="border-l border-black/10 dark:border-white/10 bg-[var(--color-surface-elevated)] p-0 flex flex-col"
                  hasOverlay={isOverlay}
                  onInteractOutside={(e) => {
                    if (!isOverlay) {
                      e.preventDefault();
                    }
                  }}
                >
                  <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 shrink-0 flex flex-row items-center m-0 space-y-0">
                    <SheetTitle className="text-foreground text-[15px] font-medium m-0">
                      Themes settings
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                    <SwitchToggleThemeDemo />
                    {/* Theme configuration content */}
                  </div>
                </SheetContent>
              </Sheet>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={navPreset.iconButton}
                    data-testid="button-preview"
                  >
                    <Eye
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-125"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className={navPreset.tooltip}>
                  Preview
                </TooltipContent>
              </Tooltip>
              <Button
                className={navPreset.publishButton}
                data-testid="button-publish"
              >
                Publish
              </Button>
              <Avatar
                className={`${componentLayout.avatarNav} border border-black/10 dark:border-white/10 shrink-0`}
              >
                <AvatarImage src={profileImg} alt="Profile" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
