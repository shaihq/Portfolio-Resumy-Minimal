import re

path = 'client/src/components/navbar.tsx'
with open(path, 'r') as f:
    content = f.read()

# Make sure VisuallyHidden is imported
if 'VisuallyHidden' not in content:
    content = content.replace(
        'import { ChartSpline, Eye, PaintRoller, Check, Menu } from "lucide-react";',
        'import { ChartSpline, Eye, PaintRoller, Check, Menu } from "lucide-react";\nimport { VisuallyHidden } from "@radix-ui/react-visually-hidden";'
    )

old_sheet_content = """              <SheetContent side="bottom" className="rounded-t-3xl bg-white dark:bg-[#2A2520] border-t border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">"""

new_sheet_content = """              <SheetContent side="bottom" className="rounded-t-3xl bg-white dark:bg-[#2A2520] border-t border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col gap-4">"""

content = content.replace(old_sheet_content, new_sheet_content)

with open(path, 'w') as f:
    f.write(content)
