import pool from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { session_id } = req.body;
    

    // ✅ Fix: normalize session_id if it comes as an object
    if (session_id && typeof session_id === "object" && session_id.id) {
      session_id = session_id.id;
    }

    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({ error: "Invalid session_id" });
    }

    // Delete related messages first
    await pool.query("DELETE FROM chat_messages WHERE session_id = $1", [session_id]);
    await pool.query("DELETE FROM chat_sessions WHERE id = $1", [session_id]);

    return res.status(200).json({ message: "Chat session deleted successfully." });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Failed to delete chat session." });
  }
}
