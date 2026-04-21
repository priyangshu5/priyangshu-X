/**
 * Priyangshu AI - Frontend Only with Real-Time Web Search
 * 
 * ⚠️ Security: Your API key is visible here. Only use for personal projects.
 */

// ===== CONFIGURATION =====
// 🔑 Replace with your OpenRouter API key
const OPENROUTER_API_KEY = "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";

// 🤖 Model and personality
const MODEL_NAME = "qwen/qwen-2.5-7b-instruct";
const SYSTEM_PROMPT = `You are Priyangshu AI, a friendly, smart, professional, and helpful assistant created by Priyangshu. 
Your name is Priyangshu AI. Always introduce yourself as Priyangshu AI when asked who you are.
You have the ability to search the web for real-time information. When you need current data, facts, or news, you can request a search by using the special command: [SEARCH: your search query].
When you use [SEARCH: query], the system will perform a web search and provide you with the results. You should then incorporate this information into your response.
Always be helpful, accurate, and friendly. If you don't know something, use the search feature rather than guessing.
Remember: You are Priyangshu AI, not any other AI assistant.`;

// 🌐 OpenRouter endpoint
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 🔍 DuckDuckGo Instant Answer API (Free, no API key required)
const DDG_API_URL = "https://api.duckduckgo.com/";

// ===== DOM ELEMENTS =====
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// ===== CHAT HISTORY (for context) =====
let conversationHistory = [
    { role: "system", content: SYSTEM_PROMPT }
];

// ===== HELPER FUNCTIONS =====
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    typingDiv.appendChild(indicatorDiv);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function setInputDisabled(disabled) {
    userInput.disabled = disabled;
    sendButton.disabled = disabled;
    if (!disabled) userInput.focus();
}

function addMessage(content, isUser) {
    const messageEl = createMessageElement(content, isUser);
    chatMessages.appendChild(messageEl);
    scrollToBottom();
}

