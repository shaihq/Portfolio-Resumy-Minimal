import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { FaAmazon, FaMicrosoft } from "react-icons/fa";
import mockupImg from "@assets/image_1773592620611.png";
import { useTheme } from "next-themes";

function BlurHoverText({ defaultText, hoverText }: { defaultText: string, hoverText: string }) {
  const hoverWords = hoverText.split(" ");
  
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      className="relative cursor-default inline-flex h-full items-center"
    >
      <motion.div
        variants={{
          initial: { opacity: 1, filter: "blur(0px)" },
          hover: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }
        }}
        className="flex items-center whitespace-nowrap"
      >
        {defaultText}
      </motion.div>
      
      <motion.div className="absolute left-0 flex gap-[0.3em] whitespace-nowrap pointer-events-none">
        {hoverWords.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { opacity: 0, filter: "blur(4px)" },
              hover: { 
                opacity: 1, 
                filter: "blur(0px)",
                transition: { duration: 0.3, delay: i * 0.08 }
              }
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

function ShimmerInView({ text }: { text: string }) {
  if (!text.includes('"')) return <>{text}</>;
  const parts = text.split('"');
  
  return (
    <>
      {parts[0]}
      <motion.span
        initial={{ backgroundPosition: '100% center' }}
        whileInView={{ backgroundPosition: '0% center' }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="text-transparent bg-clip-text inline-block"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #1D1B1A 0%, #1D1B1A 30%, #5D3560 40%, #E54D2E 50%, #F5A623 60%, #1D1B1A 70%, #1D1B1A 100%)', 
          backgroundSize: '300% auto'
        }}
      >
        {parts[1]}
      </motion.span>
      {parts[2]}
    </>
  );
}

