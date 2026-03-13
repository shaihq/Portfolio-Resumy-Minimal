const fs = require('fs');

const path = 'client/src/components/navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldMobilePublish = `<Button 
                    className="w-full bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium h-10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Publish
                  </Button>`;

const newMobilePublish = `                  <div className="flex w-full items-center justify-between gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-[13px] font-medium text-[#1A1A1A] dark:text-[#F0EDE7] truncate">
                        shai.designfolio.me
                      </span>
                      <span className="text-[11px] text-[#7A736C] dark:text-[#9E9893]">
                        Updated 29 days ago
                      </span>
                    </div>
                    <Button 
                      className="bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-4 h-8 text-xs rounded-lg whitespace-nowrap flex-shrink-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Update
                    </Button>
                  </div>`;

content = content.replace(oldMobilePublish, newMobilePublish);
fs.writeFileSync(path, content);
