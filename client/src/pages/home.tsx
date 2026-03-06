import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Mail, Dribbble, Twitter } from "lucide-react";
import profileImg from "@/assets/images/profile.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0EDE7] flex justify-center font-sans text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F0EDE7]">
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
      <div className="w-full max-w-[640px] custom-dashed-x relative min-h-screen bg-[#F0EDE7] flex flex-col">
        
        {/* Header Section */}
        <div className="px-6 md:px-10 pt-12 md:pt-16 pb-6">
          <Avatar className="w-[60px] h-[60px] rounded-2xl mb-6">
            <AvatarImage src={profileImg} className="object-cover" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
            <div>
              <h1 className="text-[24px] font-semibold mb-0.5 tracking-tight">24</h1>
              <p className="text-[#666666] text-base">Product Designer</p>
            </div>
            <a href="#" className="text-[13px] font-medium flex items-center gap-1.5 border-b border-[#1A1A1A] pb-0.5 hover:opacity-70 transition-opacity w-fit">
              Download resume <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Contact Section */}
        <div className="px-6 md:px-10 py-4 flex justify-between items-center">
          <a href="mailto:matt@gmail.com" className="flex items-center gap-2 text-[14px] text-[#666666] hover:text-[#1A1A1A] transition-colors">
            <Mail className="w-[18px] h-[18px]" />
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
        <div className="px-6 md:px-10 py-8">
          <h2 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-4">Intro</h2>
          <p className="text-[#555555] leading-[1.7] text-base">
            I'm a Design Engineer focused on crafting meaningful digital experiences where design meets code. With a strong front-end development and UX design background, I build scalable UI systems and contribute to user-centered products from concept to deployment.
          </p>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Experience Section */}
        <div className="px-6 md:px-10 py-8">
          <h2 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-4">Experience</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[14px]">
              <div className="flex items-center gap-3">
                <span className="text-[#888888] font-light text-lg leading-none mt-[1px]">+</span>
                <span className="text-[#1A1A1A]">2025 / Apple</span>
              </div>
              <span className="text-[#666666]">Staff Product Designer</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <div className="flex items-center gap-3">
                <span className="text-[#888888] font-light text-lg leading-none mt-[1px]">+</span>
                <span className="text-[#1A1A1A]">2025 / Apple</span>
              </div>
              <span className="text-[#666666]">Lead Product Designer</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <div className="flex items-center gap-3">
                <span className="text-[#888888] font-light text-lg leading-none mt-[1px]">+</span>
                <span className="text-[#1A1A1A]">2025 / Apple</span>
              </div>
              <span className="text-[#666666]">Product Designer II</span>
            </div>
          </div>
        </div>

        <div className="custom-dashed-t"></div>

        {/* Projects Section */}
        <div className="px-6 md:px-10 py-8 pb-16">
          <h2 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-4">Projects</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8">
            {/* Project 1 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project1} alt="Slate" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Slate</h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                A sleek and responsive landing page designed for modern startups to showcase their product.
              </p>
            </div>

            {/* Project 2 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project2} alt="Antimetal" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Antimetal</h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                A dynamic, animation-focused landing page highlighting creative transitions.
              </p>
            </div>

            {/* Project 3 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project3} alt="Financial Dashboard" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Slate</h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                A sleek and responsive landing page designed for modern startups to showcase their product.
              </p>
            </div>

            {/* Project 4 */}
            <div className="group cursor-pointer flex flex-col">
              <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-white drop-shadow-sm border border-black/5">
                <img src={project4} alt="TaskMaster" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-base mb-1.5 text-[#1A1A1A]">Antimetal</h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                A dynamic, animation-focused landing page highlighting creative transitions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}