# AGENTS.md — Offline QR Generator & Scanner

## Project Identity

This repository contains a lightweight, fully client-side QR Code Generator and QR Code Scanner.

The application is intentionally simple.

Primary goals:

* Generate QR codes locally.
* Scan QR codes locally.
* Support large text payloads.
* Work without a backend.
* Work without cloud services.
* Be deployable as static files.
* Remain easy to understand and maintain.
* Keep the UI lightweight, responsive, and beautiful.

---

# Technology Policy

Preferred technologies:

* HTML
* JavaScript
* Tailwind CSS
* Small local QR libraries when required

Do not introduce a framework unless explicitly authorized.

Do not introduce:

* React
* Vue
* Angular
* Next.js
* Nuxt
* backend servers
* databases
* authentication systems
* cloud processing
* analytics
* telemetry
* WebSockets
* unnecessary state-management libraries

This is a static web application.

---

# Offline-First Requirement

The application must function entirely on the client.

User data must never need to leave the browser.

QR generation must happen locally.

QR decoding must happen locally.

Camera frames must be processed locally.

Do not send:

* QR payloads
* camera frames
* text input
* generated data
* scan results

to external services.

Runtime CDN dependencies are prohibited.

Remote fonts are prohibited.

Remote JavaScript is prohibited.

Remote CSS is prohibited.

Remote images are prohibited unless explicitly authorized.

---

# Source of Truth

The following files have specific responsibilities:

## `AGENTS.md`

Permanent project-level engineering instructions.

## `PHASES.md`

Complete product roadmap and phase definitions.

## `.agents/ACTIVE_PHASE.md`

Current human-authorized development phase.

This is the authoritative phase switch.

## `.agents/rules/00-phase-lock.md`

Always-on enforcement of phase isolation.

## `.agents/skills/phase-development/SKILL.md`

Reusable workflow for implementing and validating a single authorized phase.

---

# Phase System

Development is strictly phase-based.

Only one phase may be active at a time.

The active phase is determined exclusively by:

`.agents/ACTIVE_PHASE.md`

The agent must read this file before making changes.

The agent must not choose the phase itself.

The agent must not advance the phase itself.

The agent must not edit `ACTIVE_PHASE.md`.

Only the human may authorize a phase transition.

---

# Phase Isolation

During development:

1. Read `ACTIVE_PHASE.md`.
2. Identify the active phase.
3. Read that phase in `PHASES.md`.
4. Determine its authorized scope.
5. Determine what is explicitly forbidden.
6. Implement only that scope.
7. Test only what is relevant.
8. Stop when the phase is complete.

Do not implement future phases.

Do not create future-phase infrastructure "for later".

Do not partially implement future functionality.

Do not add speculative abstractions.

---

# Minimalism Policy

Prefer the simplest implementation that satisfies the requirements.

Prefer:

* small functions
* direct data flow
* local modules
* readable code
* few dependencies
* simple DOM manipulation

Avoid:

* unnecessary abstractions
* service layers
* repository patterns
* dependency injection
* complex state machines
* premature optimization
* over-architecting

This is a small static application.

---

# UI Principles

The UI should be:

* clean
* modern
* minimal
* responsive
* accessible
* fast
* visually consistent

Primary application modes:

* Generate
* Scan

Avoid unnecessary navigation or screens.

Controls should have clear labels.

Do not sacrifice usability for visual effects.

---

# Data Handling

Input may contain:

* plain text
* Unicode
* emoji
* multiline text
* JSON
* URLs
* special characters
* large payloads

Never silently truncate user input.

Do not assume:

`character count == byte count`

UTF-8 byte length must be used when byte size matters.

---

# QR Requirements

The generator should allow the QR implementation to determine the required QR version.

Do not hard-code a tiny payload limit such as 100 or 200 bytes.

The application should gracefully support larger payloads until the underlying QR implementation reaches its real capacity.

If a payload cannot be encoded:

* report the problem clearly;
* do not truncate it;
* do not silently alter it.

---

# Scanner Requirements

Camera access must be handled locally.

Prefer browser-native QR detection when practical.

Use a local fallback decoder where required.

The scanner must:

* start
* stop
* request permission appropriately
* display the camera preview
* detect QR codes
* decode the payload
* display the complete result
* prevent duplicate rapid detections

Camera processing must remain local.

---

# Browser Compatibility

Gracefully handle unsupported features.

Do not assume every browser has:

* BarcodeDetector
* camera access
* identical media-device behavior

Unsupported functionality should produce a useful user-facing message rather than a broken interface.

---

# Security Principles

Treat all decoded QR content as untrusted input.

Do not automatically execute decoded content.

Do not automatically navigate to decoded URLs.

Do not interpret QR text as HTML.

Avoid unsafe DOM insertion.

Prefer safe text rendering.

Never use `innerHTML` with untrusted QR payloads unless there is a specific, reviewed reason.

---

# File Discipline

Do not create files unless they are useful.

Keep related logic separated logically.

Do not create placeholder files for future phases.

Do not create documentation claiming functionality that does not exist.

Do not modify unrelated files.

---

# Testing Policy

Every phase must leave the application runnable.

Before declaring a phase complete:

* verify the relevant feature;
* check for obvious console errors;
* verify no unrelated functionality was introduced;
* verify the project remains within the current phase.

When practical, test with the browser's network disabled.

---

# Dependency Policy

Before adding a dependency, determine:

1. Is it required?
2. Can it reasonably be implemented without it?
3. Does it work completely offline?
4. Does it increase project complexity unnecessarily?

Prefer local, small dependencies.

Do not add dependencies merely for convenience.

---

# Change Discipline

Make focused changes.

Do not perform large unrelated refactors while implementing a phase.

If an unrelated problem is discovered:

* do not expand scope;
* record it under deferred work;
* continue with the authorized phase.

---

# Completion Rule

A phase is complete only when its `DONE_WHEN` criteria from `PHASES.md` are satisfied.

Completion does not authorize the next phase.

After completion, stop.

Wait for human authorization.

---

# Final Report

At the end of every phase, provide:

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

NEXT AUTHORIZED PHASE:
NONE — waiting for human authorization

Never claim work from a future phase.

Never advance the phase automatically.
