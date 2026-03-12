import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { Switch } from "@/components/ui/switch-button";
import Navbar from "@/components/navbar";
import { useRef, useState, useEffect, useCallback } from "react";
import { Download, Dribbble, Mail, ChevronDown, Copy, Phone, Linkedin, Twitter, Globe, FileText, ArrowUpRight, Github, Play, Square, Sun, Moon, Move, Pencil, Plus, Trash2, Search, X, Check } from "lucide-react";
import { AtSignIcon, AtSignIconHandle, DownloadIcon, DownloadIconHandle, DribbbleIcon, DribbbleIconHandle, TwitterIcon, TwitterIconHandle } from "lucide-animated";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useTemplate } from "@/hooks/use-template";
import { Cursor, CursorFollow, CursorProvider } from "@/components/ui/cursor";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import profileImg from "@assets/image_1772896095217.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";
import recommender1 from "/images/recommender-1.jpg";
import story1 from "@/assets/images/story-1.jpg";
import story2 from "@/assets/images/story-2.jpg";
import story3 from "@/assets/images/story-3.jpg";
import story4 from "@/assets/images/story-4.jpg";

export default function Home() {
  const [, navigate] = useLocation();
  const atSignRef = useRef<AtSignIconHandle>(null);
  const downloadRef = useRef<DownloadIconHandle>(null);
  const dribbbleRef = useRef<DribbbleIconHandle>(null);
  const twitterRef = useRef<TwitterIconHandle>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [playingTestimonial, setPlayingTestimonial] = useState<number | null>(null);
  const careerLadderRef = useRef<HTMLDivElement>(null);
  const ladderContainerRef = useRef<HTMLDivElement>(null);
  const pegboardRef = useRef<HTMLDivElement>(null);
  const [zIndexes, setZIndexes] = useState({ 1: 10, 2: 20, 3: 10 });
  const [characterPosition, setCharacterPosition] = useState(0);
  const [isEditing, setIsEditing] = useState(true);
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [isStackPanelOpen, setIsStackPanelOpen] = useState(false);
  const [isRecommendationsPanelOpen, setIsRecommendationsPanelOpen] = useState(false);
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [toolSearchQuery, setToolSearchQuery] = useState("");

  const [activeTools, setActiveTools] = useState([
    { name: "Figma", icon: "/tools/image 4.png" },
    { name: "Notion", icon: "/tools/image 5.png" },
    { name: "Raycast", icon: "/tools/image 6.png" },
    { name: "Framer", icon: "/tools/image 7.png" },
    { name: "Linear", icon: "/tools/image 8.png" },
    { name: "Slack", icon: "/tools/image 9.png" },
    { name: "Arc", icon: "/tools/image 10.png" },
  ]);

  const allTools = [
    { name: "Figma", icon: "/tools/image 4.png" },
    { name: "Notion", icon: "/tools/image 5.png" },
    { name: "Raycast", icon: "/tools/image 6.png" },
    { name: "Framer", icon: "/tools/image 7.png" },
    { name: "Linear", icon: "/tools/image 8.png" },
    { name: "Slack", icon: "/tools/image 9.png" },
    { name: "Arc", icon: "/tools/image 10.png" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Tailwind", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Vercel", icon: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "GitLab", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
    { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  ];

  const handleAddTool = (tool: { name: string, icon: string }) => {
    if (!activeTools.find(t => t.name === tool.name)) {
      setActiveTools([...activeTools, tool]);
    }
  };

  const handleRemoveTool = (toolToRemove: { name: string, icon: string }) => {
    setActiveTools(activeTools.filter(t => t.name !== toolToRemove.name));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingResume(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingResume(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingResume(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (isContactPanelOpen || isStackPanelOpen || isRecommendationsPanelOpen) {
        root.classList.add('theme-panel-open');
      } else {
        root.classList.remove('theme-panel-open');
      }
    }
    return () => {
      if (root) root.classList.remove('theme-panel-open');
    };
  }, [isContactPanelOpen, isStackPanelOpen, isRecommendationsPanelOpen]);

  useEffect(() => {
    if (isContactPanelOpen) {
      window.dispatchEvent(new CustomEvent('panelOpened', { detail: 'contact' }));
    }
    if (isStackPanelOpen) {
      window.dispatchEvent(new CustomEvent('panelOpened', { detail: 'stack' }));
    }
    if (isRecommendationsPanelOpen) {
      window.dispatchEvent(new CustomEvent('panelOpened', { detail: 'recommendations' }));
    }
  }, [isContactPanelOpen, isStackPanelOpen, isRecommendationsPanelOpen]);

  useEffect(() => {
    const handlePanelOpened = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== 'contact') {
        setIsContactPanelOpen(false);
      }
      if (customEvent.detail !== 'stack') {
        setIsStackPanelOpen(false);
      }
      if (customEvent.detail !== 'recommendations') {
        setIsRecommendationsPanelOpen(false);
      }
    };
    window.addEventListener('panelOpened', handlePanelOpened);
    return () => window.removeEventListener('panelOpened', handlePanelOpened);
  }, []);

  const bringToFront = (id: number) => {
    setZIndexes(prev => {
      const maxZ = Math.max(...Object.values(prev));
      return { ...prev, [id]: maxZ + 1 };
    });
  };

  const playPegboardClick = (type: 'grab' | 'drop') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      if (type === 'grab') {
        // Quick peek sound when grabbing
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        
        osc.start(now);
        osc.stop(now + 0.03);
      } else {
        // Quick pop sound when dropping
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio context not available or blocked
    }
  };

  useEffect(() => {
    const handleEnd = () => setPlayingTestimonial(null);
    window.speechSynthesis.addEventListener('voiceschanged', () => {}); // Just to initialize
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    let rafId: number;
    
    const updatePosition = () => {
      if (!careerLadderRef.current || !ladderContainerRef.current) return;
      
      const sectionRect = careerLadderRef.current.getBoundingClientRect();
      const containerHeight = ladderContainerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // When does the section start entering the viewport?
      // When sectionRect.bottom reaches viewportHeight (bottom of viewport)
      // Progress: 0 = section entering from bottom, 1 = section exiting from top
      
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      
      let progress = 0;
      
      // Calculate when the section is in viewport
      // We want progress to be 0 when the section top reaches the middle of the screen
      // and 1 when the section bottom reaches the middle of the screen
      
      const middleOfScreen = viewportHeight / 2;
      
      // Calculate how far the top of the section is from the middle of the screen
      // Positive when below middle, negative when above middle
      const distanceFromMiddle = sectionTop - middleOfScreen;
      
      // We start when top reaches middle (distance = 0)
      // We end when bottom reaches middle (distance = -sectionHeight)
      
      // Map the distance to a 0-1 progress value
      // 0 = sectionTop is at middleOfScreen
      // 1 = sectionTop is at middleOfScreen - sectionHeight (so section bottom is at middle)
      if (distanceFromMiddle > 0) {
        progress = 0; // Section is below the middle
      } else if (distanceFromMiddle < -sectionHeight) {
        progress = 1; // Section is above the middle
      } else {
        // Section is passing through the middle
        progress = Math.abs(distanceFromMiddle) / sectionHeight;
      }
      progress = Math.max(0, Math.min(1, progress));
      
      // Get the max available height for character movement
      const maxPosition = containerHeight - 54; // 54px is character height
      
      // Apply progress to move character across full ladder height
      const newPosition = progress * maxPosition;
      
      setCharacterPosition(newPosition);
    };
    
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };
    
    updatePosition();
    const timeoutId = setTimeout(updatePosition, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handlePlayTestimonial = (text: string, id: number) => {
    if (playingTestimonial === id) {
      window.speechSynthesis.cancel();
      setPlayingTestimonial(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setPlayingTestimonial(null);
      window.speechSynthesis.speak(utterance);
      setPlayingTestimonial(id);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Dino Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  
  const dinoYRef = useRef(0);
  const velocityRef = useRef(0);
  const obstaclesRef = useRef<{ id: number; x: number }[]>([]);
  const scoreRef = useRef(0);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const gameRef = useRef<HTMLDivElement>(null);

  const jump = useCallback(() => {
    if (isGameOver) {
      setIsPlaying(true);
      setIsGameOver(false);
      scoreRef.current = 0;
      obstaclesRef.current = [];
      dinoYRef.current = 0;
      velocityRef.current = 0;
      setScore(0);
      setObstacles([]);
      setDinoY(0);
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
      scoreRef.current = 0;
      obstaclesRef.current = [];
      dinoYRef.current = 0;
      velocityRef.current = 0;
      setScore(0);
      setObstacles([]);
      setDinoY(0);
      return;
    }
    if (dinoYRef.current === 0) {
      velocityRef.current = 11; // Jump strength
      dinoYRef.current = 0.1; // trigger jump
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const update = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = Math.min(time - lastTimeRef.current, 32); 
        
        scoreRef.current += 1;
        
        // Physics update
        if (dinoYRef.current > 0 || velocityRef.current !== 0) {
          dinoYRef.current += velocityRef.current * (deltaTime / 16);
          velocityRef.current -= 0.6 * (deltaTime / 16); // Gravity
          
          if (dinoYRef.current <= 0) {
            dinoYRef.current = 0;
            velocityRef.current = 0;
          }
        }

        // Obstacles update
        let newObstacles = obstaclesRef.current
          .map(obs => ({ ...obs, x: obs.x - 5.5 * (deltaTime / 16) })) // speed
          .filter(obs => obs.x > -50);

        const lastObsX = newObstacles.length > 0 ? newObstacles[newObstacles.length - 1].x : 0;
        if (newObstacles.length === 0 || (lastObsX < 400 && Math.random() < 0.02)) {
          newObstacles.push({ id: Date.now(), x: 700 });
        }
        
        obstaclesRef.current = newObstacles;

        // Collision check
        const dinoLeft = 52; // roughly left-12 (48) + some padding
        const dinoRight = 80;
        const dinoBottom = dinoYRef.current;
        
        let hit = false;
        for (const obs of newObstacles) {
          const obsLeft = obs.x + 4;
          const obsRight = obs.x + 20;
          const obsTop = 28; // height of cactus

          if (
            dinoRight > obsLeft && 
            dinoLeft < obsRight && 
            dinoBottom < obsTop
          ) {
            hit = true;
            break;
          }
        }

        if (hit) {
          setIsGameOver(true);
          setIsPlaying(false);
          setHighScore(current => Math.max(current, Math.floor(scoreRef.current / 10)));
        } else {
          // Sync state for rendering
          setScore(scoreRef.current);
          setDinoY(dinoYRef.current);
          setObstacles(newObstacles);
        }
      }
      
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
    };
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  const experiences = [
    {
      year: "2025",
      company: "Apple",
      role: "Staff Product Designer",
      description: "Leading design initiatives for core ecosystem products, focusing on seamless cross-device experiences and next-generation interface patterns."
    },
    {
      year: "2024",
      company: "Apple",
      role: "Lead Product Designer",
      description: "Spearheaded the redesign of iCloud services, improving user engagement by 40% through simplified sharing workflows and enhanced visual hierarchy."
    },
    {
      year: "2023",
      company: "Apple",
      role: "Product Designer II",
      description: "Contributed to the development of new accessibility features within iOS, ensuring inclusive design across all system-level components."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(10px)",
      y: 10
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const { activeTemplate } = useTemplate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Projects");
  
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const [isHoveringTestimonial, setIsHoveringTestimonial] = useState(false);

  // Creative template specific states
  const creativeTestimonials = [
    {
      id: 3,
      name: "Sarah Jenkins",
      title: "VP of Product, Stripe",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      text: "Matt is one of the most talented designers I've had the pleasure of working with. His ability to balance aesthetics with complex functionality is truly impressive. He elevated our entire product experience."
    },
    {
      id: 4,
      name: "David Chen",
      title: "Engineering Lead, Vercel",
      image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      text: "We brought Matt on for a critical redesign project. Not only did he deliver beautiful visuals, but his systematic approach to our component library completely transformed how our engineering team builds UI."
    }
  ];

  // Auto carousel effect
  useEffect(() => {
    if (isHoveringTestimonial) return;
    
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % creativeTestimonials.length);
    }, 5000); // 5 seconds per testimonial
    
    return () => clearInterval(timer);
  }, [creativeTestimonials.length, isHoveringTestimonial]);

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  
  // Sync theme state with document class changes
  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    // Initial check
    syncTheme();

    // Listen for changes
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // Removed isEditing state

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A1A1A] dark:selection:bg-[#F0EDE7] selection:text-[#F0EDE7] dark:selection:text-[#1A1A1A] transition-colors duration-700 pt-24"
      >
        <style dangerouslySetInnerHTML={{ __html: `
        .custom-dashed-x {
          position: relative;
        }
        .custom-dashed-x::before, .custom-dashed-x::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background-image: linear-gradient(to bottom, #E5D7C4 50%, transparent 50%);
          background-size: 1px 10px;
          z-index: 0;
          pointer-events: none;
        }
        .dark .custom-dashed-x::before, .dark .custom-dashed-x::after {
          background-image: linear-gradient(to bottom, #3A352E 50%, transparent 50%);
        }
        .custom-dashed-x::before {
          left: 0;
        }
        .custom-dashed-x::after {
          right: 0;
        }
        .custom-dashed-t {
          height: 1px;
          width: 100%;
          background-image: linear-gradient(to right, #E5D7C4 50%, transparent 50%);
          background-size: 10px 1px;
        }
        .dark .custom-dashed-t {
          background-image: linear-gradient(to right, #3A352E 50%, transparent 50%);
        }
        .dino-color {
          fill: #535353;
        }
        .dark .dino-color {
          fill: #B5AFA5;
        }
        .custom-solid-x {
          position: relative;
        }
        .custom-solid-x::before, .custom-solid-x::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background-color: #D5D0C6;
          pointer-events: none;
          z-index: 50;
        }
        .dark .custom-solid-x::before, .dark .custom-solid-x::after {
          background-color: #3A352E;
        }
        .custom-solid-x::before {
          left: 0;
        }
        .custom-solid-x::after {
          right: 0;
        }
      `}} />
      <div className={cn("w-full max-w-[640px] relative min-h-screen flex flex-col font-['Inter'] transition-colors duration-700", 
        activeTemplate === "Minimal" ? "bg-[#F0EDE7] dark:bg-[#1A1A1A] custom-dashed-x" : 
        activeTemplate === "Professional" ? "bg-[#EFECE6] dark:bg-[#1A1A1A] custom-solid-x" : "bg-[#EFECE6] dark:bg-[#1A1A1A]"
      )}>
        
        {activeTemplate === "Minimal" ? (
          <>
            <SmoothCursor type="minimal" />
            {/* Header Section */}
            <motion.div variants={itemVariants} className="px-5 md:px-8 pt-12 md:pt-16 pb-6 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <div className="flex items-start justify-between gap-4 mb-6">
            <Avatar className="w-[80px] h-[80px] rounded-2xl">
              <AvatarImage src={profileImg} className="object-cover" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-1">
              <AnimatedThemeToggler />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
            <div>
              <h1 className="text-[24px] font-semibold mb-0.5 tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7]">Hey I'm Matt.</h1>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-base" style={{ fontWeight: 450 }}>Product Designer</p>
            </div>
            <a 
              href="#" 
              className="text-[13px] font-medium flex items-center gap-1.5 border-b border-[#1A1A1A] dark:border-[#F0EDE7] pb-0.5 hover:opacity-70 transition-opacity w-fit group/download text-[#1A1A1A] dark:text-[#F0EDE7]"
              onMouseEnter={() => downloadRef.current?.startAnimation()}
              onMouseLeave={() => downloadRef.current?.stopAnimation()}
            >
              Download resume <DownloadIcon ref={downloadRef} size={14} />
            </a>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-4 flex justify-between items-center relative group/section">
          {isEditing && (
            <div className="absolute top-1/2 -translate-y-1/2 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <a 
            href="mailto:matt@gmail.com" 
            className="flex items-center gap-2 text-base text-[#666666] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group"
            onMouseEnter={() => atSignRef.current?.startAnimation()}
            onMouseLeave={() => atSignRef.current?.stopAnimation()}
          >
            <AtSignIcon ref={atSignRef} size={18} className="transition-colors" />
            matt@gmail.com
          </a>
          <div className="flex items-center gap-5 text-[#1A1A1A] dark:text-[#F0EDE7]">
            <a 
              href="#" 
              className="hover:opacity-70 transition-opacity"
              onMouseEnter={() => dribbbleRef.current?.startAnimation()}
              onMouseLeave={() => dribbbleRef.current?.stopAnimation()}
            >
              <DribbbleIcon ref={dribbbleRef} size={16} className="transition-colors" />
            </a>
            <a 
              href="#" 
              className="hover:opacity-70 transition-opacity"
              onMouseEnter={() => twitterRef.current?.startAnimation()}
              onMouseLeave={() => twitterRef.current?.stopAnimation()}
            >
              <TwitterIcon ref={twitterRef} size={16} className="transition-colors" />
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </a>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Intro Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-4">Intro</h2>
          <p className="text-[#7A736C] dark:text-[#B5AFA5] leading-[1.7] text-base" style={{ fontWeight: 450 }}>
            I'm a Design Engineer focused on crafting meaningful digital experiences where design meets code. With a strong front-end development and UX design background, I build scalable UI systems and contribute to user-centered products from concept to deployment.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Experience Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-4">Experience</h2>
          <div className="space-y-1">
            {experiences.map((exp, index) => (
              <div key={index} className="rounded-lg transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] -mx-3 px-3 relative group/item">
                {isEditing && (
                  <div className="absolute top-2.5 right-3 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <button 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex justify-between items-center py-2.5 text-base group"
                >
                  <div className="flex items-center gap-3">
                    <motion.span 
                      animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                      className="text-[#888888] dark:text-[#7A736C] font-light text-lg leading-none mt-[1px] transition-colors group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]"
                    >
                      +
                    </motion.span>
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <span className="text-[#7A736C] dark:text-[#9E9893]">{exp.year} / </span>
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] transition-colors">{exp.role}</span>
                </button>
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pl-7 pr-4">
                        <motion.p
                          variants={{
                            hidden: { opacity: 0 },
                            show: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.015,
                              },
                            },
                          }}
                          initial="hidden"
                          animate="show"
                          className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed break-words whitespace-normal"
                        >
                          {exp.description.split(" ").map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block whitespace-nowrap">
                              {word.split("").map((char, charIndex) => (
                                <motion.span
                                  key={charIndex}
                                  variants={{
                                    hidden: {
                                      opacity: 0,
                                      filter: "blur(10px)",
                                    },
                                    show: {
                                      opacity: 1,
                                      filter: "blur(0px)",
                                    },
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="inline-block"
                                >
                                  {char}
                                </motion.span>
                              ))}
                              {/* Add space after each word except the last one */}
                              {wordIndex < exp.description.split(" ").length - 1 && (
                                <span className="inline-block">&nbsp;</span>
                              )}
                            </span>
                          ))}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Projects Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 pb-16 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-4">Projects</h2>
          
          <CursorProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8">
              {/* Project 1 */}
              <div onClick={() => handleProjectClick("slate")} className="group cursor-pointer flex flex-col p-4 -m-4 rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300 relative">
                {isEditing && (
                  <div className="absolute top-8 right-8 z-10 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white dark:bg-[#2A2520] drop-shadow-sm border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
                  <img src={project1} alt="Slate" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A] dark:text-[#F0EDE7]">Slate</h3>
                <p className="text-base text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed" style={{ fontWeight: 450 }}>
                  A sleek and responsive landing page designed for modern startups to showcase their product.
                </p>
              </div>

              {/* Project 2 */}
              <div onClick={() => handleProjectClick("antimetal")} className="group cursor-pointer flex flex-col p-4 -m-4 rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300 relative">
                {isEditing && (
                  <div className="absolute top-8 right-8 z-10 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white dark:bg-[#2A2520] drop-shadow-sm border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
                  <img src={project2} alt="Antimetal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A] dark:text-[#F0EDE7]">Antimetal</h3>
                <p className="text-base text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed" style={{ fontWeight: 450 }}>
                  A dynamic, animation-focused landing page highlighting creative transitions.
                </p>
              </div>

              {/* Project 3 */}
              <div onClick={() => handleProjectClick("slate")} className="group cursor-pointer flex flex-col p-4 -m-4 rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300 relative">
                {isEditing && (
                  <div className="absolute top-8 right-8 z-10 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white dark:bg-[#2A2520] drop-shadow-sm border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
                  <img src={project3} alt="Financial Dashboard" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A] dark:text-[#F0EDE7]">Slate</h3>
                <p className="text-base text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed" style={{ fontWeight: 450 }}>
                  A sleek and responsive landing page designed for modern startups to showcase their product.
                </p>
              </div>

              {/* Project 4 */}
              <div onClick={() => handleProjectClick("antimetal")} className="group cursor-pointer flex flex-col p-4 -m-4 rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300 relative">
                {isEditing && (
                  <div className="absolute top-8 right-8 z-10 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white dark:bg-[#2A2520] drop-shadow-sm border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
                  <img src={project4} alt="TaskMaster" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A] dark:text-[#F0EDE7]">Antimetal</h3>
                <p className="text-base text-[#7A736C] dark:text-[#B5AFA5] leading-relaxed" style={{ fontWeight: 450 }}>
                  A dynamic, animation-focused landing page highlighting creative transitions.
                </p>
              </div>
            </div>
            <CursorFollow>
              <div className="bg-[#1A1A1A] dark:bg-[#F0EDE7] text-[#F0EDE7] dark:text-[#1A1A1A] px-3 py-1.5 rounded-full text-[13px] font-medium shadow-2xl flex items-center gap-1.5">
                View Project <ArrowUpRight size={14} />
              </div>
            </CursorFollow>
          </CursorProvider>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Recommendations Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Sheet modal={false} open={isRecommendationsPanelOpen} onOpenChange={setIsRecommendationsPanelOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  className="border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-0 flex flex-col"
                  hasOverlay={false}
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center m-0 space-y-0 h-[65px]">
                    <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] font-medium m-0">Add Recommendation</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="rec-name" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Name</Label>
                        <Input id="rec-name" placeholder="e.g. Jane Doe" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rec-role" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Role & Company</Label>
                        <Input id="rec-role" placeholder="e.g. Design Lead at Apple" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rec-content" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Recommendation Text</Label>
                        <textarea 
                          id="rec-content" 
                          rows={4}
                          placeholder="What did they say about you?" 
                          className="w-full bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all p-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30 resize-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Profile Photo</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
                            <Plus className="w-5 h-5 text-[#7A736C] dark:text-[#9E9893]" />
                          </div>
                          <Button variant="outline" size="sm" className="h-8 rounded-full text-[12px] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                            Upload Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t border-black/10 dark:border-white/10 flex justify-end gap-3 flex-shrink-0 bg-white dark:bg-[#2A2520]">
                    <SheetClose asChild>
                      <Button variant="outline" className="h-9 px-4 rounded-full text-[13px] font-medium border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="h-9 px-5 rounded-full text-[13px] font-medium bg-[#1A1A1A] dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 transition-colors shadow-sm">Add Recommendation</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">Recommendations</h2>
          <div className="space-y-6">
            {[
              {
                name: "Jonathan Carter",
                role: "TechStarter CTO",
                content: "Alex's ability to combine creativity with strategic thinking has transformed the way our team approaches challenges. He is good in his domain.",
                image: recommender1
              },
              {
                name: "Michael Johnson",
                role: "TechStarter CTO",
                content: "Alex's ability to combine creativity with strategic thinking has transformed the way our team approaches challenges. He is good in his domain.",
                image: recommender1
              }
            ].map((rec, i) => (
              <div key={i} className="bg-white dark:bg-[#2A2520] rounded-[16px] border border-black/5 dark:border-white/10 drop-shadow-sm overflow-hidden group/card relative">
                {isEditing && (
                  <div className="absolute top-3 right-3 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                      <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <div className="flex justify-between items-center px-6 py-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium text-base text-[#1A1A1A] dark:text-[#F0EDE7] mb-1">{rec.name}</h3>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-black dark:text-[#F0EDE7] transition-colors duration-200 hover:text-[#0077B5] dark:hover:text-[#87CEEB] cursor-pointer" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="text-[13px] text-[#7A736C] dark:text-[#9E9893]">{rec.role}</span>
                    </div>
                  </div>
                  <Avatar className="w-[80px] h-[80px] rounded-none -mr-6 -my-4 transition-all duration-700">
                    <AvatarImage src={rec.image} className="object-cover" />
                    <AvatarFallback>{rec.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="p-0">
                  <div className="border border-dashed border-[#E5D7C4] dark:border-[#3A352E] rounded-[12px] p-4">
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-sm md:text-[15px] leading-relaxed" style={{ fontWeight: 450 }}>
                      {rec.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* My Story Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 pb-16 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
              </Button>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">My Story</h2>
          
          <div className="relative mb-8 h-56 flex items-center justify-center">
            <motion.div 
              initial={{ rotate: -8, x: -120, y: 0 }}
              whileHover={{ rotate: -2, scale: 1.1, zIndex: 50 }}
              className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-white dark:border-[#2A2520] shadow-lg z-0"
            >
              <img src={story1} alt="My workspace" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: 12, x: -40, y: 15 }}
              whileHover={{ rotate: 5, scale: 1.1, zIndex: 50 }}
              className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-white dark:border-[#2A2520] shadow-lg z-10"
            >
              <img src={story2} alt="Designing" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: -5, x: 40, y: -10 }}
              whileHover={{ rotate: 0, scale: 1.1, zIndex: 50 }}
              className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-white dark:border-[#2A2520] shadow-lg z-20"
            >
              <img src={story3} alt="Coffee and notes" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: 8, x: 120, y: 20 }}
              whileHover={{ rotate: 3, scale: 1.1, zIndex: 50 }}
              className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-white dark:border-[#2A2520] shadow-lg z-30"
            >
              <img src={story4} alt="Creative studio" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="space-y-6 text-[#7A736C] dark:text-[#B5AFA5] text-base leading-[1.7]">
            <p>
              I'm David Simmons, a passionate digital designer and no-code developer who bridges creativity with technology. Currently exploring new ways to craft meaningful digital experiences, I'm driven by curiosity and a love for clean, purposeful design.
            </p>
            <p>
              I thrive on transforming ideas into reality — whether it's shaping intuitive interfaces, crafting distinctive brand identities, designing immersive visuals, or building websites that feel effortless to use.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Stack Section */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Sheet modal={false} open={isStackPanelOpen} onOpenChange={setIsStackPanelOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  className="border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-0 flex flex-col"
                  hasOverlay={false}
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center m-0 space-y-0 h-[65px]">
                    <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] font-medium m-0">Edit Stack</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Search Tools</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A736C] dark:text-[#9E9893]" />
                        <Input 
                          placeholder="Search for a tool..." 
                          value={toolSearchQuery}
                          onChange={(e) => setToolSearchQuery(e.target.value)}
                          className="h-10 pl-9 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {allTools
                          .filter(t => t.name.toLowerCase().includes(toolSearchQuery.toLowerCase()))
                          .sort((a, b) => {
                            const isASelected = activeTools.some(t => t.name === a.name);
                            const isBSelected = activeTools.some(t => t.name === b.name);
                            if (isASelected === isBSelected) return a.name.localeCompare(b.name);
                            return isASelected ? -1 : 1;
                          })
                          .map((tool) => {
                            const isSelected = activeTools.some(t => t.name === tool.name);
                            return (
                              <motion.button
                                layout
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                key={`tool-${tool.name}`}
                                onClick={() => isSelected ? handleRemoveTool(tool) : handleAddTool(tool)}
                                className={`group h-[34px] px-3.5 rounded-xl flex items-center gap-2.5 text-[13px] font-medium transition-colors border ${
                                  isSelected 
                                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] border-black/5 dark:border-white/5 text-[#1A1A1A] dark:text-[#F0EDE7] shadow-sm" 
                                    : "bg-transparent border-transparent text-[#7A736C] dark:text-[#9E9893] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
                                }`}
                              >
                                <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                                  <img 
                                    src={tool.icon} 
                                    alt={tool.name} 
                                    className={`absolute inset-0 w-4 h-4 object-contain transition-all duration-200 ${
                                      isSelected ? "grayscale-0 opacity-100" : "grayscale opacity-50 group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-45"
                                    }`} 
                                  />
                                  {!isSelected && (
                                    <Plus className="absolute inset-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-50 group-hover:scale-100 rotate-45 group-hover:rotate-0" />
                                  )}
                                </div>
                                {tool.name}
                              </motion.button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t border-black/10 dark:border-white/10 flex justify-end gap-3 flex-shrink-0 bg-white dark:bg-[#2A2520]">
                    <SheetClose asChild>
                      <Button variant="outline" className="h-9 px-4 rounded-full text-[13px] font-medium border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Close</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">Stack</h2>
          <div className="flex flex-wrap gap-6 items-center">
            {activeTools.map((tool, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="w-8 h-8 flex items-center justify-center cursor-pointer relative group/tool"
              >
                {isEditing && (
                  <div className="absolute -top-3 -right-3 z-20 transition-opacity flex gap-1 opacity-100 md:opacity-0 md:group-hover/tool:opacity-100">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="w-2.5 h-2.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Contact Section (Grid) */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 relative group/section">
          {isEditing && (
            <div className="absolute top-4 right-4 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
              <Sheet modal={false} open={isContactPanelOpen} onOpenChange={setIsContactPanelOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  className="border-l border-black/10 dark:border-white/10 bg-white dark:bg-[#2A2520] p-0 flex flex-col"
                  hasOverlay={false}
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <SheetHeader className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex flex-row items-center m-0 space-y-0 h-[65px]">
                    <SheetTitle className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] font-medium m-0">Edit Contact Information</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-4">
                      <div className="text-[12px] font-semibold text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wider px-1">Primary Contact</div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Email Address</Label>
                          <Input id="email" defaultValue="hello@example.com" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Phone Number</Label>
                          <Input id="phone" defaultValue="+1 (555) 123-4567" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Resume</Label>
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group ${
                              isDraggingResume 
                                ? "bg-black/[0.05] dark:bg-white/[0.05] border-[#1A1A1A] dark:border-[#F0EDE7]" 
                                : "bg-black/[0.03] dark:bg-white/[0.03] border-black/10 dark:border-white/10 hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
                            }`}
                          >
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                              accept=".pdf,.doc,.docx" 
                              onChange={handleFileSelect}
                            />
                            {resumeFile ? (
                              <>
                                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] dark:bg-[#F0EDE7] shadow-sm flex items-center justify-center text-white dark:text-[#1A1A1A]">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-[12px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] flex flex-col items-center max-w-[80%]">
                                  <span className="truncate w-full text-center">{resumeFile.name}</span>
                                  <span className="text-[10px] text-[#7A736C] dark:text-[#9E9893] mt-0.5">Click or drag to replace</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className={`w-10 h-10 rounded-full bg-white dark:bg-[#2A2520] shadow-sm flex items-center justify-center transition-all ${
                                  isDraggingResume 
                                    ? "text-[#1A1A1A] dark:text-[#F0EDE7] scale-110" 
                                    : "text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] group-hover:scale-110"
                                }`}>
                                  <Download className="w-5 h-5" />
                                </div>
                                <div className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893]">
                                  <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold underline decoration-black/20 dark:decoration-white/20 underline-offset-2">Click to upload</span> or drag and drop
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[12px] font-semibold text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wider px-1">Social Links</div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="linkedin" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">LinkedIn URL</Label>
                          <Input id="linkedin" defaultValue="https://linkedin.com/in/username" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="dribbble" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Dribbble URL</Label>
                          <Input id="dribbble" defaultValue="https://dribbble.com/username" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="twitter" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">X (Twitter) URL</Label>
                          <Input id="twitter" defaultValue="https://x.com/username" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="medium" className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] ml-1">Medium URL</Label>
                          <Input id="medium" defaultValue="https://medium.com/@username" className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t border-black/10 dark:border-white/10 flex justify-end gap-3 flex-shrink-0 bg-white dark:bg-[#2A2520]">
                    <SheetClose asChild>
                      <Button variant="outline" className="h-9 px-4 rounded-full text-[13px] font-medium border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="h-9 px-5 rounded-full text-[13px] font-medium bg-[#1A1A1A] dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 transition-colors shadow-sm">Save Changes</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy mail</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <AtSignIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy phone</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Phone size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Linkedin</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -10 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Linkedin size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Dribbble</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 20 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <DribbbleIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">X</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -20 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <TwitterIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Medium</span>
                <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Globe size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
          <motion.div whileHover="hover" initial="rest" className="w-full">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
              <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">View resume</span>
              <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <FileText size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Dino Game Section */}
        <motion.div variants={itemVariants} className="relative flex flex-col items-center justify-center overflow-hidden border-b border-[#E5D7C4]/50">
          <div className="absolute top-6 left-8 right-8 flex justify-between z-10 font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#463B34] dark:text-[#C4B5A0] pointer-events-none">
            <span>{isGameOver ? "Game Over" : isPlaying ? "Playing" : "Tap to play"}</span>
            <div className="flex gap-4">
              <span>HI {String(highScore).padStart(5, '0')}</span>
              <span>{String(Math.floor(score / 10)).padStart(5, '0')}</span>
            </div>
          </div>
          
          <div 
            ref={gameRef}
            onClick={jump}
            className="w-full h-48 relative flex items-end overflow-hidden cursor-pointer select-none bg-black/[0.015] dark:bg-white/[0.03] transition-colors hover:bg-black/[0.025] dark:hover:bg-white/[0.05]"
          >
            {/* Ground Line */}
            <div className="absolute bottom-12 left-0 w-full h-[1px] bg-[#E5D7C4] dark:bg-[#3A352E]"></div>
            
            {/* Dino */}
            <motion.div 
              animate={{ y: -dinoY - 48 }}
              transition={{ type: "just" }}
              className="absolute left-12 bottom-0 mb-[-2px] z-20 dino-game"
            >
              <svg width="40" height="40" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path d="M45.4502 6.75024V8.55005H47.25V18.7317H35.1006V20.2502H40.5V21.5999H35.1006V25.6497H39.1504V29.7004H37.3506V27.8997H35.1006V34.6497H33.2998V37.8H31.0498V40.05H29.25V48.1497H31.0498V49.9504H27.4502L27 43.6497H25.6504V41.8499H23.4004V43.6497H21.1504V45.8997H18.9004V48.1497H21.1504V49.9504H17.1006V41.8499H14.8506V40.05H13.0498V37.8H10.7998V35.55H9V33.3H7.2002V22.05H9V25.6497H10.7998V27.8997H13.0498V29.7004H17.1006V27.8997H19.3506V25.6497H22.0498V23.8499H25.2002V21.5999H27.1689L27.4502 8.55005H29.25V6.30005L45.4502 6.75024ZM31.0498 10.3499V14.8499H35.5498V10.3499H31.0498ZM34.6504 11.2502V13.9504H31.9502V11.2502H34.6504Z" className="dino-color"/>
                {isPlaying && dinoY === 0 && (
                  <motion.path 
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    d="M18.9004 48.1497H21.1504V49.9504H17.1006V41.8499M29.25 48.1497H31.0498V49.9504H27.4502L27 43.6497" 
                    fill="#F0EDE7"
                  />
                )}
              </svg>
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(obs => (
              <div 
                key={obs.id}
                className="absolute bottom-12 mb-[-2px] z-10 dino-game"
                style={{ left: `${obs.x}px` }}
              >
                <svg width="24" height="36" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 30H12V0H8V30Z" className="dino-color"/>
                  <path d="M4 10H8V14H4V10Z" className="dino-color"/>
                  <path d="M12 5H16V9H12V5Z" className="dino-color"/>
                </svg>
              </div>
            ))}

            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E5D7C4]/30 dark:via-[#3A352E]/40 to-transparent -translate-y-12"></div>

            {isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F0EDE7]/40 dark:bg-[#1A1A1A]/60 backdrop-blur-[2px] z-30">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/80 dark:bg-[#2A2520]/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl flex flex-col items-center gap-2"
                >
                  <span className="text-[11px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-[0.2em]">Game Over</span>
                  <div className="flex flex-col items-center group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#535353] dark:text-[#9E9893] mb-1 transition-transform group-hover:rotate-180 duration-500">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span className="text-[9px] font-medium text-[#7A736C] dark:text-[#9E9893] uppercase tracking-widest">Tap to Restart</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
          </>
        ) : activeTemplate === "Professional" ? (
          <div className="w-full flex-1 flex flex-col pt-12 overflow-hidden">
            <SmoothCursor type="professional" />
            
            {/* Top section: Avatar, Title, Subtitle */}
            <motion.div variants={itemVariants} className="flex flex-col items-center w-full relative group/section">
              <div className="absolute top-4 left-4 z-50 transition-opacity opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-black/10 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                </Button>
              </div>
              <div className="absolute top-0 right-4 z-50">
                <CinematicThemeSwitcher />
              </div>
              
              <div className="w-[68px] h-[68px] bg-[#E37941] mb-6 flex items-center justify-center overflow-hidden shrink-0 mt-2">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale-[0.2]" style={{ filter: "contrast(1.2)" }} />
              </div>
              
              <div className="w-full flex mb-6 relative overflow-hidden items-center h-[100px] md:h-[120px]">
                <motion.div 
                  className="flex whitespace-nowrap"
                  animate={{ x: [0, "-50%"] }}
                  transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                >
                  <h1 className="text-[110px] md:text-[140px] leading-[0.8] font-['Pixelify_Sans'] tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7] select-none mt-6 pr-12">
                    DAVID JOHNSON
                  </h1>
                  <h1 className="text-[110px] md:text-[140px] leading-[0.8] font-['Pixelify_Sans'] tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7] select-none mt-6 pr-12">
                    DAVID JOHNSON
                  </h1>
                  <h1 className="text-[110px] md:text-[140px] leading-[0.8] font-['Pixelify_Sans'] tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7] select-none mt-6 pr-12">
                    DAVID JOHNSON
                  </h1>
                  <h1 className="text-[110px] md:text-[140px] leading-[0.8] font-['Pixelify_Sans'] tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7] select-none mt-6 pr-12">
                    DAVID JOHNSON
                  </h1>
                </motion.div>
              </div>

              <div className="text-center font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[16px] leading-[1.8] mb-12 px-4">
                <p>I'm a Web Designer, Music Artist & Photographer.</p>
                <p>I spend most of time thinking about Tea.</p>
              </div>
            </motion.div>

            {/* Time / Role row */}
            <div className="border-t border-[#D5D0C6] dark:border-[#3A352E] flex justify-between items-center px-4 py-2.5 font-['JetBrains_Mono'] text-[13px] uppercase tracking-wide text-[#1A1A1A] dark:text-[#B5AFA5]">
              <div className="flex items-center gap-2">
                <span>{format(currentTime, "E, MMM d")}</span>
                <span className="text-[#E37941] text-[8px] mt-[1px]">◆</span>
                <span>{format(currentTime, "h:mm:ss a")}</span>
              </div>
              <div className="tracking-wider">PRODUCT DESIGNER</div>
            </div>

            {/* Navigation row */}
            <div className="bg-[#DED9CE] dark:bg-[#2A2520] px-3 py-2 flex justify-between items-center overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab("Projects")}
                className={cn(
                  "group px-6 py-2.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider transition-all duration-200 min-w-max relative",
                  activeTab === "Projects" 
                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold shadow-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]" 
                    : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] font-medium bg-transparent"
                )}
              >
                <span className="relative z-10 transition-colors duration-200">Projects</span>
                {activeTab !== "Projects" && (
                  <span className="absolute bottom-2 left-[50%] -translate-x-1/2 w-0 h-[1px] bg-[#1A1A1A] dark:bg-[#F0EDE7] opacity-0 group-hover:opacity-100 group-hover:w-[60%] transition-all duration-300 ease-out z-10" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("Experience")}
                className={cn(
                  "group px-6 py-2.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider transition-all duration-200 min-w-max relative",
                  activeTab === "Experience" 
                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold shadow-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]" 
                    : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] font-medium bg-transparent"
                )}
              >
                <span className="relative z-10 transition-colors duration-200">Experience</span>
                {activeTab !== "Experience" && (
                  <span className="absolute bottom-2 left-[50%] -translate-x-1/2 w-0 h-[1px] bg-[#1A1A1A] dark:bg-[#F0EDE7] opacity-0 group-hover:opacity-100 group-hover:w-[60%] transition-all duration-300 ease-out z-10" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("About")}
                className={cn(
                  "group px-6 py-2.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider transition-all duration-200 min-w-max relative",
                  activeTab === "About" 
                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold shadow-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]" 
                    : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] font-medium bg-transparent"
                )}
              >
                <span className="relative z-10 transition-colors duration-200">About me</span>
                {activeTab !== "About" && (
                  <span className="absolute bottom-2 left-[50%] -translate-x-1/2 w-0 h-[1px] bg-[#1A1A1A] dark:bg-[#F0EDE7] opacity-0 group-hover:opacity-100 group-hover:w-[60%] transition-all duration-300 ease-out z-10" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("Contact")}
                className={cn(
                  "group px-6 py-2.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider transition-all duration-200 min-w-max relative",
                  activeTab === "Contact" 
                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold shadow-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]" 
                    : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] font-medium bg-transparent"
                )}
              >
                <span className="relative z-10 transition-colors duration-200">Contact</span>
                {activeTab !== "Contact" && (
                  <span className="absolute bottom-2 left-[50%] -translate-x-1/2 w-0 h-[1px] bg-[#1A1A1A] dark:bg-[#F0EDE7] opacity-0 group-hover:opacity-100 group-hover:w-[60%] transition-all duration-300 ease-out z-10" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("Testimonials")}
                className={cn(
                  "group px-6 py-2.5 font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider transition-all duration-200 min-w-max relative",
                  activeTab === "Testimonials" 
                    ? "bg-[#EFECE6] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold shadow-sm [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]" 
                    : "text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] font-medium bg-transparent"
                )}
              >
                <span className="relative z-10 transition-colors duration-200">Testimonials</span>
                {activeTab !== "Testimonials" && (
                  <span className="absolute bottom-2 left-[50%] -translate-x-1/2 w-0 h-[1px] bg-[#1A1A1A] dark:bg-[#F0EDE7] opacity-0 group-hover:opacity-100 group-hover:w-[60%] transition-all duration-300 ease-out z-10" />
                )}
              </button>
            </div>

            {/* Empty space for content below */}
            <div className="flex-1">
              {activeTab === "Projects" && (
                <div className="grid grid-cols-1 gap-0">
                  {/* Add Project Card */}
                  <div className="group cursor-pointer relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
                    <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
                    <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>
                    
                    <div className="bg-white/50 dark:bg-[#1A1A1A]/50 p-6 md:p-7 relative overflow-hidden flex-1 flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px]">
                      <div className="absolute top-3 left-3 md:top-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      
                      <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-4">
                        <div className="w-12 h-12 rounded-full border border-dashed border-[#D5D0C6] dark:border-[#3A352E] flex items-center justify-center text-[#7A736C] dark:text-[#9E9893] group-hover:border-[#1A1A1A] dark:group-hover:border-[#F0EDE7] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] transition-colors bg-white dark:bg-[#2A2520] shadow-sm">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="font-['JetBrains_Mono'] text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] transition-colors uppercase tracking-wider">
                          Add New Project
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project 1 */}
                  <div onClick={() => handleProjectClick("slate")} className="group cursor-pointer relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
                    <div className="absolute top-4 right-4 z-40 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                    <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
                    <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>

                    <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-6 md:p-7 relative overflow-hidden">
                      <div className="absolute top-3 left-3 md:top-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <img src={project1} alt="Slate" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1A1A] p-4 md:p-5 relative z-20 border-t border-[#D5D0C6] dark:border-[#3A352E] flex-1">
                      <h3 className="font-['JetBrains_Mono'] text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">Slate</h3>
                      <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                        A sleek and responsive landing page designed for modern startups to showcase their products.
                      </p>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div onClick={() => handleProjectClick("antimetal")} className="group cursor-pointer relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
                    <div className="absolute top-4 right-4 z-40 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                    <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
                    <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>

                    <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-6 md:p-7 relative overflow-hidden">
                      <div className="absolute top-3 left-3 md:top-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <img src={project2} alt="Antimetal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1A1A] p-4 md:p-5 relative z-20 border-t border-[#D5D0C6] dark:border-[#3A352E] flex-1">
                      <h3 className="font-['JetBrains_Mono'] text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">Antimetal</h3>
                      <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                        A dynamic, animation-focused landing page highlighting transitions.
                      </p>
                    </div>
                  </div>

                  {/* Project 3 */}
                  <div onClick={() => handleProjectClick("slate")} className="group cursor-pointer relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
                    <div className="absolute top-4 right-4 z-40 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                    <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
                    <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>

                    <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-6 md:p-7 relative overflow-hidden">
                      <div className="absolute top-3 left-3 md:top-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <img src={project3} alt="Financial Dashboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1A1A] p-4 md:p-5 relative z-20 border-t border-[#D5D0C6] dark:border-[#3A352E] flex-1">
                      <h3 className="font-['JetBrains_Mono'] text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">Dashboard</h3>
                      <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                        Complex data visualization with clean, intuitive interfaces.
                      </p>
                    </div>
                  </div>

                  {/* Project 4 */}
                  <div onClick={() => handleProjectClick("antimetal")} className="group cursor-pointer relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
                    <div className="absolute top-4 right-4 z-40 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-black/10 dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                    <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
                    <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>

                    <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-6 md:p-7 relative overflow-hidden">
                      <div className="absolute top-3 left-3 md:top-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 left-3 md:bottom-3.5 md:left-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="absolute bottom-3 right-3 md:bottom-3.5 md:right-3.5 w-2.5 h-2.5 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                      <div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                        <img src={project4} alt="TaskMaster" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1A1A] p-4 md:p-5 relative z-20 border-t border-[#D5D0C6] dark:border-[#3A352E] flex-1">
                      <h3 className="font-['JetBrains_Mono'] text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">TaskMaster</h3>
                      <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                        Productivity application with seamless drag-and-drop mechanics.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Experience" && (
                <div className="px-4 md:px-6 pb-12 relative group/section">
                  <div className="space-y-0">
                    {experiences.map((exp, index) => (
                      <div key={index} className="group border-b border-[#D5D0C6] dark:border-[#3A352E] last:border-0 hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors -mx-4 px-4 md:-mx-6 md:px-6 relative">
                        {isEditing && (
                          <div className="absolute top-4 right-4 md:right-6 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                              <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                            </Button>
                          </div>
                        )}
                        <button 
                          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                          className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-2 sm:gap-4 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <motion.span 
                              animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                              className="text-[#1A1A1A] dark:text-[#F0EDE7] font-light text-lg leading-none transition-colors w-4 h-4 flex items-center justify-center shrink-0"
                            >
                              +
                            </motion.span>
                            <span className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[14px] font-medium tracking-wide uppercase">
                              <span className="text-[#7A736C] dark:text-[#9E9893] mr-2">{exp.year} /</span>
                              {exp.company}
                            </span>
                          </div>
                          <span className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#9E9893] text-[14px] uppercase tracking-wider group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7] transition-colors ml-8 sm:ml-0">
                            {exp.role}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expandedIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pb-6 pl-12 pr-4 sm:pr-0">
                                <motion.p
                                  variants={{
                                    hidden: { opacity: 0 },
                                    show: { opacity: 1, transition: { staggerChildren: 0.015 } },
                                  }}
                                  initial="hidden"
                                  animate="show"
                                  className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed max-w-xl"
                                >
                                  {exp.description.split(" ").map((word, wordIndex) => (
                                    <span key={wordIndex} className="inline-block whitespace-nowrap">
                                      {word.split("").map((char, charIndex) => (
                                        <motion.span
                                          key={charIndex}
                                          variants={{
                                            hidden: { opacity: 0, filter: "blur(4px)", y: 4 },
                                            show: { opacity: 1, filter: "blur(0px)", y: 0 },
                                          }}
                                          transition={{ duration: 0.2 }}
                                          className="inline-block"
                                        >
                                          {char}
                                        </motion.span>
                                      ))}
                                      {wordIndex < exp.description.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
                                    </span>
                                  ))}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    
                    {/* Add Experience Button */}
                    {isEditing && (
                      <div className="pt-6 mt-4 border-t border-[#D5D0C6]/50 dark:border-[#3A352E]/50 border-dashed">
                        <button className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-[#D5D0C6] dark:border-[#3A352E] rounded-lg text-[#7A736C] dark:text-[#9E9893] hover:border-[#1A1A1A] dark:hover:border-[#F0EDE7] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-all bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                          <Plus className="w-4 h-4" />
                          <span className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-wider font-medium">Add New Experience</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "About" && (
                <div className="p-4 md:p-6 pb-12 relative group/section">
                  {isEditing && (
                    <div className="absolute -top-3 right-4 md:right-6 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white dark:bg-[#2A2520] border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]">
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <div className="max-w-2xl">
                    <TextGradientScroll 
                      text={`I am a multi-disciplinary designer and developer based in San Francisco. I specialize in creating elevated digital experiences that combine intuitive functionality with meticulous aesthetic detail.\n\nWith a background in both graphic design and computer science, I bridge the gap between creative vision and technical implementation. My work focuses on typography, considered whitespace, and subtle interactions that bring interfaces to life.`}
                      className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] leading-relaxed mb-8"
                      textOpacity="medium"
                    />
                    
                    <div className="space-y-6">
                      <div className="relative group/skill">
                        {isEditing && (
                          <div className="absolute top-0 right-0 z-10 opacity-100 md:opacity-0 md:group-hover/skill:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white dark:bg-[#2A2520] border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]">
                              <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                            </Button>
                          </div>
                        )}
                        <h4 className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[18px] uppercase tracking-wider mb-3 font-semibold">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {["UI/UX Design", "Frontend Development", "Design Systems", "Interaction Design", "Prototyping", "Art Direction"].map((skill) => (
                            <span key={skill} className="px-3 py-1.5 border border-[#D5D0C6] dark:border-[#3A352E] font-['JetBrains_Mono'] text-[14px] text-[#7A736C] dark:text-[#B5AFA5] rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative group/tech">
                        {isEditing && (
                          <div className="absolute top-0 right-0 z-10 opacity-100 md:opacity-0 md:group-hover/tech:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white dark:bg-[#2A2520] border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]">
                              <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                            </Button>
                          </div>
                        )}
                        <h4 className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[18px] uppercase tracking-wider mb-3 font-semibold">Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {["React", "TypeScript", "Tailwind CSS", "Figma", "Framer Motion", "Next.js", "Node.js"].map((tech) => (
                            <span key={tech} className="px-3 py-1.5 border border-[#D5D0C6] dark:border-[#3A352E] bg-[#EFECE6] dark:bg-[#1A1A1A] font-['JetBrains_Mono'] text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contact" && (
                <div className="p-4 md:p-6 pb-12 relative group/section">
                  {isEditing && (
                    <div className="absolute -top-3 right-4 md:right-6 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]">
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Edit</span>
                      </Button>
                    </div>
                  )}
                  <div className="max-w-2xl h-full flex items-center justify-center min-h-[300px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="relative group">
                        <a href="mailto:hello@example.com" className="p-5 border border-[#D5D0C6] dark:border-[#3A352E] flex flex-col items-center justify-center gap-3 hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors rounded-sm h-32 w-full">
                          <Mail className="w-6 h-6 text-[#1A1A1A] dark:text-[#F0EDE7] opacity-80 group-hover:opacity-100 transition-opacity" />
                          <span className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px]">Email Me</span>
                        </a>
                      </div>
                      <div className="relative group">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-5 border border-[#D5D0C6] dark:border-[#3A352E] flex flex-col items-center justify-center gap-3 hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors rounded-sm h-32 w-full">
                          <Twitter className="w-6 h-6 text-[#1A1A1A] dark:text-[#F0EDE7] opacity-80 group-hover:opacity-100 transition-opacity" />
                          <span className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px]">Twitter / X</span>
                        </a>
                      </div>
                      <div className="relative group">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-5 border border-[#D5D0C6] dark:border-[#3A352E] flex flex-col items-center justify-center gap-3 hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors rounded-sm h-32 w-full">
                          <Github className="w-6 h-6 text-[#1A1A1A] dark:text-[#F0EDE7] opacity-80 group-hover:opacity-100 transition-opacity" />
                          <span className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px]">GitHub</span>
                        </a>
                      </div>
                      <div className="relative group">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-5 border border-[#D5D0C6] dark:border-[#3A352E] flex flex-col items-center justify-center gap-3 hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors rounded-sm h-32 w-full">
                          <Linkedin className="w-6 h-6 text-[#1A1A1A] dark:text-[#F0EDE7] opacity-80 group-hover:opacity-100 transition-opacity" />
                          <span className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px]">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Testimonials" && (
                <div className="p-4 md:p-6 pb-12 relative group/section">
                  {isEditing && (
                    <div className="absolute -top-3 right-4 md:right-6 transition-opacity z-10 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]">
                        <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Add Testimonial</span>
                      </Button>
                    </div>
                  )}
                  <div className="max-w-2xl space-y-6">
                    <div className="group border border-[#D5D0C6] dark:border-[#3A352E] p-6 rounded-sm hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors relative">
                      {isEditing && (
                        <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                            <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                        </div>
                      )}
                      <p className="font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[16px] leading-relaxed mb-6 italic relative z-10">
                        "Matt is one of the most talented designers I've had the pleasure of working with. His ability to balance aesthetics with complex functionality is truly impressive. He elevated our entire product experience."
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#D5D0C6] dark:bg-[#3A352E] overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Sarah Jenkins" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[14px] font-semibold">Sarah Jenkins</h4>
                            <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#9E9893] text-[12px] uppercase tracking-wider">VP of Product, Stripe</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePlayTestimonial("Matt is one of the most talented designers I've had the pleasure of working with. His ability to balance aesthetics with complex functionality is truly impressive. He elevated our entire product experience.", 1)}
                          className="flex items-center gap-2 px-3 py-1.5 border border-[#D5D0C6] dark:border-[#3A352E] rounded-full text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-[#DED9CE] dark:hover:bg-[#2A2520] transition-colors"
                        >
                          {playingTestimonial === 1 ? (
                            <>
                              <Square size={14} className="fill-current" />
                              <div className="flex items-center justify-center gap-[2px] h-[14px] w-[30px]">
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-[2px] bg-current rounded-full"
                                    animate={{ height: ["4px", "12px", "4px"] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <Play size={14} className="fill-current" />
                              <span className="font-['JetBrains_Mono'] text-[12px] w-[30px] text-center">Play</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="group border border-[#D5D0C6] dark:border-[#3A352E] p-6 rounded-sm hover:bg-[#DED9CE]/30 dark:hover:bg-white/[0.02] transition-colors relative">
                      {isEditing && (
                        <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => e.stopPropagation()}>
                            <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                        </div>
                      )}
                      <p className="font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[16px] leading-relaxed mb-6 italic relative z-10">
                        "We brought Matt on for a critical redesign project. Not only did he deliver beautiful visuals, but his systematic approach to our component library completely transformed how our engineering team builds UI."
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#D5D0C6] dark:bg-[#3A352E] overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="David Chen" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-['JetBrains_Mono'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[14px] font-semibold">David Chen</h4>
                            <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#9E9893] text-[12px] uppercase tracking-wider">Engineering Lead, Vercel</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePlayTestimonial("We brought Matt on for a critical redesign project. Not only did he deliver beautiful visuals, but his systematic approach to our component library completely transformed how our engineering team builds UI.", 2)}
                          className="flex items-center gap-2 px-3 py-1.5 border border-[#D5D0C6] dark:border-[#3A352E] rounded-full text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-[#DED9CE] dark:hover:bg-[#2A2520] transition-colors"
                        >
                          {playingTestimonial === 2 ? (
                            <>
                              <Square size={14} className="fill-current" />
                              <div className="flex items-center justify-center gap-[2px] h-[14px] w-[30px]">
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-[2px] bg-current rounded-full"
                                    animate={{ height: ["4px", "12px", "4px"] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <Play size={14} className="fill-current" />
                              <span className="font-['JetBrains_Mono'] text-[12px] w-[30px] text-center">Play</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTemplate === "Creative" ? (
          <div className="w-full flex-1 flex flex-col gap-3 pb-20 pt-0 px-4 md:px-0 max-w-[640px] mx-auto">
            {/* Header / Date */}
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[24px] border border-[#E5D7C4] dark:border-white/10 py-2 px-4 flex justify-between items-center w-full"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Mon, Mar 9</span>
                <div className="w-2 h-2 bg-[#E37941] rotate-45"></div>
                <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  value={isDark}
                  onToggle={toggleTheme}
                  iconOn={<Moon className="size-4" />}
                  iconOff={<Sun className="size-4" />}
                />
              </div>
            </motion.div>

            {/* Intro Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.15 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 flex flex-col md:flex-row gap-6 items-start md:items-center w-full relative group"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                </div>
              )}
              <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-black/5 dark:border-white/10 shadow-sm bg-[#A1C2D8]">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] tracking-tight leading-tight">Hey I'm Matt.</h1>
                <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed max-w-[480px]">
                  I'm a Design Engineer focused on crafting meaningful digital experiences where design meets code.
                </p>
              </div>
            </motion.div>

            {/* Marquee Tags */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.3 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[24px] border border-[#E5D7C4] dark:border-white/10 py-2 overflow-hidden relative w-full"
            >
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 dark:from-[#2A2520]/80 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 dark:from-[#2A2520]/80 to-transparent z-10"></div>
              <motion.div 
                className="flex gap-4 whitespace-nowrap"
                animate={{ x: [0, "-50%"] }}
                transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[12px] uppercase tracking-wider">Interaction Design</span>
                    <div className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/></svg>
                    </div>
                    <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[12px] uppercase tracking-wider">3D Design</span>
                    <div className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/></svg>
                    </div>
                    <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[12px] uppercase tracking-wider">User Research</span>
                    <div className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/></svg>
                    </div>
                    <span className="text-[#7A736C] dark:text-[#B5AFA5] font-medium text-[12px] uppercase tracking-wider">UI/UX Design</span>
                    <div className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/></svg>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Projects Container */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.45 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 w-full relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                  </Button>
                </div>
              )}
              <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-3" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>PROJECTS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project 1 */}
                <div className="flex flex-col gap-4 group/card cursor-pointer relative" onClick={() => handleProjectClick("slate")}>
                  {isEditing && (
                    <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <img src={project1} alt="Project 1" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2 leading-snug line-clamp-2">
                      Redesigning Quote Builder at Freshworks for 1,900+ Enterprise U...
                    </h3>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-sm leading-relaxed line-clamp-2">
                      A sleek and responsive landing page designed for modern startups to showca...
                    </p>
                  </div>
                </div>

                {/* Project 2 */}
                <div className="flex flex-col gap-4 group/card cursor-pointer relative" onClick={() => handleProjectClick("antimetal")}>
                  {isEditing && (
                    <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-black/5 dark:border-white/10 bg-[#F5F5F5] dark:bg-[#1A1A1A]">
                    <img src={project2} alt="Project 2" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#1A1A1A] dark:text-[#F0EDE7] mb-2 leading-snug line-clamp-2">
                      Designfolio: No-Code Portfolio Builder for 9,000+ Users
                    </h3>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-sm leading-relaxed line-clamp-2">
                      Helping Product folks build bragworthy portfolio websites.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

              {/* Experience / Career Ladder Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.6 }}
              ref={careerLadderRef} 
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-4 md:p-6 w-full mt-2 relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Add Experience</span>
                  </Button>
                </div>
              )}
              <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>CAREER LADDER</h2>
              
              <div ref={ladderContainerRef} className="relative flex">
                {/* Character climbing ladder */}
                <div className="absolute left-[1px] z-20 w-[40px] h-[54px]" style={{ top: `${characterPosition}px`, willChange: 'transform' }}>
                  <img src="/character-me.svg" alt="Character climbing" className="w-full h-full object-contain" />
                </div>
                {/* Timeline Line */}
                <div className="absolute left-0 top-3 bottom-0 w-[42px] flex flex-col justify-between items-start border-x-[5px] border-[#F0EDE7] dark:border-[#3A352E] py-1 bg-transparent">
                  {[...Array(38)].map((_, i) => (
                    <div key={i} className="w-full h-[5px] bg-[#F0EDE7] dark:bg-[#3A352E]"></div>
                  ))}
                </div>

                <div className="space-y-12 pl-16 relative z-10 w-full pt-1 pb-2">
                  {/* Experience 1 */}
                  <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
                    {isEditing && (
                      <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                      <h3 className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">Product Designer @ Sense Hq</h3>
                      <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                        2025 — Present
                      </div>
                    </div>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed mb-4">
                      Currently designing AI-powered recruiter tools that help HR teams create conversational talent workflows and automate engagement.
                    </p>
                    <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[15px]">
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>AI agents for recruiters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Simplifying complex AI workflows</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Scaling interaction patterns for enterprise hiring tools</span>
                      </li>
                    </ul>
                  </div>

                  {/* Experience 2 */}
                  <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
                    {isEditing && (
                      <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                      <h3 className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">Product Designer @ Sense Hq</h3>
                      <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                        2025 — Present
                      </div>
                    </div>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed mb-4">
                      Currently designing AI-powered recruiter tools that help HR teams create conversational talent workflows and automate engagement.
                    </p>
                    <div className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] mb-3">Focus areas:</div>
                    <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[15px]">
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>AI agents for recruiters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Simplifying complex AI workflows</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Scaling interaction patterns for enterprise hiring tools</span>
                      </li>
                    </ul>
                  </div>

                  {/* Experience 3 */}
                  <div className="relative group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-4 -mx-4 rounded-2xl transition-colors">
                    {isEditing && (
                      <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                      <h3 className="text-[18px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">Product Designer @ Sense Hq</h3>
                      <div className="bg-[#F0EDE7] dark:bg-[#3A352E] px-3 py-1 rounded-full text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] w-fit whitespace-nowrap">
                        2025 — Present
                      </div>
                    </div>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed mb-4">
                      Currently designing AI-powered recruiter tools that help HR teams create conversational talent workflows and automate engagement.
                    </p>
                    <div className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] mb-3">Focus areas:</div>
                    <ul className="space-y-2.5 text-[#7A736C] dark:text-[#B5AFA5] text-[15px]">
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>AI agents for recruiters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Simplifying complex AI workflows</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7A736C] dark:bg-[#B5AFA5] shrink-0"></span>
                        <span>Scaling interaction patterns for enterprise hiring tools</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tools Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.75 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 py-2 w-full relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Add Tool</span>
                  </Button>
                </div>
              )}
              <div className="overflow-hidden relative w-full rounded-[32px]">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 dark:from-[#2A2520]/80 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 dark:from-[#2A2520]/80 to-transparent z-10"></div>
                
                <motion.div 
                  className="flex gap-8 py-1"
                  animate={{ x: [0, "-50%"] }}
                  transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                >
                  {[
                    { name: "Figma", image: "/tools/image 4.png" },
                    { name: "Notion", image: "/tools/image 5.png" },
                    { name: "Procreate", image: "/tools/image 6.png" },
                    { name: "Plasticity", image: "/tools/image 7.png" },
                    { name: "Reeder", image: "/tools/image 8.png" },
                    { name: "Anthropic", image: "/tools/image 9.png" },
                    { name: "Sketch", image: "/tools/image 10.png" },
                    { name: "Figma", image: "/tools/image 4.png" },
                    { name: "Notion", image: "/tools/image 5.png" },
                    { name: "Procreate", image: "/tools/image 6.png" },
                    { name: "Plasticity", image: "/tools/image 7.png" },
                    { name: "Reeder", image: "/tools/image 8.png" },
                    { name: "Anthropic", image: "/tools/image 9.png" },
                  ].map((tool, i) => (
                    <img 
                      key={i}
                      src={tool.image} 
                      alt={tool.name} 
                      className="flex-shrink-0 w-9 h-9 hover:scale-110 transition-transform cursor-pointer" 
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* About Me Section with Pegboard */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.9 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-6 w-full relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Edit Story</span>
                  </Button>
                </div>
              )}
              <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>MY STORY</h2>
              
              {/* Pegboard Grid Background */}
              <div className="relative w-full mb-8 rounded-[32px] border border-black/5 dark:border-white/10 bg-[#F7F4EF] dark:bg-[#1E1B18]">
                {/* Invisible larger boundary for drag constraints allowing slight overflow */}
                <div className="absolute -inset-6 md:-inset-10 pointer-events-none" ref={pegboardRef}></div>
                
                {/* Light Mode Grid */}
                <div className="absolute inset-0 dark:hidden pointer-events-none rounded-[32px] overflow-hidden" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  backgroundPosition: 'center center'
                }}></div>
                {/* Dark Mode Grid */}
                <div className="absolute inset-0 hidden dark:block pointer-events-none rounded-[32px] overflow-hidden" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  backgroundPosition: 'center center'
                }}></div>

                <div className="relative h-[260px] md:h-[320px] flex flex-row items-center justify-center px-2 md:p-4 gap-4 md:gap-10">
                  
                  {/* Image 1 - Left with L-shape tape (Portrait) */}
                  <motion.div 
                    drag 
                    dragConstraints={pegboardRef}
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={() => {
                      bringToFront(1);
                      playPegboardClick('grab');
                    }}
                    onDragEnd={() => playPegboardClick('drop')}
                    onPointerDown={() => bringToFront(1)}
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                    initial={{ y: 10 }}
                    style={{ zIndex: zIndexes[1] }}
                    className="relative w-28 md:w-36 aspect-[3/4] group cursor-grab" 
                  >
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="w-full h-full pointer-events-none relative" style={{ transform: 'rotate(-4deg)' }}>
                      <div className="w-full h-full bg-white dark:bg-[#2A2520] p-1.5 md:p-2 rounded-[12px] md:rounded-[16px] shadow-sm border border-black/5 dark:border-white/10 flex flex-col relative group-hover:shadow-md transition-shadow">
                        <div className="relative w-full h-full">
                          <img src={story1} alt="My workspace" className="w-full h-full object-cover rounded-[6px] md:rounded-[8px]" draggable="false" />
                          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 rounded-[6px] md:rounded-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-sm scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Move className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-gray-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Top tape part */}
                      <div className="absolute -top-1 -left-2 w-12 md:w-16 h-5 md:h-6 bg-[#E8CF82]/90 dark:bg-[#B89B4D]/90 backdrop-blur-sm shadow-sm z-20" style={{ transform: 'rotate(-2deg)' }}></div>
                      {/* Side tape part */}
                      <div className="absolute top-3 md:top-4 -left-2 md:-left-3 w-5 md:w-6 h-10 md:h-12 bg-[#E8CF82]/90 dark:bg-[#B89B4D]/90 backdrop-blur-sm shadow-sm z-20" style={{ transform: 'rotate(2deg)' }}></div>
                    </div>
                  </motion.div>

                  {/* Image 2 - Center with Top Tape and Figma Logo (Squircle) */}
                  <motion.div 
                    drag 
                    dragConstraints={pegboardRef}
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={() => {
                      bringToFront(2);
                      playPegboardClick('grab');
                    }}
                    onDragEnd={() => playPegboardClick('drop')}
                    onPointerDown={() => bringToFront(2)}
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                    initial={{ y: 15 }}
                    style={{ zIndex: zIndexes[2] }}
                    className="relative w-32 md:w-44 aspect-square group cursor-grab" 
                  >
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="w-full h-full pointer-events-none relative" style={{ transform: 'rotate(6deg)' }}>
                      <div className="w-full h-full bg-white dark:bg-[#2A2520] p-1.5 md:p-2 rounded-[24px] md:rounded-[32px] shadow-md border border-black/5 dark:border-white/10 flex flex-col relative group-hover:shadow-lg transition-shadow">
                        <div className="relative w-full h-full">
                          <img src={story2} alt="Designing" className="w-full h-full object-cover rounded-[16px] md:rounded-[24px]" draggable="false" />
                          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 rounded-[16px] md:rounded-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-sm scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Move className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Center tape */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 md:w-20 h-5 md:h-6 bg-[#DFCDAA]/90 dark:bg-[#9B8C73]/90 backdrop-blur-sm shadow-sm z-20" style={{ transform: 'rotate(-3deg)' }}></div>
                      
                      {/* Figma Logo Accent */}
                      <div className="absolute -bottom-3 md:-bottom-5 -right-3 md:-right-5 w-12 md:w-16 h-12 md:h-16 z-30" style={{ transform: 'rotate(-10deg)' }}>
                        <img src="/stickerfigma.png" alt="Figma Sticker" className="w-full h-full object-contain drop-shadow-md" draggable="false" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Image 3 - Right with Long Top Tape (Portrait) */}
                  <motion.div 
                    drag 
                    dragConstraints={pegboardRef}
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={() => {
                      bringToFront(3);
                      playPegboardClick('grab');
                    }}
                    onDragEnd={() => playPegboardClick('drop')}
                    onPointerDown={() => bringToFront(3)}
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                    initial={{ y: -10 }}
                    style={{ zIndex: zIndexes[3] }}
                    className="relative w-28 md:w-36 aspect-[3/4] group cursor-grab" 
                  >
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                          <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                          <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                        </Button>
                      </div>
                    )}
                    <div className="w-full h-full pointer-events-none relative" style={{ transform: 'rotate(-2deg)' }}>
                      <div className="w-full h-full bg-white dark:bg-[#2A2520] p-1.5 md:p-2 rounded-[12px] md:rounded-[16px] shadow-sm border border-black/5 dark:border-white/10 flex flex-col relative group-hover:shadow-md transition-shadow">
                        <div className="relative w-full h-full">
                          <img src={story3} alt="Coffee and notes" className="w-full h-full object-cover rounded-[6px] md:rounded-[8px]" draggable="false" />
                          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 rounded-[6px] md:rounded-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-sm scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Move className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-gray-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Long horizontal tape */}
                      <div className="absolute -top-3 md:-top-4 -left-2 md:-left-4 w-32 md:w-44 h-5 md:h-6 bg-[#D3C4A9]/90 dark:bg-[#8D826B]/90 backdrop-blur-sm shadow-sm z-20" style={{ transform: 'rotate(1deg)' }}></div>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Story Text */}
              <div className="space-y-4">
                <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed">
                  I'm Matt Chen, a passionate Design Engineer focused on crafting meaningful digital experiences where design meets code. Currently exploring new ways to create intuitive interfaces that users love, I'm driven by curiosity and a deep appreciation for thoughtful, purposeful design.
                </p>
                <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed">
                  I thrive on transforming complex ideas into reality — whether it's designing seamless user experiences, building interactive prototypes, creating distinctive brand experiences, or developing websites that feel effortless to use.
                </p>
              </div>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.95 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-6 w-full relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Add Testimonial</span>
                  </Button>
                </div>
              )}
              <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>TESTIMONIALS</h2>
              
              <div className="space-y-4">
                <div className="relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonialIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onMouseEnter={() => setIsHoveringTestimonial(true)}
                      onMouseLeave={() => setIsHoveringTestimonial(false)}
                      className="group border border-[#E5D7C4] dark:border-white/10 p-6 rounded-2xl bg-white/50 dark:bg-[#2A2520]/50 hover:bg-white dark:hover:bg-[#35302A] transition-colors relative"
                    >
                      {isEditing && (
                        <div className="absolute top-4 right-4 z-20 transition-opacity flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                            <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                            <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                          </Button>
                        </div>
                      )}
                      <p className="font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] leading-relaxed mb-6 italic relative z-10">
                        "{creativeTestimonials[currentTestimonialIndex].text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#E5D7C4] dark:bg-white/10 overflow-hidden shrink-0">
                            <img src={creativeTestimonials[currentTestimonialIndex].image} alt={creativeTestimonials[currentTestimonialIndex].name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[#1A1A1A] dark:text-[#F0EDE7] text-[14px]">{creativeTestimonials[currentTestimonialIndex].name}</h4>
                            <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[13px]">{creativeTestimonials[currentTestimonialIndex].title}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePlayTestimonial(creativeTestimonials[currentTestimonialIndex].text, creativeTestimonials[currentTestimonialIndex].id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#2A2520] border border-[#E5D7C4] dark:border-white/10 rounded-full text-[#1A1A1A] dark:text-[#F0EDE7] hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors shadow-sm"
                        >
                          {playingTestimonial === creativeTestimonials[currentTestimonialIndex].id ? (
                            <>
                              <Square size={14} className="fill-current" />
                              <div className="flex items-center justify-center gap-[2px] h-[14px] w-[30px]">
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-[2px] bg-current rounded-full"
                                    animate={{ height: ["4px", "12px", "4px"] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <Play size={14} className="fill-current" />
                              <span className="text-[12px] font-medium w-[30px] text-center">Play</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-4 pt-2">
                  {creativeTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTestimonialIndex(idx);
                        // Temporarily pause auto-scroll when manually clicked
                        setIsHoveringTestimonial(true);
                        setTimeout(() => setIsHoveringTestimonial(false), 5000);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentTestimonialIndex 
                          ? "w-6 bg-[#1A1A1A] dark:bg-[#F0EDE7]" 
                          : "w-1.5 bg-[#E5D7C4] dark:bg-white/20 hover:bg-[#D5D0C6] dark:hover:bg-white/40"
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 1.05 }}
              className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[32px] border border-[#E5D7C4] dark:border-white/10 p-6 w-full relative group/section"
            >
              {isEditing && (
                <div className="absolute -top-3 -right-3 opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity z-10 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 px-3 rounded-full bg-white dark:bg-[#2A2520] shadow-md border border-[#E5D7C4] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#35302A]">
                    <Pencil className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">Edit Contact</span>
                  </Button>
                </div>
              )}
              <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-6" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>CONTACT</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy mail</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <AtSignIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy phone</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <Phone size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Linkedin</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -10 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <Linkedin size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Dribbble</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 20 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <DribbbleIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">X</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -20 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <TwitterIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                  {isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                        <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                        <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                    <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Medium</span>
                    <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: 15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                      <Globe size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
              <motion.div whileHover="hover" initial="rest" className="w-full relative group/link">
                {isEditing && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 transition-opacity flex gap-1.5 opacity-100 md:opacity-0 md:group-hover/link:opacity-100">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A]" onClick={(e) => { e.stopPropagation(); }}>
                      <Pencil className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/90 dark:bg-[#2A2520]/90 backdrop-blur-sm border-[#E5D7C4] dark:border-white/10 shadow-sm hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); }}>
                      <Trash2 className="w-3 h-3 text-[#1A1A1A] dark:text-[#F0EDE7]" />
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-[#2A2520] rounded-xl border border-black/5 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto">
                  <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">View resume</span>
                  <motion.div variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.3, rotate: -15 } }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={isEditing ? "opacity-0 md:group-hover/link:opacity-0 transition-opacity" : ""}>
                    <FileText size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4 px-6 mt-[-10vh]"
            >
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-black/10 dark:border-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7A736C] dark:text-[#9E9893]">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#F0EDE7]">
                {activeTemplate} Template
              </h2>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-base max-w-[280px] mx-auto">
                Coming soon. This template is currently under construction.
              </p>
            </motion.div>
          </div>
        )}
      </div>
      </motion.div>
    </>
  );
}