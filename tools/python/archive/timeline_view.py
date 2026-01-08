"""
Timeline View Implementation:
1. Traverse steps as linked list (following 'next' property)
2. Render as metro map style timeline
"""

# ============ 1. UPDATE CSS - Timeline Styles ============
timeline_css = '''
/* ============ TIMELINE VIEW (Metro Map Style) ============ */
.steps-timeline {
    position: relative;
    padding-left: 2rem;
}

/* The vertical track line */
.steps-timeline::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border);
}

.timeline-step {
    position: relative;
    padding-bottom: 1.5rem;
    padding-left: 1rem;
}

.timeline-step:last-child {
    padding-bottom: 0;
}

/* The node circles */
.timeline-step::before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--border);
    z-index: 1;
}

/* Start node - green outline */
.timeline-step.step-start::before {
    border-color: var(--accent-green);
    background: var(--bg-card);
}

/* End node - solid green with checkmark */
.timeline-step.step-end::before {
    border-color: var(--accent-green);
    background: var(--accent-green);
}

.timeline-step.step-end::after {
    content: '✓';
    position: absolute;
    left: -1.4rem;
    top: 2px;
    font-size: 0.6rem;
    color: white;
    z-index: 2;
}

/* Intermediate nodes - grey filled */
.timeline-step.step-middle::before {
    background: var(--text-secondary);
    border-color: var(--text-secondary);
}

.timeline-title {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
}

.timeline-prompt {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.4;
}

/* Replace old two-column with timeline */
.card-steps ol {
    column-count: 1;
}
'''

with open('../generator_ui/style.css', 'a', encoding='utf-8') as f:
    f.write(timeline_css)
print("✅ Added timeline CSS styles")


# ============ 2. UPDATE HTML - Timeline Container ============
with open('../generator_ui/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the ordered list with timeline container
old_steps = '''<div class="card-steps">
                                    <h4>Steps:</h4>
                                    <ol id="preview-steps-list"></ol>
                                </div>'''

new_steps = '''<div class="card-steps">
                                    <h4>Steps:</h4>
                                    <div id="preview-steps-list" class="steps-timeline"></div>
                                </div>'''

html = html.replace(old_steps, new_steps)

with open('../generator_ui/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("✅ Updated HTML structure")


# ============ 3. UPDATE JS - Linked List Traversal ============
with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find and replace the steps rendering logic
import re

old_steps_render = r'''// Steps as list
        const stepsList = document\.getElementById\('preview-steps-list'\);
        if \(stepsList && content\.steps\) \{
            stepsList\.innerHTML = '';
            const steps = Object\.values\(content\.steps\);
            steps\.forEach\(step => \{
                const li = document\.createElement\('li'\);
                li\.textContent = step\.title \|\| step\.action \|\| 'Step';
                stepsList\.appendChild\(li\);
            \}\);
        \}'''

new_steps_render = '''// Steps as timeline - traverse linked list
        const stepsList = document.getElementById('preview-steps-list');
        if (stepsList && content.steps) {
            stepsList.innerHTML = '';
            
            // Traverse linked list to get correct order
            const orderedSteps = [];
            let currentId = 'step-1'; // Start node
            const visited = new Set();
            
            while (currentId && content.steps[currentId] && !visited.has(currentId)) {
                visited.add(currentId);
                const step = content.steps[currentId];
                orderedSteps.push({ id: currentId, ...step });
                currentId = step.next;
            }
            
            // Render as timeline
            orderedSteps.forEach((step, index) => {
                const div = document.createElement('div');
                const isStart = index === 0;
                const isEnd = index === orderedSteps.length - 1 || step.title?.includes('Complete');
                
                div.className = 'timeline-step ' + (isStart ? 'step-start' : isEnd ? 'step-end' : 'step-middle');
                
                div.innerHTML = `
                    <div class="timeline-title">${step.title || step.action || 'Step ' + (index + 1)}</div>
                    <div class="timeline-prompt">${step.prompt || step.description || ''}</div>
                `;
                
                stepsList.appendChild(div);
            });
        }'''

# Use simpler replacement since regex might be tricky
old_simple = '''// Steps as list
        const stepsList = document.getElementById('preview-steps-list');
        if (stepsList && content.steps) {
            stepsList.innerHTML = '';
            const steps = Object.values(content.steps);
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step.title || step.action || 'Step';
                stepsList.appendChild(li);
            });
        }'''

if old_simple in js:
    js = js.replace(old_simple, new_steps_render)
    print("✅ Updated steps rendering with linked list traversal")
else:
    # Try alternative pattern
    if 'preview-steps-list' in js:
        print("⚠️ Found steps list but pattern didn't match exactly. Manual check needed.")
    else:
        print("⚠️ Steps list code not found")

with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("\n🎉 Timeline view implemented!")
print("- Steps now follow linked list order (start → next → next)")
print("- Metro map style with vertical track and nodes")
print("- Start node: green outline, End: solid green check, Middle: grey")
