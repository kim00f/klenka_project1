"use client";
import { useEffect,useState } from "react";
import supabase from "../../../../lib/createclient";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); 
  const[userid, setuserid] = useState(null);


useEffect(()=>{
    const loaduseer= async()=>{
      const { data: {user}}= await supabase.auth.getUser();
      if(user){
        setuserid(user.id)
      }
      else{
        setLoading(false);
      }
    };
    loaduseer();
  },[]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true); // start loading

    try {
      const res = await fetch("/api/chat/aichat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage, user_id: userid }),
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
      
      <div className="p-4 bg-black text-white text-lg font-semibold shadow">
        Chat Page
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow 
                ${m.role === "user" 
                  ? "bg-black text-white rounded-br-none" 
                  : "bg-transparent text-white rounded-bl-none"
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-2xl shadow bg-gray-600 text-white animate-pulse">
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
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
          className="bg-black-600 text-white px-6 py-2 rounded-xl hover:bg-black-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
