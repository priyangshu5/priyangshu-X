/* ============================================================
   SECRET.JS — Hidden Zone Toggle & Deep Introspection Mode
   PRIYANGSHUX8 | Secret Realm Controller
   ============================================================ */

let deepModeActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const secretToggle = document.getElementById('secret-mode-toggle');
    if (secretToggle) {
        secretToggle.addEventListener('click', toggleDeepMode);
    }
});

function toggleDeepMode() {
    deepModeActive = !deepModeActive;
    const indicator = document.getElementById('secret-mode-indicator');
    const body = document.body;

    if (deepModeActive) {
        if (indicator) indicator.textContent = 'Current Mode: Deep Introspection 🌙';
        body.classList.add('deep-mode');
        // Intensify red glows
        document.documentElement.style.setProperty('--glow-red', '0 0 30px rgba(220, 20, 60, 1)');
        document.documentElement.style.setProperty('--glow-red-strong', '0 0 60px rgba(220, 20, 60, 1.5)');
        // Reduce animation intensity for calm
        document.documentElement.style.setProperty('--anim-intensity', '0.4');
        // Play Shikayat if available
        if (typeof loadTrack === 'function' && typeof playTrack === 'function') {
            loadTrack(3); // Shikayat
            playTrack();
        }
    } else {
        if (indicator) indicator.textContent = 'Current Mode: Standard';
        body.classList.remove('deep-mode');
        // Restore default glows
        document.documentElement.style.setProperty('--glow-red', '0 0 20px rgba(220, 20, 60, 0.8)');
        document.documentElement.style.setProperty('--glow-red-strong', '0 0 40px rgba(220, 20, 60, 1)');
        document.documentElement.style.setProperty('--anim-intensity', (APP_CONFIG.defaultAnimationIntensity / 100).toString());
    }
}

// Deep mode styles (injected dynamically)
const deepModeStyles = document.createElement('style');
deepModeStyles.textContent = `
    body.deep-mode {
        background: radial-gradient(ellipse at center, #020000 0%, #000000 100%);
    }
    body.deep-mode .section {
        filter: brightness(0.7) saturate(1.3);
    }
    body.deep-mode .secret-card {
        box-shadow: 0 0 80px rgba(220, 20, 60, 0.5);
        border-color: rgba(220, 20, 60, 0.6);
    }
    body.deep-mode .secret-message {
        color: #ff8080;
        text-shadow: 0 0 20px rgba(220, 20, 60, 0.8);
    }
`;
document.head.appendChild(deepModeStyles);