import * as React from "react"
import { useEffect, useRef, useState } from "react";

export interface AnimatedTabsProps {
  tabs: { label: string }[];
  onChange?: (label: string) => void;
}

export function AnimatedTabs({ tabs, onChange }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;
        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab]);

  const handleClick = (label: string) => {
    setActiveTab(label);
    onChange?.(label);
  };

  return (
    <div className="relative bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.07] mx-auto flex w-fit flex-col items-center rounded-full py-1.5 px-1.5">
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-white/90 dark:bg-[#3A352E]">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleClick(tab.label)}
              className="flex h-8 items-center rounded-full px-4 text-sm font-medium text-[#1A1A1A] dark:text-[#F0EDE7]"
              tabIndex={-1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        {tabs.map(({ label }, index) => {
          const isActive = activeTab === label;
          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleClick(label)}
              className="flex h-8 items-center cursor-pointer rounded-full px-4 text-sm font-medium text-[#7A736C]/70 dark:text-[#B5AFA5]/70"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
