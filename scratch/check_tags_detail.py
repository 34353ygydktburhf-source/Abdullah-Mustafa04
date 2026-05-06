
import os
import re

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # This is a very simple parser, it will miss many things but might catch simple tag mismatches
    # Find all <div and </div>
    tags = re.findall(r'<(div)|</(div)>', line)
    for tag in tags:
        if tag[0] == 'div':
            stack.append(i + 1)
        elif tag[1] == 'div':
            if stack:
                stack.pop()
            else:
                print(f"Extra </div> at line {i + 1}")

for line_num in stack:
    print(f"Unclosed <div> started at line {line_num}")
