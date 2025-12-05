import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import glob
import os
import json
import threading
import requests
import re
import time

# Logic to merge new steps into scenario file
def merge_scenario_expansion(filepath, expansion_data):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_steps = expansion_data.get('new_steps', {})
        instructions = expansion_data.get('insert_instructions', [])
        
        # 0. Mark as Expanded in Metadata
        if "meta: {" in content:
             if "expanded: true" not in content:
                 content = content.replace("meta: {", "meta: {\n        expanded: true,", 1)
             if "improved: true" in str(expansion_data): # logic check?
                 pass 
        
        # 1. Insert new steps into the 'steps' object
        steps_match = re.search(r"(steps:\s*\{)", content)
        if not steps_match:
            return False, "Could not find steps object"
            
        new_steps_js = ""
        for step_id, step_data in new_steps.items():
            # Format choices
            choices_str = ""
            for choice in step_data.get('choices', []):
                choices_str += f"""
                {{
                    text: "{choice['text']}",
                    type: '{choice['type']}',
                    feedback: "{choice['feedback']}",
                    next: '{choice['next']}'
                }},"""
            
            step_js = f"""
        '{step_id}': {{
            skill: '{step_data.get('skill', 'general')}',
            title: '{step_data.get('title', 'New Step')}',
            prompt: "{step_data.get('prompt', '')}",
            choices: [{choices_str}
            ]
        }},
"""
            new_steps_js += step_js

        # Insert before the last '}' of the steps block? 
        if "'conclusion'" in content:
            # Avoid dupes check?
            first_new_key = list(new_steps.keys())[0] if new_steps else ""
            if first_new_key and f"'{first_new_key}':" in content:
                # return True, "Already expanded (steps found)" # Allow re-expand for specific logic?
                pass
                
            content = content.replace("'conclusion'", new_steps_js + "\n        'conclusion'")
        else:
             return False, "Could not find conclusion step for insertion"

        # 2. Fix Links
        for instr in instructions:
            if 'insert_before' in instr:
                 target = instr['insert_before'] 
                 new_start = instr['step_id']
                 # Replace start: "step-1"
                 content = content.replace(f'start: "{target}"', f'start: "{new_start}"')
                 # Replace next: 'step-1'
                 content = content.replace(f"next: '{target}'", f"next: '{new_start}'")
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return True, "Success"
    except Exception as e:
        return False, str(e)


