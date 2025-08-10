import pool from '../../lib/db.js'

export default async function (req, res) {
  const { title, description, userid } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO news (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userid]
    )

    return res.status(201).json({ message: 'News created', news: result.rows[0] })
  } catch (err) {
    console.error('Error inserting news:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
