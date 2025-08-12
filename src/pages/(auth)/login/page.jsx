"use client";

import { useState } from "react";

import supabase from "../../../../lib/createclient";

export default function LoginPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleEmailLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return setErrorMsg(error.message);

    // If session exists → go to articles, otherwise server layout will handle redirect
    if (data?.session) window.location.reload();
    else window.location.reload();;
  }

  async function handleGoogle() {
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Send Google back to our dedicated auth callback page
        redirectTo: `${location.origin}/callback`,
      },
    });
    if (error) setErrorMsg(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      
        
          <h1 className="text-center">Sign in</h1>
        
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button type="submit" className="w-full">
              Sign in
            </button>
            <button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
            >
              Continue with Google
            </button>
          </form>
       

        
          <a href="/signup" className="text-sm text-blue-600 hover:underline">
            Create an account
          </a>
    </div>
  );
}
