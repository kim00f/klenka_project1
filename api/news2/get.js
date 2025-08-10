import pool from '../../lib/db.js'

export default async function (req, res) {
 const { user_id } = req.body;
  try {
    const result = await pool.query('SELECT * FROM news WHERE user_id=$1 ORDER BY created_at DESC',[user_id]);
    return res.status(200).json({ news: result.rows })
  } catch (err) {
    console.error('Error fetching news:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
