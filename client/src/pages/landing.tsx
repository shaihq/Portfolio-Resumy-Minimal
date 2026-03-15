import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { FaAmazon, FaMicrosoft } from "react-icons/fa";
import mockupImg from "@assets/image_1773592268278.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1D1B1A] font-sans antialiased overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#FDFCF8]/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-[13px] font-semibold tracking-wide text-[#1D1B1A]/70 uppercase">
            25000+ USERS
          </div>
          <Button variant="outline" className="rounded-full px-5 h-8 text-[13px] font-medium border-black/10 hover:bg-black/5 bg-transparent text-[#1D1B1A]">
            Login
          </Button>
        </div>
      </header>

      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[40px] md:text-[56px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#1D1B1A] max-w-2xl mb-6"
          >
            Fastest way to build<br />your portfolio site
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[17px] text-[#1D1B1A]/70 mb-10 max-w-xl font-medium"
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
        <section className="w-full max-w-[900px] mx-auto px-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative rounded-[24px] overflow-hidden shadow-2xl border border-black/10 bg-black"
          >
            {/* The cropped actual mockup image centered on the interface */}
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '65%' }}>
              <img 
                src={mockupImg} 
                alt="Product Interface Mockup" 
                className="absolute inset-0 w-full h-full object-cover scale-[1.4] origin-center -translate-y-[5%]" 
              />
            </div>
          </motion.div>
        </section>

        {/* Trusted By Section */}
        <section className="w-full max-w-4xl mx-auto px-6 mb-24 flex items-center justify-center md:justify-start gap-10 flex-wrap">
          <div className="text-[15px] text-[#1D1B1A]/60 font-medium leading-tight max-w-[120px] text-left">
            Trusted by folks working at
          </div>
          <div className="flex items-center gap-8 md:gap-12 text-[#1D1B1A]/40">
            <SiGoogle className="w-auto h-6 hover:text-[#1D1B1A]/60 transition-colors" />
            <FaMicrosoft className="w-auto h-[22px] hover:text-[#1D1B1A]/60 transition-colors" />
            <SiApple className="w-auto h-[26px] hover:text-[#1D1B1A]/60 transition-colors pb-1" />
            <FaAmazon className="w-auto h-[26px] hover:text-[#1D1B1A]/60 transition-colors mt-2" />
            <div className="flex items-center gap-1.5 hover:text-[#1D1B1A]/60 transition-colors font-bold text-lg tracking-tight">
               <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
               Swiggy
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full bg-[#F4F3ED] border-y border-black/5 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                <img 
                  src="https://i.pravatar.cc/150?u=ishita" 
                  alt="Ishita Chaudhary" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-[#1D1B1A] text-[15px]">Ishita Chaudhary</div>
                <div className="text-[13px] font-medium text-[#1D1B1A]/60">Product & Business @ Cisco</div>
              </div>
            </div>
            
            <p className="text-[18px] leading-[1.6] text-[#1D1B1A]/80 font-medium max-w-2xl">
              I was procrastinating on building my portfolio for a year, but Designfolio
              completely changed that — it helped me go from Word/Figma case studies to
              a live website in just 20 minutes.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
