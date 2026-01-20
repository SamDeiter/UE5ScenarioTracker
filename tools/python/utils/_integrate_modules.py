"""
Script to integrate modules into game.js by replacing inline functions with module calls.
This script is safer than manual editing for large refactoring.
"""

import re

def integrate_modules():
    # Read the current game.js
    with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\game.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track what we're replacing
    replacements = []
    
    # 1. Replace getTimeCostForChoice with ScoringManager.getTimeCost
    # Find all calls to getTimeCostForChoice and replace with ScoringManager.getTimeCost
    content, count = re.subn(
        r'\bgetTimeCostForChoice\b',
        'ScoringManager.getTimeCost',
        content
    )
    if count > 0:
        replacements.append(f"getTimeCostForChoice -> ScoringManager.getTimeCost ({count} occurrences)")
    
    # 2. Replace formatTime with TimerManager.formatTime
    content, count = re.subn(
        r'(?<!TimerManager\.)\bformatTime\b',
        'TimerManager.formatTime',
        content
    )
    if count > 0:
        replacements.append(f"formatTime -> TimerManager.formatTime ({count} occurrences)")
    
    # 3. Replace calculateTotalIdealTime with ScoringManager.calculateIdealTime  
    content, count = re.subn(
        r'\bcalculateTotalIdealTime\b',
        'ScoringManager.calculateIdealTime',
        content
    )
    if count > 0:
        replacements.append(f"calculateTotalIdealTime -> ScoringManager.calculateIdealTime ({count} occurrences)")
    
    # 4. Replace getLoggedTimeColorClass with ScoringManager.getTimeColorClass
    content, count = re.subn(
        r'\bgetLoggedTimeColorClass\b',
        'ScoringManager.getTimeColorClass',
        content
    )
    if count > 0:
        replacements.append(f"getLoggedTimeColorClass -> ScoringManager.getTimeColorClass ({count} occurrences)")
    
    # Write the modified content
    with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\game.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Module integration complete!")
    print("\nReplacements made:")
    for r in replacements:
        print(f"  - {r}")
    
    # Now remove the duplicate function definitions
    # Read again
    with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\game.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find and mark lines to remove (the inline function definitions)
    functions_to_remove = [
        ('formatTime', 'function formatTime'),
        ('getTimeCostForChoice', 'function getTimeCostForChoice'),
        ('getLoggedTimeColorClass', 'function getLoggedTimeColorClass'),
        ('calculateTotalIdealTime', 'function calculateTotalIdealTime'),
        ('base64EncodeUnicode', 'function base64EncodeUnicode'),
    ]
    
    print("\nNote: Inline function definitions still exist in game.js.")
    print("They can be removed manually once module integration is verified.")

if __name__ == '__main__':
    integrate_modules()
