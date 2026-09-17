const { generateQR, scanQRFromImage, QRScanner, getQRByteLength } = window.QRKit;

document.addEventListener('DOMContentLoaded', () => {
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
        const byteCount = getQRByteLength(text);
        qrStats.textContent = `${charCount} characters • ${byteCount} bytes`;
    }

    function doGenerateQR(text) {
        if (!text) {
            qrContainer.innerHTML = '<span class="text-gray-400 text-sm">QR Code will appear here</span>';
            qrError.classList.add('hidden');
            qrDownload.disabled = true;
            currentQrDataUrl = null;
            return;
        }

        try {
            const result = generateQR(text, { errorCorrection: 'M', cellSize: 6, margin: 2 });
            currentQrDataUrl = result.dataUrl;
            qrContainer.innerHTML = '';
            const img = result.createImageElement();
            img.className = 'max-w-full h-auto rounded';
            qrContainer.appendChild(img);
            qrError.classList.add('hidden');
            qrDownload.disabled = false;
        } catch (e) {
            console.error(e);
            qrContainer.innerHTML = '<span class="text-red-400 text-sm">Failed to render</span>';
            qrError.classList.remove('hidden');
            qrDownload.disabled = true;
            currentQrDataUrl = null;
        }
    }

    qrInput.addEventListener('input', (e) => {
        const text = e.target.value;
        updateStats(text);
        doGenerateQR(text);
    });

    qrClear.addEventListener('click', () => {
        qrInput.value = '';
        updateStats('');
        doGenerateQR('');
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

    // --- QR Scanner Logic ---
    const scanVideo = document.getElementById('scan-video');
    const scanOverlay = document.getElementById('scan-overlay');
    const scanPlaceholder = document.getElementById('scan-placeholder');
    const scanToggle = document.getElementById('scan-toggle');
    const scanSwitch = document.getElementById('scan-switch');
    const scanError = document.getElementById('scan-error');
    const scanResultContainer = document.getElementById('scan-result-container');
    const scanResultContent = document.getElementById('scan-result-content');
    const scanCopy = document.getElementById('scan-copy');
    const scanClearResult = document.getElementById('scan-clear');
    
    let isScannerRunning = false;

    function displayResult(text) {
        scanResultContent.textContent = text;
        scanResultContainer.classList.remove('hidden');
        scanResultContainer.classList.add('flex');
        
        // Visual feedback
        scanOverlay.classList.remove('border-black/40');
        scanOverlay.classList.add('border-green-500/50');
        setTimeout(() => {
            if (isScannerRunning) {
                scanOverlay.classList.remove('border-green-500/50');
                scanOverlay.classList.add('border-black/40');
            }
        }, 500);
    }

    const scanner = new QRScanner({
        video: scanVideo,
        onResult: (result) => {
            displayResult(result.data);
        },
        onError: (error) => {
            console.error(error);
            scanError.classList.remove('hidden');
            scanError.textContent = error.message;
            stopScannerUI();
        }
    });

    function startScannerUI() {
        scanError.classList.add('hidden');
        scanVideo.classList.remove('hidden');
        scanPlaceholder.classList.add('hidden');
        
        scanToggle.textContent = 'Stop Camera';
        scanToggle.classList.replace('bg-indigo-600', 'bg-red-600');
        scanToggle.classList.replace('hover:bg-indigo-700', 'hover:bg-red-700');
        
        if (scanner.availableCameras.length > 1) {
            scanSwitch.classList.remove('hidden');
        } else {
            scanSwitch.classList.add('hidden');
        }
        isScannerRunning = true;
    }

    function stopScannerUI() {
        scanner.stop();
        scanVideo.classList.add('hidden');
        scanOverlay.classList.remove('border-green-500/50');
        scanOverlay.classList.add('border-black/40');
        scanPlaceholder.classList.remove('hidden');
        scanToggle.textContent = 'Start Camera';
        scanToggle.classList.replace('bg-red-600', 'bg-indigo-600');
        scanToggle.classList.replace('hover:bg-red-700', 'hover:bg-indigo-700');
        isScannerRunning = false;
    }

    // Override switchView to handle stopping scanner
    const originalSwitchView = switchView;
    switchView = function(view) {
        if (view === 'generate') {
            stopScannerUI();
        }
        originalSwitchView(view);
    };

    scanToggle.addEventListener('click', async () => {
        if (isScannerRunning) {
            stopScannerUI();
        } else {
            const cameras = await scanner.getCameras();
            if (cameras.length > 1) {
                scanSwitch.classList.remove('hidden');
            }
            const deviceId = cameras.length > 0 ? cameras[scanner.currentCameraIndex].deviceId : null;
            await scanner.start(deviceId);
            startScannerUI();
        }
    });

    scanSwitch.addEventListener('click', async () => {
        await scanner.switchCamera();
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
        scanner.lastDecodedText = null;
    });

    // --- Image Scanner Logic ---
    const modeCameraBtn = document.getElementById('mode-camera');
    const modeImageBtn = document.getElementById('mode-image');
    const uiCamera = document.getElementById('ui-camera');
    const uiImage = document.getElementById('ui-image');
    const imageError = document.getElementById('image-error');

    function switchScanMode(mode) {
        if (mode === 'camera') {
            uiCamera.classList.remove('hidden');
            uiCamera.classList.add('flex');
            uiImage.classList.add('hidden');
            uiImage.classList.remove('flex');
            
            modeCameraBtn.classList.add(...activeClasses);
            modeCameraBtn.classList.remove(...inactiveClasses);
            modeCameraBtn.setAttribute('aria-selected', 'true');
            
            modeImageBtn.classList.remove(...activeClasses);
            modeImageBtn.classList.add(...inactiveClasses);
            modeImageBtn.setAttribute('aria-selected', 'false');
        } else {
            stopScannerUI();
            uiImage.classList.remove('hidden');
            uiImage.classList.add('flex');
            uiCamera.classList.add('hidden');
            uiCamera.classList.remove('flex');
            
            modeImageBtn.classList.add(...activeClasses);
            modeImageBtn.classList.remove(...inactiveClasses);
            modeImageBtn.setAttribute('aria-selected', 'true');
            
            modeCameraBtn.classList.remove(...activeClasses);
            modeCameraBtn.classList.add(...inactiveClasses);
            modeCameraBtn.setAttribute('aria-selected', 'false');
        }
    }

    modeCameraBtn.addEventListener('click', () => switchScanMode('camera'));
    modeImageBtn.addEventListener('click', () => switchScanMode('image'));

    const dropZone = document.getElementById('drop-zone');
    const btnUpload = document.getElementById('btn-upload');
    const fileUpload = document.getElementById('file-upload');

    async function processImageFile(file) {
        stopScannerUI();
        scanError.classList.add('hidden');
        imageError.classList.add('hidden');

        if (!file || !file.type.startsWith('image/')) {
            imageError.textContent = 'Please select a valid image.';
            imageError.classList.remove('hidden');
            return;
        }

        try {
            const result = await scanQRFromImage(file);
            displayResult(result.data);
        } catch (err) {
            imageError.textContent = err.message || 'No QR code was detected in this image.';
            imageError.classList.remove('hidden');
        }
    }

    btnUpload.addEventListener('click', () => {
        fileUpload.click();
    });
    
    dropZone.addEventListener('click', (e) => {
        if (e.target !== btnUpload) fileUpload.click();
    });

    fileUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processImageFile(e.target.files[0]);
        }
        e.target.value = '';
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('bg-indigo-50', 'border-indigo-300');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-indigo-50', 'border-indigo-300');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-indigo-50', 'border-indigo-300');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processImageFile(e.dataTransfer.files[0]);
        }
    });
});
