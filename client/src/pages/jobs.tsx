import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, ChevronRight } from "lucide-react";

type Phase = "transition" | "voice" | "type";

const questions = [
  "What kind of work are you looking for — full-time, freelance, or something in between?",
  "Where would you want to be based? Remote, hybrid, or a specific city?",
  "Which industry excites you most right now?",
  "What's the one thing a role must have for you to say yes?",
  "Anything you'd want to avoid in your next job?",
];

// Waveform bars animation
function Waveform({ listening }: { listening: boolean }) {
  const bars = Array.from({ length: 28 });
  return (
    <div className="flex items-center justify-center gap-[3px] h-14">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-white/60"
          animate={
            listening
              ? {
                  height: [
                    `${8 + Math.random() * 8}px`,
                    `${20 + Math.random() * 30}px`,
                    `${8 + Math.random() * 8}px`,
                  ],
                  opacity: [0.4, 1, 0.4],
                }
              : { height: "6px", opacity: 0.25 }
          }
          transition={
            listening
              ? {
                  duration: 0.6 + Math.random() * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.04,
                }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}

// Dot trail progress
function DotTrail({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-white"
          animate={{
            width: i === current ? 20 : 6,
            opacity: i < current ? 0.3 : i === current ? 1 : 0.15,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}

// ── Transition screen ──────────────────────────────────────────────────────
function TransitionScreen({ onVoice, onType }: { onVoice: () => void; onType: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0E0D0C] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/8 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-md text-center space-y-6"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo mark */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <svg width="44" height="44" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
            <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
          </svg>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-white">
            Your portfolio's ready.<br />Your resume's in.
          </h1>
          <p className="text-[16px] text-white/50 leading-relaxed font-light">
            Now let's find work that actually fits.
          </p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            data-testid="button-lets-talk"
            onClick={onVoice}
            className="flex items-center gap-2 bg-white text-[#0E0D0C] font-medium text-[14px] px-6 py-3 rounded-full hover:bg-white/90 transition-all active:scale-[0.97]"
          >
            <Mic className="w-4 h-4" />
            Let's talk
          </button>
          <button
            data-testid="button-type-instead"
            onClick={onType}
            className="flex items-center gap-2 text-white/50 font-medium text-[14px] px-6 py-3 rounded-full border border-white/10 hover:border-white/25 hover:text-white/80 transition-all active:scale-[0.97]"
          >
            I'll type instead
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Voice onboarding room ──────────────────────────────────────────────────
function VoiceRoom({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [listening, setListening] = useState(false);
  const [answered, setAnswered] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMic = () => {
    if (listening) {
      setListening(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      // Simulate recording an answer and moving forward
      setTimeout(() => {
        const next = current + 1;
        setAnswered((prev) => [...prev, "..."]);
        if (next >= questions.length) {
          onDone();
        } else {
          setCurrent(next);
        }
      }, 400);
    } else {
      setListening(true);
      // Auto-stop after 8 seconds
      timerRef.current = setTimeout(() => {
        setListening(false);
        const next = current + 1;
        setAnswered((prev) => [...prev, "..."]);
        if (next >= questions.length) {
          onDone();
        } else {
          setCurrent(next);
        }
      }, 8000);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-between bg-[#0E0D0C] px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px]"
          animate={{
            backgroundColor: listening ? "rgba(255,85,62,0.12)" : "rgba(255,85,62,0.06)",
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Top spacer */}
      <div />

      {/* Question */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            className="text-white text-[22px] font-medium leading-snug tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {questions[current]}
          </motion.p>
        </AnimatePresence>

        {/* Waveform */}
        <Waveform listening={listening} />

        {/* Mic button */}
        <motion.button
          data-testid="button-mic"
          onClick={handleMic}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            listening
              ? "bg-[#FF553E] shadow-[0_0_40px_rgba(255,85,62,0.5)]"
              : "bg-white/10 border border-white/15 hover:bg-white/15"
          }`}
          whileTap={{ scale: 0.93 }}
        >
          {listening ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white/70" />
          )}
        </motion.button>

        <p className="text-white/30 text-[12px]">
          {listening ? "Tap to stop" : "Tap to speak"}
        </p>
      </div>

      {/* Dot trail */}
      <div className="relative z-10">
        <DotTrail current={current} total={questions.length} />
      </div>
    </motion.div>
  );
}

// ── Text onboarding room ───────────────────────────────────────────────────
function TypeRoom({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setInput("");
  }, [current]);

  const advance = () => {
    if (!input.trim()) return;
    const next = current + 1;
    if (next >= questions.length) {
      onDone();
    } else {
      setCurrent(next);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") advance();
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-between bg-[#0E0D0C] px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/6 blur-[120px]" />
      </div>

      {/* Top spacer */}
      <div />

      {/* Question + input */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-10 w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            className="text-white text-[22px] font-medium leading-snug tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {questions[current]}
          </motion.p>
        </AnimatePresence>

        <div className="w-full flex items-center gap-3">
          <input
            ref={inputRef}
            data-testid="input-answer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your answer…"
            className="flex-1 bg-white/6 border border-white/10 rounded-2xl px-5 py-4 text-white text-[15px] placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
          />
          <motion.button
            data-testid="button-next"
            onClick={advance}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center disabled:opacity-25 transition-opacity flex-shrink-0"
            whileTap={{ scale: 0.92 }}
          >
            <ArrowRight className="w-4 h-4 text-[#0E0D0C]" />
          </motion.button>
        </div>
      </div>

      {/* Dot trail */}
      <div className="relative z-10">
        <DotTrail current={current} total={questions.length} />
      </div>
    </motion.div>
  );
}

// ── LinkedIn logo ──────────────────────────────────────────────────────────
function LinkedInLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M7.2 9.6H4.8V19.2H7.2V9.6ZM6 8.4C6.79 8.4 7.44 7.75 7.44 6.96C7.44 6.17 6.79 5.52 6 5.52C5.21 5.52 4.56 6.17 4.56 6.96C4.56 7.75 5.21 8.4 6 8.4ZM19.2 19.2H16.8V14.52C16.8 13.38 16.78 11.91 15.21 11.91C13.62 11.91 13.38 13.16 13.38 14.44V19.2H10.98V9.6H13.28V10.92H13.32C13.65 10.28 14.47 9.6 15.69 9.6C18.12 9.6 19.2 11.22 19.2 13.44V19.2Z"
        fill="white"
      />
    </svg>
  );
}

// ── Indeed logo ────────────────────────────────────────────────────────────
function IndeedLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#003A9B" />
      <path
        d="M12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5Z"
        fill="white"
      />
      <path
        d="M8 13H16V19H14.5V15H13V19H11V15H9.5V19H8V13Z"
        fill="white"
      />
    </svg>
  );
}

// ── Thinking line component ─────────────────────────────────────────────────
function ThoughtLine({ text, delay, dim }: { text: string; delay: number; dim?: boolean }) {
  return (
    <motion.div
      className={`flex items-start gap-2 text-[13px] leading-relaxed font-mono ${dim ? "text-white/25" : "text-white/60"}`}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
    >
      <span className="text-white/20 mt-0.5 flex-shrink-0">›</span>
      <span>{text}</span>
    </motion.div>
  );
}

// ── Platform status card ────────────────────────────────────────────────────
type PlatformStatus = "waiting" | "scraping" | "done";

function PlatformCard({
  logo,
  name,
  status,
  count,
  delay,
}: {
  logo: React.ReactNode;
  name: string;
  status: PlatformStatus;
  count?: number;
  delay: number;
}) {
  return (
    <motion.div
      className="flex-1 min-w-0 border border-white/8 rounded-2xl p-4 flex flex-col gap-3 bg-white/3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        {logo}
        <span className="text-white/70 text-[13px] font-medium">{name}</span>
      </div>

      <div className="flex items-center gap-2">
        {status === "waiting" && (
          <span className="text-white/25 text-[12px]">Queued</span>
        )}
        {status === "scraping" && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[3px]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#FF553E]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-[#FF553E] text-[12px]">Scraping…</span>
          </div>
        )}
        {status === "done" && (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.4 }}
            />
            <span className="text-emerald-400 text-[12px]">{count} roles found</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Done / Thinking screen ─────────────────────────────────────────────────
function DoneScreen() {
  const thoughts = [
    { text: "Reading your answers…", delay: 0.3 },
    { text: "Remote-first preference detected.", delay: 0.85 },
    { text: "Filtering for full-time, senior-level roles.", delay: 1.4 },
    { text: "Excluding agency & contract-only listings.", delay: 1.95 },
    { text: "Weighting for culture fit over title match.", delay: 2.5 },
    { text: "Cross-referencing with your portfolio strengths.", delay: 3.1 },
    { text: "Ranking by alignment score…", delay: 3.7 },
  ];

  const [liStatus, setLiStatus] = useState<PlatformStatus>("waiting");
  const [liCount, setLiCount] = useState<number | undefined>();
  const [indeedStatus, setIndeedStatus] = useState<PlatformStatus>("waiting");
  const [indeedCount, setIndeedCount] = useState<number | undefined>();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setLiStatus("scraping"), 1800);
    const t2 = setTimeout(() => { setLiStatus("done"); setLiCount(214); }, 4200);
    const t3 = setTimeout(() => setIndeedStatus("scraping"), 3000);
    const t4 = setTimeout(() => { setIndeedStatus("done"); setIndeedCount(178); }, 5400);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0E0D0C] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF553E]/7 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col gap-5">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex gap-[5px] items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#FF553E]"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
              />
            ))}
          </div>
          <h2 className="text-white text-[17px] font-semibold tracking-tight">
            Got it. We're on it.
          </h2>
        </motion.div>

        {/* Thinking panel */}
        <motion.div
          className="border border-white/8 rounded-2xl overflow-hidden bg-white/2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {/* Panel header */}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-white/6 hover:bg-white/3 transition-colors"
            data-testid="button-thinking-toggle"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-white/50 text-[12px] font-medium tracking-wide uppercase">
                Thinking
              </span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.25 }}
              className="text-white/20"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </button>

          {/* Thought stream */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="px-4 py-3 flex flex-col gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {thoughts.map((t, i) => (
                  <ThoughtLine
                    key={i}
                    text={t.text}
                    delay={t.delay}
                    dim={i < thoughts.length - 2}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Platform cards */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <PlatformCard
            logo={<LinkedInLogo size={22} />}
            name="LinkedIn"
            status={liStatus}
            count={liCount}
            delay={0.4}
          />
          <PlatformCard
            logo={<IndeedLogo size={22} />}
            name="Indeed"
            status={indeedStatus}
            count={indeedCount}
            delay={0.55}
          />
        </motion.div>

        {/* Sub-label */}
        <motion.p
          className="text-white/25 text-[12px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Matching roles to your portfolio and preferences
        </motion.p>
      </div>
    </motion.div>
  );
}

// ── Main Jobs page ─────────────────────────────────────────────────────────
export default function Jobs() {
  const [phase, setPhase] = useState<Phase | "done">("transition");

  return (
    <AnimatePresence mode="wait">
      {phase === "transition" && (
        <TransitionScreen
          key="transition"
          onVoice={() => setPhase("voice")}
          onType={() => setPhase("type")}
        />
      )}
      {phase === "voice" && (
        <VoiceRoom key="voice" onDone={() => setPhase("done")} />
      )}
      {phase === "type" && (
        <TypeRoom key="type" onDone={() => setPhase("done")} />
      )}
      {phase === "done" && <DoneScreen key="done" />}
    </AnimatePresence>
  );
}
