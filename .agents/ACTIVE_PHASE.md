# PHASE 6 — Image QR Scanning Improvement

## PURPOSE

Improve the existing QR Scanner by adding a second scanning method:

**Scan QR code from an uploaded image.**

This is an incremental improvement to the existing application.

The agent must build this feature on top of the current codebase and preserve all existing functionality.

---

## AUTHORIZED_SCOPE

### Image Upload

Add an image-based QR scanning option to the existing Scan interface.

Support:

* selecting an image from the device;
* PNG images;
* JPEG/JPG images;
* WebP images where supported;
* QR code screenshots;
* downloaded QR images;
* photographs containing QR codes;
* locally generated QR images;
* drag-and-drop image input where practical.

### Local QR Decoding

The selected image must be processed entirely in the browser.

Flow:

```text
User selects image
       ↓
Image loaded locally
       ↓
QR detector / decoder
       ↓
Decoded payload
       ↓
Existing result UI
```

No image or decoded data may leave the browser.

### Scanner Integration

Integrate image scanning into the **existing Scan experience**.

Do not create a separate application or unrelated page.

The Scan UI should provide both:

```text
Camera
Image
```

These are two input methods for the same QR scanning functionality.

### Result Handling

Use the existing scanner result display whenever possible.

After successful image scanning:

* display the decoded payload;
* allow existing Copy functionality to work;
* allow existing Clear functionality to work;
* preserve the same safe text handling already used by the application.

### Error Handling

Provide clear errors for:

```text
Invalid image
Unsupported image
No QR code detected
Image could not be processed
```

Do not crash the application.

### Privacy

Image processing must remain local.

Do not introduce:

* image uploads;
* cloud OCR;
* remote QR APIs;
* external image-processing services;
* analytics;
* telemetry.

---

## IMPROVEMENT PRINCIPLE

This phase is an enhancement to the existing application.

The agent must:

* reuse the current scanner architecture;
* reuse existing UI components/patterns where practical;
* reuse existing QR decoding infrastructure where possible;
* avoid duplicating scanner logic;
* avoid unnecessary dependencies;
* avoid rewriting working functionality.

Do not rebuild the application from scratch.

---

## IMPLEMENTATION PRINCIPLE

Prefer the simplest local implementation that fits the existing architecture.

Do not introduce a framework.

Do not redesign the entire scanner.

Do not refactor unrelated code.

Only modify existing architecture where required to cleanly integrate image scanning.

---

## TESTING

Test at minimum:

### Existing functionality

Verify that camera scanning still works exactly as before.

### Image scanning

Test:

* small QR image;
* large QR image;
* screenshot of QR;
* downloaded QR;
* photographed QR;
* Unicode payload;
* multiline payload;
* JSON payload;
* URL payload;
* 100+ byte payload;
* 200+ byte payload.

### Round trip

Test:

```text
Generate QR
    ↓
Download PNG
    ↓
Upload PNG
    ↓
Decode
    ↓
Original payload
```

The decoded result must exactly match the original input.

### Failure cases

Test:

```text
random image
empty image
unsupported file
image without QR
blurred QR
```

The application must show a useful error instead of failing silently.

---

## DONE_WHEN

Phase 6 is complete when:

* the existing camera scanner still works;
* users can upload an image containing a QR code;
* QR codes are decoded entirely locally;
* decoded data appears in the existing result interface;
* Copy and Clear continue working;
* 100+ byte payloads work;
* 200+ byte payloads work;
* invalid images are handled gracefully;
* images are never uploaded;
* no unrelated functionality is broken;
* no unnecessary dependencies are introduced;
* the application remains lightweight;
* the application remains static-hosting compatible;
* the application remains offline-capable.

---

## DO_NOT_IMPLEMENT

* general OCR;
* barcode support;
* video/image AI recognition;
* cloud processing;
* backend services;
* scan history;
* accounts;
* synchronization;
* encryption;
* new application architecture;
* unrelated UI redesign;
* unrelated refactoring;
* future features not explicitly authorized.

---

## PHASE_TRANSITION

The agent MUST NOT modify `ACTIVE_PHASE.md`.

The agent MUST NOT advance to another phase.

Only the human user may authorize another phase.

When all DONE_WHEN requirements are satisfied:

STOP.

Wait for human authorization.
