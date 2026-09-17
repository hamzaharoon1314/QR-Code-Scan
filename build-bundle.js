const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'js', 'qr');
const distDir = path.join(__dirname, 'dist', 'qr-kit');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const utils = fs.readFileSync(path.join(srcDir, 'qr-utils.js'), 'utf-8');
const generator = fs.readFileSync(path.join(srcDir, 'qr-generator.js'), 'utf-8');
const imageScanner = fs.readFileSync(path.join(srcDir, 'qr-image-scanner.js'), 'utf-8');
const scanner = fs.readFileSync(path.join(srcDir, 'qr-scanner.js'), 'utf-8');

// Strip exports
function stripExports(code) {
    return code.replace(/export\s+function/g, 'function')
               .replace(/export\s+async\s+function/g, 'async function')
               .replace(/export\s+class/g, 'class');
}

const bundle = `
(function(global) {
    ${stripExports(utils)}
    ${stripExports(generator)}
    ${stripExports(imageScanner)}
    ${stripExports(scanner)}

    global.QRKit = {
        generateQR,
        scanQRFromImage,
        QRScanner,
        getQRByteLength
    };
})(window);
`;

fs.writeFileSync(path.join(distDir, 'qr-kit.umd.js'), bundle);
console.log('Bundle created.');
