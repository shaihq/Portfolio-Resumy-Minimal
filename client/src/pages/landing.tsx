import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { FaAmazon, FaMicrosoft } from "react-icons/fa";
import mockupImg from "@assets/image_1773592620611.png";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

function ScrambleHoverText({ defaultText, hoverText }: { defaultText: string, hoverText: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(defaultText);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const targetText = isHovered ? hoverText : defaultText;
    
    let iteration = 0;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
      setDisplayText(prev => {
        return targetText.split("").map((char, index) => {
          if (index < iteration) return targetText[index];
          if (char === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("");
      });
      
      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, defaultText, hoverText]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-default transition-colors duration-300 inline-block min-w-[220px]"
    >
      {displayText}
    </span>
  );
}

export default function Landing() {
  useEffect(() => {
    // Force background color on html, body, and root for Mac/iOS overscroll
    document.documentElement.style.setProperty('background-color', '#FFFEF2', 'important');
    document.body.style.setProperty('background-color', '#FFFEF2', 'important');
    const root = document.getElementById('root');
    if (root) root.style.setProperty('background-color', '#FFFEF2', 'important');
    
    // Also remove the dark class to ensure no dark mode styles bleed through
    const wasDark = document.documentElement.classList.contains('dark');
    if (wasDark) document.documentElement.classList.remove('dark');
    
    // Also update theme-color meta tag for mobile/Safari
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    let originalThemeColor = '';
    if (metaThemeColor) {
      originalThemeColor = metaThemeColor.getAttribute('content') || '';
      metaThemeColor.setAttribute('content', '#FFFEF2');
    } else {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      metaThemeColor.setAttribute('content', '#FFFEF2');
      document.head.appendChild(metaThemeColor);
    }
    
    return () => {
      // Reset when unmounting
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
      if (root) root.style.removeProperty('background-color');
      if (wasDark) document.documentElement.classList.add('dark');
      
      if (metaThemeColor) {
        if (originalThemeColor) {
          metaThemeColor.setAttribute('content', originalThemeColor);
        } else {
          metaThemeColor.remove();
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFEF2] text-[#1D1B1A] antialiased overflow-x-clip flex justify-center" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="w-full max-w-[640px] bg-[#FFFEF2] min-h-screen border-x border-[#EAE9E4] relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        
        {/* Left Floating Nav */}
        <div className="hidden lg:block absolute right-full top-0 bottom-0 z-40">
          <div className="sticky top-[120px] flex flex-col items-start pr-12 w-max">
            
            {/* Logo that gets revealed */}
            <div className="absolute top-0 left-0 w-9 h-9 z-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full rounded-full bg-[#E54D2E] flex items-center justify-center text-white shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" strokeLinecap="round"/>
                </svg>
              </motion.div>
            </div>
            
            {/* Sliding Container */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: 52 }}
              transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative z-10 bg-[#FFFEF2] w-full"
            >
              <div className="font-bold text-[15px] tracking-tight text-[#1D1B1A] flex items-center h-9 pr-4 bg-[#FFFEF2]">
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
              
              <div className="flex items-center gap-2 mt-4 mb-4 text-[#1D1B1A]/40 bg-[#FFFEF2]">
                <Sun className="w-4 h-4 text-[#1D1B1A]" />
                <div className="w-9 h-[22px] bg-[#EAE9E4] rounded-full relative shadow-inner border border-[#E2E1DA] cursor-pointer">
                  <div className="absolute left-[3px] top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
                <Moon className="w-4 h-4" />
              </div>
              
              <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-[#1D1B1A]/50 pb-4 bg-[#FFFEF2]">
                <a href="#" className="text-[#E54D2E] font-semibold transition-colors">Overview</a>
                <a href="#" className="hover:text-[#1D1B1A] transition-colors">Stories</a>
                <a href="#" className="hover:text-[#1D1B1A] transition-colors">How?</a>
                <a href="#" className="hover:text-[#1D1B1A] transition-colors">Why?</a>
              </nav>
            </motion.div>
          </div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-[#FFFEF2]/95 backdrop-blur before:absolute before:content-[''] before:inset-x-[-100vw] before:bottom-0 before:h-px before:bg-[#EAE9E4]">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="text-[13px] font-semibold tracking-wide text-[#1D1B1A]/70 uppercase" style={{ fontFamily: '"Geist Mono", monospace' }}>
              <ScrambleHoverText defaultText="25000+ USERS" hoverText="5000+ PORTFOLIOS LAUNCHED" />
            </div>
            <Button variant="outline" className="rounded-full px-5 h-8 text-[13px] font-medium border-black/10 hover:bg-black/5 bg-transparent text-[#1D1B1A]">
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
              className="text-[40px] leading-[1.1] tracking-[-0.02em] max-w-[480px] mb-5 text-[#463B34] font-semibold"
            >
              <div className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text animate-[shimmer-text_2.5s_ease-in-out_forwards_0.3s]" style={{ backgroundImage: 'linear-gradient(to right, #463B34 0%, #463B34 30%, #5D3560 40%, #E54D2E 50%, #F5A623 60%, #463B34 70%, #463B34 100%)', backgroundSize: '300% auto', backgroundPosition: '100% center' }}>Fastest</span>
              </div> way to build<br />your portfolio site
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-[16px] mb-8 max-w-[400px] leading-relaxed font-semibold text-[#1d1b1ab3]"
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
                <Button className="relative bg-[#1D1B1A] text-[#FDFCF8] hover:bg-[#1D1B1A]/90 rounded-full px-6 h-[48px] text-[15px] font-medium shadow-xl flex items-center gap-2 border border-black/10">
                  Get started for Free
                  <div className="bg-[#FDFCF8] text-[#1D1B1A] rounded-full p-[3px] ml-1 flex items-center justify-center">
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
              className="relative rounded-[20px] overflow-hidden shadow-xl border border-[#E2E1DA] bg-[#141414]"
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
            <div className="text-[14px] text-[#1D1B1A]/60 leading-tight whitespace-nowrap text-center md:text-left shrink-0 font-semibold">
              Trusted by folks<br className="hidden md:block" /> working at
            </div>
            <div className="flex-1 w-full overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <motion.div 
                className="flex items-center text-[#1D1B1A]/40 w-max"
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
          <section className="w-full border-y border-[#EAE9E4] py-8 px-6 bg-[#F4F3E5]">
            <div className="max-w-[500px] mx-auto">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-[14px] overflow-hidden shrink-0 border border-[#E2E1DA] shadow-sm">
                  <img 
                    src="/testimonial images/ishita.png" 
                    alt="Ishita Chaudhary" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[#1D1B1A] text-[16px] font-bold">Ishita Chaudhary</div>
                  <div className="text-[13px] font-medium text-[#1D1B1A]/60">Product & Business @ Cisco</div>
                </div>
              </div>
              
              <p className="text-[#1D1B1A]/80 font-medium text-[16px]">
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
                { step: "1/", title: "Choose a template.", img: "/tools/image 4.png" },
                { step: "2/", title: "Use AI as a co-pilot", img: "/tools/image 5.png" },
                { step: "3/", title: "Write a little-story about yourself.", img: "/tools/image 6.png" },
                { step: "4/", title: "And other AI tools", img: "/tools/image 7.png" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <h3 className="text-[18px] font-bold text-[#1D1B1A]">
                    {item.step} {item.title}
                  </h3>
                  <div className="w-full rounded-[12px] overflow-hidden border border-[#E2E1DA] shadow-sm bg-[#141414]">
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
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About Maker Section */}
          <section className="w-full border-t border-[#EAE9E4] pt-16 pb-12 px-6">
            <div className="max-w-[500px] mx-auto">
              <h2 className="text-[24px] font-bold text-[#1D1B1A] mb-6 tracking-tight">
                I'm Shai. Maker of Designfolio.
              </h2>
              
              <div className="flex flex-col gap-6 text-[15px] leading-[1.6] text-[#1D1B1A]/80 font-medium">
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
                <div className="font-['Caveat'] text-[32px] text-[#1D1B1A] mb-2 leading-none">
                  Shai
                </div>
                <div className="text-[14px] font-medium text-[#1D1B1A]/70">
                  Say hi - shai@designfolio.me
                </div>
              </div>

              <div className="relative group inline-block mt-4 mb-6">
                <div className="absolute -inset-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-[6px] opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <Button className="relative bg-[#1D1B1A] text-[#FDFCF8] hover:bg-[#1D1B1A]/90 rounded-full px-6 h-[44px] text-[15px] font-medium shadow-xl flex items-center gap-2 border border-black/10">
                  Get started for Free
                  <div className="bg-[#FDFCF8] text-[#1D1B1A] rounded-full p-[3px] ml-1 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full border-t border-[#EAE9E4]">
            <div className="px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-medium text-[#1D1B1A]/50 bg-[#F4F3E5]">
              <a href="#" className="hover:text-[#1D1B1A] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1D1B1A] transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-[#1D1B1A] transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-[#1D1B1A] transition-colors">Pricing</a>
              <a href="#" className="hover:text-[#1D1B1A] transition-colors">Contact / Support</a>
            </div>
            <div className="border-t border-[#EAE9E4] px-6 py-4 text-center text-[12px] font-medium text-[#1D1B1A]/40 bg-[#F4F3E5]">
              © 2025 Designfolio Labs LLP. All rights reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
