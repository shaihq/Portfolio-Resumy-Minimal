import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LayoutGrid, Settings } from "lucide-react";
import profileImg from "@/assets/images/profile.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#F0EDE7] dark:bg-[#1A1A1A] border-b border-black/5 dark:border-white/10">
      <div className="max-w-[640px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
            <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
          </svg>
          <Button 
            variant="ghost" 
            className="text-[#1A1A1A] dark:text-[#F0EDE7] font-medium px-3"
          >
            Portfolio builder
          </Button>
        </div>

        {/* Middle Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7]"
          >
            <LayoutGrid size={18} />
          </Button>
          <Button 
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-[#1A1A1A] dark:hover:bg-[#F0EDE7] font-medium px-6"
          >
            Publish
          </Button>
        </div>

        {/* Avatar */}
        <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10">
          <AvatarImage src={profileImg} alt="Profile" />
          <AvatarFallback>MB</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
