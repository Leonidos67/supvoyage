function toggleInfo() {
    const info = document.getElementById('infoMessage');
    const button = document.getElementById('infoToggle');
    const isHidden = info.style.display === 'none';
    info.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? '✖' : 'i';
}

function shareProduct() {
    const shareText = "Берите в прокат сап-борды вместе со мной в SupVoyage. Доставим сап в течении 30 минут после заявки t.me/testshoptests_bot/app";
    
    if (navigator.share) {
        navigator.share({
            title: 'SupVoyage',
            text: shareText,
            url: 'Берите в прокат сап-борды вместе со мной в SupVoyage. Доставим сап в течении 30 минут после заявки t.me/testshoptests_bot/app https://t.me/testshoptests_bot/app'
        }).catch(err => {
            console.log('Ошибка при попытке поделиться:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    // Для браузеров без поддержки Web Share API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Текст скопирован в буфер обмена:\n\n' + text);
        }).catch(err => {
            console.log('Не удалось скопировать текст:', err);
            prompt('Скопируйте этот текст:', text);
        });
    } else {
        prompt('Скопируйте этот текст:', text);
    }
}

function showProductCard(code) {
    document.querySelector('.catalog-container').style.display = 'none';
    document.querySelector('.code-search-wrapper').style.display = 'none';
    document.querySelector('.catalog-title').style.display = 'none';

    const parts = code.split('-');
    let html = '';
    let title = '';
    let img = '';
    let colorInfo = '';
    let sizeInfo = '';

    if (parts[1] === '001') {
        const color = parts[2] === 'r' ? 'Красный' : 'Черный';
        img = parts[2] === 'r' ? 'https://i.ibb.co/k22N7Q8c/De-Watermark-ai-1747319685673.png' : 'https://i.ibb.co/0R7X1Lcv/De-Watermark-ai-1747319421780.png';
        title = `Сап-борд #${parts[3]}`;
        colorInfo = `<p class="product-info-line">ЦВЕТ · ${color}</p>`;
    } else if (parts[1] === '002') {
        const sizes = { s: 'Детский', m: 'Средний', l: 'Взрослый' };
        img = `./assets/vest_${parts[2]}.jpg`;
        title = `Жилет #${parts[3]}`;
        sizeInfo = `<p class="product-info-line">РАЗМЕР · ${sizes[parts[2]]}</p>`;
    } else if (parts[1] === '003') {
        img = `https://ir.ozone.ru/s3/multimedia-0/c1000/6061656552.jpg`;
        title = `Чехол #${parts[2]}`;
    }

    // Генерация вариантов дат
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const dateOptions = [
        `Сегодня - ${formatDate(today)}`,
        `Завтра - ${formatDate(tomorrow)}`
    ];

    for (let i = 2; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dateOptions.push(formatDate(date));
    }

    const priceOptions = {
        '1ч': 500,
        '2ч': 800,
        '3ч': 1000,
        '6ч': 1500,
        'Весь день': 2000,
        'Сутки': 3000,
        'Выходные': 5000,
        'Другая дата': 'custom'
    };

    html += `
        <div class="product-card-result">
            <div class="product-header">
                <button class="back-button" onclick="goBack()">Назад</button>
                <h4>${title}</h4>
                <button class="share-button" onclick="shareProduct()">Поделиться</button>
            </div>
            <img src="${img}" alt="${title}" class="product-image">
            <div class="product-info-result">
                ${colorInfo}
                ${sizeInfo}
                <div class="price-row">
                    <span class="price-text">Цена:</span>
                    <span class="price-value">500 ₽</span>
                    <select class="duration-select">
                        ${Object.entries(priceOptions).map(([text, value]) => 
                            `<option value="${value}">${text}</option>`).join('')}
                    </select>
                </div>
                <div id="customDateContainer" class="custom-date-container">
                    <select class="date-select">
                        ${dateOptions.map((date, index) => 
                            `<option value="${index}">${date}</option>`).join('')}
                    </select>
                    <div class="duration-controls">
                        <input type="number" class="custom-duration-input" min="1" value="1">
                        <select class="custom-duration-type">
                            <option value="hours">часов</option>
                            <option value="days">дней</option>
                        </select>
                    </div>
                </div>
                <button class="book-button">Забронировать</button>
            </div>
        </div>
    `;

    document.getElementById('productCardContainer').innerHTML = html;

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    }

    // Обработчики изменений
    const durationSelect = document.querySelector('.duration-select');
    const priceValue = document.querySelector('.price-value');
    const customDateContainer = document.getElementById('customDateContainer');
    const dateSelect = document.querySelector('.date-select');
    const customDurationInput = document.querySelector('.custom-duration-input');
    const customDurationType = document.querySelector('.custom-duration-type');

    customDateContainer.style.display = 'none';

    durationSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateContainer.style.display = 'block';
            updatePrice();
        } else {
            customDateContainer.style.display = 'none';
            priceValue.textContent = `${this.value} ₽`;
        }
    });

    [dateSelect, customDurationInput, customDurationType].forEach(el => {
        el.addEventListener('change', updatePrice);
    });

    function updatePrice() {
        if (durationSelect.value !== 'custom') {
            priceValue.textContent = `${durationSelect.value} ₽`;
            return;
        }

        const duration = parseInt(customDurationInput.value);
        const isDays = customDurationType.value === 'days';
        
        let price;
        if (isDays) {
            price = duration >= 2 ? 5000 * Math.ceil(duration / 2) : 3000 * duration;
        } else {
            if (duration <= 1) price = 500;
            else if (duration <= 2) price = 800;
            else if (duration <= 3) price = 1000;
            else if (duration <= 6) price = 1500;
            else price = 2000 * Math.ceil(duration / 24);
        }

        priceValue.textContent = `${price} ₽`;
    }
}

function goBack() {
    document.querySelector('.catalog-container').style.display = 'flex';
    document.querySelector('.code-search-wrapper').style.display = 'flex';
    document.querySelector('.catalog-title').style.display = 'block';
    document.getElementById('productCardContainer').innerHTML = '';
}