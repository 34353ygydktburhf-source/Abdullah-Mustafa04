
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

stack = []
in_string = False
string_char = ''
in_template = False
escaped = False

lines = content.splitlines()
for i, line_content in enumerate(lines):
    line = line_content.split('//')[0]
    for j, char in enumerate(line):
        if escaped:
            escaped = False
            continue
        if char == '\\':
            escaped = True
            continue
            
        if in_template:
            if char == '`':
                in_template = False
            elif char == '$' and j + 1 < len(line) and line[j+1] == '{':
                # Nested expression in template literal
                stack.append(('${', i + 1, j + 1))
            continue
            
        if in_string:
            if char == string_char:
                in_string = False
            continue
            
        if char in '"\'':
            in_string = True
            string_char = char
            continue
        if char == '`':
            in_template = True
            continue
            
        if char in '({[':
            stack.append((char, i + 1, j + 1))
        elif char in ')}]':
            if not stack:
                print(f"Extra closing {char} at line {i + 1}, col {j + 1}")
                continue
            opening, line_num, col_num = stack.pop()
            if opening == '${' and char == '}':
                continue
            if (opening == '(' and char != ')') or \
               (opening == '{' and char != '}') or \
               (opening == '[' and char != ']'):
                print(f"Mismatch: found {char} at line {i + 1} but expected closer for {opening} from line {line_num}, col {col_num}")

if stack:
    for char, line_num, col_num in stack:
        print(f"Unclosed {char} from line {line_num}, col {col_num}")
else:
    print("All brackets are balanced!")
