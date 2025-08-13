"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import supabase from "../../../../lib/createclient";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Sign in</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
            >
              Continue with Google
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <a href="/signup" className="text-sm text-blue-600 hover:underline">
            Create an account
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
