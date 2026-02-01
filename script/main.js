/**
 * ========================================
 * CV EDUARDO MACÍN - JAVASCRIPT PRINCIPAL
 * Sistema de navegación por carrusel y funcionalidades interactivas
 * ========================================
 */

// ========================================
// 1. CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

/**
 * Variables del carrusel
 */
let currentSection = 0;
const totalSections = 3;
const carouselWrapper = document.getElementById('carousel-wrapper');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

/**
 * Configuración de EmailJS
 */
const EMAILJS_CONFIG = {
  publicKey: "Xy0SRykfpiIJk_o_x",
  serviceId: "service_05dl0wf",
  notificationTemplateId: "contact_notification",
  autoResponseTemplateId: "autoresponder"
};

/**
 * Control de rate limiting para formularios
 */
let lastSubmission = 0;
const RATE_LIMIT_MS = 30000; // 30 segundos

/**
 * Typing effect texts
 */
const typingTexts = [
  "Full Stack Developer",
  "Python Specialist",
  "Backend Architect",
  "Problem Solver",
  "Clean Code Advocate"
];

// ========================================
// 2. INICIALIZACIÓN
// ========================================

/**
 * Inicializa EmailJS cuando el DOM está listo
 */
(function initEmailJS() {
  emailjs.init(EMAILJS_CONFIG.publicKey);
})();

/**
 * Inicialización principal cuando la página se carga
 */
window.addEventListener('load', function() {
  // Preloader GTA V Style
  initGTAPreloader();
  
  // Inicializar tema
  initTheme();
  
  updateIndicators();
  updateNavButtons();
  updateActiveNavLink();
  initDashboardAnimations();
  initTypingEffect();
  initCurrentTime();
});

// ========================================
// 1.5 PRELOADER GTA V STYLE
// ========================================

/**
 * Inicializa el preloader estilo GTA V con barra de progreso animada
 */
function initGTAPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('gta-progress');
  const progressPercent = document.getElementById('progress-percent');
  const loadingMessage = document.getElementById('loading-message');
  const loadingTip = document.getElementById('loading-tip');
  
  if (!preloader || !progressBar) {
    // Fallback for old preloader
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
    }, 2200);
    return;
  }
  
  // Loading messages
  const messages = [
    'CARGANDO EXPERIENCIA',
    'INICIALIZANDO PORTAFOLIO',
    'CARGANDO PROYECTOS',
    'PREPARANDO INTERFAZ',
    'CASI LISTO'
  ];
  
  // Tips
  const tips = [
    'Full Stack Developer con +9 años de experiencia',
    'Especializado en Python, Django y FastAPI',
    'Desarrollo de dashboards y aplicaciones de datos',
    'Disponible para proyectos freelance',
    'Ciudad de México, México'
  ];
  
  let progress = 0;
  let messageIndex = 0;
  let tipIndex = 0;
  let canSkip = false;
  
  // Animate progress bar (slower for longer animation)
  const progressInterval = setInterval(() => {
    // Random increment to simulate real loading (slower)
    const increment = Math.random() * 1.5 + 0.5;
    progress = Math.min(progress + increment, 100);
    
    progressBar.style.width = progress + '%';
    progressPercent.textContent = Math.floor(progress) + '%';
    
    // Update message at certain progress points
    if (progress > 20 && messageIndex === 0) {
      loadingMessage.textContent = messages[1];
      messageIndex = 1;
    } else if (progress > 40 && messageIndex === 1) {
      loadingMessage.textContent = messages[2];
      messageIndex = 2;
    } else if (progress > 60 && messageIndex === 2) {
      loadingMessage.textContent = messages[3];
      messageIndex = 3;
    } else if (progress > 85 && messageIndex === 3) {
      loadingMessage.textContent = messages[4];
      messageIndex = 4;
    }
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      canSkip = true;
      loadingTip.textContent = 'Presiona cualquier tecla para continuar';
      loadingTip.style.color = 'rgba(4, 188, 132, 0.9)';
      loadingTip.style.animation = 'gtaPulse 1s ease-in-out infinite';
    }
  }, 50);
  
  // Rotate tips
  const tipInterval = setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    loadingTip.style.opacity = '0';
    setTimeout(() => {
      if (!canSkip) {
        loadingTip.textContent = tips[tipIndex];
      }
      loadingTip.style.opacity = '1';
    }, 200);
  }, 3000);
  
  // Skip on any key press or click (after loading complete)
  function hidePreloader() {
    if (canSkip) {
      clearInterval(tipInterval);
      preloader.classList.add('hidden');
      document.removeEventListener('keydown', hidePreloader);
      document.removeEventListener('click', hidePreloader);
      document.removeEventListener('touchstart', hidePreloader);
    }
  }
  
  // Auto-hide after loading + small delay, or on interaction
  setTimeout(() => {
    canSkip = true;
    // Auto-hide after 2 seconds if no interaction
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        hidePreloader();
      }
    }, 2500);
  }, 5000);
  
  document.addEventListener('keydown', hidePreloader);
  document.addEventListener('click', hidePreloader);
  document.addEventListener('touchstart', hidePreloader);
}

