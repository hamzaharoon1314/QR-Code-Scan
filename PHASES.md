# Offline QR Generator & Scanner

## Project Goal

Build a lightweight, beautiful, fully client-side QR generator and scanner.

Technology:

* HTML
* JavaScript
* Tailwind CSS
* Local/bundled QR libraries when required

Hard requirements:

* no backend
* no database
* no API
* no analytics
* no telemetry
* no cloud processing
* no CDN runtime dependency
* fully client-side
* static hosting compatible
* offline capable

---

# PHASE 1 — Static Foundation

## AUTHORIZED_SCOPE

* project structure
* index.html
* Tailwind CSS
* application shell
* Generate/Scan navigation
* responsive layout
* local assets
* offline-safe loading

## DONE_WHEN

The application opens and the basic Generate and Scan UI exists.

## DO_NOT_IMPLEMENT

* QR generation
* QR scanning
* camera access
* QR decoding
* history
* persistence
* backend
* encryption

---

# PHASE 2 — QR Generator

## AUTHORIZED_SCOPE

* text input
* UTF-8 handling
* QR generation
* QR rendering
* character count
* byte count
* clear
* download
* payload validation
* QR error handling

## DONE_WHEN

Users can enter arbitrary text and generate a valid QR completely locally.

Must support at least:

* 100+ byte payloads
* 200+ byte payloads
* Unicode
* multiline text
* JSON
* URLs

Never silently truncate input.

## DO_NOT_IMPLEMENT

* camera scanning
* scanner logic
* history
* persistence
* authentication
* cloud processing

---

# PHASE 3 — QR Scanner

## AUTHORIZED_SCOPE

* camera permission
* camera preview
* QR detection
* QR decoding
* decoded text display
* copy result
* start/stop scanning
* camera switching when practical

## DONE_WHEN

Users can scan QR codes entirely in the browser and recover the exact original payload.

## DO_NOT_IMPLEMENT

* cloud recognition
* remote OCR
* backend processing
* history
* authentication
* synchronization

---

# PHASE 4 — Integration & Hardening

## AUTHORIZED_SCOPE

* generator/scanner integration
* responsive fixes
* accessibility
* error handling
* performance
* offline verification
* browser compatibility

## DONE_WHEN

The application behaves as a polished offline QR application.

## DO_NOT_IMPLEMENT

Any feature not required for the existing application.

---

# PHASE 5 — Final Verification

## AUTHORIZED_SCOPE

* testing
* bug fixes
* documentation
* deployment preparation
* cleanup

## DONE_WHEN

The application is ready for static hosting.

Verify:

* generator works
* scanner works
* UTF-8 works
* 100+ byte payload works
* 200+ byte payload works
* larger supported payloads work
* generated QR can be scanned
* external QR codes can be scanned
* offline operation works
* no unexpected network requests
* no console errors
