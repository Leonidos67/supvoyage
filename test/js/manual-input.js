const manualCodeInput = document.getElementById('manual-code');
const checkBtn = document.getElementById('check-btn');

checkBtn.addEventListener('click', checkManualCode);
manualCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkManualCode();
});

function checkManualCode() {
    const code = manualCodeInput.value.trim();
    
    if (!code) {
        showResult("Введите код сапборда", false);
        return;
    }
    
    if (validateSupId(code)) {
        showResult(code, true);
        playSound('success');
    } else {
        showResult("Неверный формат кода. Пример: SV-00150", false);
        playSound('error');
    }
    
    manualCodeInput.value = "";
    manualCodeInput.focus();
}