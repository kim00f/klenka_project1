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
  const [createform, setcreateform] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [keywords,setkeywords] = useState([]);
  const [keyWordInput, setKeyWordInput] = useState('');
  const [editing, setEditing] = useState(null);
  const [searchtext,setsearchtext]=useState('');
  //load user 
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

//get articles
  useEffect(() => {
    if (!userid) return; // Ensure userid is set before fetching news
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news2/get', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userid,search_text: searchtext})
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
  }, [userid, searchtext]);


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
    {
  cellRenderer: (params) => {
    return (
      <a
        href={`/Newspage/${params.data.id}`}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        More Info
      </a>
    );
  }
},
  ];
  const handlekeywordadd =() =>{
    if(keyWordInput.trim()!=='' && !keywords.includes(keyWordInput.trim())){
      setkeywords([...keywords, keyWordInput.trim()]);
      setKeyWordInput('');
    }
  }
  const handlekeywordremove = (kw) =>{
    setkeywords(keywords.filter(k => k !== kw));
  }
  if (loading) return <p>Loading Article...</p>;
  if(createform){
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold mb-6">Create News Article</h1>
        
        {/* Title Input */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter title..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        
        {/* Description Input */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
          <textarea
            id="content"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-64 resize-none"
            placeholder="Type your message here..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>
        
        {/* Keywords Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">KEYWORDS:</label>
          <div className="flex mb-2">
            <input 
              type="text" 
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={keyWordInput} 
              onChange={(e)=>setKeyWordInput(e.target.value)}
              placeholder="Add keyword..."
            />
            <button 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md transition"
              onClick={handlekeywordadd}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span 
                key={kw} 
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800"
              >
                {kw}
                <button 
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handlekeywordremove(kw)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition"
            onClick={async () => {
              if (postTitle.trim() !== '' && postText.trim() !== '') {
                try {
                  const res = await fetch('/api/news2/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: postTitle, description: postText, userid:userid , key_words: keywords }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.news.id) {
                      setNews([data.news, ...news]);
                      setPostTitle('');
                      setPostText('');
                      setcreateform(false);
                      window.location.reload();
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
          <button 
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition"
            onClick={() => setcreateform(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
if(userid){
  return (
    <div className="min-h-screen bg-gray-50 py-10">
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Create Post button */}
      <button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
        onClick={() => setcreateform(true)}
      >
        Create Post
      </button>
      <input className="ml-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" type="text" placeholder="search" value={searchtext} onChange={(e)=>setsearchtext(e.target.value)}/>
     
      {/* News list */}
      <h1 className="text-xl font-bold mb-4 mt-4">Article</h1>
      <div className="ag-theme-alpine" style={{ height: 600, width: 850 }} >
     {editing && (
    <div className="bg-white shadow-md border-b p-4">
      <h2 className="text-xl font-bold mb-4">Editing: {editing.title}</h2>

      <EditNewsForm
        id={editing.id}
        currentTitle={editing.title}
        currentDescription={editing.description}
        currentkeywords={editing.key_words}
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
    </div>
  )}
        <AgGridReact   rowData={news}
      columnDefs={columnDefs}
     rowHeight={50}
     pagination={true}
     paginationPageSize={10}
     domLayout="autoHeight"
     className="ag-theme-alpine"
     overlayNoRowsTemplate="No articles found"/>
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