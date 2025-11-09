"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) { setError('未配置 Supabase 环境变量'); return }
    setLoading(true); setError(null); setMessage(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else setMessage('注册成功，请检查邮箱完成验证或直接登录')
  }

  const handleSignIn = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) { setError('未配置 Supabase 环境变量'); return }
    setLoading(true); setError(null); setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setMessage('登录成功')
      router.push('/dashboard')
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 rounded-md border p-4">
      <h2 className="text-lg font-semibold">邮箱登录 / 注册</h2>
      <input
        type="email"
        placeholder="邮箱"
        className="w-full rounded border px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="密码"
        className="w-full rounded border px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-3">
        <button onClick={handleSignIn} disabled={loading} className="rounded bg-black px-3 py-2 text-white">
          登录
        </button>
        <button onClick={handleSignUp} disabled={loading} className="rounded border px-3 py-2">
          注册
        </button>
      </div>
      {loading && <p className="text-sm text-gray-500">处理中...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <p className="text-xs text-gray-500">提示：请先在 .env.local 配置 Supabase 项目参数</p>
    </div>
  )
}