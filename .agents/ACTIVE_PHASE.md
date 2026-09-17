

# VERSION 5 — PHASE 5

After you personally verify Phase 4, replace the entire file with:

```md
# ACTIVE DEVELOPMENT PHASE

ACTIVE_PHASE: 5

PHASE_NAME: Final Verification and Release

## AUTHORIZED_SCOPE

- final testing
- bug fixing
- release cleanup
- documentation
- deployment preparation
- final offline verification
- final static-hosting verification

## DONE_WHEN

The application is ready for deployment as a static website.

The final verification must confirm:

### Generator

- short text works;
- 100+ byte text works;
- 200+ byte text works;
- larger supported payloads work;
- Unicode works;
- emoji works;
- multiline text works;
- JSON works;
- URLs work;
- special characters work;
- QR download works;
- oversized payloads fail clearly;
- input is never silently truncated.

### Scanner

- camera permission works;
- camera preview works;
- QR detection works;
- QR decoding works;
- generated QR codes can be scanned;
- externally generated QR codes can be scanned;
- Unicode is preserved;
- multiline content is preserved;
- JSON is preserved;
- URLs are preserved;
- large supported payloads are preserved;
- duplicate detection is controlled;
- stop scanning works.

### Round Trip

For representative test cases:

INPUT
→ GENERATE QR
→ SCAN QR
→ OUTPUT

The final output must equal the original input.

### Offline

With network access disabled:

- application loads;
- generator works;
- scanner works;
- QR generation works;
- QR decoding works;
- download works;
- copy works.

### Static Hosting

Verify that the application works from a static web host without requiring:

- backend services;
- databases;
- API endpoints;
- runtime CDN dependencies.

## DO_NOT_IMPLEMENT

No new product features.

No new architecture.

No framework migration.

No backend.

No cloud service.

No analytics.

No telemetry.

No unrelated refactoring.

This phase is for verification and release readiness only.

## FINALIZATION RULE

When all DONE_WHEN requirements are satisfied:

STOP.

Do not create another development phase automatically.

Do not modify ACTIVE_PHASE.

Do not extend the project scope.

## REQUIRED_FINAL_REPORT

PHASE:
STATUS:

IMPLEMENTED:
- ...

TESTED:
- ...

FILES CHANGED:
- ...

DEFERRED:
- ...

BLOCKED:
- ...

RELEASE_STATUS:
READY / NOT READY

FINAL_NOTES:
- ...

NEXT AUTHORIZED PHASE:
NONE — project complete
```
