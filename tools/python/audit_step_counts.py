"""
Scenario Step Count Auditor
Counts steps in all scenario files and generates a report.
"""
import os
import re

SCENARIOS_DIR = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios'

def count_steps(filepath):
    """Count step definitions in a scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count step-N definitions (excluding 'next' references)
    step_defs = re.findall(r'["\']step-(\d+)["\']\s*:\s*\{', content)
    if not step_defs:
        return 0
    return max(int(s) for s in step_defs)

def get_difficulty(filepath):
    """Extract difficulty from scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'difficulty["\']?\s*:\s*["\'](\w+)["\']', content, re.IGNORECASE)
    return match.group(1) if match else 'Unknown'

def audit_scenarios():
    """Audit all scenarios and generate report."""
    results = []
    
    for root, dirs, files in os.walk(SCENARIOS_DIR):
        for f in files:
            if not f.endswith('.js'):
                continue
            if f.startswith('_') or f.startswith('00'):
                continue
            if f == 'generator.js':
                continue
                
            filepath = os.path.join(root, f)
            category = os.path.basename(root)
            steps = count_steps(filepath)
            difficulty = get_difficulty(filepath)
            
            # Determine target based on difficulty
            if difficulty.lower() == 'beginner':
                target = 10
            elif difficulty.lower() == 'intermediate':
                target = 12
            elif difficulty.lower() == 'advanced':
                target = 15
            else:
                target = 12  # Default
            
            results.append({
                'category': category,
                'filename': f.replace('.js', ''),
                'steps': steps,
                'difficulty': difficulty,
                'target': target,
            })
    
    return sorted(results, key=lambda x: (x['category'], -x['steps']))

def print_report(results):
    """Print formatted audit report."""
    print('')
    print('=' * 70)
    print('SCENARIO STEP COUNT AUDIT REPORT')
    print('=' * 70)
    
    categories = {}
    for r in results:
        if r['category'] not in categories:
            categories[r['category']] = []
        categories[r['category']].append(r)
    
    total_ok = 0
    total_need_work = 0
    need_work_list = []
    
    for cat in sorted(categories.keys()):
        scenarios = categories[cat]
        print('')
        print('### %s (%d scenarios)' % (cat.upper(), len(scenarios)))
        print('-' * 70)
        print('%-35s %-6s %-7s %-12s %s' % ('Scenario', 'Steps', 'Target', 'Difficulty', 'Status'))
        print('-' * 70)
        
        for s in scenarios:
            if s['steps'] >= s['target']:
                status = 'OK'
                total_ok += 1
            else:
                status = 'NEED +%d' % (s['target'] - s['steps'])
                total_need_work += 1
                need_work_list.append(s)
            print('%-35s %-6d %-7d %-12s %s' % (
                s['filename'][:35], s['steps'], s['target'], s['difficulty'], status
            ))
    
    print('')
    print('=' * 70)
    print('SUMMARY: %d OK, %d need expansion' % (total_ok, total_need_work))
    print('=' * 70)
    
    if need_work_list:
        print('')
        print('SCENARIOS NEEDING EXPANSION:')
        for r in sorted(need_work_list, key=lambda x: x['steps']):
            needed = r['target'] - r['steps']
            print('  - %s/%s: %d steps, need +%d more' % (
                r['category'], r['filename'], r['steps'], needed
            ))

if __name__ == '__main__':
    results = audit_scenarios()
    print_report(results)
