"use client"

import { useEffect } from 'react'
import { setSupabaseEnv } from '@/lib/supabase'

export default function EnvScriptsLoader() {
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/env/public', { cache: 'no-store' })
        const json = await res.json()
        const data = json?.data || {}

        const supabaseUrl: string | undefined = data.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey: string | undefined = data.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (supabaseUrl && supabaseAnonKey) {
          setSupabaseEnv(supabaseUrl, supabaseAnonKey)
        }

        const amapKey: string | undefined = data.NEXT_PUBLIC_AMAP_KEY
        const amapSecCode: string | undefined = data.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE

        // 注入高德安全脚本（避免重复注入）
        if (amapSecCode && !document.getElementById('amap-security')) {
          const secScript = document.createElement('script')
          secScript.id = 'amap-security'
          secScript.innerHTML = `window._AMapSecurityConfig = { securityJsCode: '${amapSecCode}' }`
          document.head.appendChild(secScript)
        }

        // 注入高德地图主脚本（避免重复注入）
        if (amapKey && !document.getElementById('amap-main')) {
          const mainScript = document.createElement('script')
          mainScript.id = 'amap-main'
          mainScript.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`
          mainScript.async = true
          document.head.appendChild(mainScript)
        }
      } catch (err) {
        // 静默失败，避免阻塞页面渲染
        console.error('EnvScriptsLoader failed:', err)
      }
    }
    run()
  }, [])

  return null
}

