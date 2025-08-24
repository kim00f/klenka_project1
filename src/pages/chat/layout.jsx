"use client";
import { useEffect, useState } from "react";
import supabase from "../../../lib/createclient";

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
        <h2 className="text-lg font-bold mb-4">Your Chats</h2>
        {loading ? (
          <div>Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400">No sessions yet</div>
        ) : (
          sessions.map((s) => (
            <a
              key={s.id}
              href={`/chat/${s.id}`} // normal link (Mare will handle navigation)
              className={`block p-2 rounded ${
                currentId == s.id
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {s.title}
            </a>
          ))
        )}
      </aside>

      {/* Main chat area */}
      <main className="flex-1 bg-gray-700">{children}</main>
    </div>
  );
}
