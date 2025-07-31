'use client';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setSession(data.session))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/login'; // Redirects to Google login
  };

  const handleLogout = () => {
    fetch('/api/auth/logout')
      .then(() => setSession(null))
      .catch(err => console.error(err));
  };

  return session ? (
    <button onClick={handleLogout} className="bg-pink-500 text-white rounded-lg p-2">
      Sign Out
    </button>
  ) : (
    <button onClick={handleLogin} className="bg-pink-500 text-white rounded-lg p-2">
      Sign In with Google
    </button>
  );
}
