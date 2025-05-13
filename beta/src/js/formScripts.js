document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('focus', function() {
        if (!this.value.startsWith('+7')) {
            this.value = '+7 ';
        }
    });
    
    phoneInput.addEventListener('input', function(e) {
        if (this.value.length < 3 && this.value.startsWith('+7')) {
            this.value = '+7 ';
            return;
        }
        
        let x = this.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
        
        if (x[1] === '7') {
            this.value = '+7 (' + (x[2] ? x[2] : '') + 
                         (x[3] ? ') ' + x[3] : '') + 
                         (x[4] ? '-' + x[4] : '');
        } else {
            this.value = '+7 ' + this.value.substring(3);
        }
    });
    
    phoneInput.addEventListener('blur', function() {
        if (!this.value.startsWith('+7')) {
            this.value = '+7 ' + this.value;
        }
    });

    // Обработчики для Telegram
    const telegramInput = document.getElementById('telegram');
    telegramInput.addEventListener('focus', function() {
        if (!this.value.startsWith('@')) {
            this.value = '@';
        }
    });
    
    telegramInput.addEventListener('input', function(e) {
        if (this.value.length === 0) {
            this.value = '@';
            return;
        }
        
        if (!this.value.startsWith('@')) {
            this.value = '@' + this.value.replace(/@/g, '');
        } else if ((this.value.match(/@/g) || []).length > 1) {
            this.value = '@' + this.value.substring(1).replace(/@/g, '');
        }
    });
    
    telegramInput.addEventListener('blur', function() {
        if (!this.value.startsWith('@') && this.value.length > 0) {
            this.value = '@' + this.value;
        }
    });

    // Календарь недели
    const prevWeekBtn = document.querySelector('.prev-week');
    const nextWeekBtn = document.querySelector('.next-week');
    const weekRangeDisplay = document.querySelector('.week-range');
    const weekDaysContainer = document.querySelector('.week-days');
    const dateInput = document.getElementById('date');

    let currentDate = new Date();
    let selectedDate = null;

    // Форматирование диапазона недели
    function formatWeekRange(startDate, endDate) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const monthName = startDate.toLocaleDateString('ru-RU', { month: 'long' });
        return `${startDay} - ${endDay} ${monthName}`;
    }

    // Отрисовка дней недели
    function renderWeek() {
        // Находим понедельник и воскресенье текущей недели
        const monday = new Date(currentDate);
        monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
        
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        
        // Обновляем отображение диапазона
        weekRangeDisplay.textContent = formatWeekRange(monday, sunday);
        
        // Очищаем контейнер дней
        weekDaysContainer.innerHTML = '';
        
        // Добавляем дни недели
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(day.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'day-item';
            
            // Подсветка сегодняшнего дня
            if (day.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Подсветка выбранного дня
            if (selectedDate && day.toDateString() === selectedDate.toDateString()) {
                dayElement.classList.add('selected');
            }
            
            dayElement.innerHTML = `
                <div class="day-name">${dayNames[i]}</div>
                <div class="day-date">${day.getDate()}</div>
            `;
            
            // Обработчик выбора дня
            dayElement.addEventListener('click', () => selectDate(day));
            weekDaysContainer.appendChild(dayElement);
        }
    }

    // Выбор даты
    function selectDate(date) {
        selectedDate = new Date(date);
        dateInput.value = selectedDate.toISOString().split('T')[0];
        renderWeek();
    }

    // Переключение недель
    prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        renderWeek();
    });

    nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        renderWeek();
    });

    // Инициализация календаря
    renderWeek();
    selectDate(new Date()); // Выбираем сегодняшнюю дату по умолчанию
});

// Обработчик для ползунка количества гостей
const guestCountSlider = document.getElementById('guest-count');
const sliderValue = document.querySelector('.slider-value');
const guestFieldsContainer = document.getElementById('guest-fields-container');

// Типы полей для разных вариантов
const fieldTemplates = {
    1: `<div class="form-group guest-field">
            <label for="guest-name-1">Имя гостя:</label>
            <input type="text" id="guest-name-1" name="guest-name-1" placeholder="Введите имя" required>
        </div>`,
    2: `<div class="form-group guest-field">
            <label>Тип брони:</label>
            <select name="booking-type" required>
                <option value="">Выберите тип</option>
                <option value="standard">Стандарт</option>
                <option value="premium">Премиум</option>
            </select>
        </div>`,
    // Добавьте другие варианты по необходимости
};

// Обновление полей при изменении ползунка
guestCountSlider.addEventListener('input', function() {
    const value = this.value;
    sliderValue.textContent = value;
    updateGuestFields(value);
});

// Функция обновления полей
function updateGuestFields(count) {
    guestFieldsContainer.innerHTML = '';
    
    if (fieldTemplates[count]) {
        guestFieldsContainer.insertAdjacentHTML('beforeend', fieldTemplates[count]);
    }
    
    // Добавляем поля для каждого гостя, если нужно
    for (let i = 1; i <= count; i++) {
        guestFieldsContainer.insertAdjacentHTML('beforeend', 
            `<div class="form-group guest-field">
                <label for="guest-name-${i}">Имя гостя ${i}:</label>
                <input type="text" id="guest-name-${i}" name="guest-name-${i}" placeholder="Введите имя" required>
            </div>`
        );
    }
}

// Инициализация полей при загрузке
updateGuestFields(guestCountSlider.value);