const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const supIdDiv = document.getElementById('sup-id');
const toggleScannerBtn = document.getElementById('toggle-scanner');
const scannerContainer = document.getElementById('scanner-container');

const BASE_URL = 'https://leonidos67.github.io/supvoyage';
let stream = null;
let scanning = false;

// Инициализация сканера
toggleScannerBtn.addEventListener('click', () => {
    if (scannerContainer.classList.contains('hidden')) {
        startScanner();
    } else {
        stopScanner();
    }
});

async function startScanner() {
    try {
        scannerContainer.classList.remove('hidden');
        toggleScannerBtn.innerHTML = '<i class="fas fa-times"></i> Закрыть сканер';
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = stream;
        await video.play();
        
        scanning = true;
        resultDiv.textContent = "Сканирование...";
        resultDiv.className = "info";
        supIdDiv.textContent = "";
        
        scanFrame();
    } catch (err) {
        console.error("Ошибка камеры:", err);
        resultDiv.textContent = "Ошибка доступа к камере";
        resultDiv.className = "error";
        scannerContainer.classList.add('hidden');
        toggleScannerBtn.innerHTML = '<i class="fas fa-qrcode"></i> Открыть сканер';
    }
}

function stopScanner() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    
    scanning = false;
    scannerContainer.classList.add('hidden');
    toggleScannerBtn.innerHTML = '<i class="fas fa-qrcode"></i> Открыть сканер';
    resultDiv.textContent = "Наведите камеру на QR-код сапборда";
    resultDiv.className = "";
}

function scanFrame() {
    if (!scanning) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            const url = code.data.trim();
            const supId = getSupId(url);
            
            if (supId) {
                showResult(supId, true);
                playSound('success');
            } else {
                showResult("Неверный QR-код", false);
                playSound('error');
            }
            
            setTimeout(stopScanner, 3000);
        } else {
            requestAnimationFrame(scanFrame);
        }
    } catch (e) {
        console.error("Ошибка сканирования:", e);
        requestAnimationFrame(scanFrame);
    }
}

function getSupId(url) {
    try {
        const parsedUrl = new URL(url);
        
        if (!parsedUrl.href.startsWith(BASE_URL)) {
            return null;
        }
        
        const path = parsedUrl.pathname;
        const parts = path.replace(/^\/+|\/+$/g, '').split('/');
        const code = parts[parts.length - 1] || null;
        
        return validateSupId(code) ? code : null;
    } catch (e) {
        return null;
    }
}

function validateSupId(code) {
    const pattern = /^sv-\d{5}$/i;
    return pattern.test(code);
}

function showResult(message, isValid) {
    if (isValid) {
        resultDiv.textContent = "✅ Найден сапборд:";
        resultDiv.className = "success";
        supIdDiv.textContent = message.toUpperCase();
    } else {
        resultDiv.textContent = `❌ ${message}`;
        resultDiv.className = "error";
        supIdDiv.textContent = "";
    }
}

function playSound(type) {
    if (typeof Audio !== 'undefined') {
        const sounds = {
            success: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
        };
        new Audio(sounds[type]).play();
    }
}

// Проверка поддержки API
window.addEventListener('DOMContentLoaded', () => {
    if (!navigator.mediaDevices?.getUserMedia) {
        toggleScannerBtn.disabled = true;
        toggleScannerBtn.innerHTML = '<i class="fas fa-ban"></i> Камера не поддерживается';
        resultDiv.textContent = "Ваш браузер не поддерживает сканирование. Используйте ручной ввод.";
        resultDiv.className = "error";
    }
});