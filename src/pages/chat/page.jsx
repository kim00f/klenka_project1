"use client";
import { useEffect,useState } from "react";
import supabase from "../../../lib/createclient";


export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); 
  const[userid, setuserid] = useState(null);
  const[sessionid,setsessionid] = useState(null);
  const [sessions, setSessions] = useState([]);
  
useEffect(()=>{
    const loaduseer= async()=>{
      const { data: {user}}= await supabase.auth.getUser();
      if (user) {
      const res = await fetch("/api/chat/get_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();
      setSessions(data.session);
    }
    };
    loaduseer();
  },[]);


  return (
    <div className="flex flex-col w-full h-full bg-gray-700">
      
      <div className="p-4 bg-black text-white text-lg font-semibold shadow">
        Chat Page
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="p-2 bg-gray-800 rounded mb-2">
            <a href={`/chat/${session.id}`} className="text-white font-semibold">{session.title}</a>
            </div>
        ))}
        </div>
    </div>
  );
}
