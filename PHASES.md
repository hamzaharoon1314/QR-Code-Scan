# PHASE 8 — Reusable QR Module / SDK

## PURPOSE

Convert the existing QR generation and scanning capabilities into a **small reusable JavaScript module** that can be imported by other applications.

The existing QR-Code-Scan application remains the reference/demo application.

Other applications must be able to import the QR functionality without importing the entire application UI.

This phase is a modularization and distribution improvement.

---

# CORE OBJECTIVE

Create reusable QR functionality with a clean API.

Another application should be able to do things such as:

```js
import { generateQR } from "./qr-kit.js";
```

and:

```js
const qr = await generateQR("Hello World");
```

and display the returned QR result wherever it wants.

Similarly:

```js
import { scanQRFromImage } from "./qr-kit.js";
```

or:

```js
import { QRScanner } from "./qr-kit.js";
```

The consuming application must control its own:

* UI
* layout
* styling
* buttons
* dialogs
* pages
* frameworks

The QR module must not force Tailwind CSS or the existing application's UI.

---

# DESIGN PRINCIPLE

Separate:

```text
QR functionality
        ↓
Reusable library
        ↓
Application UI
```

Do NOT keep QR functionality tightly coupled to:

```text
index.html
app.js
Tailwind
specific DOM element IDs
specific page layout
specific CSS classes
```

---

# TARGET STRUCTURE

Create a modular structure based on the existing codebase.

Recommended structure:

```text
js/
├── app.js
│
├── qr/
│   ├── qr-generator.js
│   ├── qr-scanner.js
│   ├── qr-image-scanner.js
│   ├── qr-utils.js
│   └── index.js
│
├── qrcode.js
├── qrcode_UTF8.js
└── jsQR.js
```

A separate distributable directory may be created:

```text
dist/
└── qr-kit/
    ├── qr-kit.js
    ├── qr-kit.min.js
    └── qr-kit.css
```

Do not create unnecessary files.

The final structure may differ if the implementation has a simpler equivalent.

---

# MODULE RESPONSIBILITIES

## `qr-generator.js`

Responsible only for QR generation.

It should expose reusable generation functions.

Example:

```js
generateQR(data, options)
```

Possible result:

```js
{
  data,
  canvas,
  image,
  dataUrl,
  width,
  height
}
```

The implementation may choose a cleaner result shape.

The API must be documented.

Do not require a particular DOM element.

---

# GENERATOR API

Provide a simple high-level function such as:

```js
generateQR(data, options)
```

Minimum input:

```js
data: string
```

Optional configuration may include:

```js
{
  size,
  errorCorrection,
  margin,
  format
}
```

Only expose options that are actually supported.

Do not expose internal QR library details unnecessarily.

---

# GENERATOR OUTPUT

The reusable generator should support at least one easy-to-consume result.

Preferred options:

```text
data URL
Canvas
SVG
Blob
```

The consuming application should be able to choose how it displays the QR.

Example:

```js
const result = await generateQR("Hello World");

document.querySelector("#qr").src = result.dataUrl;
```

Or:

```js
const canvas = await generateQRCanvas("Hello World");
document.querySelector("#container").appendChild(canvas);
```

The exact API may be designed by the agent as long as it remains:

* simple;
* documented;
* framework-independent;
* browser-friendly.

---

# SCANNER MODULE

## `qr-scanner.js`

Responsible for camera-based QR scanning.

It must not depend on the application's existing HTML structure.

Provide a reusable class or function.

Example design:

```js
const scanner = new QRScanner({
  video: videoElement,
  onResult: result => {
    console.log(result);
  },
  onError: error => {
    console.error(error);
  }
});

scanner.start();
```

The consumer controls the `<video>` element.

The module controls QR detection.

---

# SCANNER CONTROLS

The reusable scanner should provide:

```text
start()
stop()
destroy()
```

Optional:

