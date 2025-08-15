"use client";
import { useState, useRef, useEffect } from "react";

// Simple markdown renderer component
const MarkdownRenderer = ({ content, isUser }) => {
  const renderContent = (text) => {
    // Handle code blocks first (```code```)
    const parts = text.split(/(```[\s\S]*?```)/);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).trim();
        return (
          <pre
            key={index}
            className={`p-4 rounded-lg mt-3 mb-3 overflow-x-auto ${
              isUser
                ? "bg-[#a04d2a]"
                : "bg-[#f4f3ee] border border-[#b1ada1]/20"
            }`}
          >
            <code
              className={`text-sm font-mono ${
                isUser ? "text-white" : "text-[#c15f3c]"
              }`}
            >
              {code}
            </code>
          </pre>
        );
      }

      // Handle inline code (`code`)
      part = part.replace(/`([^`]+)`/g, (match, code) => {
        return `<code class="px-2 py-1 rounded text-sm font-mono ${
          isUser
            ? "bg-[#a04d2a] text-white"
            : "bg-[#f4f3ee] text-[#c15f3c] border border-[#b1ada1]/20"
        }">${code}</code>`;
      });

      // Handle bold (**text** or __text__)
      part = part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      part = part.replace(/__(.*?)__/g, "<strong>$1</strong>");

      // Handle italic (*text* or _text_)
      part = part.replace(/\*(.*?)\*/g, "<em>$1</em>");
      part = part.replace(/_(.*?)_/g, "<em>$1</em>");

      // Handle line breaks
      part = part.replace(/\n/g, "<br />");

      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return <>{renderContent(content)}</>;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [persona, setPersona] = useState("hiteshSir");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleChat = async () => {
    if (!message.trim()) return;

    setLoading(true);

    // Add user message to conversation
    const userMessage = { role: "user", content: message };
    setConversation((prev) => [...prev, userMessage]);

    // Clear input
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, persona }),
      });

      const data = await res.json();

      // Add AI response to conversation
      const aiMessage = { role: "assistant", content: data.response };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "ERROR: " + error.message,
      };
      setConversation((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="font-sans flex flex-col min-h-screen bg-[#f4f3ee]">
      {/* Header */}
      <div className="bg-white border-b border-[#b1ada1]/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-light text-[#c15f3c]">Persona AI</h1>
          <label className="flex items-center cursor-pointer">
            {/* Toggle container */}
            <div className="relative">
              {/* Hidden checkbox */}
              <input
                type="checkbox"
                checked={persona === "piyushSir"}
                onChange={() =>
                  setPersona((prev) =>
                    prev === "hiteshSir" ? "piyushSir" : "hiteshSir"
                  )
                }
                className="sr-only"
              />
              {/* Track */}
              <div className="w-12 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-300 peer-checked:bg-blue-500"></div>
              {/* Thumb */}
              <div
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  persona === "piyushSir" ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
            {/* Label text */}
            <span className="ml-3 text-gray-700">
              {persona === "hiteshSir" ? "Hitesh Sir" : "Piyush Sir"}
            </span>
          </label>

          <button
            onClick={clearConversation}
            className="px-4 py-2 text-sm text-[#b1ada1] hover:text-[#c15f3c] transition-colors duration-200"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#c15f3c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#c15f3c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-[#b1ada1] text-lg font-light">
                Start a conversation
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-[#c15f3c]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-[#c15f3c]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-[#c15f3c] text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-[#b1ada1]/10"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        <MarkdownRenderer
                          content={msg.content}
                          isUser={msg.role === "user"}
                        />
                      </div>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 bg-[#c15f3c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-[#c15f3c]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-[#c15f3c]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                        />
                      </svg>
                    </div>
                    <div className="bg-white border border-[#b1ada1]/10 rounded-2xl rounded-bl-md p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#b1ada1] rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-[#b1ada1] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#b1ada1] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-[#b1ada1] ml-2">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#b1ada1]/20 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full p-4 border border-[#b1ada1]/20 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#c15f3c]/20 focus:border-[#c15f3c]/30 transition-all duration-200 text-gray-800 placeholder-[#b1ada1]"
                disabled={loading}
                style={{
                  minHeight: "56px",
                  maxHeight: "120px",
                  overflowY: message.split("\n").length > 2 ? "auto" : "hidden",
                }}
              />
            </div>
            <button
              onClick={handleChat}
              disabled={loading || !message.trim()}
              className="w-12 h-12 bg-[#c15f3c] text-white rounded-full hover:bg-[#a04d2a] disabled:bg-[#b1ada1] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-[#b1ada1] mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
