import re
from datetime import datetime

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate new timestamp
new_timestamp = str(int(datetime.now().timestamp()))

# Replace all old cache-bust parameters with the new one
# Pattern: ?v=<digits>
pattern = r'\?v=\d+'
new_content = re.sub(pattern, f'?v={new_timestamp}', content)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"✅ Updated all cache-bust parameters to v={new_timestamp}")

# Count how many were updated
count = len(re.findall(pattern, content))
print(f"📝 Updated {count} script tags")
