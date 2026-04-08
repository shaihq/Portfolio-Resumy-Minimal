import { Link, useLocation } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutTemplate, Briefcase } from "lucide-react";

const navItems = [
  {
    icon: LayoutTemplate,
    label: "Portfolio Builder",
    href: "/",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/jobs",
  },
];

export function FloatingNav() {
  const [location] = useLocation();

  return (
    <div className="fixed top-6 left-6 z-[200] flex flex-col gap-1.5 bg-background/80 backdrop-blur-md border border-border p-1.5 rounded-xl shadow-lg">
      {navItems.map(({ icon: Icon, label, href }) => {
        const isActive =
          href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Tooltip key={href} delayDuration={200}>
            <TooltipTrigger asChild>
              <Link href={href}>
                <button
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover-elevate"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
