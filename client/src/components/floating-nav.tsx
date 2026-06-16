import { Link, useLocation } from "wouter";
import { useRef } from "react";
import {
  LayoutGridIcon, type LayoutGridIconHandle,
  BriefcaseBusinessIcon, type BriefcaseBusinessIconHandle,
  SparklesIcon, type SparklesIconHandle,
} from "lucide-animated";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";

function DesignfolioLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
      <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
    </svg>
  );
}

function NavItem({
  href,
  label,
  isActive,
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  label: string;
  isActive: boolean;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <Link href={href} className="w-full">
      <button
        data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full flex flex-col items-center gap-1.5 px-1 py-2.5 rounded-xl transition-all duration-200 group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-[#D6CDBF] dark:bg-[#242424]"
              : "group-hover:bg-black/[0.05] dark:group-hover:bg-white/[0.05]"
          }`}
        >
          {children}
        </span>
        <span
          className={`text-[11px] font-medium leading-none font-['Inter'] transition-colors duration-200 ${
            isActive
              ? "text-[#2C2420] dark:text-[#E8E0D5]"
              : "text-[#8C7B72] dark:text-[#7A6E65] group-hover:text-[#2C2420] dark:group-hover:text-[#E8E0D5]"
          }`}
        >
          {label}
        </span>
      </button>
    </Link>
  );
}

export function FloatingNav() {
  const [location] = useLocation();

  const portfolioRef = useRef<LayoutGridIconHandle>(null);
  const jobsRef = useRef<BriefcaseBusinessIconHandle>(null);
  const toolsRef = useRef<SparklesIconHandle>(null);

  const iconClass = (active: boolean) =>
    `transition-colors duration-200 ${
      active
        ? "text-[#2C2420] dark:text-[#E8E0D5]"
        : "text-[#8C7B72] dark:text-[#7A6E65]"
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-[72px] z-[200] flex flex-col items-center bg-[#E9E3DB] dark:bg-[#141414] border-r border-black/[0.07] dark:border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center justify-center w-full py-5 flex-shrink-0">
        <div data-testid="nav-logo">
          <DesignfolioLogo />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-0.5 w-full pt-2 px-2">
        <NavItem
          href="/"
          label="Portfolio"
          isActive={location === "/"}
          onMouseEnter={() => portfolioRef.current?.startAnimation()}
          onMouseLeave={() => portfolioRef.current?.stopAnimation()}
        >
          <LayoutGridIcon ref={portfolioRef} size={22} className={iconClass(location === "/")} />
        </NavItem>

        <NavItem
          href="/jobs"
          label="Jobs"
          isActive={location.startsWith("/jobs")}
          onMouseEnter={() => jobsRef.current?.startAnimation()}
          onMouseLeave={() => jobsRef.current?.stopAnimation()}
        >
          <BriefcaseBusinessIcon ref={jobsRef} size={22} className={iconClass(location.startsWith("/jobs"))} />
        </NavItem>

        <NavItem
          href="/tools"
          label="AI Tools"
          isActive={location.startsWith("/tools")}
          onMouseEnter={() => toolsRef.current?.startAnimation()}
          onMouseLeave={() => toolsRef.current?.stopAnimation()}
        >
          <SparklesIcon ref={toolsRef} size={22} className={iconClass(location.startsWith("/tools"))} />
        </NavItem>
      </nav>

      {/* Profile avatar pinned to bottom */}
      <div className="mt-auto pb-4 flex items-center justify-center">
        <AvatarDropdown variant="sidebar" />
      </div>
    </aside>
  );
}
