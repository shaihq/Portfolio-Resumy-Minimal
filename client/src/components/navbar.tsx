import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LayoutGrid, Settings } from "lucide-react";
import profileImg from "@/assets/images/profile.png";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 px-4">
      <nav className="bg-white dark:bg-[#2A2520] border border-black/8 dark:border-white/10 rounded-full shadow-sm pointer-events-auto max-w-[640px] w-full">
        <div className="px-4 md:px-5 py-2 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
              <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
            </svg>
            <Button 
              variant="ghost" 
              className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium px-3 text-sm"
            >
              Portfolio builder
            </Button>
          </div>

          {/* Middle Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 w-9"
            >
              <Settings size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 w-9"
            >
              <LayoutGrid size={18} />
            </Button>
            <Button 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-[#1A1A1A] dark:hover:bg-[#F0EDE7] font-medium px-6 h-9 text-sm"
            >
              Publish
            </Button>
          </div>

          {/* Avatar */}
          <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10 flex-shrink-0">
            <AvatarImage src={profileImg} alt="Profile" />
            <AvatarFallback>MB</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </div>
  );
}
