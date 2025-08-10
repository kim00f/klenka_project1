'use client';

import { useState } from 'react';

export default function EditNewsForm({ id, currentTitle, currentDescription,onCancel, onSave }) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [loading, setLoading] = useState(false);

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
    <div className="border p-4 rounded shadow-sm bg-white mb-4">
      <input
        type="text"
        className="w-full border px-3 py-2 mb-3 rounded"
        placeholder="Edit title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border px-3 py-2 mb-3 rounded"
        rows={3}
        placeholder="Edit description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="cursor-pointer"onClick={() => onCancel()}>Cancel</button>
      </div>
    </div>
  );
}
