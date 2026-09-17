
(function(global) {
    function getQRByteLength(text) {
    if (!text) return 0;
    return new Blob([text]).size; 
}

    function generateQR(data, options = {}) {
    if (!data) {
        throw new Error('Data is required for QR generation');
    }

    const errorCorrection = options.errorCorrection || 'M';
    const margin = options.margin !== undefined ? options.margin : 2;
    const cellSize = options.cellSize !== undefined ? options.cellSize : 6;

    if (typeof qrcode === 'undefined') {
        throw new Error('qrcode library is not loaded. Please include qrcode.js.');
    }

    if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
        qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    }

    try {
        const qr = qrcode(0, errorCorrection);
        qr.addData(data);
        qr.make();
        
        const dataUrl = qr.createDataURL(cellSize, margin);
        const moduleCount = qr.getModuleCount();
        const size = moduleCount * cellSize + margin * 2;
        
        return {
            data,
            dataUrl,
            width: size,
            height: size,
            moduleCount,
            createCanvas: () => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = size;
                        canvas.height = size;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas);
                    };
                    img.onerror = reject;
                    img.src = dataUrl;
                });
            },
            createImageElement: () => {
                const img = new Image();
                img.src = dataUrl;
                img.width = size;
                img.height = size;
                img.alt = "QR Code";
                return img;
            }
        };
    } catch (e) {
        throw new Error('QR generation failed: ' + e.message);
    }
}

    async function scanQRFromImage(imageInput) {
    if (typeof jsQR === 'undefined') {
        throw new Error('jsQR library is not loaded. Please include jsQR.js.');
    }

    return new Promise((resolve, reject) => {
        const processImage = (img) => {
            const canvas = document.createElement('canvas');
            const maxDimension = 1200;
            let width = img.width;
            let height = img.height;
            if (width > maxDimension || height > maxDimension) {
                const ratio = Math.min(maxDimension / width, maxDimension / height);
                width *= ratio;
                height *= ratio;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, width, height);

            const barcodeDetector = ('BarcodeDetector' in window) ? new BarcodeDetector({ formats: ['qr_code'] }) : null;
            
            const runFallback = () => {
                const imageData = ctx.getImageData(0, 0, width, height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'attemptBoth',
                });
                if (code && code.data) {
                    resolve({ data: code.data, source: 'jsQR' });
                } else {
                    reject(new Error('No QR code detected in this image.'));
                }
            };

            if (barcodeDetector) {
                barcodeDetector.detect(canvas).then(barcodes => {
                    if (barcodes.length > 0) {
                        resolve({ data: barcodes[0].rawValue, source: 'BarcodeDetector' });
                    } else {
                        runFallback();
                    }
                }).catch(() => {
                    runFallback();
                });
            } else {
                runFallback();
            }
        };

        if (imageInput instanceof File || imageInput instanceof Blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => processImage(img);
                img.onerror = () => reject(new Error('Invalid image file.'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file.'));
            reader.readAsDataURL(imageInput);
        } else if (imageInput instanceof HTMLImageElement) {
            if (imageInput.complete) {
                processImage(imageInput);
            } else {
                imageInput.onload = () => processImage(imageInput);
                imageInput.onerror = () => reject(new Error('Failed to load image element.'));
            }
        } else if (typeof imageInput === 'string') {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => processImage(img);
            img.onerror = () => reject(new Error('Failed to load image from URL.'));
            img.src = imageInput;
        } else {
            reject(new Error('Unsupported image input type. Please provide a File, Blob, HTMLImageElement, or URL string.'));
        }
    });
}

    class QRScanner {
    constructor(options = {}) {
        this.videoElement = options.video;
        this.onResult = options.onResult || (() => {});
        this.onError = options.onError || console.error;
        
        if (!this.videoElement || !(this.videoElement instanceof HTMLVideoElement)) {
            throw new Error('A valid HTMLVideoElement is required for the QRScanner.');
        }

        this.currentStream = null;
        this.scanInterval = null;
        this.lastDecodedText = null;
        this.availableCameras = [];
        this.currentCameraIndex = 0;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.barcodeDetector = ('BarcodeDetector' in window) ? new BarcodeDetector({ formats: ['qr_code'] }) : null;
        
        this.tick = this.tick.bind(this);
    }

    async getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.availableCameras = devices.filter(device => device.kind === 'videoinput');
            return this.availableCameras;
        } catch (e) {
            this.onError(new Error('Error enumerating devices: ' + e.message));
            return [];
        }
    }

    async start(deviceId = null) {
        this.stop(); 
        this.lastDecodedText = null; 
        
        try {
            const constraints = {
                video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' }
            };
            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.currentStream;
            this.videoElement.setAttribute('playsinline', true);
            this.videoElement.play();

            this.scanInterval = requestAnimationFrame(this.tick);
            
            if (this.availableCameras.length === 0) {
                await this.getCameras();
            }
        } catch (e) {
            this.onError(new Error('Camera access denied or unavailable: ' + e.message));
        }
    }

    stop() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        if (this.scanInterval) {
            cancelAnimationFrame(this.scanInterval);
            this.scanInterval = null;
        }
    }
    
    destroy() {
        this.stop();
        this.videoElement.srcObject = null;
    }

    async switchCamera() {
        if (this.availableCameras.length > 1) {
            this.currentCameraIndex = (this.currentCameraIndex + 1) % this.availableCameras.length;
            await this.start(this.availableCameras[this.currentCameraIndex].deviceId);
        }
    }

    async tick() {
        if (!this.currentStream || this.videoElement.readyState !== this.videoElement.HAVE_ENOUGH_DATA) {
            this.scanInterval = requestAnimationFrame(this.tick);
            return;
        }

        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;
        this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
        
        let found = false;

        if (this.barcodeDetector) {
            try {
                const barcodes = await this.barcodeDetector.detect(this.canvas);
                if (barcodes.length > 0) {
                    this._handleResult(barcodes[0].rawValue);
                    found = true;
                }
            } catch (e) {
            }
        }

        if (!found && typeof jsQR !== 'undefined') {
            try {
                const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });
                if (code && code.data) {
                    this._handleResult(code.data);
                }
            } catch (e) {
            }
        }

        if (this.currentStream) {
            this.scanInterval = requestAnimationFrame(this.tick);
        }
    }
    
    _handleResult(text) {
        if (text === this.lastDecodedText) return;
        this.lastDecodedText = text;
        this.onResult({ data: text });
    }
}


    global.QRKit = {
        generateQR,
        scanQRFromImage,
        QRScanner,
        getQRByteLength
    };
})(window);
