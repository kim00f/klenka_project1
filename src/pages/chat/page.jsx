"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   
import supabase from "../../../lib/createclient";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [userid, setUserid] = useState(null);
  const [loading, setLoading] = useState(false);  
  const[sendLoading,setSendLoading]= useState(false);
  const[provider,setProvider]= useState(() => {
  return localStorage.getItem("provider") ;
});


  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserid(user.id); 
        
      }
      setLoading(false) 
    };
    
    
    loadUser();
  }, []);
  useEffect(() => {
  if (provider) {
    localStorage.setItem("provider", provider);
  }
}, [provider]);

  const handleSend = async () => {
    if (!input.trim() || !userid || loading) return;

    try {
       setSendLoading(true);
      const res = await fetch("/api/chat/new_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userid,
          title: input.trim(),
          first_message: input.trim(),
        }),
      });

      const data = await res.json();
      if (!data?.session) {
        setSendLoading(false);
        return;
      }

      const sessionId = data.session.id;

      console.log(provider)
      await fetch("/api/chat/aichat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          user_id: userid,
          session_id: sessionId,
          provider: provider
        }),
      });

     
      navigate(`/chat/${sessionId}`);
    } catch (err) {
      console.error("Error creating session:", err);
      setSendLoading(false);
    }
  };
  if(loading){
    return <div className="flex flex-col w-full h-full bg-gray-700">
      <div className="p-4 bg-black text-white text-lg font-semibold shadow">
        Loading...
      </div>
    </div>
  }
 if(userid){
  return (
    <div className="flex flex-col w-full h-full bg-gray-700">
      <div className="p-4 bg-black text-white text-lg font-semibold shadow">
        Chat Page
        <select value={provider} onChange={(e) => setProvider(e.target.value)}   className="ml-4 p-2 rounded bg-gray-800 text-white border border-gray-600">
          <option value="openai">GPT</option>
          <option value="deepseek">Deepseek</option>
        </select>
      </div>

      
      <div className="p-4 bg-black border-t flex">
        <input
          type="text"
          value={input}
          disabled={loading}   
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder={"Type your message..."}
          className="flex-1 text-white border rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={sendLoading}   
          className="bg-black-600 text-white px-6 py-2 rounded-xl hover:bg-black-700 transition"
        >
          {sendLoading ? "Sending..." : "Send"} 
        </button>
      </div>
    </div>
  );
}
else{
  return <div className="flex flex-col w-full h-full bg-gray-700">
    <div className="p-4 bg-black text-white text-lg font-semibold shadow">
      Please log in to use the chat.
    </div>
  </div>
}
}
