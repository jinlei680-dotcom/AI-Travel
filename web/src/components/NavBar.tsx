"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

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
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          AI Travel
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {!loading && email && (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Dashboard
              </Link>
              <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">
                {email}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-md px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
              >
                退出
              </button>
            </>
          )}
          {!loading && !email && (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}