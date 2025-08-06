'use client';

export default function DeleteNewsButton({ id, onDelete }) {
  const handleDelete = async () => {
    try {
      const res = await fetch('/api/news2/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        if (onDelete) onDelete(id); 
      } else {
        const errorData = await res.json();
        alert('Failed to delete: ' + (errorData?.error || 'Unknown error'));
      }
      if (res.ok) {
      
      window.location.reload();
    }
    } catch (err) {
      console.error('Error deleting:', err);
      alert('An error occurred while deleting');
    }
  };

  return (
    <button
      className="mt-2 px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
