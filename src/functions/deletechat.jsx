'use client';
import {FaTrash} from "react-icons/fa";
export default function deletechat(id) {
    const handleDelete = async () => {
        try {
        const res = await fetch("/api/chat/deletechat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: id }),
        });
        const data = await res.json();
        if (res.ok) {
            
            window.location.href = "/chat"; 
        } else {
            alert(data.error || "Failed to delete chat session.");
        }
        } catch (error) {
        console.error("Error deleting chat session:", error);
        alert("An error occurred while deleting the chat session.");
        }
    };
    
    return (
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 ml-2">
            <FaTrash />
        </button>
    );
};
