import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check if logo is already present
if 'UE-Icon-2023-White.svg' not in html:
    # Add the logo before the title
    html = re.sub(
        r'(<h1 class="text-3xl font-bold text-blue-400[^>]*>)',
        r'<img src="icons/UE-Icon-2023-White.svg" alt="UE5 Logo" class="h-10 w-10 mr-4 opacity-90">\n            \1',
        html
    )
    print("✅ Added UE5 logo to header")
else:
    print("ℹ️  Logo already present")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("   • Using: icons/UE-Icon-2023-White.svg")
