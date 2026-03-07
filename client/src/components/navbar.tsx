import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid, Settings, ChevronDown } from "lucide-react";
import profileImg from "@/assets/images/profile.png";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 px-4">
      <nav className="bg-white dark:bg-[#2A2520] border border-black/8 dark:border-white/10 rounded-full shadow-sm pointer-events-auto max-w-[640px] w-full">
        <div className="px-2 md:px-2 py-2 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="37" height="37" rx="18.5" fill="#FF553E"/>
              <path d="M20.0417 4.625H16.9583V14.7781L9.77902 7.59877L7.59877 9.77902L14.7781 16.9583H4.625V20.0417H14.7781L7.59877 27.221L9.77902 29.4012L16.9583 22.2219V32.375H20.0417V22.2219L27.221 29.4012L29.4012 27.221L22.2219 20.0417H32.375V16.9583H22.2219L29.4012 9.77902L27.221 7.59877L20.0417 14.7781V4.625Z" fill="white"/>
            </svg>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] font-medium px-3 text-sm rounded-full flex items-center gap-1 hover:cursor-pointer"
                >
                  Portfolio builder
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>Portfolio Builder</DropdownMenuItem>
                <DropdownMenuItem>Other AI tools</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="icon"
              className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 w-9 rounded-full hover:cursor-pointer"
            >
              <Settings size={18} />
            </Button>
            <Button 
              variant="secondary" 
              size="icon"
              className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] h-9 w-9 rounded-full hover:cursor-pointer"
            >
              <LayoutGrid size={18} />
            </Button>
            <Button 
              className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-6 h-9 text-sm rounded-full hover:cursor-pointer"
            >
              Publish
            </Button>
            <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10 flex-shrink-0">
              <AvatarImage src={profileImg} alt="Profile" />
              <AvatarFallback>MB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    </div>
  );
}
