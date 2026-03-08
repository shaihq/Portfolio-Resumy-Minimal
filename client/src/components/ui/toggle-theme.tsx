"use client";

import { useId, useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

const SwitchToggleThemeDemo = () => {
  const id = useId();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    const syncTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"))

    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const handleCheckedChange = (checked: boolean) => {
    setIsDark(checked);
    document.documentElement.classList.toggle("dark", checked)
    localStorage.setItem("theme", checked ? "dark" : "light")
  };

  return (
    <div className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 rounded-[16px] bg-black/[0.02] dark:bg-white/[0.02]">
      <div className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Appearance</div>
      <div className="group inline-flex items-center gap-2">
        <span
          id={`${id}-light`}
          className={cn(
            "cursor-pointer text-left text-sm font-medium transition-colors",
            isDark ? "text-[#7A736C] dark:text-[#9E9893]" : "text-[#1A1A1A] dark:text-[#F0EDE7]",
          )}
          aria-controls={id}
          onClick={() => handleCheckedChange(false)}
        >
          <SunIcon className="size-4" aria-hidden="true" />
        </span>

        <Switch
          id={id}
          checked={isDark}
          onCheckedChange={handleCheckedChange}
          aria-labelledby={`${id}-light ${id}-dark`}
          aria-label="Toggle between dark and light mode"
        />

        <span
          id={`${id}-dark`}
          className={cn(
            "cursor-pointer text-right text-sm font-medium transition-colors",
            !isDark ? "text-[#7A736C] dark:text-[#9E9893]" : "text-[#1A1A1A] dark:text-[#F0EDE7]",
          )}
          aria-controls={id}
          onClick={() => handleCheckedChange(true)}
        >
          <MoonIcon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};

export default SwitchToggleThemeDemo;