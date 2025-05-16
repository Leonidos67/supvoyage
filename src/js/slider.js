

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const startButton = document.getElementById('startButton');
    const supForm = document.getElementById('supForm');
    const startModal = document.getElementById('startModal');
    const selfFillBtn = document.getElementById('selfFillBtn');
    const helpFillBtn = document.getElementById('helpFillBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Функция переключения вкладок
    function switchTab(tabId) {
        menuItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        const menuItem = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
        if (menuItem) menuItem.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Функция закрытия модального окна
    function closeModal() {
        startModal.classList.remove('active');
    }

    // Переключение вкладок через меню
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // Открытие модального окна при клике на START
    startButton.addEventListener('click', function() {
        startModal.classList.add('active');
    });

    // Закрытие модального окна
    closeModalBtn.addEventListener('click', closeModal);

    // Закрытие при клике вне модального окна
    startModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Выбор "Заполню поля сам"
    selfFillBtn.addEventListener('click', function() {
        closeModal();
        switchTab(this.getAttribute('data-tab'));
    });
    
    // Выбор "Помощь менеджера в Telegram"
    helpFillBtn.addEventListener('click', function() {
        closeModal();
        window.open('https://t.me/leonidsupv', '_blank');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const usernameEl = document.getElementById('username');
    const editBtn = document.querySelector('.edit-btn');
    const editForm = document.querySelector('.edit-name-form');
    const nameInput = document.getElementById('name-input');
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // Загружаем имя из localStorage
    const savedName = localStorage.getItem('supVoyageUsername');
    if (savedName) {
        usernameEl.textContent = savedName;
    }
    
    // Обработчик клика на кнопку редактирования
    editBtn.addEventListener('click', function() {
        // Показываем форму редактирования
        usernameEl.style.display = 'none';
        editBtn.style.display = 'none';
        editForm.style.display = 'flex';
        
        // Устанавливаем текущее имя в инпут
        nameInput.value = usernameEl.textContent;
        nameInput.focus();
    });
    
    // Сохранение имени
    saveBtn.addEventListener('click', function() {
        const newName = nameInput.value.trim();
        if (newName) {
            usernameEl.textContent = newName;
            localStorage.setItem('supVoyageUsername', newName);
        }
        hideEditForm();
    });
    
    // Отмена редактирования
    cancelBtn.addEventListener('click', hideEditForm);
    
    // Сохранение при нажатии Enter
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
    
    // Функция скрытия формы редактирования
    function hideEditForm() {
        usernameEl.style.display = 'block';
        editBtn.style.display = 'block';
        editForm.style.display = 'none';
    }
});

// Генерация дополнительных частиц
const particlesBg = document.getElementById('particles-js');
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animation = `float${Math.floor(Math.random() * 2) + 1} ${8 + Math.random() * 10}s linear infinite`;
    particlesBg.appendChild(particle);
}

// Интерактивность при наведении
document.querySelector('.particles-bg').addEventListener('mousemove', (e) => {
    e.target.style.setProperty('--x', `${e.clientX}px`);
    e.target.style.setProperty('--y', `${e.clientY}px`);
});

// PRODUCT SCROLL
document.addEventListener('DOMContentLoaded', function() {
    const centerContainer = document.querySelector('.center-container');
    const productsContainer = document.querySelector('.products-container');
    const startButton = document.querySelector('.main-button');
    const pulseOuters = document.querySelectorAll('.pulse-outer');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // Оптимизация для быстрого скролла
    let animationFrameId = null;
    
    window.addEventListener('scroll', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        animationFrameId = requestAnimationFrame(function() {
            const scrollPos = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollPercent = (scrollPos / (docHeight - windowHeight)) * 100;
            
            handleScroll(scrollPos);
            
            // Показываем кнопку при 50% прокрутки
            if (scrollPercent > 10) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            
            animationFrameId = null;
        });
    }, { passive: true });
    // Обработчик клика по кнопке "Наверх"
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    function handleScroll(scrollPos) {
        // Быстрое появление карточек при небольшом скролле
        if (scrollPos > 10) {
            productsContainer.classList.add('visible');
        } else {
            productsContainer.classList.remove('visible');
        }
        
        // Быстрое затемнение кнопки
        if (scrollPos > 30) {
            centerContainer.classList.add('scrolled');
        } else {
            centerContainer.classList.remove('scrolled');
        }
        
        // Параллакс эффект
        const parallaxValue = Math.min(scrollPos * 0.3, 50);
        centerContainer.style.transform = `translateY(${parallaxValue}px)`;
        centerContainer.style.transition = scrollPos > 30 ? 'none' : 'transform 0.2s ease-out';
    }
    
    // Инициализация
    handleScroll(window.scrollY || window.pageYOffset);
});