---

name: phase-development
description: Implements exactly one authorized project phase, validates only that phase, and stops without advancing to future phases. Use whenever developing, testing, fixing, or completing a phase of the Offline QR Generator and Scanner.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Phase Development Skill

## Purpose

This skill defines the standard workflow for implementing exactly one authorized development phase.

The project is intentionally phase-locked.

Never work on multiple phases simultaneously.

---

# Activation

Use this skill whenever the task involves:

* implementing a feature
* modifying project code
* fixing a phase-specific bug
* testing a phase
* completing a phase
* reviewing whether a phase is complete

---

# Step 1 — Read the Phase State

Read:

`.agents/ACTIVE_PHASE.md`

Extract:

* ACTIVE_PHASE
* PHASE_NAME
* AUTHORIZED_SCOPE
* DONE_WHEN
* DO_NOT_IMPLEMENT

---

# Step 2 — Read the Roadmap

Read:

`PHASES.md`

Locate the active phase.

Do not treat future phases as implementation instructions.

Future phases are reference material only.

---

# Step 3 — Inspect the Workspace

Before editing:

* inspect existing files;
* understand the current implementation;
* identify relevant existing functionality;
* avoid rewriting working code.

Do not create architecture simply because future phases may need it.

---

# Step 4 — Define the Current Task Boundary

Translate the active phase into:

CURRENTLY ALLOWED:

* ...

CURRENTLY FORBIDDEN:

* ...

Do not cross this boundary.

---

# Step 5 — Implement Minimally

Use the simplest implementation that satisfies the phase.

Prefer:

* existing browser APIs
* small functions
* direct data flow
* local modules
* minimal dependencies

Avoid unnecessary abstraction.

---

# Step 6 — Validate

Perform relevant validation.

Examples:

* load application;
* inspect browser console;
* exercise current feature;
* test expected inputs;
* test failure conditions;
* verify responsive behavior when relevant.

Do not spend the phase implementing unrelated features.

---

# Step 7 — Scope Audit

Before stopping, verify:

* no future-phase feature was implemented;
* no unnecessary dependency was added;
* no unrelated file was modified;
* no phase control file was altered;
* the application still runs.

---

# Step 8 — Stop

When `DONE_WHEN` is satisfied:

STOP.

Do not advance the phase.

Do not change:

`.agents/ACTIVE_PHASE.md`

Do not start future work.

---

# Final Report

Return:

PHASE:
STATUS:

IMPLEMENTED:

* ...

TESTED:

* ...

FILES CHANGED:

* ...

DEFERRED:

* ...

BLOCKED:

* ...

SCOPE AUDIT:

* No future-phase functionality implemented.
* ACTIVE_PHASE was not modified.

NEXT AUTHORIZED PHASE:
NONE — waiting for human authorization
