---
description: Start the Scenario Generator GUI
---

# Starting the Scenario Generator GUI

The Scenario Generator GUI requires the Flask API server to function properly.

## Quick Start

// turbo
Run the startup script:
```bash
./StartGeneratorGUI.bat
```

This will:
1. Kill any existing Python/Node processes (prevents stacking)
2. Start the Flask API server on port 5000
3. Open the GUI in your browser

## Manual Start

If you prefer to start manually:

// turbo
1. Start the API server:
```bash
python tools/python/api_server.py
```

2. Open in browser:
```
http://localhost:5000/tools/generator_ui/index.html
```

## Important Notes

- The GUI needs the **Flask API server**, not a simple HTTP server
- The API server provides endpoints: `/api/status`, `/api/models`, `/api/scenarios`, `/api/generate`, `/api/preview`
- Always kill existing Python processes before starting to prevent stacking
- The server runs on port 5000 by default