class LogicEngineApp:
    def __init__(self, root):
        self.root = root
        self.root.title("UE5 Scenario Logic Engine")
        self.root.geometry("900x750")
        
        # API Configuration
        config_frame = ttk.LabelFrame(root, text="API Configuration")
        config_frame.pack(fill="x", padx=10, pady=5)
        
        ttk.Label(config_frame, text="API Key:").grid(row=0, column=0, padx=5, pady=5)
        self.api_key = tk.StringVar()
        ttk.Entry(config_frame, textvariable=self.api_key, width=50, show="*").grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(config_frame, text="Provider:").grid(row=0, column=2, padx=5, pady=5)
        self.provider = tk.StringVar(value="Gemini")
        ttk.Combobox(config_frame, textvariable=self.provider, values=["OpenAI", "Gemini"], state="readonly", width=10).grid(row=0, column=3, padx=5, pady=5)
        
        ttk.Label(config_frame, text="Model:").grid(row=1, column=0, padx=5, pady=5)
        self.model = tk.StringVar(value="gemini-1.5-flash")
        models = [
            "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-001",
            "gemini-1.5-pro", "gemini-1.5-pro-latest", "gemini-1.5-pro-001",
            "gemini-1.0-pro", "gemini-pro"
        ]
        self.model_cb = ttk.Combobox(config_frame, textvariable=self.model, values=models, width=25)
        self.model_cb.grid(row=1, column=1, sticky="w", padx=5, pady=5)
        
        ttk.Button(config_frame, text="Fetch Models", command=self.fetch_models_list).grid(row=1, column=2, padx=5, pady=5)
        
        # Operation Mode
        mode_frame = ttk.LabelFrame(root, text="Operation Mode")
        mode_frame.pack(fill="x", padx=10, pady=5)
        
        self.mode = tk.StringVar(value="expand")
        
        ttk.Radiobutton(mode_frame, text="Expand Short Scenarios (Add Inv/Verify steps)", 
                       variable=self.mode, value="expand", command=self.load_scenarios).pack(anchor="w", padx=5)
        ttk.Radiobutton(mode_frame, text="Improve/Deepen Existing (Inject more choices/complexity)", 
                       variable=self.mode, value="improve", command=self.load_scenarios).pack(anchor="w", padx=5)

        # Scenario Selection
        list_frame = ttk.LabelFrame(root, text="Select Scenarios")
        list_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Filter Controls
        filter_frame = ttk.Frame(list_frame)
        filter_frame.pack(fill="x", padx=5, pady=2)
        self.hide_completed = tk.BooleanVar(value=True)
        ttk.Checkbutton(filter_frame, text="Hide 'Done' Scenarios", variable=self.hide_completed, command=self.load_scenarios).pack(side="left")
        
        container = ttk.Frame(list_frame)
        canvas = tk.Canvas(container)
        scrollbar = ttk.Scrollbar(container, orient="vertical", command=canvas.yview)
        self.scrollable_frame = ttk.Frame(canvas)
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        container.pack(fill="both", expand=True)
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        self.check_vars = {}
        
        # Controls
        btn_frame = ttk.Frame(root)
        btn_frame.pack(fill="x", padx=10, pady=5)
        
        ttk.Button(btn_frame, text="Run Logic Engine", command=self.run_engine).pack(side="right", padx=5)
        ttk.Button(btn_frame, text="Refresh List", command=self.load_scenarios).pack(side="right", padx=5)
        
        # Log
        log_frame = ttk.LabelFrame(root, text="Engine Log")
        log_frame.pack(fill="both", expand=True, padx=10, pady=5)
        self.log_area = scrolledtext.ScrolledText(log_frame, height=10)
        self.log_area.pack(fill="both", expand=True, padx=5, pady=5)
        
        # Initial Load
        self.load_scenarios()

    def log(self, msg):
        self.log_area.insert(tk.END, msg + "\n")
        self.log_area.see(tk.END)
        
    def fetch_models_list(self):
        key = self.api_key.get()
        provider = self.provider.get()
        if not key:
            messagebox.showerror("Error", "Please enter API Key first")
            return
        if provider == "Gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
                resp = requests.get(url, timeout=10)
                resp.raise_for_status()
                data = resp.json()
                found_models = [m['name'].replace('models/', '') for m in data.get('models', []) if "generateContent" in m.get('supportedGenerationMethods', [])]
                if found_models:
                    self.model_cb['values'] = found_models
                    self.model.set(found_models[0])
                    messagebox.showinfo("Success", f"Found {len(found_models)} models!")
                else:
                    messagebox.showwarning("Warning", "No compatible models found.")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to fetch models: {str(e)}")
        else:
            messagebox.showinfo("Wait", "Gemini only feature.")

    def load_scenarios(self):
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        self.check_vars = {}
        
        files = glob.glob('../../scenarios/*.js')
        count = 0
        current_mode = self.mode.get()
        self.log(f"Scanning {len(files)} files in '{current_mode}' mode...")
        
        for f in files:
            name = os.path.basename(f)
            
            # Skip manifest/system files
            if "manifest" in name or "localization" in name or "game.js" == name:
                continue

            # Check Status
            is_expanded = False # "Done" flag
            step_count = 0
            
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    content = file.read()
                    if "expanded: true" in content:
                        is_expanded = True
                    
                    # Count 'title' occurrences as strict proxy for step count
                    # typically 1 title per step + meta + conclusion
                    # e.g. 6 steps = 8 titles.
                    titles = len(re.findall(r"title:", content))
                    step_count = max(0, titles - 2)
                    
                    if current_mode == "expand":
                        # Expand Mode: We care if it's > 8 steps
                        if step_count > 8:
                            is_expanded = True 
                    elif current_mode == "improve":
                        # Improve Mode: We check if it's already "Improved" or HUGE
                        if "improved: true" in content:
                             is_expanded = True
                        if step_count > 25: # Don't improve massive ones
                             is_expanded = True
                        if step_count < 6: # Ignore super tiny ones for "improve"?
                             pass
            except Exception as e:
                print(f"Error reading {f}: {e}")
                pass
            
            # Filter Logic
            if self.hide_completed.get() and is_expanded:
                continue
                
            var = tk.BooleanVar()
            
            # Label
            label_text = f"{name} (~{step_count} steps)"
            if is_expanded:
                label_text += " ✅" # Done
            elif current_mode == "improve" and step_count < 8:
                label_text += " ⚠️ (Short)"
                
            cb = ttk.Checkbutton(self.scrollable_frame, text=label_text, variable=var)
            cb.pack(anchor="w", padx=5, pady=2)
            
            self.check_vars[f] = var
            count += 1
            
        self.log(f"List refreshed. Showing {count} viable scenarios.")
            
    def run_engine(self):
        key = self.api_key.get()
        if not key:
            messagebox.showerror("Error", "Please enter an API Key")
            return
            
        selected = [f for f, v in self.check_vars.items() if v.get()]
        if not selected:
            messagebox.showwarning("Warning", "No scenarios selected")
            return
            
        threading.Thread(target=self.process_queue, args=(selected, key)).start()
        
    def process_queue(self, files, key):
        self.log(f"Starting batch for {len(files)} scenarios...")
        mode = self.mode.get()
        
        for filepath in files:
            try:
                self.log(f"Processing {os.path.basename(filepath)}...")
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                prompt = self.build_prompt(content, mode)
                
                self.log("  > Sending to API...")
                response_json = self.call_llm(key, prompt)
                
                if not response_json:
                    self.log("  > Failed to get valid response")
                    continue
                    
                self.log("  > Merging...")
                success, msg = merge_scenario_expansion(filepath, response_json)
                if success:
                    self.log("  > ✅ Success!")
                else:
                    self.log(f"  > ❌ Merge failed: {msg}")
                    
            except Exception as e:
                self.log(f"Error processing {filepath}: {str(e)}")
        
        self.log("Queue finished. refreshing list...")
        self.root.after(0, self.load_scenarios)
        self.log("Done.")
        
    def build_prompt(self, content, mode):
        if mode == "expand":
            return f"""
You are the UE5 Scenario Logic Engine. 
Your task is to EXPAND this short scenario into a deeper debugging workflow.

SCENARIO:
{content}

INSTRUCTIONS:
1. Extract the core problem.
2. Generate 2-3 NEW "Investigation" steps (view modes, console commands) BEFORE the fix.
3. Generate 1 NEW "Red Herring" step.
4. Generate 2 NEW "Verification" steps (standalone test, stat unit) AFTER the fix.

STYLE RULES:
- Titles: Do NOT include "Step X" or numbers in the title. Just the name (e.g. "Checking Collision").
- Choices: Do NOT prefix choices with "Action:".

OUTPUT JSON FORMAT:
{{
  "new_steps": {{
     "step-inv-1": {{ "skill": "...", "title": "Investigation Phase", "prompt": "...", "choices": [...] }},
     "step-ver-1": {{ ... }}
  }},
  "insert_instructions": [
     {{ "insert_before": "step-1", "step_id": "step-inv-1" }}
  ]
}}
Ensure proper JSON. No markdown fencing.
"""
        elif mode == "improve":
             return f"""
You are the UE5 Scenario Logic Engine.
Your task is to DEEPEN and IMPROVE this existing scenario. 
It feels "lackluster" or too simple. 

SCENARIO:
{content}

INSTRUCTIONS:
1. Identify 1-2 steps that are too simple or jump to conclusions.
2. Create nested sets of steps to add depth there.
3. Add a "Red Herring" dead-end path if one is missing.
4. Add technical detail (Console commands: 'stat gpu', 'viewmode', etc).

STYLE RULES:
- Titles: Do NOT include "Step X" or numbers in the title. Just the name (e.g. "Analyzing GPU Profiler").
- Choices: Do NOT prefix choices with "Action:".

OUTPUT JSON FORMAT:
{{
  "new_steps": {{
     "step-deep-1": {{ "skill": "...", "title": "Deep Dive 1", "prompt": "...", "choices": [...] }},
     "step-deep-2": {{ ... }}
  }},
  "insert_instructions": [
     {{ "insert_before": "step-X", "step_id": "step-deep-1" }}
  ]
}}
IMPORTANT: Do not replace the whole file. Just output the NEW steps and where to insert them.
"""

    def call_llm(self, key, prompt):
        # ... (same as before, no changes needed)
        provider = self.provider.get()
        if provider == "OpenAI":
            headers = {"Content-Type": "application/json", "Authorization": f"Bearer {key}"}
            data = {"model": self.model.get(), "messages": [{"role": "system", "content": "You are a master UE5 technical educator."}, {"role": "user", "content": prompt}], "response_format": { "type": "json_object" }}
            url = "https://api.openai.com/v1/chat/completions"
            try:
                resp = requests.post(url, headers=headers, json=data, timeout=60)
                resp.raise_for_status()
                return json.loads(resp.json()['choices'][0]['message']['content'])
            except Exception as e:
                self.log(f"API Error: {str(e)}")
                return None
        elif provider == "Gemini":
            model_name = self.model.get()
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
            headers = {"Content-Type": "application/json"}
            data = {"contents": [{"parts": [{"text": prompt + "\n\nIMPORTANT: Return valid JSON only."}]}], "generationConfig": {"temperature": 0.2, "response_mime_type": "application/json"}}
            try:
                resp = requests.post(url, headers=headers, json=data, timeout=60)
                resp.raise_for_status()
                result = resp.json()
                os.makedirs('../../responses', exist_ok=True)
                with open('../../responses/last_raw_response.json', 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2)
                text = result['candidates'][0]['content']['parts'][0]['text']
                text = text.replace("```json", "").replace("```", "").strip()
                return json.loads(text)
            except Exception as e:
                self.log(f"Gemini Error: {str(e)}")
                return None

if __name__ == "__main__":
    root = tk.Tk()
    app = LogicEngineApp(root)
    root.mainloop()
