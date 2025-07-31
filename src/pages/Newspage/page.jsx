'use client';

import { useEffect, useState } from 'react';






export default function NewsPage() {

 // ✅ must be *inside* the component
  const [news, setNews] = useState([]);


  const [loading, setLoading] = useState(true);
  const [showsmallpage, setShowSmallPage] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news2/get');
        const data = await res.json();
        if (data?.news && Array.isArray(data.news)) {
          setNews(data.news);
        } else {
          console.error('API returned invalid data:', data);
          setNews([]); // fallback to empty list
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);
const handleDelete = async (id) => {
  

  try {
    const res = await fetch('/api/news2/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      // Remove the deleted post from local state
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));
    } else {
      const errorData = await res.json();
      alert('Failed to delete: ' + (errorData?.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Error deleting:', err);
    alert('An error occurred while deleting');
  }
};

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="p-4 relative">
      {/* Create Post button */}
      <button
        className="mt-10 border rounded px-4 py-2 cursor-pointer"
        onClick={() => setShowSmallPage(true)}
      >
        Create Post
      </button>

      {/* Modal overlay */}
      {showsmallpage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            {/* Title field */}
            <div className="flex flex-col mb-2">
              <label htmlFor="title" className="text-sm font-medium mb-1">Title:</label>
              <textarea
                id="title"
                className="border rounded px-2 py-1 resize-none overflow-hidden"
                placeholder="Enter title..."
                value={postTitle}
                onChange={(e) => {
                  setPostTitle(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                rows={1}
              ></textarea>
            </div>

            {/* Description field */}
            <div className="flex flex-col mb-2">
              <label htmlFor="content" className="text-sm font-medium mb-1">Description:</label>
              <textarea
                id="content"
                className="border rounded px-2 py-2 resize-none overflow-hidden"
                placeholder="Type your message here..."
                value={postText}
                onChange={(e) => {
                  setPostText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                rows={2}
              ></textarea>
            </div>

            {/* Create button */}
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              onClick={async () => {
                if (postTitle.trim() !== '' && postText.trim() !== '') {
                  try {
                    const res = await fetch('/api/news2/create', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: postTitle, description: postText }),
                    });
                    if (res.ok) {
                      const data = await res.json();

                      
                      if ( data.news.id  ) {
                        
                        // Add new post to local state
                        
                        setNews([data.post, ...news]);
                        // Clear inputs and close modal
                        setPostTitle('');
                        setPostText('');
                        setShowSmallPage(false);

                        // ✅ Navigate back to /news page (refresh)
                     
                      }
                    } else {
                      const errData = await res.json();
                      alert('Failed to create post: ' + (errData?.message || 'Unknown error'));
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                  }
                } else {
                  alert('Please enter both title and description!');
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* News list */}
      <h1 className="text-xl font-bold mb-4 mt-4">News</h1>
      <ul>
        {news.filter(Boolean).map((item, index) =>
          item && item.title && item.description ? (
            <li key={item.id || index} className="mb-2 border p-2 rounded">
              <h1 className="font-semibold">{item.title}</h1>
              <p>{item.description}</p>
              <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(item.id)}> Delete </button>

            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}