// Selección de elementos
const heroSection = document.querySelector('.hero');
const navArrows = document.querySelectorAll('.hero-nav .nav-arrow');
let backgroundIndex = 0;

// Array de imágenes para el fondo
const backgrounds = [
    'url("img/comunitaria.jpg")',
    'url("img/supervisionObra.jpg")',
    'url("img/city.jpg")'
];

// Función para cambiar el fondo
function changeBackground(index) {
    if (heroSection) {
        heroSection.style.backgroundImage = backgrounds[index];
    }
}

// Cambio automático de fondo
let autoChange = setInterval(() => {
    backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
    changeBackground(backgroundIndex);
}, 5000); // Cambia cada 5 segundos

navArrows.forEach((arrow, index) => {
    arrow.addEventListener('click', () => {
        clearInterval(autoChange); // Detener cambio automático
        if (index === 0) {
            // Flecha izquierda
            backgroundIndex = (backgroundIndex - 1 + backgrounds.length) % backgrounds.length;
        } else {
            // Flecha derecha
            backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
        }
        changeBackground(backgroundIndex);

        // Reiniciar cambio automático después de 10 segundos de inactividad
        autoChange = setInterval(() => {
            backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
            changeBackground(backgroundIndex);
        }, 5000);
    });
});


// module video

const videoTrigger = document.querySelector('.video-trigger');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const iframe = document.querySelector('.modal iframe');

// Example video URL - replace with your actual video URL
const videoUrl = './img/video/video.mp4';
if (videoTrigger) {
    videoTrigger.addEventListener('click', () => {
        modal.classList.add('active');
        iframe.setAttribute('src', videoUrl);
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        iframe.setAttribute('src', '');
    });
}

// Close modal when clicking outside
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            iframe.setAttribute('src', '');
        }
    });
}

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        iframe.setAttribute('src', '');
    }
});
//end video
document.addEventListener("DOMContentLoaded", () => {
    if (heroSection) {
        const heroSection = document.querySelector(".hero");
    }
    const backgrounds = ["city.jpg", "city-01.jpg"];

    backgrounds.forEach((bg, index) => {
        const div = document.createElement("div");
        div.classList.add("background");
        div.style.backgroundImage = `url('${bg}')`;
        if (index === 0) div.classList.add("active");
        if (heroSection) {
            heroSection.appendChild(div);
        }
        });

    const backgroundElements = document.querySelectorAll(".hero .background");
    let currentIndex = 0;

    function changeBackground(next = true) {
        const current = backgroundElements[currentIndex];
        if (current) {
            current.classList.remove("active");
        }
        currentIndex = next
            ? (currentIndex + 1) % backgroundElements.length
            : (currentIndex - 1 + backgroundElements.length) % backgroundElements.length;

        const nextBackground = backgroundElements[currentIndex];
        if (nextBackground){

            nextBackground.classList.add("active");
        }
    }

    let autoSlideInterval = setInterval(() => changeBackground(true), 4000);

    function resetInterval() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => changeBackground(true), 4000);
    }

    const navArrows = document.querySelectorAll(".hero-nav .nav-arrow");
    navArrows.forEach((arrow, index) => {
        arrow.addEventListener("click", () => {
            changeBackground(index !== 0);
            resetInterval();
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            links.forEach(link => link.classList.add('scrolled'));
        } else {
            navbar.classList.remove('scrolled');
            links.forEach(link => link.classList.remove('scrolled'));
        }
    });
});

// module carousel logo
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
let currentIndex = 0;
const slideWidth = 120;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Clonar slides para el efecto infinito
slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
});

// Crear puntos
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

// Eventos táctiles
track.addEventListener('touchstart', dragStart);
track.addEventListener('touchmove', drag);
track.addEventListener('touchend', dragEnd);

// Eventos del ratón
track.addEventListener('mousedown', dragStart);
track.addEventListener('mousemove', drag);
track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', dragEnd);

function dragStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    track.style.cursor = 'grabbing';
    track.style.transition = 'none';
}

function drag(event) {
    if (!isDragging) return;

    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;

    setSlidePosition(currentTranslate);
}

function dragEnd() {
    isDragging = false;
    track.style.cursor = 'grab';

    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > slideWidth / 3) {
        if (movedBy < 0) {
            currentIndex++;
        } else {
            currentIndex--;
        }
    }

    goToSlide(currentIndex);
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function goToSlide(index) {
    const totalSlides = slides.length;
    if (index < 0) {
        currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    prevTranslate = currentIndex * -slideWidth;
    currentTranslate = prevTranslate;

    track.style.transition = 'transform 0.5s ease';
    setSlidePosition(currentTranslate);

    updateDots();
    updateSlides();

    // Ajuste para el efecto infinito
    if (index < 0 || index >= totalSlides) {
        setTimeout(() => {
            track.style.transition = 'none';
            setSlidePosition(currentIndex * -slideWidth);
        }, 500);
    }
}

function setSlidePosition(position) {
    track.style.transform = `translateX(${position}px)`;
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function updateSlides() {
    const allSlides = document.querySelectorAll('.carousel-slide');
    allSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index % slides.length === currentIndex);
    });
}

// Avance automático
setInterval(() => {
    currentIndex++;
    goToSlide(currentIndex);
}, 3000);

// Prevenir el arrastre de imágenes
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

const styledRoutes = ["/","/project.html", "/project-detail-public.html","/project-detail-private.html","/project-detail-recident.html","/service.html"];

// Verificar si la ruta actual coincide con alguna de las rutas del arreglo
// if (styledRoutes.includes(window.location.pathname)) {
//     // Seleccionar los enlaces y aplicar estilos
//     document.querySelectorAll('a.nav-link').forEach(link => {
//         link.style.color = '#000000';
//     });
// }
