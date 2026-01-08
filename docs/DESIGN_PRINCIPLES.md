# Scenario Tracker - Design Principles

## Core Principle: Human-in-the-Loop

> **AI cannot make decisions. Humans approve everything.**

This applies to all automation in this project:

| Stage | AI Does | Human Decides |
|-------|---------|---------------|
| Generation | Draft scenario | Review/edit feedback |
| Scene Setup | Run setup script | Approve scene, camera |
| Capture | Guide workflow | Take screenshot |
| Deploy | Package SCORM | Final approval |

---

## Assessment Tool Philosophy

- No hints (only tooltips for UI guidance)
- Wrong answers loop back with probing questions
- Feedback sounds like a senior mentoring a junior, not corporate

---

## SCORM 1.2 Analytics

Track everything for LMS:

- `choicesMade` — Selections per step
- `attemptsPerStep` — Retries before correct
- `loggedTime` — Time penalties
- `skill` — Category tag
- `completionStatus` — Pass/fail/incomplete