// ========================================
// 2.0 SISTEMA DE TEMAS (CLARO/OSCURO)
// ========================================

/**
 * Inicializa el tema basado en preferencias del usuario
 * Por defecto: tema oscuro
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggleNav = document.getElementById('theme-toggle-nav');
  
  // Obtener tema guardado
  const savedTheme = localStorage.getItem('theme');
  
  // Aplicar tema inicial (oscuro por defecto)
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  } else {
    // Por defecto: tema oscuro
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
  }
  
  // Event listener para el botón de toggle (sidebar)
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Event listener para el botón de toggle (móvil flotante)
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }
  
  // Event listener para el botón de toggle (barra de navegación móvil)
  if (themeToggleNav) {
    themeToggleNav.addEventListener('click', toggleTheme);
  }
  
  // Aplicar estilos de skill cards según tema inicial
  applySkillCardStyles();
}

/**
 * Aplica los estilos correctos a las skill cards según el tema
 */
function applySkillCardStyles() {
  const currentTheme = document.body.getAttribute('data-theme');
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach(card => {
    if (currentTheme === 'dark') {
      card.style.cssText = 'background: #243640 !important; background-color: #243640 !important; background-image: none !important; border: 1px solid rgba(123, 211, 233, 0.1) !important;';
    } else {
      card.style.cssText = 'background: linear-gradient(135deg, rgba(4, 188, 132, 0.08) 0%, #ffffff 100%) !important; border: 1px solid rgba(4, 188, 132, 0.12) !important;';
    }
  });
}

/**
 * Alterna entre tema claro y oscuro
 */
function toggleTheme() {
  const html = document.documentElement;
  const body = document.body;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Aplicar estilos de skill cards
  applySkillCardStyles();
  
  // Animación suave del botón
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 200);
  }
}

// ========================================
// 2.1 TYPING EFFECT
// ========================================

function initTypingEffect() {
  const typedTextElement = document.getElementById('typed-text');
  if (!typedTextElement) return;
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
      typedTextElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      typingSpeed = 500; // Pause before typing new word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start typing after preloader
  setTimeout(type, 2500);
}

// ========================================
// 2.3 CURRENT TIME
// ========================================

function initCurrentTime() {
  const timeElement = document.getElementById('current-time');
  if (!timeElement) return;
  
  function updateTime() {
    const now = new Date();
    const options = { 
      timeZone: 'America/Mexico_City',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    timeElement.textContent = now.toLocaleTimeString('es-MX', options);
  }
  
  updateTime();
  setInterval(updateTime, 60000); // Update every minute
}

// ========================================
// 3. FUNCIONES DE NAVEGACIÓN DEL CARRUSEL
// ========================================

/**
 * Navega a una sección específica del carrusel
 * @param {number} sectionIndex - Índice de la sección (0-2)
 */
function goToSection(sectionIndex) {
  if (sectionIndex < 0 || sectionIndex >= totalSections) return;
  
  currentSection = sectionIndex;
  const translateX = -currentSection * (100/3); // 33.33% por cada sección
  carouselWrapper.style.transform = `translateX(${translateX}%)`;
  
  updateIndicators();
  updateNavButtons();
  updateActiveNavLink();
  closeMobileMenu();
}

/**
 * Navega a la siguiente sección
 */
function nextSection() {
  if (currentSection < totalSections - 1) {
    goToSection(currentSection + 1);
  }
}

/**
 * Navega a la sección anterior
 */
function previousSection() {
  if (currentSection > 0) {
    goToSection(currentSection - 1);
  }
}

/**
 * Actualiza los indicadores visuales de la sección activa
 */
function updateIndicators() {
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSection);
  });
}

/**
 * Actualiza el estado de los botones de navegación
 */
function updateNavButtons() {
  if (prevBtn) prevBtn.disabled = currentSection === 0;
  if (nextBtn) nextBtn.disabled = currentSection === totalSections - 1;
}

/**
 * Actualiza el enlace activo en la navegación lateral
 */
