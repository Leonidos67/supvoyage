document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const scanResult = document.getElementById('scanResult');
  const readerContainer = document.getElementById('scannerFullScreen');
  const readerElement = document.getElementById('reader');
  const closeScanBtn = document.getElementById('closeScanBtn');
  const toggleFlashBtn = document.getElementById('toggleFlashBtn');

  let html5QrCode;
  let isTorchOn = false;
  let cameraId = null;

  scanBtn.addEventListener('click', async () => {
    scanResult.innerHTML = "";
    readerContainer.style.display = 'flex';

    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader");
    }

    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) {
      scanResult.innerHTML = "Камера не найдена";
      return;
    }

    cameraId = cameras[0].id;

    html5QrCode.start(
      cameraId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.333,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      },
      (decodedText) => {
        html5QrCode.stop().then(() => {
          readerContainer.style.display = 'none';
          scanResult.innerHTML = parseCode(decodedText);
        });
      },
      (errorMessage) => {
        // ошибки игнорим
      }
    );
  });

  closeScanBtn.addEventListener('click', () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        readerContainer.style.display = 'none';
      });
    }
  });

  toggleFlashBtn.addEventListener('click', () => {
    if (!html5QrCode) return;
    html5QrCode.applyVideoConstraints({
      advanced: [{ torch: !isTorchOn }]
    }).then(() => {
      isTorchOn = !isTorchOn;
      toggleFlashBtn.textContent = isTorchOn ? "Выключить вспышку" : "Включить вспышку";
    }).catch(() => {
      scanResult.innerHTML = "Вспышка не поддерживается";
    });
  });

  function parseCode(code) {
    try {
      const url = new URL(code);
      const path = url.pathname.replace('/', '');
      const parts = path.split('-');
      if (parts[0] === 'sv') parts.shift();

      const [type, p2, p3, p4] = parts;

      if (type === '001') {
        const color = p3 === 'r' ? 'Красный' : 'Черный';
        return `САП-Борд №${p4} (${color})`;
      }

      if (type === '002') {
        const sizeMap = { s: 'Детский', m: 'Средний', l: 'Взрослый' };
        return `Жилет №${p4} (Размер: ${sizeMap[p3] || 'Неизвестный'})`;
      }

      if (type === '003') {
        return `Защитный чехол №${p2}`;
      }

      return "Не удалось распознать код.";
    } catch {
      return "Ошибка в формате кода";
    }
  }
});
