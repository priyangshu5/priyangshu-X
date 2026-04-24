/* ============================================================
   MUSIC.JS — Autoplay Loop Player (Starts on Enter Click)
   PRIYANGSHUX8 | Continuous Atmosphere, User-Gesture Triggered
   ============================================================ */

let currentTrackIndex = 0;
let isPlaying = false;
let audioElement = null;
let visualizerAnimationId = null;
let visualizerCtx = null;
let visualizerCanvas = null;

// This gets called from main.js when user clicks "Enter the Realm"
function startMusicAutoplay() {
    if (!audioElement) {
        audioElement = document.getElementById('music-audio-element');
    }
    if (!audioElement) return;
    
    // Set volume
    audioElement.volume = APP_CONFIG.defaultVolume / 100;
    
    // Load Majboor (index 1) and play
    loadTrack(1);
    playTrack();
}

// Expose globally so main.js can call it
window.startMusicAutoplay = startMusicAutoplay;

document.addEventListener('DOMContentLoaded', () => {
    audioElement = document.getElementById('music-audio-element');
    if (!audioElement) return;

    // Set initial volume
    audioElement.volume = APP_CONFIG.defaultVolume / 100;

    // Hide the play/pause button (no manual control)
    const playBtn = document.getElementById('music-play-btn');
    if (playBtn) {
        playBtn.style.display = 'none';
    }

    initMusicEventListeners();
    initPlaylistClickHandlers();
    loadTrack(0); // Preload first track for UI display
});

function initMusicEventListeners() {
    const prevBtn = document.getElementById('music-prev-btn');
    const nextBtn = document.getElementById('music-next-btn');
    const progressSlider = document.getElementById('music-progress-slider');
    const volumeSlider = document.getElementById('music-volume-slider');

    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    if (progressSlider) {
        progressSlider.addEventListener('input', () => {
            if (audioElement.duration) {
                audioElement.currentTime = (progressSlider.value / 100) * audioElement.duration;
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            audioElement.volume = volumeSlider.value / 100;
        });
    }

    // Audio element events
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', nextTrack); // Automatic loop
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        startVisualizer();
    });
    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        stopVisualizer();
    });
}

function initPlaylistClickHandlers() {
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const trackIndex = parseInt(item.getAttribute('data-track'));
            loadTrack(trackIndex);
            playTrack();
        });
    });
}

function loadTrack(index) {
    if (index < 0 || index >= ASSET_PATHS.audioFiles.length) return;
    currentTrackIndex = index;
    audioElement.src = ASSET_PATHS.audioFiles[index];

    // Update playlist UI
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Update track info
    document.getElementById('current-track-title').textContent = ASSET_PATHS.audioDisplayNames[index];
    document.getElementById('current-track-mood').textContent = ASSET_PATHS.audioMoods[index];

    // Reset progress
    document.getElementById('music-progress-slider').value = 0;
    document.getElementById('music-current-time').textContent = '0:00';
    document.getElementById('music-duration').textContent = '0:00';
}

function playTrack() {
    if (!audioElement.src) {
        loadTrack(0);
    }
    audioElement.play().catch(err => {
        console.warn('Audio playback failed:', err);
    });
}

function prevTrack() {
    const newIndex = (currentTrackIndex - 1 + ASSET_PATHS.audioFiles.length) % ASSET_PATHS.audioFiles.length;
    loadTrack(newIndex);
    playTrack();
}

function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % ASSET_PATHS.audioFiles.length;
    loadTrack(newIndex);
    playTrack();
}

function updateProgress() {
    if (!audioElement.duration) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    const slider = document.getElementById('music-progress-slider');
    if (slider) slider.value = progress;
    document.getElementById('music-current-time').textContent = formatTime(audioElement.currentTime);
}

function updateDuration() {
    document.getElementById('music-duration').textContent = formatTime(audioElement.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ----- VISUALIZER -----
function initVisualizer() {
    visualizerCanvas = document.getElementById('visualizer-canvas');
    if (!visualizerCanvas) return;
    visualizerCtx = visualizerCanvas.getContext('2d');
    resizeVisualizer();
    window.addEventListener('resize', resizeVisualizer);
}

function resizeVisualizer() {
    if (!visualizerCanvas) return;
    visualizerCanvas.width = visualizerCanvas.parentElement.offsetWidth;
    visualizerCanvas.height = 120;
}

function startVisualizer() {
    if (!visualizerCanvas || !visualizerCtx) return;
    if (visualizerAnimationId) return;

    function drawVisualizer() {
        if (!isPlaying) {
            visualizerAnimationId = null;
            return;
        }
        const ctx = visualizerCtx;
        const w = visualizerCanvas.width;
        const h = visualizerCanvas.height;
        ctx.clearRect(0, 0, w, h);

        const barCount = 60;
        const barWidth = w / barCount;
        const time = Date.now() / 300;

        for (let i = 0; i < barCount; i++) {
            const height = Math.sin(time + i * 0.3) * 20 + Math.cos(time * 0.7 + i * 0.5) * 15 + 30;
            const x = i * barWidth;
            const y = h / 2 - height / 2;

            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, 'rgba(220, 20, 60, 0.9)');
            gradient.addColorStop(0.5, 'rgba(139, 0, 0, 0.7)');
            gradient.addColorStop(1, 'rgba(220, 20, 60, 0.3)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, y, barWidth - 2, height);
        }
        visualizerAnimationId = requestAnimationFrame(drawVisualizer);
    }
    visualizerAnimationId = requestAnimationFrame(drawVisualizer);
}

function stopVisualizer() {
    if (visualizerAnimationId) {
        cancelAnimationFrame(visualizerAnimationId);
        visualizerAnimationId = null;
        if (visualizerCtx && visualizerCanvas) {
            visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
        }
    }
}

// Visualizer start when music section visible
const musicObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.id === 'music' && entry.isIntersecting) {
            initVisualizer();
            if (isPlaying) startVisualizer();
        }
    });
}, { threshold: 0.3 });
const musicSection = document.getElementById('music');
if (musicSection) musicObserver.observe(musicSection);