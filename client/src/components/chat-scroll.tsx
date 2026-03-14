import { useEffect, useRef } from "react";

export function ChatScroll({ step }: { step: number }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [step]);

  return <div ref={bottomRef} />;
}
