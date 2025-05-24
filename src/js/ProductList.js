function toggleInfo() {
    const info = document.getElementById('infoMessage');
    const button = document.getElementById('infoToggle');
    const isHidden = info.style.display === 'none';
    info.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? '✖' : 'i';
}

function shareProduct() {
    const shareData = {
        title: 'SupVoyage - Прокат сап-бордов',
        text: 'Берите в прокат сап-борды вместе со мной в SupVoyage. Доставим сап в течении 30 минут после заявки',
        url: 'https://t.me/testshoptests_bot/app'
    };

    if (navigator.share) {
        // Для поддерживающих браузеров (мобильные устройства)
        navigator.share(shareData)
            .then(() => console.log('Успешно поделились'))
            .catch(err => {
                console.log('Ошибка при попытке поделиться:', err);
                copyToClipboard(`${shareData.text}\n\n${shareData.url}`);
            });
    } else {
        // Для десктопных браузеров
        copyToClipboard(`${shareData.text}\n\n${shareData.url}`);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Скопировано в буфер обмена:\n\n' + text))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        alert('Скопировано в буфер обмена:\n\n' + text);
    } catch (err) {
        prompt('Скопируйте этот текст вручную:', text);
    }
    
    document.body.removeChild(textarea);
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
    let isSup = false;
    let isVest = false;
    let isCase = false;

    // Определяем тип товара
    if (parts[1] === '001') { // Сап
        isSup = true;
        if (parts[2] === 'r') {
            img = 'https://i.ibb.co/k22N7Q8c/De-Watermark-ai-1747319685673.png';
            title = 'Dark Queen';
            colorInfo = '<p class="product-info-line">ЦВЕТ · Красный</p>';
        } else {
            img = 'https://i.ibb.co/0R7X1Lcv/De-Watermark-ai-1747319421780.png';
            title = 'Black Samurai';
            colorInfo = '<p class="product-info-line">ЦВЕТ · Черный</p>';
        }
    } else if (parts[1] === '002') { // Жилет
        isVest = true;
        const sizes = { s: 'Детский', m: 'Средний', l: 'Взрослый' };
        if (parts[2] === 's') {
            img = 'https://i.ibb.co/pvgNWYJd/image.png';
        } else if (parts[2] === 'm') {
            img = 'https://i.ibb.co/27fJB3f9/image.png';
        } else {
            img = 'https://i.ibb.co/3m65rmch/image.png';
        }
        title = `Жилет (${sizes[parts[2]]})`;
        sizeInfo = `<p class="product-info-line">РАЗМЕР · ${sizes[parts[2]]}</p>`;
    } else if (parts[1] === '003') { // Чехол
        isCase = true;
        img = 'https://ir.ozone.ru/s3/multimedia-0/c1000/6061656552.jpg';
        title = 'Чехол для телефона';
    }

    const basePrice = isCase ? 0 : 500;

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
        '1ч': basePrice,
        '2ч': basePrice * 2,
        '3ч': basePrice * 3,
        '6ч': basePrice * 6,
        'Весь день': basePrice * 8,
        'Сутки': basePrice * 10,
        'Выходные': basePrice * 20,
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
                    <span class="price-value">${basePrice} ₽</span>
                    <select class="duration-select">
                        ${Object.entries(priceOptions).map(([text, value]) => 
                            `<option value="${value}">${text}${value !== 'custom' ? ` · ${value} ₽` : ''}</option>`).join('')}
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
                <button class="book-button" onclick="showBookingForm('${title}', document.querySelector('.price-value').textContent, '${isCase ? 'free' : 'paid'}')">
                    ${isCase ? 'Получить бесплатно' : 'Забронировать'}
                </button>
            </div>
    `;

    // Добавляем дополнительные товары только если это сап
    if (isSup) {
        html += `
            <div class="additional-products">
                <h4 style="margin: 20px 0 10px; text-align: center;">Дополнительно</h4>
                <div class="additional-product" onclick="if(confirm('Вы уверены, что хотите добавить жилет?')) showProductCard('sv-002-m-01')">
                    <img src="https://i.ibb.co/27fJB3f9/image.png" alt="Жилет">
                    <p>Жилет (Средний)</p>
                    <span class="price">500 ₽</span>
                </div>
                <div class="additional-product" onclick="if(confirm('Вы уверены, что хотите добавить чехол?')) showProductCard('sv-003-01')">
                    <img src="https://ir.ozone.ru/s3/multimedia-0/c1000/6061656552.jpg" alt="Чехол">
                    <p>Чехол для телефона</p>
                    <span class="price">Бесплатно</span>
                </div>
            </div>
        `;
    } else if (isVest || isCase) {
        // Блокируем бронирование жилета/чехла без сапа
        html += `
            <div class="restriction-notice">
                <p>⚠️ Этот товар можно забронировать только вместе с сапом</p>
                <button class="back-to-sups" onclick="goBack()">Выбрать сап</button>
            </div>
        `;
    }

    html += `</div>`; // Закрываем основной контейнер

    document.getElementById('productCardContainer').innerHTML = html;

    // Стили для дополнительных элементов
    const style = document.createElement('style');
    style.textContent = `
        .additional-products {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
        }
        .additional-product {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .additional-product:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.15);
        }
        .additional-product img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 10px;
        }
        .additional-product p {
            flex-grow: 1;
            margin: 0;
            font-size: 14px;
        }
        .additional-product .price {
            font-weight: bold;
            color: #72a8a8;
        }
        .restriction-notice {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 100, 100, 0.1);
            border-radius: 12px;
            text-align: center;
        }
        .restriction-notice p {
            color: #ff6b6b;
            margin-bottom: 10px;
        }
        .back-to-sups {
            padding: 10px 15px;
            background: #72a8a8;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Остальной код функции (updatePrice и обработчики)
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
        
        let price = isDays ? basePrice * 10 * duration : basePrice * duration;
        if (isCase) price = 0;

        priceValue.textContent = `${price} ₽`;
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    }
}

