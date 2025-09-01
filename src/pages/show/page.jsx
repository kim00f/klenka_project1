"use client";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function EditNews({ newsId }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch news from your API
    const fetchNews = async () => {
      const res = await fetch("/api/news2/getone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 124 }),
      });

      const data = await res.json();
      setNews(data.news);
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!news) return <p>News not found</p>;

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={news.description}  
      init={{
        height: 500,
        menubar: true,
        plugins: "link image code lists",
        toolbar:
          "undo redo | bold italic underline | bullist numlist | link image | code",
      }}
      onEditorChange={(newValue) => {
        setNews({ ...news, description: newValue });
      }}
    />
  );
}