export default function Landing() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Force background color on html, body, and root for Mac/iOS overscroll
    const bgColor = theme === 'dark' ? '#1A1A1A' : '#FFFEF2';
    
    document.documentElement.style.setProperty('background-color', bgColor, 'important');
    document.body.style.setProperty('background-color', bgColor, 'important');
    const root = document.getElementById('root');
    if (root) root.style.setProperty('background-color', bgColor, 'important');
    
    // Also update theme-color meta tag for mobile/Safari
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    let originalThemeColor = '';
    if (metaThemeColor) {
      originalThemeColor = metaThemeColor.getAttribute('content') || '';
      metaThemeColor.setAttribute('content', bgColor);
    } else {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      metaThemeColor.setAttribute('content', bgColor);
      document.head.appendChild(metaThemeColor);
    }
    
    return () => {
      // Reset when unmounting
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
      if (root) root.style.removeProperty('background-color');
      
      if (metaThemeColor) {
        if (originalThemeColor) {
          metaThemeColor.setAttribute('content', originalThemeColor);
        } else {
          metaThemeColor.remove();
        }
      }
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-[#FFFEF2] dark:bg-background text-[#1D1B1A] dark:text-foreground antialiased overflow-x-clip flex justify-center" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="w-full max-w-[640px] bg-[#FFFEF2] dark:bg-background min-h-screen border-x border-[#EAE9E4] dark:border-border relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        
        {/* Left Floating Nav */}
        <div className="hidden lg:block absolute right-full top-0 bottom-0 z-40">
          <div className="sticky top-[120px] flex flex-col items-start pr-12 w-max">
            
            {/* Logo that gets revealed */}
            <div className="absolute top-0 left-0 w-9 h-9 z-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-center shadow-sm rounded-full overflow-hidden"
              >
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
                  <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
                </svg>
              </motion.div>
            </div>
            
            {/* Sliding Container */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: 52 }}
              transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative z-10 bg-[#FFFEF2] dark:bg-background w-full"
            >
              <div className="font-bold text-[15px] tracking-tight text-[#1D1B1A] dark:text-foreground flex items-center h-9 pr-4 bg-[#FFFEF2] dark:bg-background">
                <span className="mr-1.5">/</span>
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } }
                  }}
                  className="flex"
                >
                  {"Designfolio".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </div>
              
              <div className="flex items-center gap-2 mt-4 mb-4 text-[#1D1B1A]/40 dark:text-foreground/40 bg-[#FFFEF2] dark:bg-background">
                <Sun className="w-4 h-4 text-[#1D1B1A] dark:text-foreground/40" />
                <div 
                  className="w-9 h-[22px] bg-[#EAE9E4] dark:bg-[#1D1B1A] rounded-full relative shadow-inner border border-[#E2E1DA] dark:border-[#333] cursor-pointer"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <div className={`absolute top-[2px] w-4 h-4 bg-white dark:bg-[#A3A3A3] rounded-full shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-[17px]' : 'left-[3px]'}`}></div>
                </div>
                <Moon className="w-4 h-4 text-[#1D1B1A]/40 dark:text-foreground" />
              </div>
              
              <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-[#1D1B1A]/50 dark:text-foreground/50 pb-4 bg-[#FFFEF2] dark:bg-background">
                <a href="#" className="text-[#E54D2E] font-semibold transition-colors">Overview</a>
                <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Stories</a>
                <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">How?</a>
                <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Why?</a>
              </nav>
            </motion.div>
          </div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-[#FFFEF2]/95 dark:bg-background/95 backdrop-blur before:absolute before:content-[''] before:inset-x-[-100vw] before:bottom-0 before:h-px before:bg-[#EAE9E4] dark:before:bg-border">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="text-[13px] font-semibold tracking-wide text-[#1D1B1A]/70 dark:text-foreground/70 uppercase h-[20px] flex items-center min-w-[200px]" style={{ fontFamily: '"Geist Mono", monospace' }}>
              <BlurHoverText defaultText="25000+ USERS" hoverText="5000+ PORTFOLIOS LAUNCHED" />
            </div>
            <Button variant="outline" className="rounded-full px-5 h-8 text-[13px] font-medium border-black/10 dark:border-border hover:bg-black/5 dark:hover:bg-white/5 bg-transparent text-[#1D1B1A] dark:text-foreground">
              Login
            </Button>
          </div>
        </header>

        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <section className="w-full px-6 pt-12 pb-12 flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[40px] leading-[1.1] tracking-[-0.02em] max-w-[480px] mb-5 text-[#463B34] dark:text-foreground font-semibold"
            >
              <div className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text animate-[shimmer-text_2.5s_ease-in-out_forwards_0.3s]" style={{ backgroundImage: 'linear-gradient(to right, #463B34 0%, #463B34 30%, #5D3560 40%, #E54D2E 50%, #F5A623 60%, #463B34 70%, #463B34 100%)', backgroundSize: '300% auto', backgroundPosition: '100% center' }}>Fastest</span>
              </div> way to build<br />your portfolio site
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-[16px] mb-8 max-w-[400px] leading-relaxed font-semibold text-[#1d1b1ab3] dark:text-foreground/70"
            >
              Skip the busywork with Designfolio —<br />publish in hours, not weeks.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative group inline-block">
                <div className="absolute -inset-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-[6px] opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <Button className="relative bg-[#1D1B1A] dark:bg-foreground text-[#FDFCF8] dark:text-background hover:bg-[#1D1B1A]/90 dark:bg-foreground/90 rounded-full px-6 h-[48px] text-[15px] font-medium shadow-xl flex items-center gap-2 border border-black/10 dark:border-border/10">
                  Get started for Free
                  <div className="bg-[#FDFCF8] text-[#1D1B1A] dark:text-foreground rounded-full p-[3px] ml-1 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </Button>
              </div>
            </motion.div>
          </section>

          {/* Browser Mockup Section */}
          <section className="w-full px-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative rounded-[20px] overflow-hidden shadow-xl border border-[#E2E1DA] dark:border-border bg-[#141414]"
            >
              <div className="relative w-full overflow-hidden" style={{ paddingTop: '65%' }}>
                <video 
                  src="/opthero.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover origin-center" 
                />
              </div>
            </motion.div>
          </section>

          {/* Trusted By Section */}
          <section className="w-full px-6 mb-20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-[14px] text-[#1D1B1A]/60 dark:text-foreground/60 leading-tight whitespace-nowrap text-center md:text-left shrink-0 font-semibold">
              Trusted by folks<br className="hidden md:block" /> working at
            </div>
            <div className="flex-1 w-full overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <motion.div 
                className="flex items-center text-[#1D1B1A]/40 dark:text-foreground/40 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 50, repeat: Infinity }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-x-8 pr-8">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <img 
                        key={num}
                        src={`/companylogo/companienames0${num}.svg`} 
                        alt={`Company logo ${num}`}
                        className="h-[32px] w-auto opacity-50 hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="w-full border-y border-[#EAE9E4] dark:border-border py-8 px-6 bg-[#F4F3E5] dark:bg-card">
            <div className="max-w-[500px] mx-auto">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-[14px] overflow-hidden shrink-0 border border-[#E2E1DA] dark:border-border shadow-sm">
                  <img 
                    src="/testimonial images/ishita.png" 
                    alt="Ishita Chaudhary" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[#1D1B1A] dark:text-foreground text-[16px] font-bold">Ishita Chaudhary</div>
                  <div className="text-[13px] font-medium text-[#1D1B1A]/60 dark:text-foreground/60">Product & Business @ Cisco</div>
                </div>
              </div>
              
              <p className="text-[#1D1B1A]/80 dark:text-foreground/80 font-medium text-[16px]">
                I was procrastinating on building my portfolio for a year, but Designfolio
                completely changed that — it helped me go from Word/Figma case studies to
                a live website in just 20 minutes.
              </p>
            </div>
          </section>

          {/* Steps Section */}
          <section className="w-full px-6 mb-16 mt-[48px]">
            <div className="w-full flex flex-col gap-12">
              {[
                { step: "1/", title: 'Choose a "template".', video: "/landingvideo/templateshero.mp4" },
                { step: "2/", title: 'Use AI as a "co-pilot".', video: "/landingvideo/analyzeai.mp4" },
                { step: "3/", title: 'Write a little-"story" about yourself.', video: "/opthero.mp4" },
                { step: "4/", title: 'And other "AI tools".', video: "/opthero.mp4" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <h3 className="text-[18px] font-bold text-[#1D1B1A] dark:text-foreground">
                    {item.step} <ShimmerInView text={item.title} />
                  </h3>
                  <div className="w-full rounded-[12px] overflow-hidden border border-[#E2E1DA] dark:border-border shadow-sm bg-[#141414]">
                    <div className="relative w-full overflow-hidden" style={{ paddingTop: '65%' }}>
                      <video 
                        src={item.video} 
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover origin-center" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About Maker Section */}
          <section className="w-full border-t border-[#EAE9E4] dark:border-border pt-16 pb-12 px-6">
            <div className="max-w-[500px] mx-auto">
              <h2 className="text-[24px] font-bold text-[#1D1B1A] dark:text-foreground mb-6 tracking-tight">
                I'm Shai. Maker of Designfolio.
              </h2>
              
              <div className="flex flex-col gap-6 text-[15px] leading-[1.6] text-[#1D1B1A]/80 dark:text-foreground/80 font-medium">
                <p>
                  I had nearly 10 years as a Product Designer, had worked on AI products, and had unicorn startups on my resume.
                </p>
                <p>
                  But when I started looking for the role I truly wanted, I realized something surprising — it was much harder than I expected.
                </p>
                <p>
                  So I went back to the basics. I spent days studying portfolios from designers at companies like Meta and Google, trying to understand how they structured their case studies and told compelling product stories.
                </p>
                <p>
                  Eventually, I rebuilt my own portfolio from scratch. And while doing it, one thought kept coming back to me — why is this process so hard for everyone?
                </p>
                <p>
                  That question is what led me to build Designfolio — a tool with the templates and frameworks that helped me tell my story better.
                </p>
                <p>
                  And it worked. I received offers from PhonePe, Freshworks, and Zeta, and now I'm joining ServiceNow as a Staff Product Designer.
                </p>
                <p>
                  Sometimes the best products come from solving your own problem.
                </p>
              </div>

              <div className="mt-8 mb-6">
                <div className="font-['Caveat'] text-[32px] text-[#1D1B1A] dark:text-foreground mb-2 leading-none">
                  Shai
                </div>
                <div className="text-[14px] font-medium text-[#1D1B1A]/70 dark:text-foreground/70">
                  Say hi - shai@designfolio.me
                </div>
              </div>

              <div className="relative group inline-block mt-4 mb-6">
                <div className="absolute -inset-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-[6px] opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <Button className="relative bg-[#1D1B1A] dark:bg-foreground text-[#FDFCF8] dark:text-background hover:bg-[#1D1B1A]/90 dark:bg-foreground/90 rounded-full px-6 h-[44px] text-[15px] font-medium shadow-xl flex items-center gap-2 border border-black/10 dark:border-border/10">
                  Get started for Free
                  <div className="bg-[#FDFCF8] text-[#1D1B1A] dark:text-foreground rounded-full p-[3px] ml-1 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full border-t border-[#EAE9E4] dark:border-border">
            <div className="px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-medium text-[#1D1B1A]/50 dark:text-foreground/50 bg-[#F4F3E5] dark:bg-card">
              <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Pricing</a>
              <a href="#" className="hover:text-[#1D1B1A] dark:text-foreground transition-colors">Contact / Support</a>
            </div>
            <div className="border-t border-[#EAE9E4] dark:border-border px-6 py-4 text-center text-[12px] font-medium text-[#1D1B1A]/40 dark:text-foreground/40 bg-[#F4F3E5] dark:bg-card">
              © 2025 Designfolio Labs LLP. All rights reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