function updateActiveNavLink() {
  // Desktop sidebar navigation
  const navLinks = document.querySelectorAll('.nav-link-lateral');
  navLinks.forEach((link, index) => {
    link.classList.toggle('active', index === currentSection);
  });
  
  // Mobile bottom navigation
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
  mobileNavBtns.forEach((btn, index) => {
    btn.classList.toggle('active', index === currentSection);
  });
}

/**
 * Cierra el menú móvil (función de compatibilidad)
 */
function closeMobileMenu() {
  // En el nuevo design lateral no hay menú móvil que cerrar
  // Esta función se mantiene por compatibilidad
}

// ========================================
// 4. EVENTOS DE TECLADO
// ========================================

/**
 * Maneja la navegación por teclado
 */
document.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      previousSection();
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      nextSection();
      break;
    case 'Home':
      e.preventDefault();
      goToSection(0);
      break;
    case 'End':
      e.preventDefault();
      goToSection(totalSections - 1);
      break;
  }
});

// ========================================
// 5. SOPORTE TÁCTIL/SWIPE
// ========================================

let startX = 0;
let startY = 0;
const SWIPE_THRESHOLD = 50; // Distancia mínima para swipe

/**
 * Detecta el inicio del toque
 */
document.addEventListener('touchstart', function(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

/**
 * Detecta el final del toque y procesa swipes
 */
document.addEventListener('touchend', function(e) {
  if (!startX || !startY) return;
  
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  
  const diffX = startX - endX;
  const diffY = startY - endY;
  
  // Detección de swipe horizontal
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
    if (diffX > 0) {
      // Swipe izquierda (siguiente sección)
      nextSection();
    } else {
      // Swipe derecha (sección anterior)
      previousSection();
    }
  }
  
  startX = 0;
  startY = 0;
});

// ========================================
// 6. SISTEMA DE FORMULARIOS CON EMAILJS
// ========================================

/**
 * Maneja el envío del formulario de contacto
 */
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Control de rate limiting
  const now = Date.now();
  if (now - lastSubmission < RATE_LIMIT_MS) {
    showFormStatus('Por favor espera 30 segundos antes de enviar otro mensaje.', 'error');
    return;
  }
  
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  
  // Mostrar estado de carga
  setLoadingState(true, submitBtn, btnText, btnLoading);
  hideFormStatus();
  
  // Crear promesas para envío dual
  const notificationPromise = emailjs.sendForm(
    EMAILJS_CONFIG.serviceId, 
    EMAILJS_CONFIG.notificationTemplateId, 
    this
  );
  
  const autoResponsePromise = emailjs.sendForm(
    EMAILJS_CONFIG.serviceId, 
    EMAILJS_CONFIG.autoResponseTemplateId, 
    this
  );
  
  // Procesar envío dual
  Promise.all([notificationPromise, autoResponsePromise])
    .then(function() {
      // Éxito
      lastSubmission = now;
      showFormStatus('¡Mensaje enviado exitosamente! Te responderé pronto.', 'success');
      document.getElementById('contact-form').reset();
    })
    .catch(function(error) {
      // Error
      console.error('Error completo:', error);
      const errorMsg = getErrorMessage(error);
      showFormStatus(`${errorMsg} Por favor, contáctame directamente.`, 'error');
    })
    .finally(function() {
      // Restablecer estado del botón
      setLoadingState(false, submitBtn, btnText, btnLoading);
    });
});

/**
 * Establece el estado de carga del botón
 * @param {boolean} isLoading - Si está cargando o no
 * @param {HTMLElement} submitBtn - Botón de envío
 * @param {HTMLElement} btnText - Texto del botón
 * @param {HTMLElement} btnLoading - Indicador de carga
 */
function setLoadingState(isLoading, submitBtn, btnText, btnLoading) {
  if (isLoading) {
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;
  } else {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }
}

/**
 * Muestra un mensaje de estado del formulario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success' o 'error')
 */
function showFormStatus(message, type) {
  const formStatus = document.getElementById('form-status');
  const colorClass = type === 'success' ? 'text-accent' : 'text-red-400';
  
  formStatus.innerHTML = `<p class="${colorClass} font-bold">${message}</p>`;
  formStatus.classList.remove('hidden');
}

/**
 * Oculta el mensaje de estado del formulario
 */
function hideFormStatus() {
  const formStatus = document.getElementById('form-status');
  formStatus.classList.add('hidden');
}

/**
 * Obtiene un mensaje de error personalizado basado en el código de error
 * @param {Object} error - Objeto de error de EmailJS
 * @returns {string} Mensaje de error
 */
