"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import supabase from "../../../lib/createclient";

export default function MyEditor() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [userid, setUserid] = useState();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserid(user.id);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.getContent();
    console.log("Saving article:", title, content);

    await fetch("/api/news2/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: content, // only HTML with <img src="...">
        userid: userid,
        key_words: [],
      }),
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
      "undo redo | bold italic | alignleft aligncenter alignright | image | code",

    // 👇 ensures pasted images get converted to blobs and sent to handler
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

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
