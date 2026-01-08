# Scenario Syntax Fixer Tool - Implementation Plan

## Problem Statement

Multiple scenario JavaScript files have syntax errors that prevent them from loading:

- 30+ files showing `SyntaxError: Unexpected string` or `Unexpected identifier`
- Common causes: smart quotes, unescaped apostrophes, missing commas, structural issues

## Solution: Python Tool with Node.js Validation

### Tool Location

`tools/python/fix_scenario_syntax.py`

### Features

#### Phase 1: Detection & Reporting

1. Scan all `scenarios/*.js` files
2. Run Node.js syntax check on each file (`node --check <file>`)
3. Report which files have errors and the line numbers
4. Categorize errors by type

#### Phase 2: Automated Fixes

Apply these fixes in order:

| Issue | Pattern | Fix |
|-------|---------|-----|
| Smart single quotes | `'` `'` | `'` |
| Smart double quotes | `"` `"` | `"` |
| Unescaped apostrophes in strings | `"it's"` | `"it\\'s"` |
| Ellipsis character | `…` | `...` |
| Em/En dashes | `—` `–` | `-` |
| Missing trailing commas | `}\n{` in arrays | `},\n{` |

#### Phase 3: Validation

1. Re-run Node.js syntax check after fixes
2. Report remaining errors for manual review
3. Create backup files before modifying (`.js.bak`)

### Usage

```bash
# Scan only (no changes)
python tools/python/fix_scenario_syntax.py --scan

# Fix with backups
python tools/python/fix_scenario_syntax.py --fix

# Fix without backups (use with git)
python tools/python/fix_scenario_syntax.py --fix --no-backup
```

### Implementation Steps

#### Step 1: Create the base scanner

- [x] Define function to run `node --check <file>`
- [x] Parse stderr to extract error line numbers
- [x] Generate summary report

#### Step 2: Add fix functions

- [x] `fix_smart_quotes(content)` - Replace curly quotes
- [x] `fix_apostrophes(content)` - Escape apostrophes in strings
- [x] `fix_special_chars(content)` - Replace ellipsis, dashes

#### Step 3: Add validation loop

- [x] Run fixes → validate → report remaining issues

#### Step 4: Add CLI interface

- [x] argparse for --scan, --fix, --no-backup options
- [x] Color-coded output for errors/warnings/success

### Success Criteria

- All scenario files pass `node --check`
- Application loads without console syntax errors
- Debug navigation features work correctly

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Over-escaping apostrophes | Only escape within string literals, not property names |
| Breaking valid JS | Create backups, use git for recovery |
| Missing edge cases | Start with scan mode, review before applying fixes |

---
**Status:** Ready for implementation
**Estimated Time:** 30 minutes
