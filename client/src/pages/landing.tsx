import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { Link } from "wouter";
import project1 from "@/assets/images/project1.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F0EDE7] font-sans flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[240px] flex-col border-r border-black/10 dark:border-white/10 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <svg width="20" height="20" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
            <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
          </svg>
          <span className="font-bold text-[15px] tracking-tight">/ Designfolio</span>
        </div>
        
        {/* Theme Toggle placeholder matching image */}
        <div className="flex items-center gap-2 mb-10 bg-black/5 dark:bg-white/10 rounded-full p-1 w-fit">
          <div className="bg-white dark:bg-transparent rounded-full p-1.5 shadow-sm">
            <Sun size={14} className="text-[#1A1A1A] dark:text-[#F0EDE7]" />
          </div>
          <div className="p-1.5 opacity-40">
            <Moon size={14} className="text-[#1A1A1A] dark:text-[#F0EDE7]" />
          </div>
        </div>

        <nav className="flex flex-col gap-5 text-[15px] font-medium">
          <Link href="#overview" className="text-[#FF553E]">Overview</Link>
          <Link href="#stories" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">Stories</Link>
          <Link href="#how" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">How?</Link>
          <Link href="#why" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">Why?</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="h-[72px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-[#FDFCF8]/90 dark:bg-[#121212]/90 backdrop-blur-md z-20">
          <div className="text-[13px] font-semibold tracking-[0.08em] text-black/50 dark:text-white/50 uppercase">
            25000+ USERS
          </div>
          <Button variant="outline" className="rounded-full border-black/15 dark:border-white/15 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A] dark:text-white h-9 px-5 font-medium">
            Login
          </Button>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-[800px] mx-auto px-6 md:px-12">
            {/* Section 1: Hero */}
            <section className="py-20 md:py-28 flex flex-col items-center text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-[52px] leading-[1.15] font-bold tracking-[-0.02em] mb-6 max-w-2xl text-[#1A1A1A] dark:text-white"
              >
                Fastest way to build your portfolio site
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[17px] md:text-[19px] leading-relaxed text-black/60 dark:text-white/60 mb-10 max-w-lg"
              >
                Skip the busywork with Designfolio — publish in hours, not weeks.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <Button className="rounded-full bg-[#1A1A1A] hover:bg-[#333] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#1A1A1A] px-6 h-12 text-[15px] font-medium flex items-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/5">
                  Get started for Free
                  <span className="bg-white text-black dark:bg-[#1A1A1A] dark:text-white rounded-full p-1 ml-1">
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
              >
                <img 
                  src={project1} 
                  alt="Dashboard preview" 
                  className="w-full object-cover"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y border-black/10 dark:border-white/10"
              >
                <p className="text-[14px] leading-tight text-black/50 dark:text-white/50 font-medium max-w-[120px] text-left">
                  Trusted by folks working at
                </p>
                <div className="flex flex-1 items-center justify-between gap-6 opacity-50 grayscale filter flex-wrap pl-4">
                  <span className="font-bold text-xl tracking-tighter">Google</span>
                  <div className="flex flex-wrap w-5 h-5 gap-[2px]">
                    <div className="w-[8px] h-[8px] bg-black dark:bg-white"></div>
                    <div className="w-[8px] h-[8px] bg-black dark:bg-white"></div>
                    <div className="w-[8px] h-[8px] bg-black dark:bg-white"></div>
                    <div className="w-[8px] h-[8px] bg-black dark:bg-white"></div>
                  </div>
                  <span className="font-bold text-xl">Apple</span>
                  <span className="font-bold text-xl tracking-tight">amazon</span>
                  <span className="font-bold text-lg flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-black dark:bg-white rounded-full"></div>
                    Swiggy
                  </span>
                </div>
              </motion.div>
            </section>
          </div>

          {/* Section 2: Testimonial */}
          <section className="bg-[#F4F1E9] dark:bg-[#1E1C1A] py-20 px-6 md:px-12 border-y border-black/10 dark:border-white/10">
            <div className="max-w-[800px] mx-auto">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src="/images/recommender-1.jpg" 
                    alt="Ishita Chaudhary" 
                    className="w-[52px] h-[52px] rounded-full object-cover border border-black/10 dark:border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?u=ishita";
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] dark:text-white text-[15px]">Ishita Chaudhary</h3>
                    <p className="text-[14px] text-black/60 dark:text-white/60">Product & Business @ Cisco</p>
                  </div>
                </div>
                <p className="text-[20px] md:text-[22px] leading-[1.6] text-[#1A1A1A] dark:text-white font-medium">
                  I was procrastinating on building my portfolio for a year, but Designfolio
                  completely changed that — it helped me go from Word/Figma case studies to
                  a live website in just 20 minutes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Feature 1 */}
          <section className="py-24 px-6 md:px-12 max-w-[800px] mx-auto">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#1A1A1A] dark:text-white mb-8 tracking-tight">
              1/ Choose a template.
            </h2>
            <div className="w-full relative rounded-[20px] overflow-hidden shadow-xl border border-black/5 dark:border-white/5 bg-[#F0ECE3] dark:bg-[#2A2825] p-5 pb-0">
              <img 
                src={project1} 
                alt="Choose template" 
                className="w-full rounded-t-[12px] object-cover shadow-lg border border-black/5 dark:border-white/5"
              />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
