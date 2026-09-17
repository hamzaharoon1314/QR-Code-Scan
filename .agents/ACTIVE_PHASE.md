# ACTIVE DEVELOPMENT PHASE

ACTIVE_PHASE: 3

PHASE_NAME: QR Scanner — Camera and Image

## AUTHORIZED_SCOPE

### Camera Scanner

* camera permission handling
* camera preview
* QR detection
* QR decoding
* scanner start/stop
* camera switching when practical
* copy decoded result
* clear decoded result
* duplicate detection prevention
* scanner-specific error handling

### Image Scanner

Add a second way to scan a QR code:

* upload an image containing a QR code;
* decode the QR code entirely locally;
* display the decoded result;
* allow the user to select an image from the device;
* support common image formats such as PNG, JPEG, and WebP where supported by the browser;
* allow drag-and-drop when practical;
* provide a clear error when no QR code can be detected;
* do not upload the image anywhere.

## SCANNER UI

The Scan view should provide two clearly understandable options:

```text
Scan with Camera

        OR

Scan from Image
[ Upload Image ]
```

On desktop, drag-and-drop may also be provided:

```text
┌───────────────────────────────┐
│                               │
│      Drop QR image here       │
│                               │
│       or                     │
│                               │
│     [ Choose Image ]          │
│                               │
└───────────────────────────────┘
```

Keep the UI simple.

Do not create a separate page for image scanning.

## IMAGE PROCESSING

Image QR decoding must happen entirely inside the browser.

The application must:

1. receive the selected local image;
2. load it locally;
3. process it locally;
4. detect the QR code locally;
5. decode the QR payload;
6. display the result.

The original image must never be sent to a server.

Do not use:

* cloud OCR;
* remote image recognition;
* external QR scanning APIs;
* remote uploads.

## DETECTION STRATEGY

Prefer a local browser-native QR detection capability when practical.

Provide a bundled local fallback decoder when required.

The implementation should work with:

* QR screenshots;
* photographs of QR codes;
* downloaded QR images;
* generated QR images;
* QR codes embedded inside normal images.

Do not implement general OCR.

Only QR-code detection is required.

## IMAGE ERROR HANDLING

Handle at least these cases:

### Invalid file

Show:

```text
Please select a valid image.
```

### No QR detected

Show:

```text
No QR code was detected in this image.
```

### Unsupported image

Show:

```text
This image format could not be processed.
```

### Successful scan

Show:

```text
QR detected
```

followed by the complete decoded payload.

## CAMERA REQUIREMENTS

The camera scanner must:

* request permission appropriately;
* display the camera preview;
* prefer the rear/environment camera on supported mobile devices;
* detect QR codes;
* decode QR payloads locally;
* display the complete decoded result;
* handle Unicode correctly;
* handle multiline text;
* handle JSON;
* handle URLs;
* handle large payloads supported by the QR implementation;
* avoid repeatedly processing the same QR every frame;
* allow scanning to be stopped;
* provide useful errors when camera access is unavailable.

## LARGE PAYLOAD REQUIREMENT

The scanner must be tested with QR codes containing at least:

* 100+ bytes
* 200+ bytes

Also test larger payloads supported by the QR implementation.

The decoded output must exactly match the original payload.

## ROUND-TRIP TEST

The Phase 2 generator must be tested with the Phase 3 scanner.

Test:

```text
Input
  ↓
Generate QR
  ↓
Download QR as image
  ↓
Upload QR image
  ↓
Decode
  ↓
Output
```

The final output must equal the original input.

Also test:

```text
Input
  ↓
Generate QR
  ↓
Display QR
  ↓
Camera scan
  ↓
Output
```

## SECURITY REQUIREMENTS

Decoded QR data is untrusted input.

Never:

* execute decoded content;
* inject decoded content as HTML;
* automatically navigate to decoded URLs;
* interpret decoded content as executable code.

Prefer safe text rendering.

## DO_NOT_IMPLEMENT

* general OCR
* barcode scanning other than QR
* cloud recognition
* remote OCR
* backend processing
* image uploads to servers
* scan history
* persistent scan storage
* accounts
* authentication
* encryption
* synchronization
* P2P communication
* analytics
* telemetry
* unrelated UI redesign
* speculative future functionality

## PHASE_TRANSITION

The agent MUST NOT modify this file.

The agent MUST NOT advance the phase.

Only the human user may change ACTIVE_PHASE.

When all DONE_WHEN requirements are satisfied:

STOP.

Wait for explicit human authorization before Phase 4.

## REQUIRED_FINAL_REPORT

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

* Camera scanning implemented only if authorized above.
* Image scanning implemented only if authorized above.
* No future-phase functionality implemented.
* ACTIVE_PHASE was not modified.

NEXT AUTHORIZED PHASE:
NONE — waiting for human authorization
