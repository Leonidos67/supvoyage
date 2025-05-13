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


 // Генерация 50 частиц
const container = document.getElementById('particles-container');
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Нормализованное направление (вектор длины 1)
    const angle = Math.random() * Math.PI * 2;
    const tx = Math.cos(angle);
    const ty = Math.sin(angle);
    
    // Устанавливаем направление через CSS переменные
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    
    // Длительность анимации зависит от расстояния до края
    const distanceToEdge = Math.min(
        Math.abs((tx > 0 ? vw : 0) - vw/2) / Math.abs(tx),
        Math.abs((ty > 0 ? vh : 0) - vh/2) / Math.abs(ty)
    );
    const speed = 0.2; // px/ms
    const duration = distanceToEdge / (speed * 1000);
    
    particle.style.animationDuration = `${duration}s`;
    
    // Случайный размер и прозрачность
    const size = 1 + Math.random();
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = 0.7 + Math.random() * 0.3;
    
    container.appendChild(particle);
    
    // Удаляем частицу после завершения анимации
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Создаем начальные частицы
for (let i = 0; i < 100; i++) {
    setTimeout(createParticle, Math.random() * 2000);
}

// Постоянное создание новых частиц
setInterval(createParticle, 50);

// Больше частиц при движении мыши
document.addEventListener('mousemove', () => {
    for (let i = 0; i < 3; i++) {
        createParticle();
    }
});