import pool from "../../lib/db.js";
export default async function get_session(req,res) {
    const {user_id} =req.body;
    try {
    const result = await pool.query(`SELECT * FROM chat_sessions
       WHERE user_id=$1 
       ORDER BY created_at asc`,[user_id]);
    return res.status(200).json({ session: result.rows[0] })
  } catch (err) {
    console.error('Error fetching news:', err) 
    return res.status(500).json({ error: 'Internal Server Error' })
  } 
};
