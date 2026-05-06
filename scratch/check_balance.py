
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

open_braces = content.count('{')
close_braces = content.count('}')
open_tags = content.count('<div')
close_tags = content.count('</div>')

print(f"Open Braces: {open_braces}")
print(f"Close Braces: {close_braces}")
print(f"Open Divs: {open_tags}")
print(f"Close Divs: {close_tags}")
