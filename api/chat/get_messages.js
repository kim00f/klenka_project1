import pool from "../../lib/db.js";

export default async function get_messages(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session_id } = req.body;

    const result = await pool.query(
      `SELECT * FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [session_id]
    );

    return res.status(200).json({ messages: result.rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
