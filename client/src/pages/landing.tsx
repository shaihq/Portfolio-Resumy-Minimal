import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import project1 from "@/assets/images/project1.png";

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

const itemVariants: Variants = {
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
      ease: [0.21, 0.47, 0.32, 0.98] as any,
    },
  },
};

export default function Landing() {
  return (
    <>
      <Navbar />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#F0EDE7] dark:bg-[#1A1A1A] flex justify-center font-['Inter'] text-[#1A1A1A] dark:text-[#F0EDE7] selection:bg-[#1A1A1A] dark:selection:bg-[#F0EDE7] selection:text-[#F0EDE7] dark:selection:text-[#1A1A1A] transition-colors duration-700 pt-24 pb-24"
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
        `}} />
        
        <div className="w-full max-w-[640px] relative min-h-screen flex flex-col font-['Inter'] transition-colors duration-700 bg-[#F0EDE7] dark:bg-[#1A1A1A] custom-dashed-x">
          
          {/* Main Content */}
          <motion.div variants={itemVariants} className="px-5 md:px-8 py-10 md:py-16 flex flex-col items-start relative">
            <div className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">
              25000+ USERS
            </div>
            
            <h1 className="text-[24px] font-semibold tracking-tight mb-4 text-[#1A1A1A] dark:text-[#F0EDE7]">
              Fastest way to build your portfolio site
            </h1>
            
            <p className="text-[#7A736C] dark:text-[#B5AFA5] text-base mb-8 max-w-[480px]" style={{ fontWeight: 450 }}>
              Skip the busywork with Designfolio — publish in hours, not weeks.
            </p>
            
            <Button className="rounded-full bg-[#1A1A1A] hover:bg-[#333] text-white dark:bg-white dark:hover:bg-[#E5E5E5] dark:text-[#1A1A1A] px-5 h-10 text-[14px] font-medium flex items-center gap-2 shadow-sm mb-12">
              Get started for Free
              <span className="bg-white text-black dark:bg-[#1A1A1A] dark:text-white rounded-full p-0.5 ml-1">
                <ArrowRight size={12} strokeWidth={2.5} />
              </span>
            </Button>

            <div className="w-full relative rounded-[20px] overflow-hidden shadow-sm border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 p-2">
              <img 
                src={project1} 
                alt="Dashboard preview" 
                className="w-full rounded-[14px] object-cover border border-black/5 dark:border-white/5"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

          <motion.div variants={itemVariants} className="px-5 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
            <p className="text-[14px] leading-tight text-[#7A736C] dark:text-[#B5AFA5] font-medium max-w-[120px]">
              Trusted by folks working at
            </p>
            <div className="flex flex-1 items-center justify-between sm:justify-end gap-6 sm:gap-8 opacity-50 grayscale filter flex-wrap">
              <span className="font-bold text-[18px] tracking-tighter text-[#1A1A1A] dark:text-[#F0EDE7]">Google</span>
              <span className="font-bold text-[18px] text-[#1A1A1A] dark:text-[#F0EDE7]">Apple</span>
              <span className="font-bold text-[18px] tracking-tight text-[#1A1A1A] dark:text-[#F0EDE7]">amazon</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

          {/* Testimonial */}
          <motion.div variants={itemVariants} className="px-5 md:px-8 py-12 relative bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/images/recommender-1.jpg" 
                alt="Ishita Chaudhary" 
                className="w-12 h-12 rounded-full object-cover border border-black/10 dark:border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?u=ishita";
                }}
              />
              <div>
                <h3 className="font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] text-[15px]">Ishita Chaudhary</h3>
                <p className="text-[14px] text-[#7A736C] dark:text-[#B5AFA5]">Product & Business @ Cisco</p>
              </div>
            </div>
            <p className="text-[#1A1A1A] dark:text-[#F0EDE7] leading-[1.7] text-[17px]" style={{ fontWeight: 450 }}>
              "I was procrastinating on building my portfolio for a year, but Designfolio
              completely changed that — it helped me go from Word/Figma case studies to
              a live website in just 20 minutes."
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

          {/* Feature 1 */}
          <motion.div variants={itemVariants} className="px-5 md:px-8 py-12 relative">
            <h2 className="text-[14px] font-bold text-[#463B34] dark:text-[#D4C9BC] font-['DM_Mono'] uppercase tracking-widest mb-6">
              1 / Choose a template
            </h2>
            <div className="w-full relative rounded-[20px] overflow-hidden shadow-sm border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#2A2520]/50 p-3 pb-0">
              <img 
                src={project1} 
                alt="Choose template" 
                className="w-full rounded-t-[14px] object-cover shadow-sm border border-black/5 dark:border-white/5"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="custom-dashed-t"></motion.div>

        </div>
      </motion.div>
    </>
  );
}
