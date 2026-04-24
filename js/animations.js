/* ============================================================
   ANIMATIONS.JS — Scroll Reveal, Transition Orchestrator
   PRIYANGSHUX8 | Advanced Motion & Interaction Effects
   ============================================================ */

// ----- GLOBAL ANIMATION INTENSITY -----
let animIntensity = APP_CONFIG.defaultAnimationIntensity / 100;

document.addEventListener('DOMContentLoaded', () => {
    const animSlider = document.getElementById('anim-intensity-slider');
    if (animSlider) {
        animSlider.addEventListener('input', () => {
            animIntensity = animSlider.value / 100;
        });
    }

    // Add staggered reveal to hero heading letters
    initHeroHeadingAnimation();

    // Add hover ripple effect to buttons
    initButtonRippleEffect();
});

// ----- HERO HEADING FLOAT -----
function initHeroHeadingAnimation() {
    const letters = document.querySelectorAll('.hero-heading-letter');
    letters.forEach((letter, i) => {
        letter.style.animationDelay = `${i * 0.08}s`;
        letter.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    });
}

// ----- BUTTON RIPPLE EFFECT -----
function initButtonRippleEffect() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleOut 0.6s ease-out forwards';
            ripple.style.pointerEvents = 'none';
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple keyframe dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleOut {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// ----- SECTION TRANSITION EFFECT -----
function smoothSectionTransition(fromSection, toSection) {
    if (fromSection) {
        fromSection.style.opacity = '0';
        fromSection.style.transform = 'translateY(20px)';
    }
    setTimeout(() => {
        if (fromSection) {
            fromSection.classList.remove('active-section');
            fromSection.style.opacity = '';
            fromSection.style.transform = '';
        }
        if (toSection) {
            toSection.classList.add('active-section');
            toSection.style.opacity = '1';
            toSection.style.transform = 'translateY(0)';
        }
    }, 300 * animIntensity);
}

// ----- PARALLAX EFFECT ON HERO IMAGE -----
document.addEventListener('mousemove', (e) => {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage || !heroImage.closest('.active-section')) return;
    const rect = heroImage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / 40 * animIntensity;
    const moveY = (e.clientY - centerY) / 40 * animIntensity;
    heroImage.style.transform = `scale(1.03) translate(${moveX}px, ${moveY}px)`;
});

// Reset transform when mouse leaves hero image
document.getElementById('hero-image')?.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// ----- GLOW PULSE ON SECRET ELEMENTS -----
function pulseSecretElements() {
    const secretNavLink = document.querySelector('.secret-nav-link');
    if (secretNavLink) {
        setInterval(() => {
            secretNavLink.style.textShadow = '0 0 30px rgba(220,20,60,1)';
            setTimeout(() => {
                secretNavLink.style.textShadow = '0 0 10px rgba(220,20,60,0.4)';
            }, 800);
        }, 4000);
    }
}
pulseSecretElements();