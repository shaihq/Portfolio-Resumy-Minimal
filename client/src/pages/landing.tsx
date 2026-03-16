import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { FaAmazon, FaMicrosoft } from "react-icons/fa";
import mockupImg from "@assets/image_1773592620611.png";

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
                <div className="w-9 h-[22px] bg-[#EAE9E4] rounded-full relative shadow-inner border border-black/5 cursor-pointer">
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
              25000+ USERS
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
              Fastest way to build<br />your portfolio site
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
              className="relative rounded-[20px] overflow-hidden shadow-xl border border-black/5 bg-[#141414]"
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
            <div className="text-[14px] text-[#1D1B1A]/60 font-medium leading-tight whitespace-nowrap text-center md:text-left shrink-0">
              Trusted by folks<br className="hidden md:block" /> working at
            </div>
            <div className="flex-1 w-full overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <motion.div 
                className="flex items-center text-[#1D1B1A]/40 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-x-12 pr-12">
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
          <section className="w-full bg-[#F5F4EC] border-y border-[#EAE9E4] py-12 px-6">
            <div className="max-w-[500px] mx-auto">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-black/5 shadow-sm">
                  <img 
                    src="https://i.pravatar.cc/150?u=ishita" 
                    alt="Ishita Chaudhary" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-[#1D1B1A] text-[14px]">Ishita Chaudhary</div>
                  <div className="text-[13px] font-medium text-[#1D1B1A]/60">Product & Business @ Cisco</div>
                </div>
              </div>
              
              <p className="text-[17px] leading-[1.6] text-[#1D1B1A]/80 font-medium">
                I was procrastinating on building my portfolio for a year, but Designfolio
                completely changed that — it helped me go from Word/Figma case studies to
                a live website in just 20 minutes.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
