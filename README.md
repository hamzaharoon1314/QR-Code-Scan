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