function addErrorMessage(errorText) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.style.backgroundColor = '#fee2e2';
    contentDiv.style.color = '#991b1b';
    contentDiv.textContent = `⚠️ ${errorText}`;
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// ===== SEARCH FUNCTIONALITY =====
async function performWebSearch(query) {
    console.log(`🔍 Searching DuckDuckGo for: "${query}"`);
    
    try {
        // DuckDuckGo Instant Answer API (returns JSON with Abstract, RelatedTopics, etc.)
        const response = await fetch(`${DDG_API_URL}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
        
        if (!response.ok) {
            throw new Error(`Search API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract useful information from DDG response
        let searchResult = "";
        
        // 1. Abstract (main summary)
        if (data.Abstract && data.Abstract.trim() !== "") {
            searchResult += `📌 Summary: ${data.Abstract}\n`;
            if (data.AbstractURL) {
                searchResult += `   Source: ${data.AbstractURL}\n`;
            }
            searchResult += "\n";
        }
        
        // 2. Answer (direct answer to question)
        if (data.Answer && data.Answer.trim() !== "") {
            searchResult += `✅ Direct Answer: ${data.Answer}\n`;
            if (data.AnswerType) {
                searchResult += `   Type: ${data.AnswerType}\n`;
            }
            searchResult += "\n";
        }
        
        // 3. Definition
        if (data.Definition && data.Definition.trim() !== "") {
            searchResult += `📖 Definition: ${data.Definition}\n`;
            if (data.DefinitionURL) {
                searchResult += `   Source: ${data.DefinitionURL}\n`;
            }
            searchResult += "\n";
        }
        
        // 4. Related Topics (first few)
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            searchResult += "🔗 Related Information:\n";
            let count = 0;
            for (const topic of data.RelatedTopics) {
                if (count >= 3) break; // Limit to 3 related topics
                if (topic.Text && topic.Text.trim() !== "") {
                    searchResult += `   • ${topic.Text}\n`;
                    count++;
                }
            }
            searchResult += "\n";
        }
        
        // 5. Infobox (structured data)
        if (data.Infobox && data.Infobox.content && data.Infobox.content.length > 0) {
            searchResult += "📊 Quick Facts:\n";
            for (const item of data.Infobox.content) {
                if (item.label && item.value) {
                    searchResult += `   • ${item.label}: ${item.value}\n`;
                }
            }
            searchResult += "\n";
        }
        
        // If no useful data found
        if (searchResult.trim() === "") {
            // Fallback: provide a link to DuckDuckGo search
            searchResult = `No direct answer found. You can search manually: https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        }
        
        console.log("📥 Search results received");
        return searchResult;
        
    } catch (error) {
        console.error("Search error:", error);
        return `Search failed: ${error.message}. Please try a different query or check your internet connection.`;
    }
}

// ===== PROCESS MESSAGE WITH POTENTIAL SEARCH =====
async function processUserMessage(userMessage) {
    // Add user message to history
    conversationHistory.push({ role: "user", content: userMessage });
    
    // Keep conversation history manageable (last 10 messages + system prompt)
    if (conversationHistory.length > 11) {
        const systemPrompt = conversationHistory[0];
        const recentMessages = conversationHistory.slice(-10);
        conversationHistory = [systemPrompt, ...recentMessages];
    }
    
    let aiResponse = "";
    let needsSearch = false;
    let searchQuery = "";
    
    // First, check if AI wants to search (we'll do a preliminary call)
    try {
        const headers = {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin || "http://localhost",
            "X-Title": "Priyangshu AI"
        };
        
        const payload = {
            model: MODEL_NAME,
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 150,
            reasoning: { enabled: true }
        };
        
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const data = await response.json();
            const preliminaryReply = data.choices[0].message.content;
            
            // Check if AI requested a search
            const searchMatch = preliminaryReply.match(/\[SEARCH:\s*(.+?)\]/i);
            if (searchMatch) {
                needsSearch = true;
                searchQuery = searchMatch[1].trim();
                console.log(`🤖 AI requested search: "${searchQuery}"`);
            }
        }
    } catch (error) {
        console.warn("Preliminary check failed, proceeding without search detection:", error);
    }
    
    // If AI requested a search, perform it and enhance the conversation
    if (needsSearch && searchQuery) {
        // Show searching indicator
        addMessage(`🔍 Searching the web for: "${searchQuery}"...`, false);
        
        const searchResults = await performWebSearch(searchQuery);
        
        // Add search results as a system message
        const searchContextMessage = `[SYSTEM: Web search results for "${searchQuery}":\n${searchResults}\n\nPlease use this information to answer the user's question accurately. Cite sources when appropriate.]`;
        
        // Temporarily add search context to conversation
        conversationHistory.push({ role: "system", content: searchContextMessage });
    }
    
    // Now get the final AI response
    try {
        const headers = {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin || "http://localhost",
            "X-Title": "Priyangshu AI"
        };
        
        const payload = {
            model: MODEL_NAME,
            messages: conversationHistory,
            temperature: 0.7,
            reasoning: { enabled: true }
        };
        
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check configuration.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment.');
            } else if (response.status === 404) {
                throw new Error('Model not found. Try another model name.');
            } else {
                throw new Error(data.error?.message || `API error: ${response.status}`);
            }
        }
        
        aiResponse = data.choices[0].message.content;
        
        // Add AI response to history
        conversationHistory.push({ role: "assistant", content: aiResponse });
        
        return aiResponse;
        
    } catch (error) {
        throw error;
    }
}

// ===== MAIN SEND MESSAGE FUNCTION =====
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    addMessage(message, true);

    const typingIndicator = showTypingIndicator();
    setInputDisabled(true);

    try {
        const aiReply = await processUserMessage(message);
        removeTypingIndicator();
        addMessage(aiReply, false);
    } catch (error) {
        removeTypingIndicator();
        console.error('Error:', error);
        addErrorMessage(error.message || 'Could not connect to AI. Check console.');
    } finally {
        setInputDisabled(false);
    }
}

// ===== MANUAL SEARCH FUNCTION (Optional - can be triggered by user) =====
async function manualSearch(query) {
    if (!query) return;
    
    addMessage(`🔍 Searching for: "${query}"`, false);
    const results = await performWebSearch(query);
    addMessage(`Search results:\n${results}`, false);
}

// ===== EVENT LISTENERS =====
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    userInput.focus();
    scrollToBottom();
    
    // Optional: Expose manual search function to console for debugging
    window.priyangshuSearch = manualSearch;
    console.log('Priyangshu AI loaded. Use priyangshuSearch("query") to manually search.');
});