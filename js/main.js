/* ============================================================
   MAIN.JS — App Initialization, Navigation, Section Switching
   PRIYANGSHUX8 | Core Application Controller
   ============================================================ */

// ----- DOM READY -----
document.addEventListener('DOMContentLoaded', () => {
    initIntroScreen();
    initNavigation();
    initCustomCursor();
    initSettingsPanel();
    initScrollReveal();
    initKeyboardShortcuts();
});

// ----- INTRO SCREEN -----
function initIntroScreen() {
    const introScreen = document.getElementById('intro-screen');
    const app = document.getElementById('app');
    const loadingBar = document.getElementById('intro-loading-bar');
    const introTitle = document.getElementById('intro-title');
    const enterBtn = document.getElementById('intro-enter-btn');

    // Build intro title letters with delays
    const name = 'PRIYANGSHUX8';
    introTitle.innerHTML = '';
    name.split('').forEach((letter, i) => {
        const span = document.createElement('span');
        span.className = 'intro-letter';
        span.textContent = letter;
        span.style.animationDelay = `${i * 80}ms`;
        introTitle.appendChild(span);
    });

    // Simulate loading progress, then show Enter button
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        loadingBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(progressInterval);
            // Show the Enter button
            setTimeout(() => {
                enterBtn.classList.remove('hidden');
            }, 300);
        }
    }, 200);

    // Fallback: show enter button after max duration
    setTimeout(() => {
        if (enterBtn.classList.contains('hidden')) {
            clearInterval(progressInterval);
            loadingBar.style.width = '100%';
            setTimeout(() => {
                enterBtn.classList.remove('hidden');
            }, 300);
        }
    }, APP_CONFIG.introDuration + 800);

    // ENTER BUTTON CLICK — the crucial user gesture for autoplay
    enterBtn.addEventListener('click', () => {
        // Hide intro
        introScreen.classList.add('hidden');
        // Show app
        app.classList.remove('app-hidden');
        app.classList.add('app-visible');
        
        // Start hero particles
        if (FEATURES.enableParticles) {
            if (typeof initHeroParticles === 'function') initHeroParticles();
        }
        
        // START MUSIC NOW (user gesture allows autoplay)
        if (typeof startMusicAutoplay === 'function') {
            startMusicAutoplay();
        }
    });
}

// ----- NAVIGATION -----
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const navbar = document.getElementById('navbar');

    // Desktop nav
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
            closeMobileNav();
        });
    });

    // Mobile nav
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
            closeMobileNav();
        });
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const isOpen = mobileNav.classList.contains('open');
        hamburger.classList.toggle('active', isOpen);
    });

    // Close mobile nav when clicking background
    mobileNav.querySelector('.mobile-nav-bg').addEventListener('click', closeMobileNav);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile nav on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });
}

function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const hamburger = document.getElementById('nav-hamburger');
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
}

function navigateToSection(sectionId) {
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Initialize specific section features
    if (sectionId === 'music' && FEATURES.enableMusic) {
        if (typeof initVisualizer === 'function') initVisualizer();
    }
    if (sectionId === 'games' && FEATURES.enableGames) {
        if (typeof initGames === 'function') initGames();
    }
}

// Handle hash navigation on load
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) navigateToSection(hash);
});

// ----- CUSTOM CURSOR -----
function initCustomCursor() {
    if (!FEATURES.enableCustomCursor) return;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        cursorRing.style.left = dotX + 'px';
        cursorRing.style.top = dotY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Enlarge ring on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .playlist-item, .quiz-option, .memory-card, .tictactoe-cell, .reflex-arena, input, select, .toggle-switch, #intro-enter-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '48px';
            cursorRing.style.height = '48px';
            cursorRing.style.borderColor = 'rgba(220,20,60,1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '32px';
            cursorRing.style.height = '32px';
            cursorRing.style.borderColor = 'rgba(220,20,60,0.6)';
        });
    });
}

// ----- SETTINGS -----
function initSettingsPanel() {
    const animSlider = document.getElementById('anim-intensity-slider');
    const glowToggle = document.getElementById('glow-toggle');
    const particleSlider = document.getElementById('particle-density-slider');
    const themeSelect = document.getElementById('theme-select');
    const volumeSlider = document.getElementById('default-volume-slider');

    if (animSlider) {
        animSlider.value = APP_CONFIG.defaultAnimationIntensity;
        document.getElementById('anim-intensity-val').textContent = animSlider.value + '%';
        animSlider.addEventListener('input', () => {
            document.getElementById('anim-intensity-val').textContent = animSlider.value + '%';
            document.documentElement.style.setProperty('--anim-intensity', animSlider.value / 100);
        });
    }

    if (glowToggle) {
        glowToggle.checked = APP_CONFIG.defaultGlowEnabled;
        glowToggle.addEventListener('change', () => {
            const enabled = glowToggle.checked;
            document.body.classList.toggle('no-glow', !enabled);
        });
    }

    if (particleSlider) {
        particleSlider.value = APP_CONFIG.defaultParticleDensity;
        document.getElementById('particle-density-val').textContent = particleSlider.value;
        particleSlider.addEventListener('input', () => {
            document.getElementById('particle-density-val').textContent = particleSlider.value;
            if (typeof setParticleDensity === 'function') setParticleDensity(particleSlider.value);
        });
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            document.body.setAttribute('data-theme', themeSelect.value);
        });
    }

    if (volumeSlider) {
        volumeSlider.value = APP_CONFIG.defaultVolume;
        document.getElementById('default-volume-val').textContent = volumeSlider.value + '%';
        volumeSlider.addEventListener('input', () => {
            document.getElementById('default-volume-val').textContent = volumeSlider.value + '%';
        });
    }
}

// ----- SCROLL REVEAL -----
function initScrollReveal() {
    if (!FEATURES.enableScrollReveal) return;
    const revealElements = document.querySelectorAll('.game-card, .quiz-card, .settings-card, .about-card, .secret-card, .section-header');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        observer.observe(el);
    });
}

// ----- KEYBOARD SHORTCUTS -----
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            const sectionMap = {
                '1': 'home',
                '2': 'ai-zone',
                '3': 'games',
                '4': 'quiz',
                '5': 'music',
                '6': 'about',
                '7': 'secret',
                '0': 'settings'
            };
            if (sectionMap[e.key]) {
                e.preventDefault();
                navigateToSection(sectionMap[e.key]);
            }
        }
        // Also allow Enter key to trigger intro enter
        if (e.key === 'Enter') {
            const enterBtn = document.getElementById('intro-enter-btn');
            if (enterBtn && !enterBtn.classList.contains('hidden')) {
                e.preventDefault();
                enterBtn.click();
            }
        }
    });
}

// Expose navigateToSection globally
window.navigateToSection = navigateToSection;