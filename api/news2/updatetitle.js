import pool from "../../lib/db.js"; // ✅ Make sure the path and extension are correct

export default async function (req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, title } = req.body;
  console.log(id, title);

  if (!id || !title) {
    return res.status(400).json({ error: 'Missing id or title' });
  }

  try {
    const result = await pool.query(
      'UPDATE news SET title = $1 WHERE id = $2 RETURNING *',
      [title, parseInt(id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }
    console.log("h")
    return res.status(200).json({ message: 'Title updated', data: result.rows[0] });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ error: 'Database update failed' });
  }
}
