import { useEffect, useState, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronLeft, Phone } from "lucide-react";
import { CaseStudyEditor } from "@/components/case-study-editor";
import { SectionManager } from "@/components/section-manager";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { AtSignIcon } from "lucide-animated";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTemplate } from "@/hooks/use-template";
import profileImg from "@/assets/images/profile.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";
import slateImage from "@assets/image_1772894732476.png";
import contentImage from "@assets/image_1772895554431.png";

const projectsData: Record<string, any> = {
  slate: {
    id: "slate",
    title: "Redesigning Quote Builder at Freshworks for 1,900+ Enterprise Users",
    subtitle: "Focused on enhancing the experience for customers in the U.S.",
    description: "Focused on enhancing the experience for customers in the U.S.",
    image: slateImage,
    details: {
      client: "Startup Co.",
      role: "Lead Designer",
      industry: "SaaS",
      platform: "Web app"
    },
    introduction: "Freshsales, part of the Freshworks family, is a CRM designed to help sales teams manage leads, track deals, and close more business with less effort. It offers tools like email tracking, deal pipelines, and AI-powered insights, all aimed at making the sales process smoother and more efficient.\n\nIn this project, I'm redesigning the quote builder experience. The focus is on making it simpler and more intuitive for users to create and share quotes effortlessly. It's a meaningful update to a feature that's central to the sales workflow.",
    examples: []
  },
  antimetal: {
    id: "antimetal",
    title: "Antimetal",
    subtitle: "A dynamic, animation-focused landing page highlighting creative transitions",
    description: "Focused on enhancing creative visual experiences for animation enthusiasts.",
    image: project2,
    details: {
      client: "Creative Studio",
      role: "Design Director",
      industry: "Entertainment",
      platform: "Web app"
    },
    introduction: "Antimetal pushes the boundaries of digital design through bold, carefully-crafted animations. This project demonstrates how motion design can tell a story and create memorable user experiences. Every animation serves a purpose, contributing to the overall narrative.",
    examples: [
      {
        title: "Motion Design",
        description: "Custom animations bring the interface to life, creating a sense of fluidity and elegance. Each transition is orchestrated to feel natural while maintaining visual interest."
      },
      {
        title: "Visual Storytelling",
        description: "The design hierarchy uses motion to guide users through content progressively, making complex information feel approachable and engaging."
      }
    ]
  }
};

