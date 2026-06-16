import { Sparkles, FileText, Mic, Search, Wand2, BrainCircuit } from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Tailored to every job. AI rewrites your resume to match the role — keywords, tone, and structure included.",
    badge: "Popular",
  },
  {
    icon: Wand2,
    title: "Cover Letter Writer",
    description: "One click, one cover letter that actually sounds like you. Not a template. Not a robot.",
    badge: null,
  },
  {
    icon: BrainCircuit,
    title: "Case Study Analyzer",
    description: "Paste your case study. Get back a critique on structure, storytelling, and what recruiters will actually think.",
    badge: "Pro",
  },
  {
    icon: Mic,
    title: "Mock Interview",
    description: "Practice with Kevin — an AI interviewer who pushes back, spots vague answers, and won't let you off easy.",
    badge: "Pro",
  },
  {
    icon: Search,
    title: "Job Match",
    description: "Stop scrolling blindly. AI surfaces roles that fit your portfolio, skills, and seniority — ranked by fit.",
    badge: "Pro",
  },
];

export default function AITools() {
  return (
    <div className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] transition-colors duration-700">
      <div className="max-w-[640px] mx-auto px-5 md:px-8 pt-12 pb-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FF553E]/10 dark:bg-[#FF553E]/15">
              <Sparkles className="w-4 h-4 text-[#FF553E]" />
            </span>
            <span className="text-[13px] font-semibold text-[#FF553E] tracking-wide uppercase">AI Tools</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7] leading-tight mb-2">
            Your unfair advantage.
          </h1>
          <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
            Every tool here is built for one thing — getting you hired faster, with less busywork.
          </p>
        </div>

        {/* Tools list */}
        <div className="flex flex-col gap-3">
          {tools.map(({ icon: Icon, title, description, badge }) => (
            <button
              key={title}
              className="group w-full text-left bg-white/60 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.07] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl px-5 py-4 transition-all duration-200 flex items-start gap-4"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-black/[0.05] dark:bg-white/[0.06] group-hover:bg-[#FF553E]/10 dark:group-hover:bg-[#FF553E]/15 transition-colors duration-200 mt-0.5">
                <Icon className="w-[18px] h-[18px] text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#FF553E] transition-colors duration-200" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">{title}</span>
                  {badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      badge === "Pro"
                        ? "bg-[#FF553E]/10 text-[#FF553E] dark:bg-[#FF553E]/20"
                        : "bg-black/[0.06] text-[#7A736C] dark:bg-white/[0.08] dark:text-[#9E9893]"
                    }`}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#7A736C] dark:text-[#9E9893] leading-relaxed">
                  {description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
