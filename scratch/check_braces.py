
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove comments to avoid false positives
content = os.linesep.join([line.split('//')[0] for line in content.splitlines()])

stack = []
for i, char in enumerate(content):
    if char == '{':
        stack.append(i)
    elif char == '}':
        if stack:
            stack.pop()
        else:
            print(f"Extra closing brace at position {i}")

if stack:
    for pos in stack:
        # Print context around unclosed brace
        context = content[max(0, pos-20):min(len(content), pos+50)]
        print(f"Unclosed brace at position {pos}: ...{context}...")
else:
    print("Braces are balanced (ignoring block comments)")
