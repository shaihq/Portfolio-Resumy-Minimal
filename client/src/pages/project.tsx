import { useRoute, useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";

const projectsData: Record<string, any> = {
  slate: {
    id: "slate",
    title: "Slate",
    subtitle: "A sleek and responsive landing page designed for modern startups",
    description: "Focused on enhancing the experience for customers in the U.X.",
    image: project1,
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

  if (!match) {
    return null;
  }

  const projectId = (params?.id as string)?.toLowerCase();
  const project = projectsData[projectId] || projectsData.slate;

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

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
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8">
          <h1 className="text-[28px] font-semibold mb-2 tracking-tight text-[#1A1A1A]">{project.title}</h1>
          <p className="text-[#7A736C] text-base mb-4">{project.subtitle}</p>
          <p className="text-[13px] text-[#7A736C]">{project.description}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Featured Image */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full rounded-xl overflow-hidden drop-shadow-sm border border-black/5"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        {/* Project Details */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-8">
          <h2 className="text-[11px] font-bold text-[#463B34] font-['DM_Mono'] uppercase tracking-widest mb-6">Project Details</h2>
          <div className="space-y-4">
            {Object.entries(project.details).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start py-2 border-b border-[#E5D7C4]/50">
                <span className="text-[12px] font-medium text-[#463B34] uppercase tracking-wide">{key}</span>
                <span className="text-base text-[#1A1A1A]">{value}</span>
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

        {/* Contact CTA */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-12 flex flex-col items-center text-center">
          <h2 className="text-[20px] font-semibold mb-2 text-[#1A1A1A]">More stories.</h2>
          <p className="text-[#7A736C] mb-6 text-base">Got a project in mind or just curious? Let's talk.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-2 text-[13px] font-medium text-[#1A1A1A] border border-[#1A1A1A] rounded-lg hover:bg-[#1A1A1A] hover:text-[#F0EDE7] transition-colors">
              Copy mail
            </button>
            <button className="px-6 py-2 text-[13px] font-medium text-[#1A1A1A] border border-[#1A1A1A] rounded-lg hover:bg-[#1A1A1A] hover:text-[#F0EDE7] transition-colors">
              Copy phone
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-6 text-center border-t border-[#E5D7C4]/50">
          <p className="text-[12px] text-[#7A736C]">© ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
