# UE5 Scenario Generator - Token-Efficient AI Tool

## Overview

This tool uses Google's Gemini API to automatically generate UE5 debugging assessment scenarios from structured data. It employs a **two-pass generation strategy** to minimize token usage while maintaining high quality.

## Features

- ✅ **Two-Pass Generation**: Outline first, details second (saves ~25% tokens)
- ✅ **Template Library**: Reusable wrong answer patterns (saves ~40% tokens)
- ✅ **Batch Processing**: Process multiple scenarios efficiently
- ✅ **Token Tracking**: Monitor API usage and costs
- ✅ **Validation**: Automatic scenario structure validation
- ✅ **Category Grouping**: Process by category for context sharing

## Installation

### 1. Install Dependencies

```bash
pip install google-generativeai
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. **🔒 SECURE SETUP (Recommended)**: Store in `.env` file

**Create a `.env` file in the project root:**

```bash
# Copy the example file
Copy-Item .env.example .env

# Edit .env and add your key:
GEMINI_API_KEY=your-api-key-here
```

The `.env` file is automatically gitignored and will never be committed. ✅

**Alternative: Set environment variable (less secure):**

<details>
<summary>Click to expand legacy environment variable setup</summary>

**Windows (PowerShell):**

```powershell
$env:GEMINI_API_KEY = "your-api-key-here"
```

**Windows (Command Prompt):**

```cmd
set GEMINI_API_KEY=your-api-key-here
```

**Linux/Mac:**

```bash
export GEMINI_API_KEY="your-api-key-here"
```

</details>

📖 **See [API_KEY_SECURITY.md](../docs/API_KEY_SECURITY.md) for full security documentation.**

## Usage

### Generate Single Scenario

```bash
cd tools/python
python scenario_generator.py
```

This will:

1. Load the first scenario from `raw_data.json`
2. Generate it using Gemini API
3. Save to `scenarios/[scenario_id].js`
4. Report token usage

### Batch Convert All Scenarios

```bash
cd tools/python
python batch_convert.py
```

### Batch Convert by Category

```bash
python batch_convert.py --category "Lighting & Rendering"
```

Available categories:

- `Lighting & Rendering`
- `Blueprints & Logic`
- `Materials & Shaders`
- `World Partition & Streaming`
- `Physics & Collisions`
- `Performance & Optimization`

### Batch Convert Range

```bash
python batch_convert.py --range "0-5"
```

This processes scenarios 0 through 4 (5 scenarios total).

### Custom Paths

```bash
python batch_convert.py --input custom_data.json --output custom_scenarios --templates custom_templates.json
```

## Token Efficiency

### Expected Usage (Gemini 1.5 Flash)

| Method | Tokens/Scenario | Cost per Scenario |
|--------|----------------|-------------------|
| Naive approach | ~3000 | $0.0006 |
| **This tool** | ~1500 | $0.0003 |
| With caching | ~1200 | $0.00024 |

**For 20 scenarios:**

- Naive: $0.012
- **This tool: $0.006**
- **Savings: 50%**

### How It Saves Tokens

1. **Two-Pass Generation**
   - Pass 1: Generate outline only (~500 tokens)
   - Pass 2: Expand details (~1000 tokens)
   - Total: ~1500 tokens vs ~3000 naive

2. **Template Library**
   - Reuses common wrong answer patterns
   - Injects only relevant templates per category
   - Reduces redundant generation

3. **Concise Prompts**
   - No verbose instructions
   - Direct task description
   - Minimal examples

## File Structure

```
tools/
├── python/
│   ├── scenario_generator.py    # Core generator (two-pass)
│   ├── batch_convert.py          # Batch processor
│   └── ...
├── templates/
│   └── scenario_templates.json   # Reusable components
scenarios/
├── [scenario_id].js              # Generated scenarios
raw_data.json                     # Source data
```

## Template Library

The `scenario_templates.json` contains:

- **Wrong Answer Patterns**: Category-specific common mistakes
- **Investigation Modules**: Debugging techniques
- **Verification Modules**: Testing approaches
- **Common Settings**: Frequently used UE5 settings

You can edit this file to improve generation quality over time.

## Validation

The tool automatically validates:

- ✅ Required fields (meta, start, steps)
- ✅ Step flow (all `next` references exist)
- ✅ Choice structure (each step has correct/wrong choices)
- ✅ JSON syntax

Failed scenarios are reported with specific errors.

## Troubleshooting

### "No JSON found in response"

The AI didn't return valid JSON. Try:

1. Check your API key is valid
2. Ensure you have API quota remaining
3. Try a simpler scenario first

### "Validation failed"

The generated scenario has structural issues. Check:

1. The raw_data.json format is correct
2. All required fields are present
3. Step references are valid

### High token usage

If tokens are higher than expected:

1. Check if scenarios are very complex (many steps)
2. Ensure templates are loading correctly
3. Consider simplifying problem descriptions

## Next Steps

1. ✅ Test with 1 scenario
2. ✅ Measure token usage
3. ⏳ Batch convert 5 scenarios
4. ⏳ Refine templates based on results
5. ⏳ Build GUI integration

## Cost Monitoring

The tool tracks:

- Total tokens used
- Average tokens per scenario
- Estimated cost (based on Gemini 1.5 Flash pricing)

Example output:

```
📊 Total tokens used: ~7500
📊 Average tokens per scenario: ~1500
💰 Estimated cost: $0.0014
```

## API Limits

Gemini 1.5 Flash (free tier):

- 15 requests per minute
- 1 million tokens per minute
- 1500 requests per day

The batch processor respects these limits automatically.

## Support

For issues or questions:

1. Check the validation output
2. Review the generated JSON
3. Inspect token usage logs
4. Verify API key and quota
