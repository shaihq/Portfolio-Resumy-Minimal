import { Link, useLocation } from "wouter";
import { LayoutTemplate, Briefcase } from "lucide-react";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";

const navItems = [
  { icon: LayoutTemplate, label: "Portfolio", href: "/" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
];

function DesignfolioLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
      <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
    </svg>
  );
}

export function FloatingNav() {
  const [location] = useLocation();

  return (
    <div
      className="fixed top-5 left-5 z-[200] flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-[18px]"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.07), inset 0 0 0 0.5px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo */}
      <div className="mb-1.5 mt-0.5" data-testid="nav-logo">
        <DesignfolioLogo />
      </div>

      {/* Nav items */}
      {navItems.map(({ icon: Icon, label, href }) => {
        const isActive = href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Link key={href} href={href}>
            <button
              data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              style={isActive ? {
                background: "rgba(0,0,0,0.06)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1), inset 0 0.5px 1px rgba(0,0,0,0.07)",
              } : undefined}
              className={`flex flex-col items-center gap-1 w-[52px] py-2 rounded-xl transition-all duration-150 group ${
                isActive ? "" : "hover:bg-black/[0.04]"
              }`}
            >
              <Icon className={`w-[15px] h-[15px] transition-colors duration-150 ${isActive ? "text-foreground/75" : "text-foreground/35 group-hover:text-foreground/60"}`} />
              <span className={`text-[9.5px] font-medium tracking-wide transition-colors duration-150 ${isActive ? "text-foreground/60" : "text-foreground/30 group-hover:text-foreground/50"}`}>
                {label}
              </span>
            </button>
          </Link>
        );
      })}

      {/* Avatar */}
      <div className="mt-1.5">
        <AvatarDropdown side="right" />
      </div>
    </div>
  );
}
