
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line_content in enumerate(lines):
    # Remove comments
    line = line_content.split('//')[0]
    for j, char in enumerate(line):
        if char in '({[':
            stack.append((char, i + 1, j + 1))
        elif char in ')}]':
            if not stack:
                print(f"Extra closing {char} at line {i + 1}, col {j + 1}")
                continue
            opening, line_num, col_num = stack.pop()
            if (opening == '(' and char != ')') or \
               (opening == '{' and char != '}') or \
               (opening == '[' and char != ']'):
                print(f"Mismatch: found {char} at line {i + 1} but expected closer for {opening} from line {line_num}")

if stack:
    for char, line_num, col_num in stack:
        print(f"Unclosed {char} from line {line_num}, col {col_num}")
else:
    print("All brackets are balanced!")
