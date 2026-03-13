import React, { useEffect, useRef, useState } from "react";


export default function ChatWidget({ config, widgetId, isPreview = false }) {
  const [open, setOpen] = useState(config?.openByDefault ?? true);
  const [messages, setMessages] = useState(() =>
    config?.welcomeMessage
      ? [{ id: "welcome", sender: "bot", content: config.welcomeMessage }]
      : []
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // --- NEW: Live Preview Fix for Welcome Message ---
  // If the config.welcomeMessage changes (like when typing in the editor),
  // we want to update the first message in the chat box immediately.
  useEffect(() => {
    setMessages((prev) => {
      // If there are no messages yet, just return
      if (prev.length === 0) return prev;

      // The welcome message is usually the very first one.
      // So we copy the array, and update the content of the first message.
      const newMessages = [...prev];
      if (newMessages[0].id === "welcome") {
        newMessages[0] = { ...newMessages[0], content: config?.welcomeMessage || "" };
      }
      return newMessages;
    });
  }, [config?.welcomeMessage]);

  // Notify parent window to resize iframe
  useEffect(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: "WIDGET_RESIZE",
        isOpen: open
      }, "*");
    }
  }, [open]);


  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const colors = {
    primary: config?.primaryColor || "#570DF8",
    accent: config?.accentColor || "#F000B8",
    background: config?.backgroundColor || "#FFFFFF",
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sessionIdRef = useRef(
    typeof window !== "undefined"
      ? window.localStorage.getItem("chatbot_session") ||
          (() => {
            const id = crypto.randomUUID();
            window.localStorage.setItem("chatbot_session", id);
            return id;
          })()
      : "preview-session"
  );

  // This helper sends either the current text input or a provided message.
  // We extract it into a separate function so both the text box and the
  // suggestion "capsules" can trigger the same behavior.
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!text) return;

    const userMsg = {
      id: `local-${Date.now()}`,
      sender: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (isPreview || !widgetId) {
      const botPreview = {
        id: `preview-${Date.now()}`,
        sender: "bot",
        content: `Preview response to: "${text}"`,
      };
      setMessages((prev) => [...prev, botPreview]);
      return;
    }

    try {
      setSending(true);
      const res = await fetch(
        `${apiBase}/public/widgets/${widgetId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            message: trimmed,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      const [, botMessage] = data.data.messages;
      const botWithTyping = {
        id: botMessage.id,
        sender: botMessage.sender,
        content: "",
        fullContent: botMessage.content,
      };

      setMessages((prev) => [...prev, botWithTyping]);

      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botWithTyping.id
              ? { ...m, content: botWithTyping.fullContent.slice(0, i) }
              : m
          )
        );
        if (i >= botWithTyping.fullContent.length) {
          clearInterval(interval);
        }
      }, 20);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: "bot",
        content: `Something went wrong: ${err.message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const alignmentStyles =
    config?.position === "bottom-left"
      ? { left: 0, alignItems: "flex-start" }
      : { right: 0, alignItems: "flex-end" };

  return (
    <div
      className="flex flex-col"
      style={{
        ...alignmentStyles,
        width: "100%",
        maxWidth: 360,
      }}
    >
      {!open && (
        <button
          type="button"
          className="btn btn-primary rounded-full shadow-lg self-end"
          style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
          onClick={() => setOpen(true)}
        >
          {config?.botName || "Chatbot"}
        </button>
      )}

      {open && (
        <div
          className="card shadow-xl border"
          style={{ backgroundColor: colors.background }}
        >
          <div
            className="card-title flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}
          >
            <div className="flex items-center gap-2 text-sm">
              {config?.avatarUrl && (
                <img
                  src={config.avatarUrl}
                  alt="Bot avatar"
                  className="w-8 h-8 rounded-full border border-white/40"
                />
              )}
              <span>{config?.botName || "Chatbot"}</span>
            </div>
            <button
              type="button"
              className="btn btn-xs btn-ghost text-white"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Optional suggestions section rendered above the messages. */}
          {Array.isArray(config?.suggestionItems) &&
            config.suggestionItems.length > 0 && (
              <div className="px-3 pt-2 pb-1 border-b border-base-200 text-xs">
                {config.suggestionTitle && (
                  <p className="font-semibold mb-1">
                    {config.suggestionTitle.toUpperCase()}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {config.suggestionItems.map((q, index) => (
                    <button
                      key={`${q}-${index}`}
                      type="button"
                      className="badge badge-outline cursor-pointer px-3 py-2"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className="px-3 pt-3 pb-2 h-72 overflow-y-auto space-y-2 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat ${
                  m.sender === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    m.sender === "user" ? "chat-bubble-primary" : ""
                  }`}
                  style={
                    m.sender === "user"
                      ? {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        }
                      : undefined
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 pb-3 pt-1"
          >
            <input
              type="text"
              className="input input-bordered input-sm flex-1"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              className={`btn btn-sm text-white ${
                sending ? "loading" : ""
              }`}
              style={{
                backgroundColor: colors.accent,
                borderColor: colors.accent,
              }}
              disabled={sending}
            >
              Send
            </button>
          </form>

          {config?.showBranding && (
            <div className="text-[10px] text-center pb-2 opacity-60">
              Powered by Chatbot Widget Demo
            </div>
          )}
        </div>
      )}
    </div>
  );
}

