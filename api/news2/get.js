import pool from '../../lib/db.js'

export default async function (req, res) {
 const { user_id ,search_text} = req.body;
  try {
    const result = await pool.query(`SELECT * FROM news
       WHERE user_id=$1  AND ($2=''OR title ILIKE '%' || $2 || '%' OR EXISTS (
             SELECT 1 
             FROM unnest(key_words) kw
             WHERE kw ILIKE '%' || $2 || '%'
           ) )
       ORDER BY created_at DESC`,[user_id,search_text]);
    return res.status(200).json({ news: result.rows })
  } catch (err) {
    console.error('Error fetching news:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}