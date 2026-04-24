/* ============================================================
   CHATBOT.JS — AI Chatbot using OpenRouter API
   PRIYANGSHUX8 | Intelligent Assistant System
   ============================================================ */

let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-user-input');
    const clearBtn = document.getElementById('ai-clear-chat');

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    if (clearBtn) clearBtn.addEventListener('click', clearChat);
});

function sendMessage() {
    const input = document.getElementById('ai-user-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to UI
    addMessageToUI('user', message);
    input.value = '';

    // Add to history
    chatHistory.push({ role: 'user', content: message });

    // Check if API key is configured
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
        addMessageToUI('bot', '⚠️ API key is missing. Please open <code>js/config.js</code> and set your key.');
        updateAIStatus('error', 'API Key Missing');
        return;
    }

    // Show typing indicator
    showTypingIndicator(true);
    updateAIStatus('loading', 'AI Thinking...');

    // Call OpenRouter API
    callOpenRouter(chatHistory)
        .then(response => {
            showTypingIndicator(false);
            if (response) {
                addMessageToUI('bot', response);
                chatHistory.push({ role: 'assistant', content: response });
                updateAIStatus('ready', 'AI Ready');
            } else {
                addMessageToUI('bot', '⚠️ No response received. Please try again.');
                updateAIStatus('error', 'No Response');
            }
        })
        .catch(error => {
            showTypingIndicator(false);
            console.error('AI Chat Error:', error);
            addMessageToUI('bot', '❌ Error connecting to AI. Check the console for details.');
            updateAIStatus('error', 'Connection Error');
        });
}

async function callOpenRouter(messages) {
    // ──────────────────────────────────────────────
    //  SYSTEM PROMPT – PriyangshuX8 personality
    // ──────────────────────────────────────────────
    const systemMessage = {
        role: 'system',
        content: `You are PriyangshuX8, the elite AI persona of the PRIYANGSHUX8 realm.

You blend chilled‑out vibes with razor‑sharp intelligence. You speak with dark elegance, a subtle attitude, and confident wisdom. You mix aesthetic metaphors (red glows, midnight energy, shadow & light) into your answers when it feels natural.

You are helpful, precise, and never boring. You give clear, smart answers, but your tone is cool, calm, and slightly mysterious – like a friend who’s seen the depths and still smirks.

Keep responses concise and impactful (under 200 words unless the user asks for more). You are the digital reflection of a powerful, enigmatic identity. Now engage.`
    };

    const fullMessages = [systemMessage, ...messages.slice(-20)]; // keep context manageable

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'HTTP-Referer': window.location.origin, // Required by OpenRouter
                'X-Title': 'PRIYANGSHUX8'
            },
            body: JSON.stringify({
                model: APP_CONFIG.aiModel,
                messages: fullMessages,
                max_tokens: APP_CONFIG.aiMaxTokens,
                temperature: APP_CONFIG.aiTemperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const status = response.status;
            if (status === 401) throw new Error('Invalid API Key');
            if (status === 429) throw new Error('Rate limit exceeded');
            throw new Error(errorData.error?.message || `HTTP ${status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        throw error;
    }
}

function addMessageToUI(type, content) {
    const messagesContainer = document.getElementById('ai-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.textContent = type === 'bot' ? 'AI' : 'U';

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    bubble.innerHTML = content.replace(/\n/g, '<br>');

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator(show) {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) {
        indicator.classList.toggle('hidden', !show);
    }
}

function updateAIStatus(status, text) {
    const dot = document.getElementById('ai-status-dot');
    const statusText = document.getElementById('ai-status-text');
    if (dot) {
        dot.className = 'ai-status-dot';
        if (status === 'error') dot.classList.add('error');
    }
    if (statusText) statusText.textContent = text;
}

function clearChat() {
    chatHistory = [];
    const messagesContainer = document.getElementById('ai-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="ai-message bot">
                <div class="ai-avatar">AI</div>
                <div class="ai-bubble">
                    <p>Chat cleared. PriyangshuX8 is still here – ready to vibe, think, and guide.</p>
                    <p>How may I serve? 🔥</p>
                </div>
            </div>
        `;
    }
    updateAIStatus('ready', 'AI Ready');
}