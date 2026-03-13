import re

path = 'client/src/components/navbar.tsx'
with open(path, 'r') as f:
    content = f.read()

old_mobile_menu = """          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] h-10 w-10 rounded-full hover:cursor-pointer"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl bg-white dark:bg-[#2A2520] border-t border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col gap-4">
                  <FluidDropdown />
                  <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                    onClick={() => setIsThemePanelOpen(true)}
                  >
                    <PaintRoller className="mr-2 h-4 w-4" />
                    Themes settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                  >
                    <ChartSpline className="mr-2 h-4 w-4" />
                    Insights
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    className="w-full bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium h-10"
                  >
                    Publish
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10 flex-shrink-0">
              <AvatarImage src={profileImg} alt="Profile" />
              <AvatarFallback>MB</AvatarFallback>
            </Avatar>
          </div>"""

new_mobile_menu = """          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10 flex-shrink-0">
              <AvatarImage src={profileImg} alt="Profile" />
              <AvatarFallback>MB</AvatarFallback>
            </Avatar>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#F5F5F5] hover:bg-[#E8E8E8] dark:bg-[#3A3531] dark:hover:bg-[#4A4540] border border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F0EDE7] h-10 w-10 rounded-full hover:cursor-pointer"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl bg-white dark:bg-[#2A2520] border-t border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col gap-4">
                  <FluidDropdown />
                  <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                    onClick={() => setIsThemePanelOpen(true)}
                  >
                    <PaintRoller className="mr-2 h-4 w-4" />
                    Themes settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                  >
                    <ChartSpline className="mr-2 h-4 w-4" />
                    Insights
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:bg-[#F5F5F5] dark:hover:bg-[#3A3531] h-10 px-4"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    className="w-full bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium h-10"
                  >
                    Publish
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>"""

content = content.replace(old_mobile_menu, new_mobile_menu)

with open(path, 'w') as f:
    f.write(content)
