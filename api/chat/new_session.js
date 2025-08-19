import pool from "../../lib/db.js";

export default async function new_session(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_id, title } = req.body;

    // RETURNING * will give us the inserted row
    const result = await pool.query(
      "INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING *",
      [user_id, title || "New chat"]
    );

    return res.status(200).json({ session: result.rows[0] })
  } catch (err) {
    console.error("Error creating session:", err);
    return res.status(500).json({ error: "Failed to create session." });
  }
}
