# ✦ Nova AI — React Chatbot

<div align="center">

![Nova AI Banner](https://img.shields.io/badge/Nova%20AI-Chatbot-7c6af7?style=for-the-badge&logo=anthropic&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Claude API](https://img.shields.io/badge/Claude%20API-Sonnet%204-a78bfa?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-4ade80?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff6b6b?style=for-the-badge)

**A sleek, production-ready AI chatbot built with React and powered by Anthropic's Claude API.**  
Dark-themed · Single-file · Zero dependencies beyond React · Fully responsive

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  ✦ Nova AI        │  Nova AI Chat                    🔄         │
│  ─────────────────│─────────────────────────────────────────────│
│  + New conversation│                                            │
│                   │         ✦                                   │
│  Recent           │   What can I help with?                     │
│  · React best...  │   Ask me anything — write, explain, code... │
│  · Python async   │                                             │
│  · Explain trans..│  ┌──────────────┐  ┌──────────────┐        │
│                   │  │ 💡 Explain   │  │ ✍️ Help me   │        │
│                   │  │ a concept    │  │ write        │        │
│                   │  └──────────────┘  └──────────────┘        │
│  ● claude-sonnet-4│  ┌──────────────┐  ┌──────────────┐        │
│                   │  │ 🧮 Solve a   │  │ 💬 Just      │        │
│                   │  │ problem      │  │ chat         │        │
│                   │  └──────────────┘  └──────────────┘        │
│                   │─────────────────────────────────────────────│
│                   │  Message Nova…                          ➤   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Claude-powered** | Uses `claude-sonnet-4` — Anthropic's most capable everyday model |
| 🎨 **Dark UI** | Deep navy/charcoal palette, accent purples, carefully chosen contrast |
| 💬 **Full conversation** | Maintains full message history, multi-turn context included |
| ⌨️ **Typing indicator** | Animated bouncing dots while waiting for a response |
| 📋 **Code rendering** | Fenced code blocks and inline code styled with JetBrains Mono |
| 🚀 **Suggestion cards** | Click-to-send prompts on the empty state |
| 📜 **Sidebar history** | Fake recent chats panel showing a realistic UI shell |
| 🕐 **Timestamps** | Per-message time shown beneath each bubble |
| 🔁 **Auto-resize textarea** | Input grows with content, capped at 140px |
| ⚡ **Keyboard shortcut** | Enter to send, Shift+Enter for newline |
| 🛑 **Error handling** | Friendly red toast on API failure |
| 📱 **Responsive** | Works cleanly down to tablet widths |
| 🎯 **Zero-dependency** | Only React — no UI library, no router, no state manager |

---

## 🛠️ Tech Stack

- **Framework** — [React 18](https://react.dev/) (hooks only: `useState`, `useRef`, `useEffect`)
- **AI Provider** — [Anthropic Claude API](https://docs.anthropic.com/) (`/v1/messages`)
- **Model** — `claude-sonnet-4-20250514`
- **Fonts** — [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
- **Styling** — Vanilla CSS-in-JS (injected `<style>` tag, CSS custom properties)
- **Build** — Works with Vite, Create React App, or any React scaffold

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/nova-ai-chatbot.git
cd nova-ai-chatbot

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env
# Edit .env → VITE_ANTHROPIC_API_KEY=sk-ant-...

# 4. Start the dev server
npm run dev
```

> **Note:** The default component calls the Anthropic API directly from the browser (for demo/Claude Artifacts use). For production, **proxy through a backend** to keep your API key private (see [Security](#-security)).

### Scaffold from Scratch

```bash
npm create vite@latest nova-ai -- --template react
cd nova-ai
npm install

# Drop ChatBot.jsx into src/
# Replace src/App.jsx content with:
# import ChatBot from './ChatBot'
# export default function App() { return <ChatBot /> }

npm run dev
```

---

## 📁 Project Structure

```
nova-ai-chatbot/
├── src/
│   ├── ChatBot.jsx        ← entire app (component + styles)
│   └── main.jsx           ← React root mount
├── public/
│   └── favicon.svg
├── .env.example
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

The entire UI lives in **one file** — `ChatBot.jsx`. Styles are injected via a `<style>` tag; no CSS files needed.

---

## ⚙️ Configuration

### System Prompt

Edit the `SYSTEM_PROMPT` constant at the top of `ChatBot.jsx` to change Nova's personality:

```js
const SYSTEM_PROMPT = `You are Nova, a highly capable and friendly AI assistant...`;
```

### Model

Change the model string inside `sendMessage()`:

```js
model: "claude-sonnet-4-20250514",   // balanced speed + quality
// model: "claude-opus-4-20250514",  // most powerful
// model: "claude-haiku-4-5",        // fastest + cheapest
```

### Suggestion Cards

Edit the `SUGGESTIONS` array to customize the empty-state prompt cards:

```js
const SUGGESTIONS = [
  { icon: "💡", text: "Explain a concept", desc: "Break down something complex" },
  { icon: "✍️", text: "Help me write",     desc: "Draft emails, posts, or docs" },
  // add your own...
];
```

---

## 🔒 Security

> **⚠️ Important for production deployments**

Calling the Anthropic API directly from the browser exposes your API key in network requests. For any public deployment:

1. **Create a backend proxy** (Node/Express, Next.js API route, FastAPI, etc.)
2. Store your key in a server-side environment variable
3. Forward `/api/chat` requests from the frontend to Anthropic

**Example Next.js API route:**

```js
// pages/api/chat.js
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
}
```

Then in `ChatBot.jsx` change the fetch URL to `/api/chat` and remove the `x-api-key` header from the client.

---

## 🎨 Design Tokens

The entire color system lives in CSS custom properties — easy to retheme:

```css
:root {
  --bg-deep:    #0a0b0f;   /* page background */
  --bg-panel:   #111218;   /* sidebar + topbar */
  --bg-card:    #16171e;   /* input + cards */
  --accent:     #7c6af7;   /* primary purple */
  --accent-glow:rgba(124,106,247,0.18);
  --green:      #4ade80;   /* online dot */
  --text-primary: #f0f0f8;
  --text-secondary:#8b8fa8;
  --text-muted: #55576a;
}
```

---

## 🧩 Component API

`ChatBot` is a self-contained default export with no required props.

| Internal state | Type | Purpose |
|---|---|---|
| `messages` | `Array<{role, content, time}>` | Full conversation history |
| `input` | `string` | Controlled textarea value |
| `loading` | `boolean` | Waiting for API response |
| `error` | `string` | Error message to display |
| `activeChat` | `number` | Sidebar history selection |

---

## 🗺️ Roadmap

- [ ] Streaming responses (SSE / `ReadableStream`)
- [ ] Conversation persistence with `localStorage`
- [ ] Multiple named chat sessions
- [ ] Copy-to-clipboard on code blocks
- [ ] Light / dark mode toggle
- [ ] Markdown table rendering
- [ ] Voice input (Web Speech API)
- [ ] Export conversation as Markdown / PDF
- [ ] Regenerate last response button
- [ ] Token / cost counter in sidebar footer

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo and create your branch
git checkout -b feature/streaming-responses

# 2. Make your changes and commit
git commit -m "feat: add streaming SSE support"

# 3. Push and open a Pull Request
git push origin feature/streaming-responses
```

Please follow the existing code style (vanilla CSS, hooks-only React, single-file) and open an issue first for large changes.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) for building Claude and the API
- [Inter](https://rsms.me/inter/) by Rasmus Andersson — the best UI typeface
- [JetBrains Mono](https://www.jetbrains.com/legalnotice/fonts/) for the code font
- The React team for hooks

---

<div align="center">

Made with ♥ · Star ⭐ the repo if you found it useful!

</div>
