# Priyangshu AI 🤖

A beautiful, modern, and intelligent AI chatbot that runs entirely in your browser. It uses **OpenRouter** to access powerful language models and **DuckDuckGo** for real‑time web search – all without any backend or server setup.

---

## ✨ Features

- 🧠 **AI Powered** – Uses OpenRouter API with models like Qwen 2.5 7B (free tier available).
- 🔍 **Real‑Time Web Search** – Automatically searches DuckDuckGo when the AI needs current information.
- 💬 **Conversation Memory** – Remembers previous messages for coherent multi‑turn chats.
- 🎨 **Clean & Responsive UI** – Works beautifully on desktop, tablet, and mobile.
- ⚡ **No Backend Required** – Pure HTML, CSS, and JavaScript. Just open `index.html`.
- 🔐 **Simple Token Security** – (Optional) Protect your API with a bearer token (commented out).
- 📦 **Zero Dependencies** – No `npm install`, no Python, no server. It just works.

---

## 🚀 Quick Start (One Minute)

1. **Download or clone this repository.**
2. **Open `index.html`** in your favourite browser.
3. **Replace the OpenRouter API key** in `script.js` (see Configuration below).
4. **Start chatting!**

That's it. No build step, no server, no database.

---

## ⚙️ Configuration

Open `script.js` and set your OpenRouter API key:

```javascript
// 🔑 Replace with your actual OpenRouter API key
const OPENROUTER_API_KEY = "sk-or-v1-...";
