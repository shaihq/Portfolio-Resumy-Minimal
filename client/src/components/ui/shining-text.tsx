import { motion } from "motion/react";

export function ShiningText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#555_20%,#999_38%,#fff_50%,#999_62%,#555_80%)] dark:bg-[linear-gradient(110deg,#777_20%,#aaa_38%,#fff_50%,#aaa_62%,#777_80%)] bg-[length:300%_100%] bg-clip-text text-transparent ${className ?? ""}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-100% 0" }}
      transition={{
        repeat: Infinity,
        duration: 4,
        ease: "linear",
        repeatDelay: 1.5,
      }}
    >
      {text}
    </motion.span>
  );
}
