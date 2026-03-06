import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useCallback } from "react";
import { Download, Dribbble, Mail, ChevronDown, Copy, Phone, Linkedin, Twitter, Globe, FileText } from "lucide-react";
import { AtSignIcon, AtSignIconHandle, DownloadIcon, DownloadIconHandle } from "lucide-animated";
import { motion, AnimatePresence } from "framer-motion";
import profileImg from "@/assets/images/profile.png";
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
  const atSignRef = useRef<AtSignIconHandle>(null);
  const downloadRef = useRef<DownloadIconHandle>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Dino Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const jump = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsGameOver(false);
      setScore(0);
      setObstacles([]);
      return;
    }
    if (isJumping || isGameOver) return;
    setIsJumping(true);
    let velocity = 12;
    const gravity = 0.6;
    let currentY = 0;

    const jumpFrame = () => {
      currentY += velocity;
      velocity -= gravity;
      if (currentY <= 0) {
        setDinoY(0);
        setIsJumping(false);
        return;
      }
      setDinoY(currentY);
      requestAnimationFrame(jumpFrame);
    };
    requestAnimationFrame(jumpFrame);
  }, [isPlaying, isJumping, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const update = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = time - lastTimeRef.current;
        
        setScore(prev => prev + 1);

        setObstacles(prev => {
          const newObstacles = prev
            .map(obs => ({ ...obs, x: obs.x - 0.4 * deltaTime }))
            .filter(obs => obs.x > -50);

          if (newObstacles.length === 0 || (newObstacles[newObstacles.length - 1].x < 450 && Math.random() < 0.02)) {
            newObstacles.push({ id: Date.now(), x: 640 });
          }

          // Collision Detection
          for (const obs of newObstacles) {
            if (obs.x > 35 && obs.x < 75 && dinoY < 30) {
              setIsGameOver(true);
              setIsPlaying(false);
              setHighScore(current => Math.max(current, Math.floor(score / 10)));
            }
          }

          return newObstacles;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
    };
  }, [isPlaying, isGameOver, dinoY, score]);

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

  return (
    <div className="min-h-screen bg-[#F0EDE7] flex justify-center font-['Inter'] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F0EDE7]">
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
          z-index: 50;
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
      `}} />
      <div className="w-full max-w-[640px] custom-dashed-x relative min-h-screen bg-[#F0EDE7] flex flex-col font-['Inter']">
        
        {/* Header Section */}
        <div className="px-5 md:px-8 pt-12 md:pt-16 pb-6">
          <Avatar className="w-[80px] h-[80px] rounded-2xl mb-6">
            <AvatarImage src={profileImg} className="object-cover" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
            <div>
              <h1 className="text-[24px] font-semibold mb-0.5 tracking-tight text-[#1A1A1A]">Hey I'm Matt.</h1>
              <p className="text-[#7A736C] text-base">Product Designer</p>
            </div>
            <a 
              href="#" 
              className="text-[13px] font-medium flex items-center gap-1.5 border-b border-[#1A1A1A] pb-0.5 hover:opacity-70 transition-opacity w-fit group/download"
              onMouseEnter={() => downloadRef.current?.startAnimation()}
              onMouseLeave={() => downloadRef.current?.stopAnimation()}
            >
              Download resume <DownloadIcon ref={downloadRef} size={14} />
            </a>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Contact Section */}
        <div className="px-5 md:px-8 py-4 flex justify-between items-center">
          <a 
            href="mailto:matt@gmail.com" 
            className="flex items-center gap-2 text-base text-[#666666] hover:text-[#1A1A1A] transition-colors group"
            onMouseEnter={() => atSignRef.current?.startAnimation()}
            onMouseLeave={() => atSignRef.current?.stopAnimation()}
          >
            <AtSignIcon ref={atSignRef} size={18} className="transition-colors" />
            matt@gmail.com
          </a>
          <div className="flex items-center gap-5 text-[#1A1A1A]">
            <a href="#" className="hover:opacity-70 transition-opacity"><Dribbble className="w-4 h-4" /></a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Intro Section */}
        <div className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-4">Intro</h2>
          <p className="text-[#7A736C] leading-[1.7] text-base">
            I'm a Design Engineer focused on crafting meaningful digital experiences where design meets code. With a strong front-end development and UX design background, I build scalable UI systems and contribute to user-centered products from concept to deployment.
          </p>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Experience Section */}
        <div className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-4">Experience</h2>
          <div className="space-y-1">
            {experiences.map((exp, index) => (
              <div key={index} className="rounded-lg transition-colors hover:bg-black/[0.03] -mx-3 px-3">
                <button 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex justify-between items-center py-2.5 text-base group"
                >
                  <div className="flex items-center gap-3">
                    <motion.span 
                      animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                      className="text-[#888888] font-light text-lg leading-none mt-[1px] transition-colors group-hover:text-[#1A1A1A]"
                    >
                      +
                    </motion.span>
                    <span className="text-[#1A1A1A]">
                      <span className="text-[#7A736C]">{exp.year} / </span>
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[#7A736C] group-hover:text-[#1A1A1A] transition-colors">{exp.role}</span>
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
                          className="text-[#7A736C] text-[15px] leading-relaxed break-words whitespace-normal"
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
        </div>

        <div className="custom-dashed-t"></div>

        {/* Projects Section */}
        <div className="px-5 md:px-8 py-8 pb-16">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-4">Projects</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8">
            {/* Project 1 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project1} alt="Slate" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Slate</h3>
              <p className="text-base text-[#7A736C] leading-relaxed">
                A sleek and responsive landing page designed for modern startups to showcase their product.
              </p>
            </div>

            {/* Project 2 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project2} alt="Antimetal" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Antimetal</h3>
              <p className="text-base text-[#7A736C] leading-relaxed">
                A dynamic, animation-focused landing page highlighting creative transitions.
              </p>
            </div>

            {/* Project 3 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project3} alt="Financial Dashboard" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Slate</h3>
              <p className="text-base text-[#7A736C] leading-relaxed">
                A sleek and responsive landing page designed for modern startups to showcase their product.
              </p>
            </div>

            {/* Project 4 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project4} alt="TaskMaster" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Antimetal</h3>
              <p className="text-base text-[#7A736C] leading-relaxed">
                A dynamic, animation-focused landing page highlighting creative transitions.
              </p>
            </div>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Recommendations Section */}
        <div className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">Recommendations</h2>
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
              <div key={i} className="bg-white rounded-[16px] border border-black/5 drop-shadow-sm overflow-hidden group">
                <div className="flex justify-between items-center px-6 py-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium text-base text-[#1A1A1A] mb-1">{rec.name}</h3>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-black transition-colors duration-200 hover:text-[#0077B5] cursor-pointer" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="text-[13px] text-[#7A736C]">{rec.role}</span>
                    </div>
                  </div>
                  <Avatar className="w-[80px] h-[80px] rounded-none -mr-6 -my-4 transition-all duration-700">
                    <AvatarImage src={rec.image} className="object-cover" />
                    <AvatarFallback>{rec.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="p-1">
                  <div className="border border-dashed border-[#E5D7C4] rounded-[12px] p-6">
                    <p className="text-[#7A736C] text-sm md:text-[15px] leading-relaxed">
                      {rec.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* My Story Section */}
        <div className="px-5 md:px-8 py-8 pb-16">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">My Story</h2>
          
          <div className="relative mb-8 h-56 flex items-center justify-center">
            <motion.div 
              initial={{ rotate: -8, x: -120, y: 0 }}
              whileHover={{ rotate: -2, scale: 1.1, zIndex: 50 }}
              className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg z-0"
            >
              <img src={story1} alt="My workspace" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: 12, x: -40, y: 15 }}
              whileHover={{ rotate: 5, scale: 1.1, zIndex: 50 }}
              className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-white shadow-lg z-10"
            >
              <img src={story2} alt="Designing" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: -5, x: 40, y: -10 }}
              whileHover={{ rotate: 0, scale: 1.1, zIndex: 50 }}
              className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg z-20"
            >
              <img src={story3} alt="Coffee and notes" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ rotate: 8, x: 120, y: 20 }}
              whileHover={{ rotate: 3, scale: 1.1, zIndex: 50 }}
              className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-white shadow-lg z-30"
            >
              <img src={story4} alt="Creative studio" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="space-y-6 text-[#7A736C] text-base leading-[1.7]">
            <p>
              I'm David Simmons, a passionate digital designer and no-code developer who bridges creativity with technology. Currently exploring new ways to craft meaningful digital experiences, I'm driven by curiosity and a love for clean, purposeful design.
            </p>
            <p>
              I thrive on transforming ideas into reality — whether it's shaping intuitive interfaces, crafting distinctive brand identities, designing immersive visuals, or building websites that feel effortless to use.
            </p>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Stack Section */}
        <div className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">Stack</h2>
          <div className="flex flex-wrap gap-6 items-center">
            {[
              { name: "Figma", icon: "/tools/image 4.png" },
              { name: "Notion", icon: "/tools/image 5.png" },
              { name: "Raycast", icon: "/tools/image 6.png" },
              { name: "Framer", icon: "/tools/image 7.png" },
              { name: "Linear", icon: "/tools/image 8.png" },
              { name: "Slack", icon: "/tools/image 9.png" },
              { name: "Arc", icon: "/tools/image 10.png" },
            ].map((tool, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Contact Section (Grid) */}
        <div className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-4 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
              <span className="text-[#1A1A1A] font-medium text-sm">Copy mail</span>
              <AtSignIcon size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-4 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
              <span className="text-[#1A1A1A] font-medium text-sm">Copy phone</span>
              <Phone size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {[
              { name: "Linkedin", icon: Linkedin },
              { name: "Dribbble", icon: Dribbble },
              { name: "X", icon: Twitter },
              { name: "Medium", icon: Globe },
            ].map((social, i) => (
              <Button key={i} variant="outline" size="sm" className="flex items-center justify-between px-4 py-4 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
                <span className="text-[#1A1A1A] font-medium text-sm">{social.name}</span>
                <social.icon size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full flex items-center justify-between px-4 py-4 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
            <span className="text-[#1A1A1A] font-medium text-sm">View resume</span>
            <FileText size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
          </Button>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Dino Game Section */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden border-b border-[#E5D7C4]/50">
          <div className="absolute top-6 left-8 right-8 flex justify-between z-10 font-['DM_Mono'] text-[10px] uppercase tracking-widest text-[#463B34]/60 pointer-events-none">
            <span>{isGameOver ? "Game Over" : isPlaying ? "Playing" : "Tap to play"}</span>
            <div className="flex gap-4">
              <span>HI {String(highScore).padStart(5, '0')}</span>
              <span>{String(Math.floor(score / 10)).padStart(5, '0')}</span>
            </div>
          </div>
          
          <div 
            ref={gameRef}
            onClick={jump}
            className="w-full h-48 relative flex items-end overflow-hidden cursor-pointer select-none bg-black/[0.015] transition-colors hover:bg-black/[0.025]"
          >
            {/* Ground Line */}
            <div className="absolute bottom-12 left-0 w-full h-[1px] bg-[#E5D7C4]"></div>
            
            {/* Dino */}
            <motion.div 
              animate={{ y: -dinoY - 48 }}
              transition={{ type: "just" }}
              className="absolute left-12 bottom-0 mb-[-2px] z-20"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path d="M22 10H20V8H18V6H12V8H10V10H8V12H6V14H4V18H6V20H8V22H10V20H14V18H16V16H18V14H20V12H22V10Z" fill="#535353"/>
                <path d="M12 10H14V12H12V10Z" fill="white"/>
                {isPlaying && !isJumping && (
                  <motion.path 
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    d="M10 20H12V22H10V20ZM14 20H16V22H14V20Z" 
                    fill="#F0EDE7"
                  />
                )}
              </svg>
            </motion.div>

            {/* Obstacles */}
            {obstacles.map(obs => (
              <div 
                key={obs.id}
                className="absolute bottom-12 mb-[-2px] z-10"
                style={{ left: `${obs.x}px` }}
              >
                <svg width="24" height="36" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 30H12V0H8V30Z" fill="#535353"/>
                  <path d="M4 10H8V14H4V10Z" fill="#535353"/>
                  <path d="M12 5H16V9H12V5Z" fill="#535353"/>
                </svg>
              </div>
            ))}

            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E5D7C4]/30 to-transparent -translate-y-12"></div>

            {isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F0EDE7]/40 backdrop-blur-[2px] z-30">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-black/5 shadow-xl flex flex-col items-center gap-2"
                >
                  <span className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-[0.2em]">Game Over</span>
                  <div className="flex flex-col items-center group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#535353] mb-1 transition-transform group-hover:rotate-180 duration-500">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span className="text-[9px] font-medium text-[#7A736C] uppercase tracking-widest">Tap to Restart</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}