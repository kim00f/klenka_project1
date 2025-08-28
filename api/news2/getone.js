import pool from "../../lib/db.js";

export default async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
console.log("id:",id)
  try {
    
    const result = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    return res.status(200).json({ news: result.rows[0] });
  } catch (err) {
    console.error("Error fetching news:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
