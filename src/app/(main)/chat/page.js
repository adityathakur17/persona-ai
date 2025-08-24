"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

// Simple markdown renderer component
const MarkdownRenderer = ({ content, isUser }) => {
  const renderContent = (text) => {
    // Handle code blocks first (\`\`\`code\`\`\`)
    const parts = text.split(/(```[\s\S]*?```)/)

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).trim()
        return (
          <pre
            key={index}
            className={`p-4 rounded-lg mt-3 mb-3 overflow-x-auto ${
              isUser ? "bg-gray-800" : "bg-gray-100 border border-gray-200"
            }`}
          >
            <code className={`text-sm font-mono ${isUser ? "text-white" : "text-black"}`}>{code}</code>
          </pre>
        )
      }

      // Handle inline code (`code`)
      part = part.replace(/`([^`]+)`/g, (match, code) => {
        return `<code class="px-2 py-1 rounded text-sm font-mono ${
          isUser ? "bg-gray-800 text-white" : "bg-gray-100 text-black border border-gray-200"
        }">${code}</code>`
      })

      // Handle bold (**text** or __text__)
      part = part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      part = part.replace(/__(.*?)__/g, "<strong>$1</strong>")

      // Handle italic (*text* or _text_)
      part = part.replace(/\*(.*?)\*/g, "<em>$1</em>")
      part = part.replace(/_(.*?)_/g, "<em>$1</em>")

      // Handle line breaks
      part = part.replace(/\n/g, "<br />")

      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
    })
  }

  return <>{renderContent(content)}</>
}

export default function Chat() {
  const [message, setMessage] = useState("")
  const [persona, setPersona] = useState("hiteshSir")
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState([])
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [resetTimer, setResetTimer] = useState(0)
  const messagesEndRef = useRef(null)

  const saveConversationToStorage = (personaKey, conv) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`persona-ai-${personaKey}`, JSON.stringify(conv))
    }
  }

  const loadConversationFromStorage = (personaKey) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`persona-ai-${personaKey}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  useEffect(() => {
    const savedConversation = loadConversationFromStorage(persona)
    setConversation(savedConversation)
  }, [persona])

  useEffect(() => {
    if (conversation.length > 0) {
      saveConversationToStorage(persona, conversation)
    }
  }, [conversation, persona])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const handleChat = async () => {
    if (!message.trim()) return

    setLoading(true)

    // Add user message to conversation
    const userMessage = { role: "user", content: message }
    setConversation((prev) => [...prev, userMessage])

    // Clear input
    setMessage("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, persona }),
      })

      if (res.status === 429) {
        const { error, resetInSeconds } = await res.json() // if backend provides resetInSeconds
        toast.error(error)

        setIsRateLimited(true)
        setResetTimer(resetInSeconds || 60) // fallback to 60s
        setLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error("Something went wrong")
      }

      const data = await res.json()

      // Add AI response to conversation
      const aiMessage = { role: "assistant", content: data.response }
      setConversation((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "ERROR: " + error.message,
      }
      setConversation((prev) => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const switchPersona = (newPersona) => {
    if (newPersona !== persona) {
      setPersona(newPersona)
      setMessage("")
    }
  }

  const clearConversation = () => {
    setConversation([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(`persona-ai-${persona}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  return (
    <div className="font-sans flex min-h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-light text-black">Persona AI</h1>
          <p className="text-sm text-gray-600 mt-1">Choose your mentor</p>
        </div>

        {/* Persona Cards */}
        <div className="flex-1 p-6 space-y-4">
          {/* Hitesh Choudhary Card */}
          <div
            onClick={() => switchPersona("hiteshSir")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              persona === "hiteshSir" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://avatars.githubusercontent.com/u/11613311?v=4" />
                <AvatarFallback>HC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-black">Hitesh Choudhary</h3>
                <p className="text-sm text-gray-600">Full Stack Developer</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Expert in JavaScript, React, Node.js, and modern web development. Known for practical tutorials and
              real-world coding solutions.
            </p>
          </div>

          {/* Piyush Garg Card */}
          <div
            onClick={() => switchPersona("piyushSir")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              persona === "piyushSir" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://avatars.githubusercontent.com/u/44976328?v=4" />
                <AvatarFallback>PG</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-black">Piyush Garg</h3>
                <p className="text-sm text-gray-600">Software Engineer</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Passionate about system design, backend development, and teaching complex concepts in simple terms. Focus
              on scalable solutions.
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-2">
            <div>
              <Link
                className="hover:text-black transition-colors"
                href="https://github.com/adityathakur17/persona-ai/tree/main"
              >
                Github
              </Link>
              {" • "}
              <Link className="hover:text-black transition-colors" href="https://hashnode.com/689b81aa81efa11f5051e59f">
                Hashnode
              </Link>
              {" • "}
              <Link
                className="hover:text-black transition-colors"
                href="https://www.linkedin.com/in/aditya-thakur-267991229/"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    persona === "hiteshSir"
                      ? "https://avatars.githubusercontent.com/u/11613311?v=4"
                      : "https://avatars.githubusercontent.com/u/44976328?v=4"
                  }
                />
                <AvatarFallback>{persona === "hiteshSir" ? "HC" : "PG"}</AvatarFallback>
              </Avatar>
              <span className="text-black font-medium">
                {persona === "hiteshSir" ? "Hitesh Choudhary" : "Piyush Garg"}
              </span>
            </div>
            <button
              onClick={clearConversation}
              className="px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-light">Start a conversation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {persona === "hiteshSir" ? (
                            <Avatar>
                              <AvatarImage src="https://avatars.githubusercontent.com/u/11613311?v=4" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar>
                              <AvatarImage src="https://avatars.githubusercontent.com/u/44976328?v=4" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          <MarkdownRenderer content={msg.content} isUser={msg.role === "user"} />
                        </div>
                      </div>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09z"
                          />
                        </svg>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 ml-2">Thinking...</span>
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
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRateLimited ? `Wait ${resetTimer}s to send` : "Type your message..."}
                  rows={1}
                  className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 text-gray-800 placeholder-gray-600"
                  disabled={loading || isRateLimited}
                  style={{
                    minHeight: "56px",
                    maxHeight: "120px",
                    overflowY: message ? (message.split("\n").length > 2 ? "auto" : "hidden") : "hidden",
                  }}
                />
              </div>
              <button
                onClick={handleChat}
                disabled={loading || !message.trim()}
                className="w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="text-xs text-gray-600 mt-2 text-center">Press Enter to send • Shift + Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  )
}
