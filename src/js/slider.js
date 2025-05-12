document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('imageSlider');
    const slidesContainer = slider.querySelector('.slides-container');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let autoplayInterval;
    
    // Инициализация слайдера
    initSlider();
    
    function initSlider() {
        // Автопрокрутка
        startAutoplay();
        
        // События мыши
        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('mouseup', dragEnd);
        slider.addEventListener('mouseleave', dragEnd);
        slider.addEventListener('mousemove', drag);
        
        // События касания для мобильных
        slider.addEventListener('touchstart', dragStart);
        slider.addEventListener('touchend', dragEnd);
        slider.addEventListener('touchmove', drag);
        
        // Клик по точкам
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
        });
    }
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault(); // Предотвращаем выделение текста
        }
        
        isDragging = true;
        slidesContainer.style.transition = 'none';
        clearInterval(autoplayInterval);
        
        // Запускаем анимацию
        animationID = requestAnimationFrame(animation);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }
        
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Определяем направление свайпа
        if (movedBy < -100 && currentSlide < slides.length - 1) {
            currentSlide += 1;
        } else if (movedBy > 100 && currentSlide > 0) {
            currentSlide -= 1;
        }
        
        goToSlide(currentSlide);
        startAutoplay();
    }
    
    function animation() {
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(animation);
    }
    
    function goToSlide(index) {
        currentSlide = index;
        prevTranslate = -currentSlide * slider.offsetWidth;
        currentTranslate = prevTranslate;
        slidesContainer.style.transition = 'transform 0.5s ease';
        slidesContainer.style.transform = `translateX(${prevTranslate}px)`;
        
        // Обновляем точки
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
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