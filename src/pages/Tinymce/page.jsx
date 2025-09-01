"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import supabase from "../../../lib/createclient";

export default function MyEditor() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [userid, setuserid]=useState();

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

  const handleSave = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.getContent(); 
    console.log("Saving article:", title, content);

    await fetch("/api/news2/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title:title, description:content, userid:userid, key_words:[ ] }),
    });
  };

  return (
    <div className="p-4 space-y-4">
      
      <input
        className="bg-gray-100 w-full p-2 rounded border"
        placeholder="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        init={{
          height: 400,
          menubar: true,
          plugins: "link image code table lists",
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | code",
        }}
      />

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
