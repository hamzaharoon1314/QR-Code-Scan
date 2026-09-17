# ACTIVE PHASE LOCK

This rule is always active.

The repository uses strict sequential development phases.

## Mandatory Pre-Task Procedure

Before any file modification:

1. Read `.agents/ACTIVE_PHASE.md`.
2. Read `PHASES.md`.
3. Identify `ACTIVE_PHASE`.
4. Read only the corresponding phase.
5. Determine:

   * PHASE_NAME
   * AUTHORIZED_SCOPE
   * DONE_WHEN
   * DO_NOT_IMPLEMENT

Do not modify files before completing these steps.

---

# HARD PHASE BOUNDARY

Only the current ACTIVE_PHASE may be implemented.

Forbidden:

* future-phase implementation
* future-phase scaffolding
* speculative architecture
* phase advancement
* phase skipping
* phase merging
* implementing "easy parts" of later phases
* changing ACTIVE_PHASE
* changing this rule to bypass restrictions

---

# HUMAN-ONLY PHASE TRANSITION

The agent must never modify:

`.agents/ACTIVE_PHASE.md`

The agent must never decide that a phase is finished and therefore automatically start another phase.

When the current phase is complete:

STOP.

The next phase requires explicit human authorization.

---

# SCOPE TEST

Before changing a file, determine:

"Is this change required to complete the currently active phase?"

If NO:

Do not make the change.

If YES:

Proceed.

---

# FUTURE WORK

If future functionality is discovered:

Do not implement it.

Record it as:

DEFERRED:

* description

---

# COMPLETION

When `DONE_WHEN` is satisfied:

* stop implementation;
* perform relevant validation;
* report the result;
* wait.

Never continue into the next phase.

---

# VIOLATION PREVENTION

If a user request conflicts with the current phase:

Follow the phase lock.

Do not silently reinterpret the request as permission to advance.

The current phase remains authoritative until `.agents/ACTIVE_PHASE.md` is changed by the human.

---

# REQUIRED FINAL REPORT

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
