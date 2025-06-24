document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const supItems = document.querySelectorAll('.sup-item');
    const bookingForm = document.getElementById('bookingForm');
    const startTab = document.getElementById('start');
    const backToCatalog = document.getElementById('backToCatalog');
    const selectedSupImage = document.getElementById('selectedSupImage');
    const timeOptions = document.querySelectorAll('.time-option');
    const bookingDetailsForm = document.getElementById('bookingDetails');
    const totalAmount = document.getElementById('totalAmount');
    const vestQuestion = document.getElementById('vestQuestion');
    const vestSelection = document.getElementById('vestSelection');
    const selectedVestsList = document.querySelector('#selectedVests .items-list');
    const phoneCaseBtn = document.getElementById('phoneCase');
    const successNotification = document.getElementById('successNotification');
    const closeSuccess = document.getElementById('closeSuccess');
    const userPhone = document.getElementById('userPhone');
    const userTelegram = document.getElementById('userTelegram');
    const supCountInput = document.getElementById('supCount');
    const supCountMinus = document.querySelector('#supCount ~ .minus');
    const supCountPlus = document.querySelector('#supCount ~ .plus');
    
    // Данные бронирования
    let bookingData = {
        sup: null,
        supCount: 1,
        hours: null,
        price: 0,
        extras: {
            vests: [],
            phoneCase: false
        }
    };
    
    // Обработчики выбора SUP
    supItems.forEach(item => {
        item.addEventListener('click', function() {
            const supId = this.getAttribute('data-id');
            const supImage = this.querySelector('img').src;
            
            // Сохраняем данные
            bookingData.sup = {
                id: supId,
                image: supImage
            };
            
            // Обновляем UI
            selectedSupImage.src = supImage;
            
            // Переключаем на форму
            startTab.style.display = 'none';
            bookingForm.style.display = 'block';
        });
    });
    
    // Возврат к каталогу
    backToCatalog.addEventListener('click', function() {
        bookingForm.style.display = 'none';
        startTab.style.display = 'block';
        resetForm();
    });
    
    // Выбор времени
    timeOptions.forEach(option => {
        option.addEventListener('click', function() {
            timeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            bookingData.hours = parseInt(this.getAttribute('data-hours'));
            bookingData.price = parseInt(this.getAttribute('data-price')) * bookingData.supCount;
            
            updateTotalPrice();
        });
    });
    
    // Управление количеством сапов
    supCountMinus.addEventListener('click', function() {
        if (bookingData.supCount > 1) {
            bookingData.supCount--;
            supCountInput.value = bookingData.supCount;
            updatePriceForCount();
        }
    });
    
    supCountPlus.addEventListener('click', function() {
        if (bookingData.supCount < 10) {
            bookingData.supCount++;
            supCountInput.value = bookingData.supCount;
            updatePriceForCount();
        }
    });
    
    supCountInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 1;
        if (value < 1) value = 1;
        if (value > 10) value = 10;
        
        bookingData.supCount = value;
        this.value = value;
        updatePriceForCount();
    });
    
    // Нужен ли жилет
    document.querySelectorAll('.toggle-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.value === 'yes') {
                vestSelection.style.display = 'block';
            } else {
                vestSelection.style.display = 'none';
                resetVests();
            }
        });
    });
    
    // Управление количеством жилетов
    document.querySelectorAll('.vest-item').forEach(item => {
        const size = item.querySelector('.vest-count').dataset.size;
        const minusBtn = item.querySelector('.minus');
        const plusBtn = item.querySelector('.plus');
        const countElement = item.querySelector('.vest-count');
        
        minusBtn.addEventListener('click', function() {
            const currentCount = parseInt(countElement.textContent);
            if (currentCount > 0) {
                countElement.textContent = currentCount - 1;
                updateVestSelection(size, currentCount - 1);
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentCount = parseInt(countElement.textContent);
            countElement.textContent = currentCount + 1;
            updateVestSelection(size, currentCount + 1);
        });
    });
    
    // Выбор чехла
    phoneCaseBtn.addEventListener('click', function() {
        bookingData.extras.phoneCase = !bookingData.extras.phoneCase;
        this.classList.toggle('active');
    });
    
    // Запрет редактирования +7 и @
    userPhone.addEventListener('keydown', function(e) {
        // Запрещаем удаление +7
        if ((e.key === 'Backspace' || e.key === 'Delete') && 
            this.selectionStart <= 2 && this.selectionEnd <= 2) {
            e.preventDefault();
        }
    });

    // Обработчики для поля телефона
    userPhone.addEventListener('focus', function() {
        if (this.value === '+7') {
            this.selectionStart = this.selectionEnd = 2; // Устанавливаем курсор после +7
        }
    });

    // Обработчики для поля Telegram
    userTelegram.addEventListener('focus', function() {
        if (this.value === '@') {
            this.selectionStart = this.selectionEnd = 1; // Устанавливаем курсор после @
        }
    });
    
    userTelegram.addEventListener('keydown', function(e) {
        // Запрещаем удаление @
        if ((e.key === 'Backspace' || e.key === 'Delete') && 
            this.selectionStart <= 1 && this.selectionEnd <= 1) {
            e.preventDefault();
        }
    });
    
    // Форматирование телефона
    userPhone.addEventListener('input', function(e) {
        // Запрещаем удаление +7
        if (!this.value.startsWith('+7')) {
            this.value = '+7' + this.value.replace(/[^0-9]/g, '');
        }
        
        // Оставляем только цифры после +7
        let digits = this.value.replace(/[^0-9]/g, '');
        if (digits.length > 1) {
            this.value = '+7' + digits.substring(1, 11); // Ограничиваем 10 цифрами после +7
        } else {
            this.value = '+7';
        }
    });
    
    // Форматирование Telegram
    userTelegram.addEventListener('input', function(e) {
        // Запрещаем удаление @
        if (!this.value.startsWith('@')) {
            this.value = '@' + this.value.replace(/^@/, '');
        }
    });
    
    // Отправка формы
    bookingDetailsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка заполнения
        if (!bookingData.sup || !bookingData.hours) {
            alert('Пожалуйста, выберите время аренды');
            return;
        }
        
        const userName = document.getElementById('userName').value.trim();
        const userPhoneValue = userPhone.value;
        const userTelegramValue = userTelegram.value;
        
        if (!userName || userPhoneValue === '+7' || userTelegramValue === '@') {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        // Формируем сообщение
        let message = `🏄 *Новая бронь SUP* 🏄\n\n`;
        message += `*SUP:* ${bookingData.sup.id}\n`;
        message += `*Количество:* ${bookingData.supCount}\n`;
        message += `*Время:* ${bookingData.hours} ${getHoursWord(bookingData.hours)}\n`;
        message += `*Сумма:* ${bookingData.price} ₽\n\n`;
        message += `*Клиент:* ${userName}\n`;
        message += `*Телефон:* ${userPhoneValue}\n`;
        message += `*Telegram:* ${userTelegramValue}\n\n`;
        
        if (bookingData.extras.vests.length > 0) {
            message += `*Жилеты:*\n`;
            bookingData.extras.vests.forEach(vest => {
                const sizeName = {
                    'child': 'Детский',
                    'medium': 'Средний',
                    'adult': 'Взрослый'
                }[vest.size];
                message += `- ${sizeName}: ${vest.count} шт.\n`;
            });
            message += `\n`;
        }
        
        if (bookingData.extras.phoneCase) {
            message += `*Чехол для телефона:* Да\n`;
        }
        
        // Отправляем в Telegram
        sendToTelegram(message);
    });
    
    // Закрытие уведомления
    closeSuccess.addEventListener('click', function() {
        successNotification.style.display = 'none';
        resetForm();
    });
    
    // Функция обновления итоговой цены
    function updateTotalPrice() {
        totalAmount.textContent = `${bookingData.price} ₽`;
    }
    
    // Функция обновления цены при изменении количества сапов
    function updatePriceForCount() {
        const activeOption = document.querySelector('.time-option.active');
        if (activeOption) {
            bookingData.price = parseInt(activeOption.dataset.price) * bookingData.supCount;
            updateTotalPrice();
        }
    }
    
    // Функция обновления выбранных жилетов
    function updateVestSelection(size, count) {
        // Удаляем если есть
        bookingData.extras.vests = bookingData.extras.vests.filter(v => v.size !== size);
        
        // Добавляем если количество > 0
        if (count > 0) {
            bookingData.extras.vests.push({
                size: size,
                count: count
            });
        }
        
        updateVestsList();
    }
    
    // Функция обновления списка выбранных жилетов
    function updateVestsList() {
        selectedVestsList.innerHTML = '';
        
        bookingData.extras.vests.forEach(vest => {
            const sizeName = {
                'child': 'Детский',
                'medium': 'Средний',
                'adult': 'Взрослый'
            }[vest.size];
            
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                <span class="item-name">${sizeName} жилет</span>
                <div class="item-actions">
                    <span class="item-count">${vest.count} шт.</span>
                    <button type="button" class="delete-item" data-size="${vest.size}">×</button>
                </div>
            `;
            
            item.querySelector('.delete-item').addEventListener('click', function() {
                const size = this.dataset.size;
                document.querySelector(`.vest-count[data-size="${size}"]`).textContent = '0';
                updateVestSelection(size, 0);
            });
            
            selectedVestsList.appendChild(item);
        });
    }
    
    // Функция сброса выбора жилетов
    function resetVests() {
        document.querySelectorAll('.vest-count').forEach(el => el.textContent = '0');
        bookingData.extras.vests = [];
        updateVestsList();
    }
    
    // Функция отправки в Telegram
    function sendToTelegram(message) {
        const token = '7914139182:AAHfGT-ckXITu6_DZNQtp0asA9_5yOCscqA';
        const chatId = '-4940315390';
        
        axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
        .then(response => {
            showSuccessNotification();
        })
        .catch(error => {
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
            console.error('Telegram API error:', error);
        });
    }
    
    // Показать уведомление об успехе
    function showSuccessNotification() {
        successNotification.style.display = 'flex';
    }
    
    // Функция сброса формы
    function resetForm() {
        bookingDetailsForm.reset();
        timeOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelectorAll('.vest-count').forEach(el => el.textContent = '0');
        phoneCaseBtn.classList.remove('active');
        document.querySelector('.toggle-option.no').classList.add('active');
        document.querySelector('.toggle-option.yes').classList.remove('active');
        vestSelection.style.display = 'none';
        
        bookingData = {
            sup: null,
            supCount: 1,
            hours: null,
            price: 0,
            extras: {
                vests: [],
                phoneCase: false
            }
        };
        
        totalAmount.textContent = '0 ₽';
        supCountInput.value = '1';
        userPhone.value = '+7';
        userTelegram.value = '@';
    }
    
    // Функция для правильного склонения часов
    function getHoursWord(hours) {
        if (hours === 1) return 'час';
        if (hours >= 2 && hours <= 4) return 'часа';
        return 'часов';
    }
});