function getErrorMessage(error) {
  switch (error.status) {
    case 400:
      return 'Error de configuración. Verifica los templates en EmailJS.';
    case 401:
      return 'Error de autenticación. Verifica tu Public Key.';
    default:
      return 'Error al enviar el mensaje.';
  }
}

// ========================================
// 7. ANIMACIONES DEL DASHBOARD
// ========================================

/**
 * Inicializa las animaciones del dashboard
 */
function initDashboardAnimations() {
  // Intersection Observer para animaciones en scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar todas las tarjetas del dashboard con efecto escalonado
  document.querySelectorAll('.dashboard-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
  });

  // Inicializar efectos de hover en iconos
  initIconAnimations();
  
  // Inicializar contadores animados
  initCounterAnimations();
  
  // Inicializar efecto parallax sutil
  initParallaxEffect();
  
  // Inicializar efecto de typing
  initTypingEffect();
}

/**
 * Animaciones de iconos interactivos
 */
function initIconAnimations() {
  const icons = document.querySelectorAll('.dashboard-card i');
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.2) rotate(5deg)';
      this.style.transition = 'transform 0.3s ease';
    });
    icon.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

/**
 * Contadores animados para estadísticas
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

/**
 * Anima un contador desde 0 hasta su valor final
 * @param {HTMLElement} element - Elemento con el contador
 */
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'));
  const duration = 2000;
  const start = performance.now();
  const suffix = element.getAttribute('data-suffix') || '';
  
  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    
    element.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Efecto parallax sutil en el scroll
 */
function initParallaxEffect() {
  const sections = document.querySelectorAll('.carousel-section');
  
  sections.forEach(section => {
    section.addEventListener('scroll', function() {
      const scrolled = this.scrollTop;
      const cards = this.querySelectorAll('.dashboard-card');
      
      cards.forEach((card, index) => {
        const speed = 0.02 + (index * 0.005);
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos}px)`;
      });
    });
  });
}

/**
 * Efecto de typing para títulos
 */
function initTypingEffect() {
  const typingElements = document.querySelectorAll('.typing-effect');
  
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        element.classList.add('typing-done');
      }
    }, 50);
  });
}

/**
 * Efecto de mouse tracking para cards
 */
function initMouseTracking() {
  const cards = document.querySelectorAll('.card-tilt');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/**
 * Animación de partículas de fondo (sutil)
 */
function createParticles() {
  const container = document.querySelector('.carousel-container');
  if (!container) return;
  
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: rgba(4, 188, 132, ${Math.random() * 0.2 + 0.05});
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    container.appendChild(particle);
  }
}

// Inicializar partículas después de cargar
window.addEventListener('load', function() {
  // Partículas solo en desktop para mejor rendimiento
  if (window.innerWidth > 768) {
    createParticles();
  }
});

// ========================================
// 8. UTILIDADES Y HELPERS
// ========================================

/**
 * Utilidad para debug - Log con timestamp
 * @param {string} message - Mensaje a logear
 * @param {any} data - Datos adicionales
 */
function debugLog(message, data = null) {
  if (console && console.log) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || '');
  }
}

/**
 * Verifica si un elemento está visible en el viewport
 * @param {HTMLElement} element - Elemento a verificar
 * @returns {boolean} True si está visible
 */
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && 
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
         rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

// ========================================
// 9. EXPOSICIÓN GLOBAL PARA COMPATIBILIDAD
// ========================================

// Hacer funciones disponibles globalmente para onclick en HTML
window.goToSection = goToSection;
window.nextSection = nextSection;
window.previousSection = previousSection;

// ========================================
// 10. COMENTARIOS DE DOCUMENTACIÓN
// ========================================

/**
 * Este archivo contiene toda la lógica JavaScript para el CV de Eduardo Macín.
 * 
 * Funcionalidades incluidas:
 * - Sistema de carrusel de 3 secciones con navegación fluida
 * - Soporte completo para navegación por teclado y touch/swipe
 * - Integración con EmailJS para formulario de contacto dual
 * - Sistema de animaciones progresivas para dashboard cards
 * - Rate limiting y manejo de errores robusto
 * - Utilidades helper para debugging y verificaciones
 * 
 * Compatibilidad:
 * - Navegadores modernos con soporte ES6+
 * - Dispositivos móviles con eventos táctiles
 * - Navegación por teclado para accesibilidad
 * 
 * Dependencias externas:
 * - EmailJS (cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js)
 * - Tailwind CSS para clases de utilidad
 */
