import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Nova, a highly capable and friendly AI assistant. You are helpful, concise, and engaging. You have a warm personality and respond clearly. Keep responses well-structured and not overly long unless the user needs detail.`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-deep: #0a0b0f;
    --bg-panel: #111218;
    --bg-card: #16171e;
    --bg-hover: #1c1d26;
    --border: #2a2c38;
    --border-subtle: #1e2029;
    --accent: #7c6af7;
    --accent-glow: rgba(124, 106, 247, 0.18);
    --accent-dim: #5b4fd4;
    --green: #4ade80;
    --text-primary: #f0f0f8;
    --text-secondary: #8b8fa8;
    --text-muted: #55576a;
    --user-bubble: #1e1f2e;
    --ai-bubble: #13141a;
    --scrollbar: #2a2c38;
    --radius: 16px;
    --radius-sm: 10px;
  }

  html, body, #root { height: 100%; font-family: 'Inter', sans-serif; }

  .app {
    display: flex;
    height: 100vh;
    background: var(--bg-deep);
    color: var(--text-primary);
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 260px;
    min-width: 260px;
    background: var(--bg-panel);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    gap: 6px;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px 20px;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 8px;
  }

  .logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), #a78bfa);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .logo-text { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; }

  .new-chat-btn {
    display: flex; align-items: center; gap: 8px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,106,247,0.3);
    color: #a78bfa;
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    width: 100%;
    margin-bottom: 10px;
  }
  .new-chat-btn:hover { background: rgba(124,106,247,0.25); }

  .section-label {
    font-size: 10px; font-weight: 600; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--text-muted);
    padding: 6px 10px 2px;
  }

  .chat-item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 12px; border-radius: var(--radius-sm);
    font-size: 13px; color: var(--text-secondary);
    cursor: pointer; transition: all 0.15s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .chat-item:hover { background: var(--bg-hover); color: var(--text-primary); }
  .chat-item.active { background: var(--bg-hover); color: var(--text-primary); }
  .chat-item svg { flex-shrink: 0; opacity: 0.5; }

  .sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--border-subtle);
    padding-top: 14px;
  }
  .model-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: var(--radius-sm);
    background: var(--bg-card); font-size: 12px;
    color: var(--text-secondary);
  }
  .model-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); flex-shrink: 0; box-shadow: 0 0 6px var(--green); }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 28px;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-panel);
  }
  .topbar-title { font-size: 15px; font-weight: 600; }
  .topbar-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .topbar-actions { display: flex; gap: 8px; }
  .icon-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: transparent; border: 1px solid var(--border);
    color: var(--text-secondary); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-size: 15px;
  }
  .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

  /* ── MESSAGES ── */
  .messages-wrap {
    flex: 1; overflow-y: auto;
    padding: 28px 0;
    scroll-behavior: smooth;
  }
  .messages-wrap::-webkit-scrollbar { width: 5px; }
  .messages-wrap::-webkit-scrollbar-track { background: transparent; }
  .messages-wrap::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 10px; }

  .messages-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 8px; }

  /* ── EMPTY STATE ── */
  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 24px; text-align: center;
    max-width: 560px; margin: 0 auto;
  }
  .empty-orb {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, var(--accent), #a78bfa, #ec4899);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin-bottom: 20px;
    box-shadow: 0 0 40px var(--accent-glow);
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .empty-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 28px; }
  .suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
  .suggestion-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px;
    font-size: 13px; color: var(--text-secondary);
    cursor: pointer; text-align: left; transition: all 0.18s;
  }
  .suggestion-card:hover { border-color: var(--accent); color: var(--text-primary); background: var(--bg-hover); }
  .suggestion-icon { font-size: 18px; margin-bottom: 6px; }
  .suggestion-text { font-weight: 500; font-size: 13px; color: var(--text-primary); margin-bottom: 3px; }
  .suggestion-desc { font-size: 11px; color: var(--text-muted); }

  /* ── MSG ROW ── */
  .msg-row { display: flex; gap: 12px; align-items: flex-start; }
  .msg-row.user { flex-direction: row-reverse; }

  .avatar {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; margin-top: 2px;
  }
  .avatar.ai {
    background: linear-gradient(135deg, var(--accent), #a78bfa);
    color: #fff;
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .avatar.user { background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-secondary); }

  .bubble {
    max-width: 82%;
    padding: 13px 17px;
    border-radius: 14px;
    font-size: 14px; line-height: 1.65;
  }
  .bubble.ai {
    background: var(--ai-bubble);
    border: 1px solid var(--border-subtle);
    color: var(--text-primary);
    border-top-left-radius: 4px;
  }
  .bubble.user {
    background: var(--user-bubble);
    border: 1px solid rgba(124,106,247,0.15);
    color: var(--text-primary);
    border-top-right-radius: 4px;
  }

  .bubble code {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(255,255,255,0.06);
    padding: 1px 5px; border-radius: 4px; font-size: 12px;
  }

  .bubble pre {
    background: #0d0e14;
    border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px; margin: 10px 0;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; line-height: 1.6;
  }

  .msg-meta {
    font-size: 10px; color: var(--text-muted);
    margin-top: 4px; padding: 0 2px;
  }
  .msg-row.user .msg-meta { text-align: right; }

  /* ── TYPING ── */
  .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
  .typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); opacity: 0.5;
    animation: typingBounce 1.2s infinite ease-in-out;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); opacity:0.4; } 30% { transform: translateY(-6px); opacity: 1; } }

  /* ── INPUT ── */
  .input-wrap {
    background: var(--bg-panel);
    border-top: 1px solid var(--border-subtle);
    padding: 16px 28px 20px;
  }
  .input-inner {
    max-width: 720px; margin: 0 auto;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex; align-items: flex-end;
    gap: 8px; padding: 10px 10px 10px 16px;
    transition: border-color 0.2s;
  }
  .input-inner:focus-within { border-color: rgba(124,106,247,0.5); box-shadow: 0 0 0 3px var(--accent-glow); }

  .chat-input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text-primary); font-family: 'Inter', sans-serif;
    font-size: 14px; line-height: 1.5; resize: none;
    max-height: 140px; min-height: 24px;
  }
  .chat-input::placeholder { color: var(--text-muted); }

  .send-btn {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    background: var(--accent); border: none; color: #fff;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.15s;
  }
  .send-btn:hover:not(:disabled) { background: #8b7cf8; transform: scale(1.05); }
  .send-btn:disabled { background: var(--bg-hover); color: var(--text-muted); cursor: not-allowed; transform: none; }

  .input-footer {
    max-width: 720px; margin: 8px auto 0;
    font-size: 11px; color: var(--text-muted); text-align: center;
  }

  /* ── ERROR ── */
  .error-toast {
    margin: 6px auto 0; max-width: 720px;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5; border-radius: 8px; padding: 8px 14px;
    font-size: 12px; display: flex; align-items: center; gap: 6px;
  }
`;

