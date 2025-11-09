"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import Button from "./Button";

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user?.email ?? null;
      setEmail(userEmail);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      const userEmail = session?.user?.email ?? null;
      setEmail(userEmail);
    });
    return () => {
      sub?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setEmail(null);
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          AI Travel
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300">
            Dashboard
          </Link>
          {loading && <span className="text-zinc-500 dark:text-zinc-400">加载中...</span>}
          {!loading && email && (
            <>
              <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">{email}</span>
              <Button onClick={handleSignOut} size="sm">
                退出
              </Button>
            </>
          )}
          {!loading && !email && (
            <Link href="/login">
              <Button variant="secondary" size="sm">登录</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
