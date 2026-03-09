import re

with open('client/src/pages/home.tsx', 'r') as f:
    content = f.read()

# Replace the inner monitor frame block
pattern = re.compile(
    r'<div className="bg-\[#E4DFD7\] dark:bg-\[#221F1B\] flex flex-col items-center pt-8 md:pt-10 px-6 md:px-8 relative">\s*'
    r'<div className="relative bg-gradient-to-b from-\[#E0DBD0\] to-\[#BCB6AB\] dark:from-\[#3A352E\] dark:to-\[#1A1A1A\] p-3 md:p-4 w-full shadow-sm">\s*'
    r'<div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-\[#EFECE6\]/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"></div>\s*'
    r'<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-\[#EFECE6\]/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"></div>\s*'
    r'<div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-\[#EFECE6\]/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"></div>\s*'
    r'<div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-\[#EFECE6\]/50 shadow-\[inset_0_1px_2px_rgba\(0,0,0,0\.2\)\]"></div>\s*'
    r'<div className="w-full aspect-\[16/10\] bg-\[#1A1A1A\] p-\[4px\] md:p-\[6px\] relative z-10">\s*'
    r'<div className="w-full h-full overflow-hidden bg-white dark:bg-\[#1A1A1A\]">\s*'
    r'<img src={(project\d+)} alt="([^"]+)" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />\s*'
    r'</div>\s*'
    r'</div>\s*'
    r'</div>\s*'
    r'<div className="w-12 md:w-16 h-6 md:h-8 bg-gradient-to-b from-\[#BCB6AB\] to-\[#E4DFD7\] dark:from-\[#1A1A1A\] dark:to-\[#221F1B\] z-10"></div>\s*'
    r'</div>',
    re.MULTILINE
)

replacement = r'''<div className="w-full aspect-[16/9] md:aspect-[16/10] relative overflow-hidden bg-white dark:bg-[#1A1A1A]">
                      <img src={\1} alt="\2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>'''

new_content = pattern.sub(replacement, content)

with open('client/src/pages/home.tsx', 'w') as f:
    f.write(new_content)

print(f"Replacements made: {len(pattern.findall(content))}")
