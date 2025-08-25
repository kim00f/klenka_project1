"use client";
import { useEffect, useState } from "react";
import supabase from "../../../lib/createclient";
import DeleteChat from "../../functions/deletechat";

export default function ChatLayout({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch("/api/chat/get_session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const data = await res.json();
        
        setSessions(data.session || []);
      }
      setLoading(false);
      console.log("Sessions loaded:", sessions);
    };
    loadSessions();
  }, []);

  // figure out the active session from the URL
  const currentId = window?.location?.pathname.split("/chat/")[1];

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-2 overflow-y-auto">
        <a href="/chat">New chat</a>
        <h2 className="text-lg font-bold mb-4">Your Chats</h2>
        {loading ? (
          <div>Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400">You dont have any previous chats</div>
        ) : (
          sessions.map((s) => (
            <div  key={s.id}
        className={`flex items-center justify-between p-2 rounded ${
          currentId == s.id
            ? "bg-gray-700 font-semibold"
            : "hover:bg-gray-700"
        }`}>
            <a
              key={s.id}
              href={`/chat/${s.id}`} // normal link (Mare will handle navigation)
              className="text-blue-400 hover:underline flex-1"
            >
              {s.title} 
            </a>
            <DeleteChat id={s.id} />
            </div>
          ))
        )}
      </aside>

      {/* Main chat area */}
      <main className="flex-1 bg-gray-700">{children}</main>
    </div>
  );
}
