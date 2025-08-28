"use client";
import { useEffect, useState, useRef } from "react";
import supabase from "../../../../lib/createclient";

export default function ChatPage({ params }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userid, setUserid] = useState(null);
  const [sessionid, setSessionid] = useState(null);

  // safer: initialize provider only on client
  const [provider, setProvider] = useState(() => {
  return localStorage.getItem("provider") ;
});

  const bottomRef = useRef(null);

  // Load user + session
  useEffect(() => {
    const pathParts = window.location.pathname.split("/chat/");
    if (pathParts[1]) {
      setSessionid(pathParts[1]);
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserid(user.id);
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Persist provider in localStorage
  useEffect(() => {
    if (provider) {
      localStorage.setItem("provider", provider);
    }
  }, [provider]);

  // Load messages
  useEffect(() => {
    if (!sessionid) return;

    const loadMessages = async () => {
      try {
        const res = await fetch("/api/chat/get_messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionid }),
        });

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [sessionid]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat/aichat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          user_id: userid,
          session_id: sessionid,
          provider,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: failed to get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-700">
      {/* Header */}
      <div className="p-4 bg-black text-white text-lg font-semibold shadow flex items-center">
        Chat Page
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="ml-4 p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="openai">GPT</option>
          <option value="deepseek">Deepseek</option>
        </select>
      </div>

      {/* Messages */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
  {messages.map((m, i) => (
    <div
      key={i}
      className={`flex ${
        m.role === "user" ? "justify-end" : "justify-center"
      }`}
    >
      <div
        className={`px-6 py-4 text-xl rounded-2xl shadow-md leading-relaxed
          ${
            m.role === "user"
              ? "max-w-md bg-black text-white rounded-br-none"
              : "max-w-5xl bg-transparent text-white rounded-bl-none"
          }`}
      >
        {m.content}
      </div>
    </div>
  ))}

  {loading && (
    <div className="flex justify-center">
      <div className="px-6 py-4 rounded-2xl shadow bg-gray-600/70 text-white animate-pulse text-center">
        ...
      </div>
    </div>
  )}
  <div ref={bottomRef} />
</div>

      {/* Input */}
      <div className="p-4 bg-black border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
          className="flex-1 text-white border rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
