import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// 允许在客户端运行时动态注入公共环境（避免构建期内联导致的空值）
let SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
let SUPABASE_ANON_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

export function setSupabaseEnv(url?: string, anonKey?: string) {
  if (typeof url === 'string' && url.trim().length > 0) {
    SUPABASE_URL = url
  }
  if (typeof anonKey === 'string' && anonKey.trim().length > 0) {
    SUPABASE_ANON_KEY = anonKey
  }
}

// 惰性获取客户端，避免在环境变量未配置时抛错，影响页面渲染
export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
