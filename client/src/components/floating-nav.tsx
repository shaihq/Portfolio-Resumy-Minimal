import { Link, useLocation } from "wouter";
import { LayoutTemplate, Briefcase } from "lucide-react";

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
    <svg width="28" height="28" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
      <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
    </svg>
  );
}

export function FloatingNav() {
  const [location] = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[72px] z-[200] flex flex-col items-center bg-[#E5E1DA] dark:bg-card border-r border-[#D5CFC7] dark:border-border">
      {/* Logo */}
      <div className="flex items-center justify-center w-full py-5 flex-shrink-0">
        <div data-testid="nav-logo">
          <DesignfolioLogo />
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-black/[0.07] dark:bg-white/[0.07] flex-shrink-0" />

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 w-full pt-3 px-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === "/" ? location === "/" : location.startsWith(href);

          return (
            <Link key={href} href={href} className="w-full">
              <button
                data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`w-full flex flex-col items-center gap-1.5 px-1 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-black/[0.07] dark:bg-white/[0.09]"
                    : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive
                      ? "text-foreground/70 dark:text-foreground/60"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {label}
                </span>
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
