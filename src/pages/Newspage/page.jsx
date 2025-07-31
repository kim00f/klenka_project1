'use client'; 

import { useEffect, useState } from 'react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news2/get');
      const data = await res.json();
      setNews(data.news);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, []);

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">News</h1>
      <ul>
        {news.map(item => (
          <li key={item.id} className="mb-2 border p-2 rounded">
            <h1 className="font-semibold">{item.title}</h1>
            <p>{item.description}</p>

          </li>
        ))}
      </ul>
    </div>
  );
}