export default function Project() {
  const [match, params] = useRoute("/project/:id");
  const [, navigate] = useLocation();
  const { activeTemplate } = useTemplate();
  const [isProjectPasswordEnabled, setIsProjectPasswordEnabled] = useState(false);
  const [heroView, setHeroView] = useState<'immersive' | 'editorial'>('immersive');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], ["0%", "30%"]);

  const projectId = (params?.id as string)?.toLowerCase();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!match) {
    return null;
  }

  const project = projectsData[projectId] || projectsData.slate;

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

  const itemVariants: any = {
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

  if (activeTemplate === "Chatfolio") {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A8CFF] selection:text-white transition-colors duration-700"
      >
        <div className="w-full max-w-2xl bg-[#F0EDE7] dark:bg-[#1A1A1A] flex flex-col min-h-screen relative pt-8 pb-24 px-4 sm:px-6">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6 pt-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group"
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </button>
          </motion.div>

          <div className="space-y-6">
            {/* Main Project Intro & Image Message */}
            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%] pt-4">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                 <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] p-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full flex flex-col gap-4">
                  <div className="flex flex-col text-left px-1">
                    <h1 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">{project.title}</h1>
                    <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed max-w-md">
                      {project.subtitle}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5F5F5] dark:bg-[#1A1A1A] relative border border-black/5 dark:border-white/5">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* You Message */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <div className="flex flex-col gap-1 max-w-[85%] items-end">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] mr-1 font-medium">You</span>
                <div className="bg-[#1A8CFF] dark:bg-[#0073E6] text-white px-4 py-3 rounded-2xl rounded-br-sm text-[15px] leading-relaxed shadow-sm">
                  Can you share more details about this project?
                </div>
              </div>
            </motion.div>

            {/* Details Message */}
            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                 <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] px-5 py-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full">
                  <p className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] mb-4">Sure! Here are the core details:</p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    {Object.entries(project.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wide">{key}</span>
                        <span className="text-[14px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* You Message */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <div className="flex flex-col gap-1 max-w-[85%] items-end">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] mr-1 font-medium">You</span>
                <div className="bg-[#1A8CFF] dark:bg-[#0073E6] text-white px-4 py-3 rounded-2xl rounded-br-sm text-[15px] leading-relaxed shadow-sm">
                  What was the process like?
                </div>
              </div>
            </motion.div>

            {/* Overview Message */}
            <motion.div variants={itemVariants} className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto border border-black/5 dark:border-white/5">
                 <img src={profileImg} alt="Matt" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[11px] text-[#7A736C] dark:text-[#B5AFA5] ml-1 font-medium">Matt</span>
                <div className="bg-[#E5E2DB] dark:bg-[#2A2520] p-4 rounded-2xl rounded-bl-sm transition-colors duration-700 border border-black/5 dark:border-white/5 w-full flex flex-col gap-5">
                  <div className="px-1 space-y-4">
                    {project.introduction.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="w-full rounded-xl overflow-hidden bg-[#E7E3D9] dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5">
                    <img 
                      src={contentImage} 
                      alt="Project context"
                      className="w-full h-auto mix-blend-multiply dark:mix-blend-normal opacity-90"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call to action */}
            <motion.div variants={itemVariants} className="flex justify-center mt-12 mb-8">
              <Button onClick={() => navigate("/")} className="rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-200 h-12 px-8 shadow-sm">
                Back to Projects
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (activeTemplate === "Professional") {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#E37941] selection:text-white transition-colors duration-700"
      >
        <div className="w-full max-w-[750px] relative min-h-screen bg-[#EFECE6] dark:bg-[#1A1A1A] flex flex-col transition-colors duration-700 border-x border-[#D5D0C6] dark:border-[#3A352E]">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="border-b border-[#D5D0C6] dark:border-[#3A352E] flex justify-between items-center px-4 py-3 font-['JetBrains_Mono'] text-[13px] uppercase tracking-wide text-[#1A1A1A] dark:text-[#B5AFA5] bg-[#EFECE6] dark:bg-[#1A1A1A] sticky top-0 z-50">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:text-[#E37941] transition-colors"
            >
              <ChevronLeft size={16} /> BACK
            </button>
            <div className="tracking-wider">PROJECT / {project.id}</div>
          </motion.div>

          <div className="p-4 md:p-6 space-y-10 pb-16">
            {/* Title */}
            <motion.div variants={itemVariants}>
              <h1 className="font-['JetBrains_Mono'] text-[22px] md:text-[28px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-[1.2] mb-4 uppercase tracking-tight">{project.title}</h1>
              <p className="font-['JetBrains_Mono'] text-[#7A736C] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                {project.subtitle}
              </p>
            </motion.div>

            {/* Hero Image */}
            <motion.div variants={itemVariants} className="relative flex flex-col border-[16px] md:border-[20px] border-t-[#EBE7E0] border-r-[#DCD7CD] border-b-[#D2CDC2] border-l-[#E4DFD7] dark:border-t-[#2A2520] dark:border-r-[#1A1A1A] dark:border-b-[#12100E] dark:border-l-[#221F1B]">
              <div className="absolute inset-[-16px] md:inset-[-20px] border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none"></div>
              <div className="absolute inset-0 border border-[#D5D0C6] dark:border-[#3A352E] pointer-events-none z-30"></div>
              <div className="bg-gradient-to-br from-[#D2CEC8] to-[#A8A49D] dark:from-[#3A352E] dark:to-[#1A1A1A] p-4 md:p-5 relative overflow-hidden">
                <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                <div className="absolute bottom-2.5 left-2.5 md:bottom-3 md:left-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                <div className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 w-2 h-2 z-20 rounded-full bg-gradient-to-br from-[#F5F3EF] to-[#D0CCC5] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),1px_1px_2px_rgba(0,0,0,0.2)] dark:from-[#5A554E] dark:to-[#2A2520]"></div>
                <div className="w-full aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            {/* Details Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-[#D5D0C6] dark:border-[#3A352E] py-6">
              {Object.entries(project.details).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-['JetBrains_Mono'] text-[11px] text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wider mb-2">{key}</h4>
                  <p className="font-['JetBrains_Mono'] text-[13px] text-[#1A1A1A] dark:text-[#F0EDE7] uppercase">{value as string}</p>
                </div>
              ))}
            </motion.div>

            {/* Introduction */}
            <motion.div variants={itemVariants}>
              <h3 className="font-['JetBrains_Mono'] text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] font-semibold mb-6 uppercase tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 bg-[#E37941]"></span> Overview
              </h3>
              <div className="space-y-6">
                {project.introduction.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="font-['Inter'] text-[#1A1A1A] dark:text-[#B5AFA5] text-[15px] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Content Image */}
            <motion.div variants={itemVariants} className="border border-[#D5D0C6] dark:border-[#3A352E] p-3 bg-[#DED9CE] dark:bg-[#2A2520]">
              <div className="border border-[#D5D0C6] dark:border-[#3A352E] relative overflow-hidden">
                <img 
                  src={contentImage} 
                  alt="Project details"
                  className="w-full mix-blend-multiply dark:mix-blend-normal opacity-90 grayscale-[0.2]"
                  style={{ filter: "contrast(1.1)" }}
                />
              </div>
            </motion.div>
            
            {/* Footer nav */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-[#D5D0C6] dark:border-[#3A352E] flex justify-between items-center">
               <button onClick={() => navigate("/")} className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-wide text-[#1A1A1A] dark:text-[#F0EDE7] hover:text-[#E37941] dark:hover:text-[#E37941] transition-colors flex items-center gap-2">
                 <ChevronLeft size={16} /> All Projects
               </button>
            </motion.div>

          </div>
        </div>
      </motion.div>
    );
  }

  if (activeTemplate === "Creative") {
    return (
      <div className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#E8CF82] selection:text-[#1A1A1A] transition-colors duration-700 p-4 md:p-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-[750px] flex flex-col gap-3 pb-20 pt-0"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[20px] border border-[#E5D7C4] dark:border-white/10 py-2 px-4 flex justify-between items-center w-full">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group"
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </button>
            <div className="flex items-center gap-4">
              <div className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] opacity-50 hidden sm:block">PROJECT / {project.id}</div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A] dark:text-[#F0EDE7] transition-all focus-visible:ring-0 focus-visible:ring-offset-0" title="Lock Case Study">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="w-[320px] p-4 bg-white/95 dark:bg-[#2A2520]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-xl z-50">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Label className="text-[14px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] cursor-pointer">Protect Project</Label>
                          <p className="text-[12px] text-[#7A736C] dark:text-[#9E9893] leading-snug">Require a password to view this project (e.g., for NDAs).</p>
                        </div>
                        <Switch 
                          checked={isProjectPasswordEnabled} 
                          onCheckedChange={setIsProjectPasswordEnabled} 
                          className="mt-0.5 data-[state=checked]:bg-[#1A1A1A] dark:data-[state=checked]:bg-[#F0EDE7]"
                        />
                      </div>
                      <AnimatePresence>
                        {isProjectPasswordEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div>
                              <Input 
                                id="proj-password" 
                                type="password"
                                placeholder="Enter password" 
                                className="h-10 bg-black/[0.03] dark:bg-white/[0.03] border-transparent rounded-xl text-[14px] text-[#1A1A1A] dark:text-[#F0EDE7] focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:border-black/20 dark:focus-visible:border-white/20 transition-all px-3.5 shadow-none placeholder:text-black/30 dark:placeholder:text-white/30" 
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="h-7 text-[12px] rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A] dark:text-[#F0EDE7] flex items-center gap-1.5 px-3 transition-all focus-visible:ring-0 focus-visible:ring-offset-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Analyze with AI
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Project Header & Featured Image */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-2 md:p-3 w-full">
            <div className="p-5 md:p-6 pb-7 md:pb-10">
              <h1 className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] tracking-tight leading-tight mb-5">{project.title}</h1>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[16px] leading-relaxed max-w-[600px]">
                {project.subtitle}
              </p>
            </div>
            <div className="w-full rounded-[20px] overflow-hidden bg-[#F5F5F5] dark:bg-[#1A1A1A]">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-9 w-full">
            <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-8" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>PROJECT DETAILS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(project.details).map(([key, value]) => {
                const isEditable = key === 'industry' || key === 'platform';
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <span className="text-[12px] font-medium text-[#7A736C] dark:text-[#9E9893] uppercase tracking-wide">{key}</span>
                    {isEditable ? (
                      <input 
                        type="text" 
                        placeholder="Type here..." 
                        defaultValue="" 
                        className="text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] bg-transparent border-none p-0 focus:ring-0 placeholder:text-black/20 dark:placeholder:text-white/20 placeholder:italic w-full outline-none"
                      />
                    ) : (
                      <span className="text-[15px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7]">{value as string}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-9 w-full">
            <h2 className="text-[#7A736C] dark:text-[#B5AFA5] text-xs font-mono mb-8" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '500' }}>OVERVIEW</h2>
            <div className="space-y-6 max-w-3xl">
              {project.introduction.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="text-[#1A1A1A] dark:text-[#F0EDE7] text-[16px] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Content Visual */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-2 md:p-3 w-full">
            <div className="w-full rounded-[20px] overflow-hidden bg-[#E7E3D9] dark:bg-[#2A2520]">
              <img 
                src={contentImage} 
                alt="Project context"
                className="w-full mix-blend-multiply dark:mix-blend-normal opacity-90"
              />
            </div>
          </motion.div>

          {/* Next Steps / Contact CTA */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#2A2520]/80 backdrop-blur-md rounded-[26px] border border-[#E5D7C4] dark:border-white/10 p-7 md:p-10 w-full text-center flex flex-col items-center">
            <h2 className="text-[24px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-8">Let's build something great.</h2>
            <div className="flex gap-5">
              <Button variant="outline" className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#2A2520] hover:bg-gray-50 dark:hover:bg-[#35302A] h-12 px-6">
                Copy Email
              </Button>
              <Button onClick={() => navigate("/")} className="rounded-xl bg-[#1A1A1A] text-white hover:bg-[#333] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-200 h-12 px-6">
                Back to Home
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A1A1A] dark:selection:bg-[#F0EDE7] selection:text-[#F0EDE7] dark:selection:text-[#1A1A1A] transition-colors duration-700"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
      `}} />

      {/* ── SHARED: view toggle pill (reused in both layouts) ── */}
      {/* rendered inside each nav */}

      <AnimatePresence mode="wait">
      {heroView === 'immersive' ? (
        <motion.div key="immersive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          {/* ── IMMERSIVE HERO ── */}
          <div ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: '92vh' }}>
            <motion.img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ y: heroImageY, height: "130%", top: "-15%" }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "url('/backgrounds/grainsnow.avif')", backgroundSize: "200px 200px", backgroundRepeat: "repeat" }}
            />

            {/* Nav */}
            <div className="relative z-10 flex justify-center pt-7">
              <div className="w-full max-w-[1100px] px-6 md:px-12 flex items-center justify-between">
                <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition-colors group">
                  <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  Go Back
                </button>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-5 text-[13px] font-medium text-white/80">
                    <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Work</button>
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <span className="text-[10px]">✦</span> Resume
                    </button>
                  </div>
                  {/* Toggle */}
                  <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-lg p-1 ml-2">
                    <button
                      onClick={() => setHeroView('immersive')}
                      title="Immersive view"
                      className="w-7 h-7 rounded-md flex items-center justify-center transition-all bg-white/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="12" rx="1.5" fill="white" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setHeroView('editorial')}
                      title="Editorial view"
                      className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="5" rx="1" fill="white" fillOpacity="0.5" />
                        <rect x="1" y="8" width="7" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" />
                        <rect x="1" y="11" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: title + metadata */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-10">
              <div className="w-full max-w-[1100px] px-6 md:px-12">
                <h1 className="text-[36px] md:text-[52px] font-bold text-white leading-[1.05] tracking-[-0.02em] mb-8 w-full">
                  {project.title}
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Role</span>
                    <span className="text-[15px] font-semibold text-white leading-snug">{project.details.client}</span>
                    <span className="text-[14px] text-white/75">{project.details.role}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Timeline</span>
                    <span className="text-[15px] font-semibold text-white leading-snug">{project.details.industry}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Tools</span>
                    <span className="text-[15px] font-semibold text-white leading-snug">{project.details.platform}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Team</span>
                    <span className="text-[15px] font-semibold text-white leading-snug">Designer: Me</span>
                    <span className="text-[14px] text-white/75">Collaborators: PMs, Devs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="editorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          {/* ── EDITORIAL HEADER ── */}

          {/* Sticky nav */}
          <div className="sticky top-0 z-50 flex justify-center bg-[#F0EDE7]/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
            <div className="w-full max-w-[880px] px-6 md:px-10 flex items-center justify-between py-4">
              <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors group">
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Go Back
              </button>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-5 text-[13px] font-medium text-[#7A736C] dark:text-[#9E9893]">
                  <button onClick={() => navigate("/")} className="hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors">Work</button>
                  <button className="flex items-center gap-1 hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] transition-colors">
                    <span className="text-[10px]">✦</span> Resume
                  </button>
                </div>
                {/* Toggle */}
                <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 rounded-lg p-1 ml-2">
                  <button
                    onClick={() => setHeroView('immersive')}
                    title="Immersive view"
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="1.5" fill="currentColor" className="text-[#7A736C] dark:text-[#9E9893]" fillOpacity="0.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setHeroView('editorial')}
                    title="Editorial view"
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all bg-white dark:bg-[#2A2520] shadow-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="5" rx="1" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" />
                      <rect x="1" y="8" width="7" height="1.5" rx="0.75" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" fillOpacity="0.4" />
                      <rect x="1" y="11" width="5" height="1.5" rx="0.75" fill="#1A1A1A" className="dark:fill-[#F0EDE7]" fillOpacity="0.4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial header content */}
          <div className="w-full max-w-[880px] mx-auto px-6 md:px-10">
            {/* Title block */}
            <div className="pt-14 pb-10">
              <h1 className="text-[38px] md:text-[52px] font-bold text-[#1A1A1A] dark:text-[#F0EDE7] leading-[1.05] tracking-[-0.02em] mb-5">
                <motion.span
                  className="inline"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                  }}
                >
                  {project.title.split(" ").map((word: string, i: number) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.25em]"
                      variants={{
                        hidden: { opacity: 0, filter: "blur(12px)", y: 6 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
              <p className="text-[#7A736C] dark:text-[#B5AFA5] text-[18px] leading-relaxed max-w-2xl" style={{ fontWeight: 450 }}>
                {project.subtitle}
              </p>
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 pb-12">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest">Role</span>
                <span className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">{project.details.client}</span>
                <span className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5]">{project.details.role}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest">Timeline</span>
                <span className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">{project.details.industry}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest">Tools</span>
                <span className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">{project.details.platform}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-widest">Team</span>
                <span className="text-[15px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] leading-snug">Designer: Me</span>
                <span className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5]">Collaborators: PMs, Devs</span>
              </div>
            </div>
          </div>

          {/* Full-width thumbnail */}
          <motion.div
            className="w-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full object-cover"
              style={{ maxHeight: '70vh' }}
            />
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* ── BODY (shared between both views) ── */}
      <div className="w-full max-w-[880px] mx-auto flex flex-col font-['Inter'] pl-10">

        {/* Sections */}
        <SectionManager projectId={project.id} />

        {/* Contact CTA / Footer */}
        <motion.div variants={itemVariants} className="px-6 md:px-10 py-8 flex flex-col items-center text-center">
          <h1 className="text-[23px] font-['Cedarville_Cursive'] text-[#1A1A1A] dark:text-[#F0EDE7] mb-2">Mike Starves</h1>
          <p className="text-[#1A1A1A] dark:text-[#F0EDE7] mb-4 text-[28px] font-semibold max-w-sm leading-tight">Got a project in mind or just curious? Let's talk.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2A2520] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto hover:cursor-pointer border-0">
              <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy mail</span>
              <AtSignIcon size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2A2520] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#35302A] transition-colors group h-auto hover:cursor-pointer border-0">
              <span className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium text-sm">Copy phone</span>
              <Phone size={14} className="text-[#7A736C] dark:text-[#9E9893] group-hover:text-[#1A1A1A] dark:group-hover:text-[#F0EDE7]" />
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="px-6 md:px-10 py-5 text-center">
          <p className="text-[12px] text-[#7A736C] dark:text-[#9E9893]" style={{ fontWeight: 450 }}>© ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