const SUGGESTIONS = [
  { icon: "💡", text: "Explain a concept", desc: "Break down something complex" },
  { icon: "✍️", text: "Help me write", desc: "Draft emails, posts, or docs" },
  { icon: "🧮", text: "Solve a problem", desc: "Math, logic, or analysis" },
  { icon: "💬", text: "Just chat", desc: "Casual conversation" },
];

const FAKE_HISTORY = [
  "React best practices",
  "Python async tutorial",
  "Explain transformer models",
];

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderContent(text) {
  const codeBlock = /```[\s\S]*?```/g;
  const inlineCode = /`([^`]+)`/g;
  const parts = [];
  let last = 0;
  let match;
  const re = /```(?:\w+)?\n?([\s\S]*?)```/g;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", content: text.slice(last, match.index) });
    }
    parts.push({ type: "code", content: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });

  return parts.map((p, i) =>
    p.type === "code" ? (
      <pre key={i}>{p.content.trim()}</pre>
    ) : (
      <span key={i} dangerouslySetInnerHTML={{
        __html: p.content
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/\n/g, "<br/>")
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
      }} />
    )
  );
}

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeChat, setActiveChat] = useState(0);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setError("");
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", content, time: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "No response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply, time: new Date() }]);
    } catch (e) {
      setError("Something went wrong. Check your connection or API access.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleNew = () => { setMessages([]); setError(""); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">✦</div>
            <div>
              <div className="logo-text">Nova AI</div>
              <div className="logo-sub">Assistant</div>
            </div>
          </div>

          <button className="new-chat-btn" onClick={handleNew}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New conversation
          </button>

          <div className="section-label">Recent</div>
          {FAKE_HISTORY.map((h, i) => (
            <div key={i} className={`chat-item ${activeChat === i ? "active" : ""}`} onClick={() => setActiveChat(i)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {h}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="model-badge">
              <div className="model-dot" />
              claude-sonnet-4
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">Nova AI Chat</div>
              <div className="topbar-sub">{messages.length > 0 ? `${messages.length} messages` : "Start a new conversation"}</div>
            </div>
            <div className="topbar-actions">
              <button className="icon-btn" title="Clear chat" onClick={handleNew}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
              </button>
            </div>
          </div>

          {/* MESSAGES or EMPTY */}
          {messages.length === 0 ? (
            <div className="messages-wrap" style={{ display: "flex" }}>
              <div className="empty-state">
                <div className="empty-orb">✦</div>
                <div className="empty-title">What can I help with?</div>
                <div className="empty-sub">Ask me anything — I can write, explain, code, analyze, brainstorm, and much more.</div>
                <div className="suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <div key={i} className="suggestion-card" onClick={() => sendMessage(s.text)}>
                      <div className="suggestion-icon">{s.icon}</div>
                      <div className="suggestion-text">{s.text}</div>
                      <div className="suggestion-desc">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-wrap">
              <div className="messages-inner">
                {messages.map((m, i) => (
                  <div key={i}>
                    <div className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                      <div className={`avatar ${m.role === "user" ? "user" : "ai"}`}>
                        {m.role === "user" ? "U" : "✦"}
                      </div>
                      <div>
                        <div className={`bubble ${m.role === "user" ? "user" : "ai"}`}>
                          {renderContent(m.content)}
                        </div>
                        <div className="msg-meta">{formatTime(m.time)}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="msg-row">
                    <div className="avatar ai">✦</div>
                    <div className="bubble ai">
                      <div className="typing-indicator">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="error-toast" style={{ margin: "0 28px 8px", maxWidth: "720px", alignSelf: "center", width: "calc(100% - 56px)" }}>
              ⚠️ {error}
            </div>
          )}

          {/* INPUT */}
          <div className="input-wrap">
            <div className="input-inner">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Message Nova…"
                value={input}
                rows={1}
                onChange={e => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKey}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <div className="input-footer">Enter to send · Shift+Enter for new line</div>
          </div>
        </main>
      </div>
    </>
  );
}
