"""Start category groups collapsed by default"""

with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Change category-group to category-group collapsed
js = js.replace('category-group";', 'category-group collapsed";')

with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Groups now start collapsed')
