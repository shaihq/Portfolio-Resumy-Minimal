const fs = require('fs');

const content = fs.readFileSync('client/src/pages/home.tsx', 'utf-8');

const pattern = /<div className="bg-\[#E4DFD7\] dark:bg-\[#221F1B\] flex flex-col items-center pt-8 md:pt-10 px-6 md:px-8 relative">\s*<div className="relative bg-gradient-to-b from-\[#E0DBD0\] to-\[#BCB6AB\] dark:from-\[#3A352E\] dark:to-\[#1A1A1A\] p-3 md:p-4 w-full shadow-sm">\s*<div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-\[#EFECE6\]\/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"><\/div>\s*<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-\[#EFECE6\]\/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"><\/div>\s*<div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-\[#EFECE6\]\/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"><\/div>\s*<div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-\[#EFECE6\]\/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"><\/div>\s*<div className="w-full aspect-\[16\/10\] bg-\[#1A1A1A\] p-\[4px\] md:p-\[6px\] relative z-10">\s*<div className="w-full h-full overflow-hidden bg-white dark:bg-\[#1A1A1A\]">\s*<img src=\{(project\d+)\} alt="([^"]+)" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="w-12 md:w-16 h-6 md:h-8 bg-gradient-to-b from-\[#BCB6AB\] to-\[#E4DFD7\] dark:from-\[#1A1A1A\] dark:to-\[#221F1B\] z-10"><\/div>\s*<\/div>/g;

const replacement = `<div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A]">
                      <img src={$1} alt="$2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>`;

const newContent = content.replace(pattern, replacement);

fs.writeFileSync('client/src/pages/home.tsx', newContent);

const matches = [...content.matchAll(pattern)];
console.log(`Replacements made: ${matches.length}`);
