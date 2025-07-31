import pool from '../../lib/db.js'

export default async function (req, res) {
 
  try {
    
    const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC')
    return res.status(200).json({ news: result.rows })
  } catch (err) {
    console.error('Error fetching news:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
