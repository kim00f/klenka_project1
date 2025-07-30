import pool from "../../lib/db.js"; // Make sure this path is correct for your project

export default async function (req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, description } = req.body;
  console.log(id, description); // For debugging

  if (!id || !description) {
    return res.status(400).json({ error: 'Missing id or description' });
  }

  try {
    const result = await pool.query(
      'UPDATE news SET description = $1 WHERE id = $2 RETURNING *',
      [description, parseInt(id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }

    return res.status(200).json({ message: 'Description updated', data: result.rows[0] });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ error: 'Database update failed' });
  }
}
