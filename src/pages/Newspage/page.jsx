'use client';

import { useEffect, useState } from 'react';
import supabase from '../../../lib/createclient';
import EditNewsForm from '../../functions/edit';
import Delete from '../../functions/delete';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { CsvExportModule } from 'ag-grid-community';


// Register only available community modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
 
]);


export default function NewsPage() {

  const[userid, setuserid] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsmallpage, setShowSmallPage] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [editing, setEditing] = useState(null);
  useEffect(()=>{
    const loaduseer= async()=>{
      const { data: {user}}= await supabase.auth.getUser();
      if(user){
        setuserid(user.id)
      }
      else{
        setLoading(false);
      }
    };
    loaduseer();
  },[]);
  useEffect(() => {
    if (!userid) return; // Ensure userid is set before fetching news
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news2/get', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userid})
});
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
  }, [userid]);
  const columnDefs = [
    
    { headerName: 'Title', field: 'title' },
    { headerName: 'Description', field: 'description' },
    {cellRenderer: (params) => {
      return( <Delete id={params.data.id}/>)
    }
    },
    { cellRenderer: (params) =>{
      return(
        <button className="mt-2 px-3 py-1 bg-blue-400 text-white cursor-pointer" onClick={()=>setEditing(params.data)}>Edit</button>
      )

    }},
  ];
  if (loading) return <p>Loading Article...</p>;
if(userid){
  return (
    <div className="min-h-screen w-screen bg-white">
    <div className="max-w-2xl mx-auto">
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
                      body: JSON.stringify({ title: postTitle, description: postText, userid:userid }),
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
                    if (res.ok) {
      
      window.location.reload();
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
            <button className="cursor-pointer"onClick={ () => {setShowSmallPage(false) 
              window.location.reload} }>Cancel</button>
          </div>
        </div>
      )}

      {/* News list */}
      <h1 className="text-xl font-bold mb-4 mt-4">Article</h1>
      <div className="ag-theme-alpine" style={{ height: 600, width: 800 }} >
        {editing &&(
          <EditNewsForm
    id={editing.id}
    currentTitle={editing.title}
    currentDescription={editing.description}
    onSave={(id, newTitle, newDescription) => {
      setNews(prev =>
        prev.map(post =>
          post.id === id
            ? { ...post, title: newTitle, description: newDescription }
            : post
        )
      );
      setEditing(null);
    }}
    onCancel={() => setEditing(null)}

  />

        )}
        <AgGridReact rowData={news} columnDefs={columnDefs} rowHeight={50}/>
        </div>
    </div>
    </div>
  );
}
else{
  
  return( 
    <div className="min-h-screen w-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">Please log in to view your news articles.</p>
    </div>
  );
}
}