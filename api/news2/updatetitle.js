 import pool from "../../lib/db";
export default async function (req,res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, title } = req.body;
  console.log(
    id, title
  )

  if (!id || !title) {
    return res.status(400).json({ error: 'Missing id or title' });
  }


  // try {
   const result = await pool.query(
      `UPDATE news SET title = '${title}' WHERE id = '${id}' RETURNING *`
    );
     
    console.log(result)


    // if (result.rowCount === 0) {
    //   return res.status(404).json({ error: 'News item not found' });
    //  }

  //   return res.status(200).json({ message: 'Title updated', data: result.rows[0] });
  // } catch (error) {
  //   console.error('Error updating title:', error);
  //   return res.status(500).json({ error: 'Internal Server Error' });
  // }
}
