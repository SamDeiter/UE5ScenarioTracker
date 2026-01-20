"""Update left panel to show real-time task completion during generation."""

with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find the generation loop and add real-time status update
old_success = """            if (result.success) {
                totalTokens += result.tokens_used;
                elements.tokensUsed.textContent = totalTokens.toLocaleString();
                elements.estimatedCost.textContent = `$${(totalTokens * 0.0000002).toFixed(4)}`;

                log(`✅ Generated ${id} (${result.tokens_used} tokens)`, 'success');
                successCount++;"""

new_success = """            if (result.success) {
                totalTokens += result.tokens_used;
                elements.tokensUsed.textContent = totalTokens.toLocaleString();
                elements.estimatedCost.textContent = `$${(totalTokens * 0.0000002).toFixed(4)}`;

                log(`✅ Generated ${id} (${result.tokens_used} tokens)`, 'success');
                successCount++;
                
                // Update left panel - mark as complete
                const item = document.querySelector(`[data-id="${id}"]`);
                if (item) {
                    item.querySelector('.status-icon').textContent = '✅';
                    item.classList.add('completed');
                }"""

js = js.replace(old_success, new_success)

with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Updated! Left panel now shows real-time completion.')
