"""List all Unreal-related window titles for debugging."""
import subprocess
import unreal

result = subprocess.run(
    ['powershell', '-Command', "Get-Process | Where-Object {$_.MainWindowTitle -ne ''} | Select-Object MainWindowTitle"],
    capture_output=True, text=True
)
for line in result.stdout.split('\n'):
    if 'Unreal' in line or 'UE' in line:
        unreal.log(f"[WindowList] {line.strip()}")
