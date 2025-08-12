"use client";

import { useState } from "react";

import supabase from "../../../../lib/createclient";

export default function SignupPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [info, setInfo] = useState("");

  async function handleEmailSignup(e) {
    e.preventDefault();
    setErrorMsg("");
    setInfo("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setErrorMsg(error.message);

    // Depending on your Supabase email confirmation setting:
    // - If confirm email is ON: show info message.
    // - If OFF: user will be logged in -> go to /articles
    const { data: { session } } = await supabase.auth.getSession();
    if (session) window.location.reload();
    else setInfo("Check your email to confirm your account.");
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/Newspage` },
    });
    if (error) setErrorMsg(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1>Sign up</h1>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            {info && <p className="text-sm text-green-700">{info}</p>}

            <button type="submit" className="w-full">Create account</button>
            <button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
              Continue with Google
            </button>
          </form>

       
          <a href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Sign in</a>
    </div>
  );
}
