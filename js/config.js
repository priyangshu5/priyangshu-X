/* ============================================================
   CONFIG.JS — Global Configuration, API Keys, Asset Paths
   PRIYANGSHUX8 | Single Source of Truth for All Settings
   ============================================================ */

// ╔══════════════════════════════════════════╗
// ║  OPENROUTER API KEY (pre‑configured)    ║
// ╚══════════════════════════════════════════╝
const OPENAI_API_KEY = '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';

// ╔══════════════════════════════════════════╗
// ║  ASSET PATHS (Change if needed)         ║
// ╚══════════════════════════════════════════╝
const ASSET_PATHS = {
    heroImage: 'assets/images/649242457_17850445116688554_1811409149503448486_n.jpg',
    audioFiles: [
        'assets/audio/Maand (Unplugged).mp3',
        'assets/audio/Majboor - Sheheryar Rehan (320k).mp3',
        'assets/audio/Mood (Lofi) - Yagih Mael (320k).mp3',
        'assets/audio/Shikayat by AUR _ شکایت (Official Music Video).mp3'
    ],
    audioDisplayNames: [
        'Maand (Unplugged)',
        'Majboor - Sheheryar Rehan',
        'Mood (Lofi) - Yagih Mael',
        'Shikayat by AUR'
    ],
    audioMoods: [
        'Calm Intro • Soft Atmosphere',
        'Deep Emotion • Night Vibe',
        'Chill Focus • Dashboard',
        'Introspection • Late Night'
    ]
};

// ╔══════════════════════════════════════════╗
// ║  APP SETTINGS                          ║
// ╚══════════════════════════════════════════╝
const APP_CONFIG = {
    // Intro screen duration (milliseconds)
    introDuration: 2500,

    // Animation intensity (0-100)
    defaultAnimationIntensity: 80,

    // Glow effects enabled by default
    defaultGlowEnabled: true,

    // Particle density (10-100)
    defaultParticleDensity: 50,

    // Default volume (0-100)
    defaultVolume: 70,

    // AI Model (OpenRouter)
    aiModel: 'openai/gpt-oss-120b:free',

    // AI Max tokens
    aiMaxTokens: 1000,

    // AI Temperature
    aiTemperature: 0.7
};

// ╔══════════════════════════════════════════╗
// ║  FEATURE FLAGS                        ║
// ╚══════════════════════════════════════════╝
const FEATURES = {
    enableAI: true,
    enableMusic: true,
    enableGames: true,
    enableQuiz: true,
    enableSecret: true,
    enableParticles: true,
    enableCustomCursor: true,
    enableScrollReveal: true
};

// Export for module usage (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OPENAI_API_KEY, ASSET_PATHS, APP_CONFIG, FEATURES };
}