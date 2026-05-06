
import re

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

open_divs = len(re.findall(r'<div[\s>]', content))
close_divs = len(re.findall(r'</div>', content))

print(f"Open Divs: {open_divs}")
print(f"Close Divs: {close_divs}")
