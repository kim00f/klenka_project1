'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function EditNewsForm({ id, currentTitle, currentDescription,currentkeywords,onCancel, onSave }) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [keywords,setkeywords] = useState(currentkeywords||[]);
  const [keyWordInput, setKeyWordInput] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTitle(currentTitle);
    setDescription(currentDescription);
    setkeywords(currentkeywords)
  }, [id,currentTitle, currentDescription]);
  const handlekeywordadd =() =>{
    if(keyWordInput.trim()!=='' && !keywords.includes(keyWordInput.trim())){
      setkeywords([...keywords, keyWordInput.trim()]);
      setKeyWordInput('');
    }
  }
  const handlekeywordremove = (kw) =>{
    setkeywords(keywords.filter(k => k !== kw));
  }
  const handleSave = async () => {
    setLoading(true);
    try {
      // Update title
      const resTitle = await fetch('/api/news2/updatetitle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title }),
      });

      // Update description
      const resDesc = await fetch('/api/news2/updatedescription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, description }),
      });
      // update keywords 
      console.log(keywords)
      const reskey=await fetch('/api/news2/updatekeywords',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, key_words: keywords }),
      })

      if (resTitle.ok && resDesc.ok) {
        onSave(id, title, description);
      } else {
        alert('Failed to update post');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('An error occurred while updating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded h-full shadow-sm bg-white mb-4">
      <div className="flex gap-3">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="bg-whitetext-black px-4 py-2 rounded cursor-pointer hover:bg-gray-300 disabled:opacity-50"onClick={() => onCancel()}>Cancel</button>
      </div>
      <input
        type="text"
        className="w-full border px-3 py-2 mb-3 rounded"
        placeholder="Edit title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={postText}
        onEditorChange={(content) => setPostText(content)}
        init={{
          height: 1000,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table code help wordcount",
            "link image code table lists",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help | image",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
             paste_data_images: true,

    // 👇 Upload directly to Supabase Storage
    images_upload_handler: async (blobInfo) => {
      const file = blobInfo.blob();
      const fileName = `${Date.now()}-${blobInfo.filename()}`;

      const { data, error } = await supabase.storage
        .from("news-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error.message);
        throw new Error("Image upload failed");
      }

      const { data: publicData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      if (!publicData.publicUrl) {
        throw new Error("Failed to get public URL from Supabase");
      }

      return publicData.publicUrl; // ✅ TinyMCE will insert <img src="...">
    },
        }}
      />
      <div>
            <label>KEYWORDS:</label>
            <div>
              <input className="" placeholder="Add keyword" type="text" value={keyWordInput} onChange={(e)=>setKeyWordInput(e.target.value)}/>
              <button className="ml-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={handlekeywordadd}>Add</button>
            </div>
            <div>
              {(keywords || []).map((kw,i)=>(
                <span key={i} className="bg-gray-200 px-2 py-1 m-1 rounded-full flex items-center">{kw}<button className="ml-2 text-red-500" onClick={()=>handlekeywordremove(kw)}>Remove</button></span>
              ))}
            </div>
          </div>
      
    </div>
  );
}
