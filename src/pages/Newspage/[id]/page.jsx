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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newsId }),
        });

        const data = await res.json();
        setNews(data.news);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  if (!news)
    return <div className="p-6 text-center text-red-400">News not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-4">
          {news.title}
        </h1>
        <div
      className="text-lg leading-relaxed prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: news.description }}
    />


        {news.key_words && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              Key Words
            </h2>
            <div className="flex flex-wrap gap-2">
              {news.key_words.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 hover:bg-blue-600/40 transition"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
