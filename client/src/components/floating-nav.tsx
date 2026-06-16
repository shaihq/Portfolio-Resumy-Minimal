import { Link, useLocation } from "wouter";
import { LayoutTemplate, Briefcase } from "lucide-react";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";

const navItems = [
  {
    icon: LayoutTemplate,
    label: "Portfolio",
    href: "/",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/jobs",
  },
];

function DesignfolioLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
      <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
    </svg>
  );
}

export function FloatingNav() {
  const [location] = useLocation();

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-[200] flex flex-col items-center gap-1 bg-white dark:bg-[#1E1C1A] border border-black/[0.08] dark:border-white/[0.08] px-2 py-3 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">

      {/* Logo */}
      <div className="flex items-center justify-center mb-1 px-1" data-testid="nav-logo">
        <DesignfolioLogo />
      </div>

      {/* Divider */}
      <div className="w-7 h-px bg-black/[0.07] dark:bg-white/[0.07] mb-1" />

      {/* Nav items */}
      {navItems.map(({ icon: Icon, label, href }) => {
        const isActive =
          href === "/" ? location === "/" : location.startsWith(href);

        return (
          <Link key={href} href={href} className="w-full">
            <button
              data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              style={isActive ? {
                background: "rgba(0,0,0,0.055)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.13), inset 0 0.5px 1px rgba(0,0,0,0.09)",
              } : undefined}
              className={`w-full flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "dark:bg-white/[0.07]"
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              }`}
            >
              <Icon
                className={`w-[17px] h-[17px] transition-colors duration-200 ${
                  isActive
                    ? "text-foreground/80"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                  isActive
                    ? "text-foreground/70"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          </Link>
        );
      })}

      {/* Divider */}
      <div className="w-7 h-px bg-black/[0.07] dark:bg-white/[0.07] mt-1 mb-1" />

      {/* Avatar */}
      <AvatarDropdown side="right" />
    </div>
  );
}
