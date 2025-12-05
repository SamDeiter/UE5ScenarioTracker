"""Fix category class mapping to include all categories with distinct colors."""

with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_fn = """function getCategoryClass(category) {
    if (category.includes('Lighting')) return 'lighting';
    if (category.includes('Blueprint')) return 'blueprints';
    if (category.includes('Material')) return 'materials';
    if (category.includes('World')) return 'world';
    if (category.includes('Physics')) return 'physics';
    return '';
}"""

new_fn = """function getCategoryClass(category) {
    if (category.includes('Lighting')) return 'lighting';
    if (category.includes('Blueprint')) return 'blueprints';
    if (category.includes('Material')) return 'materials';
    if (category.includes('World')) return 'world';
    if (category.includes('Physics')) return 'physics';
    if (category.includes('Asset')) return 'asset';
    if (category.includes('Sequencer') || category.includes('Cinematic')) return 'sequencer';
    if (category.includes('Audio')) return 'audio';
    if (category.includes('Performance')) return 'performance';
    return '';
}"""

js = js.replace(old_fn, new_fn)

with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Fixed getCategoryClass - all categories now have distinct colors!')
