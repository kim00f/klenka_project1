"use client";

import { useEffect } from "react";

import supabase from "../../../../lib/createclient";


export default function AuthCallback() {
 

  useEffect(() => {
    async function finishSignIn() {
      try {
        // For PKCE flow
        await supabase.auth.exchangeCodeForSession(window.location.href);
        window.location.href = "/";
      } catch {
        // For implicit flow (#access_token in URL)
        await supabase.auth.getSession();
      }
      
    }
    finishSignIn();
  }, []);

  return <p className="p-6 text-center">Signing you in…</p>;
}
