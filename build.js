// build.js — dijalankan otomatis saat deploy ke Vercel
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs   = require('fs');
const path = require('path');

const pub = path.join(__dirname, 'public');
if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });

// Obfuscate src/app.js → public/app.js
const src    = fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8');
const result = JavaScriptObfuscator.obfuscate(src, {
    compact: true,
    identifierNamesGenerator: 'hexadecimal',
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 1,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 3,
    stringArrayWrappersType: 'function',
    stringArrayWrappersChainedCalls: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    renameProperties: false,
    renameGlobals: false,
    selfDefending: true,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: false,
    target: 'browser',
    seed: Math.floor(Math.random() * 999999),
});
fs.writeFileSync(path.join(pub, 'app.js'), result.getObfuscatedCode(), 'utf8');
console.log('[build] app.js obfuscated ✔');

// Copy src/index.html → public/index.html
fs.writeFileSync(
    path.join(pub, 'index.html'),
    fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8'),
    'utf8'
);
console.log('[build] index.html copied ✔');
console.log('[build] Done ✔');
