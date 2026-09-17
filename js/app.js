document.addEventListener('DOMContentLoaded', () => {
    // Setup UTF-8 support for qrcode-generator
    if (typeof qrcode !== 'undefined' && qrcode.stringToBytesFuncs) {
        qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    }

    const navGenerate = document.getElementById('nav-generate');
    const navScan = document.getElementById('nav-scan');
    const viewGenerate = document.getElementById('view-generate');
    const viewScan = document.getElementById('view-scan');

    const activeClasses = ['bg-white', 'text-gray-900', 'shadow-sm'];
    const inactiveClasses = ['text-gray-500', 'hover:text-gray-900'];

    function switchView(view) {
        if (view === 'generate') {
            viewGenerate.classList.remove('hidden');
            viewGenerate.classList.add('flex');
            viewScan.classList.add('hidden');
            viewScan.classList.remove('flex');
            
            navGenerate.classList.add(...activeClasses);
            navGenerate.classList.remove(...inactiveClasses);
            navGenerate.setAttribute('aria-selected', 'true');
            
            navScan.classList.remove(...activeClasses);
            navScan.classList.add(...inactiveClasses);
            navScan.setAttribute('aria-selected', 'false');
        } else if (view === 'scan') {
            viewScan.classList.remove('hidden');
            viewScan.classList.add('flex');
            viewGenerate.classList.add('hidden');
            viewGenerate.classList.remove('flex');

            navScan.classList.add(...activeClasses);
            navScan.classList.remove(...inactiveClasses);
            navScan.setAttribute('aria-selected', 'true');
            
            navGenerate.classList.remove(...activeClasses);
            navGenerate.classList.add(...inactiveClasses);
            navGenerate.setAttribute('aria-selected', 'false');
        }
    }

    navGenerate.addEventListener('click', () => switchView('generate'));
    navScan.addEventListener('click', () => switchView('scan'));

    // --- QR Generator Logic ---
    const qrInput = document.getElementById('qr-input');
    const qrStats = document.getElementById('qr-stats');
    const qrClear = document.getElementById('qr-clear');
    const qrError = document.getElementById('qr-error');
    const qrContainer = document.getElementById('qr-container');
    const qrDownload = document.getElementById('qr-download');

    let currentQrDataUrl = null;

    function updateStats(text) {
        const charCount = text.length;
        const byteCount = new Blob([text]).size; // Fast UTF-8 byte length
        qrStats.textContent = `${charCount} characters • ${byteCount} bytes`;
    }

    function generateQR(text) {
        if (!text) {
            qrContainer.innerHTML = '<span class="text-gray-400 text-sm">QR Code will appear here</span>';
            qrError.classList.add('hidden');
            qrDownload.disabled = true;
            currentQrDataUrl = null;
            return;
        }

        try {
            // Auto-detect type number (0), Error correction 'M'
            const qr = qrcode(0, 'M');
            qr.addData(text);
            qr.make();
            
            currentQrDataUrl = qr.createDataURL(6, 2);
            qrContainer.innerHTML = `<img src="${currentQrDataUrl}" alt="QR Code" class="max-w-full h-auto rounded">`;
            qrError.classList.add('hidden');
            qrDownload.disabled = false;
        } catch (e) {
            console.error('QR Generation Error:', e);
            qrContainer.innerHTML = '<span class="text-red-400 text-sm">Failed to render</span>';
            qrError.classList.remove('hidden');
            qrDownload.disabled = true;
            currentQrDataUrl = null;
        }
    }

    qrInput.addEventListener('input', (e) => {
        const text = e.target.value;
        updateStats(text);
        generateQR(text);
    });

    qrClear.addEventListener('click', () => {
        qrInput.value = '';
        updateStats('');
        generateQR('');
        qrInput.focus();
    });

    qrDownload.addEventListener('click', () => {
        if (!currentQrDataUrl) return;
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = currentQrDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // --- View Switching Updates ---
    function stopScanner() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        if (scanInterval) {
            cancelAnimationFrame(scanInterval);
            scanInterval = null;
        }
        scanVideo.classList.add('hidden');
        scanOverlay.classList.remove('border-green-500/50');
        scanOverlay.classList.add('border-black/40');
        scanPlaceholder.classList.remove('hidden');
        scanToggle.textContent = 'Start Camera';
        scanToggle.classList.replace('bg-red-600', 'bg-indigo-600');
        scanToggle.classList.replace('hover:bg-red-700', 'hover:bg-indigo-700');
    }

    // Override switchView to handle stopping scanner
    const originalSwitchView = switchView;
    switchView = function(view) {
        if (view === 'generate') {
            stopScanner();
        }
        originalSwitchView(view);
    };

    // --- QR Scanner Logic ---
    const scanVideo = document.getElementById('scan-video');
    const scanCanvas = document.getElementById('scan-canvas');
    const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
    const scanOverlay = document.getElementById('scan-overlay');
    const scanPlaceholder = document.getElementById('scan-placeholder');
    const scanToggle = document.getElementById('scan-toggle');
    const scanSwitch = document.getElementById('scan-switch');
    const scanError = document.getElementById('scan-error');
    const scanResultContainer = document.getElementById('scan-result-container');
    const scanResultContent = document.getElementById('scan-result-content');
    const scanCopy = document.getElementById('scan-copy');
    const scanClearResult = document.getElementById('scan-clear');

    let currentStream = null;
    let scanInterval = null;
    let lastDecodedText = null;
    let availableCameras = [];
    let currentCameraIndex = 0;

    const barcodeDetector = ('BarcodeDetector' in window) ? new BarcodeDetector({ formats: ['qr_code'] }) : null;

    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(device => device.kind === 'videoinput');
            if (availableCameras.length > 1) {
                scanSwitch.classList.remove('hidden');
            } else {
                scanSwitch.classList.add('hidden');
            }
        } catch (e) {
            console.error('Error enumerating devices', e);
        }
    }

    async function startScanner(deviceId = null) {
        scanError.classList.add('hidden');
        try {
            const constraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' }
            };
            currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            scanVideo.srcObject = currentStream;
            scanVideo.setAttribute('playsinline', true);
            scanVideo.play();
            
            scanVideo.classList.remove('hidden');
            scanPlaceholder.classList.add('hidden');
            
            scanToggle.textContent = 'Stop Camera';
            scanToggle.classList.replace('bg-indigo-600', 'bg-red-600');
            scanToggle.classList.replace('hover:bg-indigo-700', 'hover:bg-red-700');

            requestAnimationFrame(tick);
            
            if (availableCameras.length === 0) {
                await getCameras();
            }
        } catch (e) {
            console.error('Camera access error', e);
            scanError.classList.remove('hidden');
            scanError.textContent = 'Camera access denied or unavailable.';
        }
    }

    function displayResult(text) {
        if (text === lastDecodedText) return;
        lastDecodedText = text;
        
        scanResultContent.textContent = text;
        scanResultContainer.classList.remove('hidden');
        scanResultContainer.classList.add('flex');
        
        // Visual feedback
        scanOverlay.classList.remove('border-black/40');
        scanOverlay.classList.add('border-green-500/50');
        setTimeout(() => {
            if (currentStream) {
                scanOverlay.classList.remove('border-green-500/50');
                scanOverlay.classList.add('border-black/40');
            }
        }, 500);
    }

    async function tick() {
        if (!currentStream || scanVideo.readyState !== scanVideo.HAVE_ENOUGH_DATA) {
            scanInterval = requestAnimationFrame(tick);
            return;
        }

        scanCanvas.width = scanVideo.videoWidth;
        scanCanvas.height = scanVideo.videoHeight;
        scanCtx.drawImage(scanVideo, 0, 0, scanCanvas.width, scanCanvas.height);
        
        let found = false;

        // Try BarcodeDetector first
        if (barcodeDetector) {
            try {
                const barcodes = await barcodeDetector.detect(scanCanvas);
                if (barcodes.length > 0) {
                    displayResult(barcodes[0].rawValue);
                    found = true;
                }
            } catch (e) {
                // fallback on error
            }
        }

        // Fallback to jsQR
        if (!found && typeof jsQR !== 'undefined') {
            try {
                const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });
                if (code && code.data) {
                    displayResult(code.data);
                }
            } catch (e) {
                // Ignore frame-specific processing errors
            }
        }

        scanInterval = requestAnimationFrame(tick);
    }

    scanToggle.addEventListener('click', () => {
        if (currentStream) {
            stopScanner();
        } else {
            const deviceId = availableCameras.length > 0 ? availableCameras[currentCameraIndex].deviceId : null;
            startScanner(deviceId);
        }
    });

    scanSwitch.addEventListener('click', () => {
        if (availableCameras.length > 1) {
            currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
            stopScanner();
            startScanner(availableCameras[currentCameraIndex].deviceId);
        }
    });

    scanCopy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(scanResultContent.textContent);
            const originalText = scanCopy.textContent;
            scanCopy.textContent = 'Copied!';
            setTimeout(() => scanCopy.textContent = originalText, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });

    scanClearResult.addEventListener('click', () => {
        scanResultContent.textContent = '';
        scanResultContainer.classList.add('hidden');
        scanResultContainer.classList.remove('flex');
        lastDecodedText = null;
    });

});
