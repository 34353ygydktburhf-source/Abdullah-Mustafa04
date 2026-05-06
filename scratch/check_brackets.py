
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove comments
content = os.linesep.join([line.split('//')[0] for line in content.splitlines()])

stack = []
for i, char in enumerate(content):
    if char in '({[':
        stack.append((char, i))
    elif char in ')}]':
        if not stack:
            print(f"Extra closing {char} at position {i}")
            continue
        opening, pos = stack.pop()
        if (opening == '(' and char != ')') or \
           (opening == '{' and char != '}') or \
           (opening == '[' and char != ']'):
            print(f"Mismatch: found {char} but expected closer for {opening} at {pos}")

if stack:
    for char, pos in stack:
        context = content[max(0, pos-20):min(len(content), pos+50)]
        print(f"Unclosed {char} at position {pos}: ...{context}...")
else:
    print("All brackets are balanced!")
