"use client";
import { useEffect, useState } from "react";

export default function NewsPage({ params }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/Newspage/");
    const newsId = pathParts[1];

    if (!newsId) return;

    const fetchNews = async () => {
        
      try {
        const res = await fetch("/api/news2/getone", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newsId }),
        });
        console.log("response",res)
        
        const data = await res.json();
        setNews(data.news);
        
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
      console.log("news",mews)
    };

    fetchNews();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!news) return <div className="p-4">News not found</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">{news.title}</h1>
      <p className="mt-2">{news.description}</p>
      {news.key_words && (
        <div className="mt-4 flex flex-wrap gap-2">
          {news.key_words.map((kw, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-700 rounded text-sm"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
