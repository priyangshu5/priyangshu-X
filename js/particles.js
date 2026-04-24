/* ============================================================
   PARTICLES.JS — Canvas Particle Systems for Intro & Hero
   PRIYANGSHUX8 | Floating Red Particles & Energy Effects
   ============================================================ */

let heroParticlesActive = false;
let heroParticleDensity = APP_CONFIG.defaultParticleDensity;
let heroAnimationId = null;

// ----- INTRO PARTICLES (Runs during intro screen) -----
(function initIntroParticles() {
    const canvas = document.getElementById('intro-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 2 + 0.5);
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.life = 0;
            this.maxLife = 200 + Math.random() * 200;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.life++;
            if (this.y < -20 || this.life > this.maxLife) {
                this.reset();
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 20, 60, ${this.opacity * (1 - this.life / this.maxLife)})`;
            ctx.fill();
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 20, 60, ${this.opacity * 0.2 * (1 - this.life / this.maxLife)})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        animId = requestAnimationFrame(animate);
    }
    animate();

    // Stop intro particles when intro ends
    const observer = new MutationObserver(() => {
        const introScreen = document.getElementById('intro-screen');
        if (introScreen && introScreen.classList.contains('hidden')) {
            cancelAnimationFrame(animId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            observer.disconnect();
        }
    });
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        observer.observe(introScreen, { attributes: true, attributeFilter: ['class'] });
    }
})();

// ----- HERO PARTICLES -----
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    heroParticlesActive = true;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class HeroParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Wrap around edges
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
        draw(ctx, time) {
            const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
            const alpha = this.opacity * pulse;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 20, 60, ${alpha})`;
            ctx.fill();
            // Outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 20, 60, ${alpha * 0.15})`;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.floor(heroParticleDensity * 1.5);
        for (let i = 0; i < count; i++) {
            particles.push(new HeroParticle());
        }
    }
    createParticles();

    function animate(time) {
        if (!heroParticlesActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx, time);
        });
        // Draw connecting lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(220, 20, 60, ${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        heroAnimationId = requestAnimationFrame(animate);
    }
    heroAnimationId = requestAnimationFrame(animate);
}

function setParticleDensity(density) {
    heroParticleDensity = density;
    // Restart particles with new density
    if (heroAnimationId) {
        cancelAnimationFrame(heroAnimationId);
    }
    heroParticlesActive = false;
    setTimeout(() => {
        heroParticlesActive = true;
        initHeroParticles();
    }, 100);
}

// Pause particles when not on hero section
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.id === 'home') {
            heroParticlesActive = entry.isIntersecting;
            if (entry.isIntersecting && !heroAnimationId) {
                initHeroParticles();
            }
        }
    });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);