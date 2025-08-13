import pool from '../../lib/db.js';

export default async function handler(req, res) {
  const { id, key_words } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Post ID is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE news
       SET key_words = $1
       WHERE id = $2
       RETURNING *`,
      [key_words, id]
    );

    res.status(200).json({ news: result.rows[0] });
  } catch (err) {
    console.error('Error updating keywords:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