function showBookingForm(productTitle, price) {

    if (price === '0 ₽') {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="product-info-result">
                <h4 style="margin-bottom: 10px;">Вы выбрали: ${productTitle}</h4>
                <p>Этот товар предоставляется бесплатно!</p>
                <button onclick="goBack()" style="padding: 12px; width: 100%; background: #72a8a8; color: white; font-weight: bold; border: none; border-radius: 6px;">Вернуться</button>
            </div>
        `;
        document.querySelector('.product-card-result').appendChild(container);
        return;
    }

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="product-info-result">
            <h4 style="margin-bottom: 10px;">Вы выбрали: ${productTitle}</h4>
            <form id="bookingForm">
                <input type="text" id="userName" placeholder="Ваше имя" required style="margin-bottom: 10px; width: 100%; padding: 10px; border-radius: 6px; background: #111; color: white; border: 1px solid #444;">
                <input type="text" id="userTelegram" required style="margin-bottom: 10px; width: 100%; padding: 10px; border-radius: 6px; background: #111; color: white; border: 1px solid #444;">
                <input type="tel" id="userPhone" required style="margin-bottom: 10px; width: 100%; padding: 10px; border-radius: 6px; background: #111; color: white; border: 1px solid #444;">
                <input type="hidden" id="productTitle" value="${productTitle}">
                <input type="hidden" id="productPrice" value="${price}">
                <button type="submit" class="book-button">Подтвердить бронирование</button>
            </form>
            <p id="bookingSuccess" style="display:none; color: #fff; margin-top: 10px; text-align: center;">Данные успешно отправлены!</p>
        </div>
    `;
    document.querySelector('.product-card-result').appendChild(container);

    const telegramInput = document.getElementById('userTelegram');
    const phoneInput = document.getElementById('userPhone');
    const durationSelect = document.querySelector('.duration-select');
    const customInput = document.querySelector('.custom-duration-input');
    const customType = document.querySelector('.custom-duration-type');

    telegramInput.value = '@';
    telegramInput.addEventListener('input', function () {
        if (!this.value.startsWith('@')) {
            this.value = '@' + this.value.replace(/^@*/, '');
        }
    });

    phoneInput.value = '+7';
    phoneInput.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '').slice(1, 11);
        this.value = '+7' + digits;
    });

    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const telegram = telegramInput.value.trim();
        const phone = phoneInput.value.trim();
        const product = document.getElementById('productTitle').value;
        const price = document.getElementById('productPrice').value;

        const phoneRegex = /^\+7\d{10}$/;
        const telegramRegex = /^@\w{3,}$/;

        if (!phoneRegex.test(phone)) {
            alert('Введите корректный номер телефона в формате +7XXXXXXXXXX (10 цифр)');
            return;
        }

        if (!telegramRegex.test(telegram)) {
            alert('Введите корректный Telegram, например @leo');
            return;
        }

        let timeText = '';
        if (durationSelect.value === 'custom') {
            const amount = customInput.value;
            const unit = customType.options[customType.selectedIndex].textContent;
            timeText = `${amount} ${unit}`;
        } else {
            const label = durationSelect.options[durationSelect.selectedIndex].textContent;
            timeText = label;
        }

        const message = `\uD83D\uDCC5 Новое бронирование\n\n\uD83D\uDC64 Имя: ${name}\n\uD83D\uDCAC Telegram: ${telegram}\n\u260E\uFE0F Телефон: ${phone}\n\uD83C\uDF0A Продукт: ${product}\n\u23F0 Время: ${timeText}\n\uD83D\uDCB2 Цена: ${price}`;

        fetch("https://api.telegram.org/bot7914139182:AAHfGT-ckXITu6_DZNQtp0asA9_5yOCscqA/sendMessage", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: '-4940315390',
                parse_mode: 'HTML',
                text: message
            })
        })
        .then(() => {
            document.getElementById('bookingSuccess').style.display = 'block';
            this.reset();
            telegramInput.value = '@';
            phoneInput.value = '+7';
        })
        .catch(err => {
            alert('Ошибка отправки: ' + err.message);
        });
    });
}

function goBack() {
    document.querySelector('.catalog-container').style.display = 'flex';
    document.querySelector('.code-search-wrapper').style.display = 'flex';
    document.querySelector('.catalog-title').style.display = 'block';
    document.getElementById('productCardContainer').innerHTML = '';
}