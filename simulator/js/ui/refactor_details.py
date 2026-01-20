import os
import re

details_controller_path = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\simulator\js\ui\DetailsController.js'

with open(details_controller_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Refactor _createPropertyRow to wrap indicator and label
# Target:
#   row.appendChild(indicator);
#   ...
#   row.appendChild(label);
# Replace with:
#   const nameCol = document.createElement("div");
#   nameCol.className = "property-name-col";
#   nameCol.appendChild(indicator);
#   nameCol.appendChild(label);
#   row.appendChild(nameCol);

# Precise replacement for _createPropertyRow part
old_prop_row_start = """  row.appendChild(indicator);

  const label = document.createElement("span");
  label.className = "property-name";
  label.textContent = prop.name;
  label.title = prop.tooltip || prop.name;
  row.appendChild(label);"""

new_prop_row_start = """  const nameCol = document.createElement("div");
  nameCol.className = "property-name-col";
  nameCol.appendChild(indicator);

  const label = document.createElement("span");
  label.className = "property-name";
  label.textContent = prop.name;
  label.title = prop.tooltip || prop.name;
  nameCol.appendChild(label);
  
  row.appendChild(nameCol);"""

content = content.replace(old_prop_row_start, new_prop_row_start)

# 2. Refactor _createMobilityRow to wrap label
old_mobility_label = """  const label = document.createElement("span");
  label.className = "property-name";
  label.textContent = "Mobility";
  row.appendChild(label);"""

new_mobility_label = """  const nameCol = document.createElement("div");
  nameCol.className = "property-name-col";
  const label = document.createElement("span");
  label.className = "property-name";
  label.textContent = "Mobility";
  nameCol.appendChild(label);
  row.appendChild(nameCol);"""

content = content.replace(old_mobility_label, new_mobility_label)

# 3. Refactor _createTransformRow to wrap labelContainer and property-actions
# This one is trickier as it has optional lockBtn.

def refactor_transform_row(match):
    body = match.group(1)
    
    # Wrap label/labelContainer
    body = body.replace('row.appendChild(labelContainer);', 
                        'labelContainer.classList.add("property-name-col");\n  row.appendChild(labelContainer);')
    
    # Wrap vectorContainer
    body = body.replace('row.appendChild(vectorContainer);', 
                        'vectorContainer.className = "property-value vector-input";\n  row.appendChild(vectorContainer);')
    
    # Wrap Actions (Lock + Reset)
    # We need to find if lockBtn exists and resetBtn, and wrap them.
    if 'scale-lock-btn' in body:
        # Complex case: both exist
        # We'll create an actions container
        actions_code = """  const actionsCol = document.createElement("div");
  actionsCol.className = "property-actions";"""
        
        body = body.replace('row.appendChild(lockBtn);', 'actionsCol.appendChild(lockBtn);')
        body = body.replace('row.appendChild(resetBtn);', 'actionsCol.appendChild(resetBtn);\n  row.appendChild(actionsCol);')
        
        # Insert actionsCol creation before the first action append
        body = body.replace('actionsCol.appendChild(lockBtn);', actions_code + '\n  actionsCol.appendChild(lockBtn);')
    else:
        # Simple case: only resetBtn
        body = body.replace('row.appendChild(resetBtn);', 
                            'const actionsCol = document.createElement("div");\n  actionsCol.className = "property-actions";\n  actionsCol.appendChild(resetBtn);\n  row.appendChild(actionsCol);')
            
    return f'_createTransformRow(\n  label,\n  prop,\n  value,\n  hasAbsoluteToggle = false,\n  hasLockIcon = false\n) {{' + body

# Using regex to find the function body
content = re.sub(r'_createTransformRow\(\s*label,\s*prop,\s*value,\s*hasAbsoluteToggle = false,\s*hasLockIcon = false\s*\) \{(.*?)\s*\n\}', 
                 refactor_transform_row, content, flags=re.DOTALL)

with open(details_controller_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("DetailsController.js refactored successfully.")
