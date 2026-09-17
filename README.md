# QR Code Scan

A lightweight, fully client-side QR Code Generator and Scanner.

## Features

- **Offline-First**: Works entirely without an internet connection after the initial load.
- **Privacy-Focused**: No data is sent to external servers. All generation and scanning happen locally in your browser.
- **Generator**: Supports Unicode, emojis, URLs, and large payloads.
- **Scanner**: Leverages hardware-accelerated barcode detection when available, with a robust software fallback.
- **Responsive**: Beautifully designed for both mobile and desktop experiences.

## Deployment

This application is a 100% static web application. There is no backend, database, or API required.

To deploy, simply host the following files on any static web host (e.g., GitHub Pages, Netlify, Vercel, S3):

- `index.html`
- `css/output.css`
- `js/app.js`
- `js/qrcode.js`
- `js/qrcode_UTF8.js`
- `js/jsQR.js`

### Development

If you wish to modify the styles, you can recompile the Tailwind CSS:

1. Install dependencies: `npm install`
2. Build CSS: `npm run build`
3. Watch CSS for changes: `npm run watch`

## Reusable QR Module / SDK

This project includes a framework-independent, UI-free ES module for QR generation and scanning that can be easily imported into other applications.

### Setup

Ensure you have the required local dependencies available, and then import the module:

```html
<!-- Required Dependencies -->
<script src="js/qrcode.js"></script>
<script src="js/qrcode_UTF8.js"></script>
<script src="js/jsQR.js"></script>

<!-- Your Application -->
<script type="module">
    import { generateQR, scanQRFromImage, QRScanner } from './js/qr/index.js';
    
    // ...
</script>
```

### Generator API

```javascript
import { generateQR } from './js/qr/index.js';

// Returns { data, dataUrl, width, height, moduleCount, createCanvas(), createImageElement() }
const result = generateQR("Hello World", { 
    errorCorrection: 'M', // L, M, Q, H
    margin: 2, 
    cellSize: 6 
});

document.body.appendChild(result.createImageElement());
```

### Image Scanner API

```javascript
import { scanQRFromImage } from './js/qr/index.js';

const fileInput = document.getElementById('my-file-input');
fileInput.addEventListener('change', async (e) => {
    try {
        const result = await scanQRFromImage(e.target.files[0]);
        console.log("Decoded data:", result.data);
    } catch (err) {
        console.error(err);
    }
});
```
*(Accepts `File`, `Blob`, `HTMLImageElement`, or a URL string)*

### Camera Scanner API

```javascript
import { QRScanner } from './js/qr/index.js';

const scanner = new QRScanner({
    video: document.getElementById('my-video'),
    onResult: (result) => {
        console.log("Scanned:", result.data);
    },
    onError: (error) => {
        console.error("Scanner Error:", error);
    }
});

// Start scanning
await scanner.start();

// Stop scanning
scanner.stop();
```

See the `examples/basic` folder for a complete working example.