```text
switchCamera()
```

where practical.

Do not force buttons or UI into the consuming application.

---

# IMAGE SCANNER MODULE

## `qr-image-scanner.js`

Provide reusable image scanning.

Example:

```js
const result = await scanQRFromImage(file);
```

The function should accept practical browser image inputs such as:

* `File`
* `Blob`
* image URL where safely supported
* image element where practical

The implementation must process the image locally.

No upload.

No cloud service.

No remote QR API.

---

# CORE DECODER

The image scanner and camera scanner should reuse the existing local QR decoding implementation where practical.

Do not create multiple independent QR decoding implementations.

The module should internally use the existing QR decoder.

---

# UTF-8 AND PAYLOAD HANDLING

The reusable library must preserve the same behavior as the main application.

Support:

* normal text
* Unicode
* emoji
* multiline text
* JSON
* URLs
* special characters
* 100+ byte payloads
* 200+ byte payloads
* larger payloads supported by the QR implementation

Never silently truncate input.

---

# PURE CORE API

Where possible, keep the lowest-level QR functions independent from the DOM.

Example conceptual separation:

```text
generateQR()
      │
      ├── pure QR data generation
      │
      └── optional browser render helpers


decodeQR()
      │
      ├── image data
      │
      └── decoded text
```

Do not force a specific rendering target.

---

# UI-FREE REQUIREMENT

The reusable library must not require:

* Tailwind CSS
* application CSS
* `index.html`
* application-specific IDs
* application-specific classes
* the current navigation system
* the current page structure

It must be possible to import the library into an unrelated application.

---

# FRAMEWORK INDEPENDENCE

The reusable module must work with plain JavaScript.

It should also be usable from applications built with:

* React
* Vue
* Svelte
* Angular
* other frameworks

Do not add framework-specific adapters in this phase.

A framework can consume the plain JavaScript API.

---

# BROWSER MODULE

The primary distribution should support:

```js
import { generateQR } from "./qr-kit.js";
```

Use standard JavaScript modules.

Do not require bundling for basic browser usage when practical.

---

# OPTIONAL BUNDLE

Where useful, provide a bundled build.

Example:

```text
dist/qr-kit/qr-kit.js
```

The bundle must contain the required local QR dependencies.

It must not require runtime CDN access.

---

# NO GLOBAL POLLUTION

Do not automatically create large global objects such as:

```js
window.QREverything
```

unless a global/browser-script build is explicitly provided.

ES modules should be the preferred integration mechanism.

---

# OPTIONAL UMD/IIFE BUILD

A standalone browser build may be provided for legacy applications:

```html
<script src="./qr-kit.js"></script>
```

If implemented, keep it optional.

Do not compromise the ES module API.

---

# API DESIGN

The public API should be small.

Prefer something close to:

```text
generateQR()
scanQRFromImage()
QRScanner
getQRByteLength()
```

Additional functions should only be public when genuinely useful.

Do not expose internal helper functions.

---

# OPTIONS

Options should be plain JavaScript objects.

Example:

```js
generateQR(data, {
  size: 400,
  errorCorrection: "M",
  margin: 4
});
```

Do not require classes for simple operations.

---

# ERROR HANDLING

Library errors must be predictable.

Use:

```text
Error
```

objects or documented structured errors.

Do not silently return invalid results.

Examples:

```text
Invalid input
Payload too large
QR generation failed
No QR code detected
Camera unavailable
Camera permission denied
Unsupported image
```

The consuming application must be able to handle these errors itself.

---

# RESULT API

Do not force the consuming application to use the existing result UI.

Return data.

For example:

```js
const result = await scanQRFromImage(file);

console.log(result.data);
```

The consumer decides whether that becomes:

```text
text
alert
modal
form field
database record
API request
React state
Vue state
etc.
```

---

# EXAMPLE APPLICATION

Create a small example demonstrating how another application can integrate the module.

Example:

