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