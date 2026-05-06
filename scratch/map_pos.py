
import os

filepath = r"d:\مشاريعي\المشروع كاامل\المشروع غير مكتمل\component-replicator-pro-f2c19dbc-main\src\pages\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def get_line(pos):
    return content[:pos].count('\n') + 1

# Positions from check_brackets.py
mismatches = [113037, 109381, 109360, 106729, 67808, 62911]
for pos in mismatches:
    print(f"Mismatch at line {get_line(pos)} (pos {pos})")

unclosed = [2440, 15903, 24016, 24017, 24024, 24060]
for pos in unclosed:
    print(f"Unclosed at line {get_line(pos)} (pos {pos})")
