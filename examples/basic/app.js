import { generateQR, scanQRFromImage, QRScanner } from '../../js/qr/index.js';

// 1. Generate QR
const genInput = document.getElementById('gen-input');
const genOutput = document.getElementById('gen-output');

genInput.addEventListener('input', () => {
    const text = genInput.value;
    genOutput.innerHTML = '';
    if (text) {
        try {
            const qr = generateQR(text);
            const img = qr.createImageElement();
            genOutput.appendChild(img);
        } catch (e) {
            genOutput.textContent = 'Error: ' + e.message;
        }
    }
});

// 2. Scan Image
const imageInput = document.getElementById('image-input');
const imageResult = document.getElementById('image-result');

imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            const result = await scanQRFromImage(file);
            imageResult.textContent = 'Decoded: ' + result.data;
            imageResult.style.display = 'block';
        } catch (e) {
            imageResult.textContent = 'Error: ' + e.message;
            imageResult.style.display = 'block';
        }
    }
});

// 3. Camera Scanner
const video = document.getElementById('camera-preview');
const camResult = document.getElementById('cam-result');
const camStart = document.getElementById('cam-start');
const camStop = document.getElementById('cam-stop');

const scanner = new QRScanner({
    video: video,
    onResult: (result) => {
        camResult.textContent = 'Scanned: ' + result.data;
        camResult.style.display = 'block';
    },
    onError: (error) => {
        console.error(error);
        camResult.textContent = 'Error: ' + error.message;
        camResult.style.display = 'block';
    }
});

camStart.addEventListener('click', async () => {
    video.style.display = 'block';
    await scanner.start();
    camStart.disabled = true;
    camStop.disabled = false;
});

camStop.addEventListener('click', () => {
    scanner.stop();
    video.style.display = 'none';
    camStart.disabled = false;
    camStop.disabled = true;
});
