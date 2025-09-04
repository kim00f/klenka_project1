import pool from "../../lib/db.js";

export default async function (req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    
    const { rows } = await pool.query("SELECT description FROM news WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls = [...rows[0].description.matchAll(imgRegex)].map(m => m[1]);

    const paths = urls
      .map(url => {
        try {
          const parts = new URL(url).pathname.split("/");
          return parts.pop(); 
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    
    if (paths.length > 0) {
      await pool.query(
        `DELETE FROM storage.objects WHERE name = ANY($1::text[])`,
        [paths]
      );
    }

   
    await pool.query("DELETE FROM news WHERE id = $1", [id]);

    res.status(200).json({
      message: "News and images deleted",
      deletedImages: paths,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
