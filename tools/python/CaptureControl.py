"""
Scenario Capture Control - One-Button Automation
- Auto-executes Python in UE5 via upyrc
- Monitors clipboard for PrintScreen (auto-capture)
- Reads scenarios from config/capture_scenarios.json
"""

import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageGrab, ImageTk
import os
import json
import threading
import time
import hashlib

# Optional: UE5 Remote Execution
try:
    import upyrc
    UPYRC_AVAILABLE = True
except ImportError:
    UPYRC_AVAILABLE = False
    print("upyrc not installed. Install with: pip install upyrc")


class CaptureControlPanel:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("UE5 Scenario Capture")
        self.root.geometry("520x900")
        self.root.configure(bg='#1a1a2e')
        self.root.attributes('-topmost', True)
        
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.config_path = os.path.join(self.base_dir, "config", "capture_scenarios.json")
        self.output_base = os.path.join(self.base_dir, "assets", "generated")
        
        # UE5 Remote API settings
        self.ue_api_url = "http://localhost:30010/remote/object/call"
        self.ue_exec_url = "http://localhost:30010/remote/execution"
        
        self.scenarios = {}
        self.current_scenario = None
        self.current_step = 0
        self.preview_img = None
        self.auto_capture_enabled = True
        self.last_clipboard_hash = None
        self.ue_connection = None
        
        self._load_config()
        self._build_ui()
        self._init_clipboard_hash()  # Initialize hash to prevent re-detection
        self._start_clipboard_monitor()
        
    def _init_clipboard_hash(self):
        """Initialize clipboard hash to prevent re-detecting existing clipboard content"""
        try:
            img = ImageGrab.grabclipboard()
            if img is not None and isinstance(img, Image.Image):
                # Use MD5 on the full image data for absolute stability
                self.last_clipboard_hash = hashlib.md5(img.tobytes()).hexdigest()
                print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] Initialized with MD5: {self.last_clipboard_hash}")
        except Exception as e:
            print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] Init Error: {e}")
            pass
    
    def _load_config(self):
        try:
            with open(self.config_path, 'r') as f:
                data = json.load(f)
                self.scenarios = data.get('scenarios', {})
        except Exception as e:
            print(f"Config load error: {e}")
            self.scenarios = {"directional_light": {"title": "Default", "steps": []}}
        
    def _build_ui(self):
        # Header
        tk.Label(self.root, text="📸 One-Button Capture", font=("Segoe UI", 16, "bold"), 
                 fg='#e94560', bg='#1a1a2e').pack(pady=10)
        
        # UE5 Connection Status
        conn_frame = tk.Frame(self.root, bg='#16213e', padx=10, pady=5)
        conn_frame.pack(fill='x', padx=10, pady=5)
        
        self.conn_status = tk.Label(conn_frame, text="⚪ UE5: Not Connected", 
                                    font=("Segoe UI", 9), fg='#888', bg='#16213e')
        self.conn_status.pack(side='left')
        
        tk.Button(conn_frame, text="Connect", font=("Segoe UI", 8), bg='#0f3460', fg='white',
                  relief='flat', padx=8, command=self._connect_ue5).pack(side='right')
        
        # Scenario Selector
        selector_frame = tk.Frame(self.root, bg='#16213e', padx=10, pady=8)
        selector_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Label(selector_frame, text="SCENARIO", font=("Segoe UI", 9), fg='#4ade80', 
                 bg='#16213e').pack(anchor='w')
        
        self.scenario_var = tk.StringVar()
        scenario_names = list(self.scenarios.keys())
        if scenario_names:
            self.scenario_var.set(scenario_names[0])
            self.current_scenario = scenario_names[0]
        
        self.scenario_dropdown = ttk.Combobox(selector_frame, textvariable=self.scenario_var, 
                                               values=scenario_names, state='readonly', width=40)
        self.scenario_dropdown.pack(fill='x', pady=5)
        self.scenario_dropdown.bind('<<ComboboxSelected>>', self._on_scenario_change)
        
        # === ONE-BUTTON CAPTURE ===
        big_btn_frame = tk.Frame(self.root, bg='#1a1a2e')
        big_btn_frame.pack(fill='x', padx=10, pady=15)
        
        self.capture_all_btn = tk.Button(big_btn_frame, 
            text="🚀 CAPTURE ALL STEPS\n(Auto-run in UE5 + PrintScreen)", 
            font=("Segoe UI", 14, "bold"), bg='#4ade80', fg='#1a1a2e', 
            relief='flat', padx=20, pady=15, command=self._capture_all_steps)
        self.capture_all_btn.pack(fill='x')
        
        # Steps List
        tk.Label(self.root, text="STEPS", font=("Segoe UI", 10, "bold"), 
                 fg='#e94560', bg='#1a1a2e').pack(pady=(10, 5))
        
        self.steps_frame = tk.Frame(self.root, bg='#1a1a2e')
        self.steps_frame.pack(fill='x', padx=10)
        
        # Current Step Info
        self.current_frame = tk.Frame(self.root, bg='#0f3460', padx=15, pady=10)
        self.current_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(self.current_frame, text="CURRENT", font=("Segoe UI", 9), 
                 fg='#4ade80', bg='#0f3460').pack(anchor='w')
        self.step_label = tk.Label(self.current_frame, text="", font=("Segoe UI", 11, "bold"), 
                                   fg='white', bg='#0f3460')
        self.step_label.pack(anchor='w', pady=3)
        
        self.cmd_label = tk.Label(self.current_frame, text="", font=("Consolas", 9), 
                                  fg='#4ade80', bg='#0f3460', wraplength=450)
        self.cmd_label.pack(anchor='w')
        
        # Highlight Properties
        self.props_label = tk.Label(self.current_frame, text="", font=("Segoe UI", 10, "bold"), 
                                    fg='#ffc107', bg='#0f3460', wraplength=450, justify='left')
        self.props_label.pack(anchor='w', pady=(5, 0))
        
        # Run Step Button (manual)
        btn_frame = tk.Frame(self.current_frame, bg='#0f3460')
        btn_frame.pack(anchor='w', pady=(8, 0))
        
        tk.Button(btn_frame, text="▶ Run in UE5", font=("Segoe UI", 9), 
                  bg='#16213e', fg='white', relief='flat', padx=8, pady=3,
                  command=self._run_current_step).pack(side='left', padx=(0, 5))
        
        tk.Button(btn_frame, text="📋 Copy", font=("Segoe UI", 9), 
                  bg='#16213e', fg='white', relief='flat', padx=8, pady=3,
                  command=self._copy_command).pack(side='left', padx=(0, 10))
        
        # Navigation buttons
        tk.Button(btn_frame, text="⬅ Prev", font=("Segoe UI", 9), 
                  bg='#333', fg='white', relief='flat', padx=8, pady=3,
                  command=self._prev_step).pack(side='left', padx=(0, 3))
        
        tk.Button(btn_frame, text="Next ➡", font=("Segoe UI", 9), 
                  bg='#333', fg='white', relief='flat', padx=8, pady=3,
                  command=self._next_step).pack(side='left')
        
        # Preview
        preview_frame = tk.Frame(self.root, bg='#16213e', padx=5, pady=5)
        preview_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(preview_frame, text="PREVIEW (auto-saves on PrintScreen)", font=("Segoe UI", 9), 
                 fg='#4ade80', bg='#16213e').pack(anchor='w')
        self.preview_label = tk.Label(preview_frame, text="Waiting...", 
                                      font=("Segoe UI", 9), fg='#555', bg='#222', 
                                      width=60, height=8)
        self.preview_label.pack(pady=5)
        
        # Delete current image button
        tk.Button(preview_frame, text="🗑️ Delete Current Image", font=("Segoe UI", 9), 
                  bg='#e94560', fg='white', relief='flat', padx=10, pady=3,
                  command=self._delete_current_image).pack(pady=5)
        
        # Status
        self.status = tk.Label(self.root, text="🔄 Ready - Click 'Capture All' or press PrintScreen", 
                               font=("Segoe UI", 9), fg='#4ade80', bg='#1a1a2e')
        self.status.pack()
        
        # Reset
        ttk.Button(self.root, text="Reset All", command=self._reset).pack(pady=10)
        
        self._update_steps_display()
    
    def _connect_ue5(self):
        """Test connection to UE5 Remote Control API via HTTP"""
        import requests
        
        def connect_thread():
            try:
                # Test connection with a simple ping
                response = requests.get("http://localhost:30010/remote/info", timeout=5)
                if response.status_code == 200:
                    self.ue_connection = True
                    self.root.after(0, lambda: self.conn_status.configure(
                        text="🟢 UE5: Connected", fg='#4ade80'))
                    self.root.after(0, lambda: self.status.configure(
                        text="✓ Connected to UE5! Click 'Capture All'", fg='#4ade80'))
                else:
                    raise Exception(f"Status {response.status_code}")
            except Exception as e:
                self.root.after(0, lambda: self.conn_status.configure(
                    text=f"🔴 UE5: Not Running", fg='#ff4444'))
                self.root.after(0, lambda: self.status.configure(
                    text="Enable Remote Control API in UE5 Project Settings", fg='#ffc107'))
        
        self.conn_status.configure(text="🟡 UE5: Connecting...", fg='#ffc107')
        threading.Thread(target=connect_thread, daemon=True).start()
    
    def _run_current_step(self):
        """Execute current step's command in UE5 via HTTP"""
        import requests
        import json
        
        if not self.ue_connection:
            self._copy_command()
            self.status.configure(text="📋 Copied (click Connect first)", fg='#ffc107')
            return
        
        steps = self.scenarios[self.current_scenario].get('steps', [])
        if self.current_step >= len(steps):
            return
        
        step = steps[self.current_step]
        cmd = f"import ManualCapture; import importlib; importlib.reload(ManualCapture); ManualCapture.setup('{self.current_scenario}', '{step['id']}')"
        
        def exec_thread():
            try:
                # Execute Python via Remote Control API
                payload = {"command": cmd}
                response = requests.put(
                    "http://localhost:30010/remote/execution",
                    data=json.dumps(payload),
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                if response.status_code == 200:
                    self.root.after(0, lambda: self.status.configure(
                        text=f"✓ Executed {step['id']} - Now press PrintScreen", fg='#4ade80'))
                else:
                    self.root.after(0, lambda: self.status.configure(
                        text=f"⚠️ UE5 returned {response.status_code}", fg='#ff4444'))
            except Exception as e:
                self.root.after(0, lambda: self.status.configure(
                    text=f"⚠️ Error: {e}", fg='#ff4444'))
        
        self.status.configure(text=f"▶ Running {step['id']}...", fg='#ffc107')
        threading.Thread(target=exec_thread, daemon=True).start()
    
    def _capture_all_steps(self):
        """One-button capture all steps"""
        if not self.ue_connection:
            messagebox.showwarning("Not Connected", 
                "Click 'Connect' first to connect to UE5.\n\n" +
                "Or use manual mode:\n1. Copy command\n2. Paste in UE5\n3. PrintScreen")
            return
        
        self.current_step = 0
        self._run_current_step()
        self.status.configure(text="🚀 Step 1 running... Press PrintScreen when ready", fg='#4ade80')
    
    def _start_clipboard_monitor(self):
        self._check_clipboard()
    
    def _check_clipboard(self):
        if self.auto_capture_enabled:
            try:
                img = ImageGrab.grabclipboard()
                if img is not None:
                    if isinstance(img, Image.Image):
                        # Use MD5 on the full image data for absolute stability
                        img_hash = hashlib.md5(img.tobytes()).hexdigest()
                        if img_hash != self.last_clipboard_hash:
                            print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] NEW IMAGE! Hash: {img_hash} (Prev: {self.last_clipboard_hash})")
                            self.last_clipboard_hash = img_hash
                            self._auto_capture(img)
                        # else:
                        #     print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] Same hash: {img_hash}")
                    elif isinstance(img, list):
                        print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] File list: {img}")
            except Exception as e:
                print(f"[{time.strftime('%H:%M:%S')}] [CLIPBOARD] ERROR: {e}")
        self.root.after(500, self._check_clipboard)
    
    def _auto_capture(self, img):
        if not self.current_scenario:
            return
        steps = self.scenarios[self.current_scenario].get('steps', [])
        if self.current_step >= len(steps):
            return
        
        step = steps[self.current_step]
        output_dir = os.path.join(self.output_base, self.current_scenario)
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, f"{step['id']}.png")
        img.save(filepath, 'PNG')
        
        self._show_preview(img)
        self.current_step += 1
        self._update_steps_display()
        
        # Auto-run next step if connected
        if self.current_step < len(steps):
            self.status.configure(text=f"✓ Saved {step['id']} - Running next...", fg='#4ade80')
            if self.ue_connection:
                self.root.after(500, self._run_current_step)
        else:
            self.status.configure(text="🎉 All steps captured!", fg='#4ade80')
    
    def _on_scenario_change(self, event):
        self.current_scenario = self.scenario_var.get()
        self.current_step = 0
        self.last_clipboard_hash = None
        self._update_steps_display()
    
    def _update_steps_display(self):
        for widget in self.steps_frame.winfo_children():
            widget.destroy()
        
        if not self.current_scenario or self.current_scenario not in self.scenarios:
            return
        
        steps = self.scenarios[self.current_scenario].get('steps', [])
        
        for i, step in enumerate(steps):
            frame = tk.Frame(self.steps_frame, bg='#16213e', padx=10, pady=3)
            frame.pack(fill='x', pady=1)
            
            if i < self.current_step:
                indicator, color, bg = "✓", '#4ade80', '#1a3a2e'
            elif i == self.current_step:
                indicator, color, bg = "►", '#e94560', '#0f3460'
            else:
                indicator, color, bg = "○", '#555', '#16213e'
            
            frame.configure(bg=bg)
            tk.Label(frame, text=indicator, font=("Segoe UI", 9), fg=color, bg=bg).pack(side='left')
            tk.Label(frame, text=f"{step['id']}", font=("Segoe UI", 8), 
                     fg='white', bg=bg).pack(side='left', padx=5)
        
        if self.current_step < len(steps):
            step = steps[self.current_step]
            self.step_label.configure(text=f"{step['id']}: {step['desc']}")
            # Force reload to ensure any script changes are picked up
            cmd = f"import ManualCapture; import importlib; importlib.reload(ManualCapture); ManualCapture.setup('{self.current_scenario}', '{step['id']}')"
            self.cmd_label.configure(text=cmd)
            
            # Show specific properties to highlight in screenshot
            props = [f"{k}: {v}" for k, v in step.items() if k not in ['id', 'desc']]
            if props:
                self.props_label.configure(text="🎯 CAPTURE VALUES: " + " | ".join(props))
            else:
                self.props_label.configure(text="")
        else:
            self.step_label.configure(text="All Done! 🎉")
            self.cmd_label.configure(text="")
            self.props_label.configure(text="")
    
    def _prev_step(self):
        """Go to previous step"""
        if self.current_step > 0:
            self.current_step -= 1
            self._update_steps_display()
            self.status.configure(text=f"◀ Moved to step {self.current_step}", fg='#4ade80')
    
    def _next_step(self):
        """Go to next step"""
        steps = self.scenarios[self.current_scenario].get('steps', [])
        if self.current_step < len(steps) - 1:
            self.current_step += 1
            self._update_steps_display()
            self.status.configure(text=f"▶ Moved to step {self.current_step}", fg='#4ade80')
    
    def _copy_command(self):
        if not self.current_scenario:
            return
        steps = self.scenarios[self.current_scenario].get('steps', [])
        if self.current_step >= len(steps):
            return
        
        step = steps[self.current_step]
        cmd = f"import ManualCapture; import importlib; importlib.reload(ManualCapture); ManualCapture.setup('{self.current_scenario}', '{step['id']}')"
        
        self.root.clipboard_clear()
        self.root.clipboard_append(cmd)
        self.status.configure(text="📋 Copied! Paste in UE5 console", fg='#4ade80')
    
    def _show_preview(self, img):
        max_width, max_height = 480, 150
        ratio = min(max_width / img.width, max_height / img.height)
        preview_width = int(img.width * ratio)
        preview_height = int(img.height * ratio)
        
        img_resized = img.resize((preview_width, preview_height), Image.Resampling.LANCZOS)
        self.preview_img = ImageTk.PhotoImage(img_resized)
        self.preview_label.configure(image=self.preview_img, text="", 
                                     width=preview_width, height=preview_height)
    
    def _delete_current_image(self):
        """Delete the current step's captured image"""
        from tkinter import messagebox
        
        if not self.current_scenario:
            return
        
        steps = self.scenarios[self.current_scenario].get('steps', [])
        if self.current_step >= len(steps):
            self.status.configure(text="⚠️ No step selected", fg='#ffc107')
            return
        
        step = steps[self.current_step]
        img_path = os.path.join(self.output_base, self.current_scenario, f"{step['id']}.png")
        
        if os.path.exists(img_path):
            if messagebox.askyesno("Delete", f"Delete {step['id']}.png?"):
                try:
                    os.remove(img_path)
                    self.preview_label.configure(image='', text="Deleted - Waiting...")
                    self.preview_img = None
                    # Update hash from current clipboard state to prevent re-detection
                    self._init_clipboard_hash()
                    self.status.configure(text=f"🗑️ Deleted {step['id']}.png", fg='#4ade80')
                    self._update_steps_display()
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to delete: {e}")
        else:
            self.status.configure(text=f"⚠️ No image for {step['id']}", fg='#ffc107')
    
    def _reset(self):
        from tkinter import messagebox
        import shutil
        
        # Ask user if they want to delete images too
        if self.current_scenario:
            output_dir = os.path.join(self.output_base, self.current_scenario)
            if os.path.exists(output_dir) and os.listdir(output_dir):
                if messagebox.askyesno("Reset", f"Delete all captured images for '{self.current_scenario}'?"):
                    try:
                        shutil.rmtree(output_dir)
                        os.makedirs(output_dir, exist_ok=True)
                        # Clear clipboard to prevent re-detection
                        self.root.clipboard_clear()
                    except Exception as e:
                        messagebox.showerror("Error", f"Failed to delete: {e}")
        
        self.current_step = 0
        # Update hash from current clipboard state to prevent re-detection
        self._init_clipboard_hash()
        self.preview_label.configure(image='', text="Waiting...")
        self.preview_img = None
        self.status.configure(text="🔄 Reset complete!", fg='#4ade80')
        self._update_steps_display()
    
    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    CaptureControlPanel().run()
