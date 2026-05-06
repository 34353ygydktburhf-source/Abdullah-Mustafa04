
import re

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all opening and closing tags
# This is a bit complex for regex, but let's try to find common ones
tags = re.findall(r'<(div|h1|h2|h3|h4|p|span|button|section|main|header|footer|aside|ul|li|table|thead|tbody|tr|td|th|label|select|option|input|textarea|button|img|video|hr|br|Star|Package|Copy|Edit|Trash2|Check|Settings|TrendingUp|Plus|LogOut|Eye|Video|ImagePlus|Play|X|ShieldAlert|Calendar|KeyRound|ArrowLeft|Search|Activity|DollarSign|Ticket|Users|TrendingDown|Menu|CreditCard)[\s/>]|</(div|h1|h2|h3|h4|p|span|button|section|main|header|footer|aside|ul|li|table|thead|tbody|tr|td|th|label|select|option|input|textarea|button|img|video|hr|br|Star|Package|Copy|Edit|Trash2|Check|Settings|TrendingUp|Plus|LogOut|Eye|Video|ImagePlus|Play|X|ShieldAlert|Calendar|KeyRound|ArrowLeft|Search|Activity|DollarSign|Ticket|Users|TrendingDown|Menu|CreditCard)>', content)

# self-closing tags in HTML/JSX (common ones)
self_closing = {'input', 'img', 'br', 'hr', 'X', 'Star', 'Package', 'Copy', 'Edit', 'Trash2', 'Check', 'Settings', 'TrendingUp', 'Plus', 'LogOut', 'Eye', 'Video', 'ImagePlus', 'Play', 'ShieldAlert', 'Calendar', 'KeyRound', 'ArrowLeft', 'Search', 'Activity', 'DollarSign', 'Ticket', 'Users', 'TrendingDown', 'Menu', 'CreditCard'}

stack = []
for tag in tags:
    opening, closing = tag
    if opening:
        if opening not in self_closing:
            stack.append(opening)
    elif closing:
        if closing not in self_closing:
            if stack and stack[-1] == closing:
                stack.pop()
            else:
                print(f"Mismatch: found </{closing}> but stack is {stack[-3:]}")

print(f"Unclosed: {stack}")
