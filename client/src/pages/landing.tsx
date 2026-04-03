import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { FaAmazon, FaMicrosoft } from "react-icons/fa";
import mockupImg from "@assets/image_1773592620611.png";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
          backgroundImage: 'linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 30%, #5D3560 40%, #E54D2E 50%, #F5A623 60%, hsl(var(--foreground)) 70%, hsl(var(--foreground)) 100%)', 
          backgroundSize: '300% auto'
        }}
      >
        {parts[1]}
      </motion.span>
      {parts[2]}
    </>
  );
}

const testimonials = [
  {
    name: "Ishita Chaudhary",
    role: "Product & Business @ Cisco",
    content: "I was procrastinating on building my portfolio for a year, but Designfolio completely changed that — it helped me go from Word/Figma case studies to a live website in just 20 minutes.",
    image: "/testimonial images/ishita.png"
  },
  {
    name: "Alex Rivera",
    role: "UX Designer @ Microsoft",
    content: "The templates are exactly what hiring managers are looking for. I didn't have to guess what to include. Landed three interviews within a week of publishing.",
    image: "/testimonial images/mock2.jpg"
  },
  {
    name: "Sarah Chen",
    role: "Senior Product Designer",
    content: "Finally, a tool that understands how designers actually think. The AI copilot helped me articulate my design decisions so much better than I could on my own.",
    image: "/testimonial images/mock3.jpg"
  },
  {
    name: "David Kim",
    role: "Product Designer @ Spotify",
    content: "I've tried Framer, Webflow, and Notion. Designfolio is the only one that didn't feel like I was fighting the tool to tell my story. Unbelievably fast.",
    image: "/testimonial images/mock4.jpg"
  }
];

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % testimonials.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col items-center">
      <div className="w-full relative h-[130px] sm:h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col w-full absolute top-0 left-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#E2E1DA] dark:border-border shadow-sm">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-[#1D1B1A] dark:text-foreground text-[14px] font-bold leading-tight">{testimonials[currentIndex].name}</div>
                <div className="text-[12px] font-medium text-[#1D1B1A]/50 dark:text-foreground/50 leading-tight">{testimonials[currentIndex].role}</div>
              </div>
            </div>
            
            <p className="text-[#1D1B1A]/80 dark:text-foreground/80 font-medium text-[15px] leading-[1.5]">
              {testimonials[currentIndex].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-[60px] h-[3px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-6">
        <motion.div 
          className="h-full bg-black/20 dark:bg-white/20 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>
    </div>
  );
}

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNavCTA, setShowNavCTA] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the currently intersecting entry
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSection(intersectingEntry.target.id);
        } else {
          // If none are intersecting (e.g. scrolling up past 'stories' before 'overview' triggers),
          // check if we are at the top of the page
          if (window.scrollY < 100) {
            setActiveSection('overview');
          }
        }
      },
      { 
        // Adjust the root margin to trigger earlier when scrolling up
        rootMargin: '-10% 0px -70% 0px' 
      }
    );

    const sections = ['overview', 'stories', 'how', 'why'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Also listen to scroll events specifically for the top of the page
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('overview');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleNavCTAScroll = () => {
      if (!videoSectionRef.current) return;
      const videoRect = videoSectionRef.current.getBoundingClientRect();
      const videoTop = videoRect.top + window.scrollY;
      const halfwayPoint = videoTop + videoRect.height * 0.5;

      const whySection = document.getElementById('why');
      const whyTop = whySection ? whySection.getBoundingClientRect().top + window.scrollY : Infinity;

      setShowNavCTA(window.scrollY > halfwayPoint && window.scrollY < whyTop);
    };
    window.addEventListener('scroll', handleNavCTAScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleNavCTAScroll);
  }, []);

  const playHeartbeat = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime

      const osc1 = audioContext.createOscillator()
      const gain1 = audioContext.createGain()
      osc1.connect(gain1)
      gain1.connect(audioContext.destination)
      osc1.frequency.setValueAtTime(150, now)
      gain1.gain.setValueAtTime(0.3, now)
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc1.start(now)
      osc1.stop(now + 0.1)

      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      osc2.connect(gain2)
      gain2.connect(audioContext.destination)
      osc2.frequency.setValueAtTime(180, now + 0.12)
      gain2.gain.setValueAtTime(0.2, now + 0.12)
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc2.start(now + 0.12)
      osc2.stop(now + 0.22)
    } catch (e) {
    }
  }, [])

  const handleCheckedChange = async (checked: boolean) => {
    playHeartbeat();

    if (!document.startViewTransition) {
      setTheme(checked ? "dark" : "light");
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(checked ? "dark" : "light");
      });
    }).ready;

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const maxDistance = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${centerX}px ${centerY}px)`,
            `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }
  };

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

  const scrollToSection = (id: string, block: ScrollLogicalPosition = 'start') => {
    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block });
    }
  };

  return (
    <div id="overview" className="min-h-screen bg-[#FFFEF2] dark:bg-background text-[#1D1B1A] dark:text-foreground antialiased overflow-x-clip flex justify-center" style={{ fontFamily: '"Manrope", sans-serif' }}>
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
                <svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <g filter="url(#filter0_i_445_296)">
                    <rect width="124.5" height="124.5" rx="62.25" fill="url(#paint0_linear_445_296)"/>
                    <path d="M67.437 15.5625H57.062V49.7263L32.9046 25.5688L25.5683 32.9051L49.7258 57.0625H15.562V67.4375H49.7258L25.5684 91.5949L32.9046 98.9311L57.062 74.7737V108.937H67.437V74.7737L91.5944 98.9312L98.9307 91.5949L74.7732 67.4375H108.937V57.0625H74.7732L98.9307 32.9051L91.5944 25.5688L67.437 49.7263V15.5625Z" fill="white"/>
                  </g>
                  <defs>
                    <filter id="filter0_i_445_296" x="0" y="0" width="124.5" height="124.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset/>
                      <feGaussianBlur stdDeviation="6.72973"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.333333 0 0 0 0 0.243137 0 0 0 1 0"/>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_445_296"/>
                    </filter>
                    <linearGradient id="paint0_linear_445_296" x1="62.25" y1="0" x2="62.25" y2="124.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFDCD7"/>
                      <stop offset="0.788462" stopColor="#FF553E"/>
                    </linearGradient>
                  </defs>
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
              
              <div ref={containerRef} className="group inline-flex items-center gap-2 mt-4 mb-4">
                <span
                  className={cn(
                    "cursor-pointer text-left text-sm font-medium transition-colors",
                    isDark ? "text-[#7A736C] dark:text-[#9E9893]" : "text-[#1A1A1A] dark:text-[#F0EDE7]",
                  )}
                  onClick={() => handleCheckedChange(false)}
                >
                  <Sun className="size-4" aria-hidden="true" />
                </span>

                <Switch
                  checked={isDark}
                  onCheckedChange={handleCheckedChange}
                  aria-label="Toggle between dark and light mode"
                />

                <span
                  className={cn(
                    "cursor-pointer text-right text-sm font-medium transition-colors",
                    !isDark ? "text-[#7A736C] dark:text-[#9E9893]" : "text-[#1A1A1A] dark:text-[#F0EDE7]",
                  )}
                  onClick={() => handleCheckedChange(true)}
                >
                  <Moon className="size-4" aria-hidden="true" />
                </span>
              </div>
              
              <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-[#1D1B1A]/50 dark:text-foreground/50 pb-4 bg-[#FFFEF2] dark:bg-background">
                <a href="#overview" onClick={(e) => { e.preventDefault(); scrollToSection('overview'); }} className={cn("transition-colors", activeSection === 'overview' ? "text-[#E54D2E] font-semibold" : "hover:text-[#1D1B1A] dark:hover:text-foreground")}>Overview</a>
                <a href="#stories" onClick={(e) => { e.preventDefault(); scrollToSection('stories', 'center'); }} className={cn("transition-colors", activeSection === 'stories' ? "text-[#E54D2E] font-semibold" : "hover:text-[#1D1B1A] dark:hover:text-foreground")}>Stories</a>
                <a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection('how', 'start'); }} className={cn("transition-colors", activeSection === 'how' ? "text-[#E54D2E] font-semibold" : "hover:text-[#1D1B1A] dark:hover:text-foreground")}>How?</a>
                <a href="#why" onClick={(e) => { e.preventDefault(); scrollToSection('why', 'start'); }} className={cn("transition-colors", activeSection === 'why' ? "text-[#E54D2E] font-semibold" : "hover:text-[#1D1B1A] dark:hover:text-foreground")}>Why?</a>
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
            <div className="flex items-center">
              <Button variant="outline" className="rounded-full px-5 h-8 text-[13px] font-medium border-black/10 dark:border-border hover:bg-black/5 dark:hover:bg-white/5 bg-transparent text-[#1D1B1A] dark:text-foreground">
                Login
              </Button>
              <AnimatePresence>
                {showNavCTA && (
                  <motion.div
                    key="nav-cta"
                    initial={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, maxWidth: 180, marginLeft: 8 }}
                    exit={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden flex-shrink-0 flex"
                  >
                    <div className="group inline-flex cursor-pointer items-center gap-0 rounded-full">
                      <span className="rounded-full bg-[#1D1B1A] dark:bg-white px-4 py-[6px] text-[13px] font-medium text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white whitespace-nowrap">
                        Get Started
                      </span>
                      <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full bg-[#1D1B1A] dark:bg-white text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white">
                        <ArrowUpRight className="absolute top-1/2 left-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-6 group-hover:-translate-y-6" strokeWidth={2.5} />
                        <ArrowUpRight className="absolute top-1/2 left-1/2 h-[14px] w-[14px] -translate-x-7 translate-y-7 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2 group-hover:-translate-y-1/2" strokeWidth={2.5} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <section className="w-full px-6 pt-12 pb-12 flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[40px] leading-[1.1] tracking-[-0.02em] max-w-[480px] mb-5 text-[#463B34] dark:text-foreground"
              style={{ fontWeight: 650 }}
            >
              <div className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text animate-[shimmer-text_2.5s_ease-in-out_forwards_0.3s]" style={{ backgroundImage: 'linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 30%, #5D3560 40%, #E54D2E 50%, #F5A623 60%, hsl(var(--foreground)) 70%, hsl(var(--foreground)) 100%)', backgroundSize: '300% auto', backgroundPosition: '100% center' }}>Fastest</span>
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
              <div className="group inline-flex cursor-pointer items-center gap-0 rounded-full">
                <span className="rounded-full bg-[#1D1B1A] dark:bg-white px-6 py-[13px] text-[15px] font-medium text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white">
                  Get started for Free
                </span>
                <div className="relative h-[46px] w-[46px] flex-shrink-0 overflow-hidden rounded-full bg-[#1D1B1A] dark:bg-white text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white">
                  <ArrowUpRight className="absolute top-1/2 left-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-8 group-hover:-translate-y-8" strokeWidth={2.5} />
                  <ArrowUpRight className="absolute top-1/2 left-1/2 h-[18px] w-[18px] -translate-x-10 translate-y-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2 group-hover:-translate-y-1/2" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Browser Mockup Section */}
          <section ref={videoSectionRef} className="w-full px-6 mb-16">
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
          <section id="stories" className="w-full border-y border-[#EAE9E4] dark:border-border py-8 px-6 bg-[#F4F3E5] dark:bg-card overflow-hidden scroll-mt-[30vh]">
            <TestimonialCarousel />
          </section>

          {/* Steps Section */}
          <section id="how" className="w-full px-6 mb-16 mt-[48px] scroll-mt-24">
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
          <section id="why" className="w-full border-t border-[#EAE9E4] dark:border-border pt-16 pb-12 px-6 scroll-mt-24">
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

              <div className="group inline-flex cursor-pointer items-center gap-0 rounded-full mt-4 mb-6">
                <span className="rounded-full bg-[#1D1B1A] dark:bg-white px-6 py-[13px] text-[15px] font-medium text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white">
                  Get started for Free
                </span>
                <div className="relative h-[46px] w-[46px] flex-shrink-0 overflow-hidden rounded-full bg-[#1D1B1A] dark:bg-white text-[#FDFCF8] dark:text-[#1D1B1A] transition-colors duration-500 ease-in-out group-hover:bg-[#FF553E] dark:group-hover:bg-[#FF553E] group-hover:text-white dark:group-hover:text-white">
                  <ArrowUpRight className="absolute top-1/2 left-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-8 group-hover:-translate-y-8" strokeWidth={2.5} />
                  <ArrowUpRight className="absolute top-1/2 left-1/2 h-[18px] w-[18px] -translate-x-10 translate-y-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2 group-hover:-translate-y-1/2" strokeWidth={2.5} />
                </div>
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
