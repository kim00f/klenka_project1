import pool from '../../lib/db.js'

export default async function (req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Missing id' })
  }

  try {
    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'News not found' })
    }

    return res.status(200).json({ message: 'News deleted', news: result.rows[0] })
  } catch (err) {
    console.error('Error deleting news:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
