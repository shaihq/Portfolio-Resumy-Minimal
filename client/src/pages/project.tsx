import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { AtSignIcon } from "lucide-animated";
import { Button } from "@/components/ui/button";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";
import slateImage from "@assets/image_1772894732476.png";

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
    introduction: "Slate represents a modern approach to landing page design. Part of the design systems family, Slate is built to help early-stage companies present their products with clarity and impact. It offers clean layouts, intuitive navigation, and customizable components aimed at making the product experience smoother and more efficient.",
    examples: [
      {
        title: "Responsive Design",
        description: "The design adapts seamlessly across all devices, ensuring a consistent experience whether viewed on desktop, tablet, or mobile. Every breakpoint has been carefully considered to maintain visual hierarchy and usability."
      },
      {
        title: "Interactive Elements",
        description: "Smooth transitions and micro-interactions guide users through the product, making the experience feel thoughtful and intentional. Animation is used purposefully to enhance, not distract."
      }
    ]
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F0EDE7] flex justify-center font-['Inter'] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F0EDE7]"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
      `}} />
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
        
        {/* Header */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 pt-8 pb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A736C] hover:text-[#1A1A1A] transition-colors group"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Go back
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Project Title & Intro */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 pt-8 pb-6">
          <h1 className="text-[24px] font-semibold mb-3 tracking-tight text-[#1A1A1A]">{project.title}</h1>
          <p className="text-[#7A736C] text-base mb-4">{project.subtitle}</p>
        </motion.div>

        {/* Featured Image */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 pb-4">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full rounded-xl overflow-hidden drop-shadow-sm border border-black/5"
          />
        </motion.div>

        {/* Project Details */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-5">
          <div className="flex items-center gap-2 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#463B34]">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest">Project Details</h2>
          </div>
          <div className="border border-[#C8C4BD] rounded-lg overflow-hidden bg-[#E7E3D9]">
            {Object.entries(project.details).map(([key, value], index) => (
              <div key={key} className={`flex justify-between items-center px-4 py-3 ${index !== Object.entries(project.details).length - 1 ? 'border-b border-[#C8C4BD]' : ''}`}>
                <span className="text-[12px] font-medium text-[#463B34] uppercase tracking-wide">{key}</span>
                <span className="text-base text-[#7A736C]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-4">Introduction</h2>
          <p className="text-[#7A736C] leading-[1.7] text-base">
            {project.introduction}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Examples */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">Examples</h2>
          <div className="space-y-6">
            {project.examples.map((example: any, index: number) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-base text-[#1A1A1A]">{example.title}</h3>
                <p className="text-[#7A736C] text-base leading-relaxed">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Contact CTA / Footer */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-5 flex flex-col items-center text-center">
          <h1 className="text-[23px] font-['Cedarville_Cursive'] text-[#1A1A1A] mb-2">Mike Starves</h1>
          <p className="text-[#1A1A1A] mb-4 text-[24px] font-semibold max-w-sm leading-tight">Got a project in mind or just curious? Let's talk.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
              <span className="text-[#1A1A1A] font-medium text-sm">Copy mail</span>
              <AtSignIcon size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors group h-auto">
              <span className="text-[#1A1A1A] font-medium text-sm">Copy phone</span>
              <Phone size={14} className="text-[#7A736C] group-hover:text-[#1A1A1A]" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-4 text-center">
          <p className="text-[12px] text-[#7A736C]">© ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
