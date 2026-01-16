import os
import json

# Load scenario definitions
with open('raw_data.json', 'r') as f:
    data = json.load(f)

scenarios = {}
for item in data:
    scen = item.get('scenario', {})
    sid = scen.get('scenario_id', '')
    if sid:
        steps = scen.get('correct_solution_steps', [])
        scenarios[sid] = len(steps) + 1  # +1 for conclusion

assets_dir = 'assets/generated'
total_expected = 0
total_actual = 0
missing_report = []

for scenario_id, expected_count in sorted(scenarios.items()):
    total_expected += expected_count
    scenario_path = os.path.join(assets_dir, scenario_id)
    if os.path.isdir(scenario_path):
        # Count step-X and conclusion
        files = [f for f in os.listdir(scenario_path) if (f.startswith('step-') or f.startswith('conclusion')) and (f.endswith('.png') or f.endswith('.jpg'))]
        actual = len(files)
        total_actual += actual
        
        # Check for viewport
        has_viewport = any(os.path.exists(os.path.join(scenario_path, v)) for v in ['viewport.jpg', 'viewport.png'])
        
        needed = expected_count - actual
        if needed > 0 or not has_viewport:
            status = f'{scenario_id}: {actual}/{expected_count}'
            if not has_viewport: status += " (MISSING VIEWPORT)"
            missing_report.append(status)
    else:
        missing_report.append(f'{scenario_id}: MISSING DIR (need {expected_count} + viewport)')

print("=== SCENARIOS NEEDING IMAGES ===")
for line in missing_report:
    print(line)

remaining = total_expected - total_actual
print(f"\n=== SUMMARY ===")
print(f"Total steps/conclusion expected: {total_expected}")
print(f"Total steps/conclusion present:  {total_actual}")
print(f"REMAINING TO GENERATE (steps):   {remaining}")
print(f"Scenarios needing attention:    {len(missing_report)}")
