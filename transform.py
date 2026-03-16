import re

with open('client/src/pages/landing.tsx', 'r') as f:
    content = f.read()

def replace_color(match):
    full_match = match.group(0)
    prefix_color = match.group(1)
    opacity = match.group(2) or ''
    
    mapping = {
        'bg-[#FFFEF2]': 'dark:bg-background',
        'text-[#1D1B1A]': 'dark:text-foreground',
        'text-[#463B34]': 'dark:text-foreground',
        'border-[#EAE9E4]': 'dark:border-border',
        'border-[#E2E1DA]': 'dark:border-border',
        'bg-[#F4F3E5]': 'dark:bg-card',
        'text-[#1d1b1ab3]': 'dark:text-foreground/70',
        'border-black': 'dark:border-border',
        'hover:bg-black': 'dark:hover:bg-white/5',
        'bg-[#1D1B1A]': 'dark:bg-foreground',
        'text-[#FDFCF8]': 'dark:text-background',
        'bg-[#EAE9E4]': 'dark:bg-border',
    }
    
    if prefix_color in mapping:
        dark_class = mapping[prefix_color]
        if opacity:
            dark_class += opacity
        return f"{full_match} {dark_class}"
    return full_match

patterns = [
    r'(bg-\[#FFFEF2\])(/\d+)?',
    r'(text-\[#1D1B1A\])(/\d+)?',
    r'(text-\[#463B34\])(/\d+)?',
    r'(border-\[#EAE9E4\])(/\d+)?',
    r'(border-\[#E2E1DA\])(/\d+)?',
    r'(bg-\[#F4F3E5\])(/\d+)?',
    r'(text-\[#1d1b1ab3\])(/\d+)?',
    r'(border-black)(/\d+)?',
    r'(hover:bg-black)(/\d+)?',
    r'(bg-\[#1D1B1A\])(/\d+)?',
    r'(text-\[#FDFCF8\])(/\d+)?',
    r'(bg-\[#EAE9E4\])(/\d+)?',
]

for p in patterns:
    content = re.sub(p, replace_color, content)

with open('client/src/pages/landing.tsx.new', 'w') as f:
    f.write(content)