```text
examples/
└── basic/
    ├── index.html
    └── app.js
```

The example should demonstrate:

1. importing the module;
2. generating a QR;
3. displaying the result;
4. scanning an image;
5. starting a camera scanner;
6. receiving scan results.

Keep the example small.

---

# DOCUMENTATION

Add a reusable-library section to the project documentation.

Document:

* installation/import;
* browser usage;
* generator API;
* scanner API;
* image scanner API;
* options;
* return values;
* errors;
* offline behavior;
* examples.

The documentation must allow a developer unfamiliar with the main application to integrate the QR module.

---

# BACKWARD COMPATIBILITY

The existing application must continue working.

The agent must:

* extract/reuse existing logic;
* preserve current features;
* update `app.js` to use the reusable module where practical;
* avoid duplicating generator or scanner logic.

The main application should become a consumer of the reusable library rather than maintaining a completely separate implementation.

---

# REFACTORING RULE

This phase allows refactoring required to create the reusable module.

Do not perform unrelated refactoring.

Do not redesign the entire application.

Do not replace working QR libraries merely for architectural reasons.

Reuse the existing local dependencies wherever practical.

---

# STATIC HOSTING

The module must remain usable on static hosting.

No backend is required for:

* QR generation;
* image scanning;
* basic decoding.

Camera scanning continues to depend on the browser's camera/security requirements.

---

# OFFLINE REQUIREMENT

The reusable module must remain fully local.

After the required files are available locally:

```text
generate QR
scan image
decode QR
```

must not require internet access.

No runtime CDN dependency.

---

# TESTING

Create integration tests or practical browser tests for:

## Generator

* Hello World
* Unicode
* emoji
* multiline text
* JSON
* URL
* 100+ bytes
* 200+ bytes

## Image scanner

* generated QR image
* downloaded PNG
* screenshot
* Unicode payload
* 100+ bytes
* 200+ bytes
* invalid image
* image without QR

## Camera scanner

* start
* stop
* successful QR detection
* duplicate detection handling
* permission failure handling

## Consumer application

Verify that the example application can import and use the library without importing the main application's UI.

---

# INTEGRATION TEST

The main application must consume the new reusable module.

Verify:

```text
Main Application
       │
       ▼
Reusable QR Module
       │
       ├── Generator
       ├── Camera Scanner
       └── Image Scanner
```

The application should not maintain duplicate QR implementation logic after the refactor.

---

# DISTRIBUTION TEST

Verify that another independent HTML application can use the library:

```text
Other App
    │
    ├── imports qr-kit
    │
    ├── generateQR(...)
    │
    └── scanQRFromImage(...)
```

The other application must not need:

* the original `index.html`;
* the original `app.js`;
* the original Tailwind CSS;
* the application's UI markup.

---

# DO_NOT_IMPLEMENT

* framework-specific wrappers
* React package
* Vue package
* npm publishing workflow unless explicitly requested
* cloud services
* remote QR APIs
* unrelated architecture
* unrelated UI redesign
* backend requirements for the reusable browser module
* analytics
* telemetry
* future features

---

# DONE_WHEN

Phase 8 is complete when:

* reusable QR modules exist;
* QR generation can be imported by another application;
* camera scanning can be imported by another application;
* image scanning can be imported by another application;
* the public API is documented;
* the module is framework-independent;
* the module does not require the existing UI;
* the main application uses the reusable module;
* no duplicate QR implementation remains unnecessarily;
* the example consumer application works;
* offline operation remains possible;
* existing application features still work;
* large payloads remain supported;
* no runtime CDN dependency was introduced.

---

# PHASE_TRANSITION

The agent MUST NOT modify `.agents/ACTIVE_PHASE.md`.

The agent MUST NOT advance to another phase.

Only the human user may authorize another phase.

When all DONE_WHEN requirements are satisfied:

STOP.

Wait for human authorization.
