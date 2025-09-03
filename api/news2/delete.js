import pool from "../../lib/db.js";
import supabase from "../../lib/createclient.js";

export default async function (req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    // Fetch the news row
    const existing = await pool.query("SELECT * FROM news WHERE id = $1", [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    const news = existing.rows[0];

    // Extract image URLs from description
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls = [];
    let match;
    while ((match = imgRegex.exec(news.description))) {
      urls.push(match[1]);
    }

    if (urls.length === 0) {
      await pool.query("DELETE FROM news WHERE id = $1", [id]);
      return res.status(200).json({ message: "News deleted (no images found)" });
    }

    // Convert URLs to storage paths
    const paths = urls
      .map(url => {
        try {
          const urlObj = new URL(url);
          const parts = urlObj.pathname.split('/');
          return parts[parts.length - 1];
        } catch (error) {
          console.error("Error parsing URL:", url);
          return null;
        }
      })
      .filter(Boolean);

    console.log("Files to delete:", paths);

    // 🔥 ESSENTIAL ERROR HANDLING ONLY:
    let deletionError = null;
    const batchSize = 50;

    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize);
      const { error } = await supabase.storage.from("news-images").remove(batch);
      
      if (error) {
        console.error("Delete error:", {
          message: error.message,
          code: error.code
        });
        deletionError = error;
        break; // Stop on first error
      }
    }

    // If storage deletion failed, stop here to avoid orphaned data
    if (deletionError) {
      // Check if it's a policy error (most common issue)
      if (deletionError.message.includes('policy') || deletionError.code === '403') {
        return res.status(403).json({ 
          error: "Delete permission denied",
          message: "Check Supabase storage policies for DELETE operations"
        });
      }
      
      return res.status(500).json({ 
        error: "Failed to delete images",
        details: deletionError.message 
      });
    }

    // Delete database record
    await pool.query("DELETE FROM news WHERE id = $1", [id]);

    return res.status(200).json({ 
      message: "News and images deleted successfully",
      deletedImages: paths.length
    });

  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}