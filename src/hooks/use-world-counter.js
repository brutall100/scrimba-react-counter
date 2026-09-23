import { useCallback, useEffect, useRef, useState } from 'react'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_KEY
export const WORLD_COUNTER_CONFIGURED = Boolean(URL && KEY)

const DEMO_KEY = 'neon-odometer-world-demo'

function readDemo() {
  try {
    return Number(localStorage.getItem(DEMO_KEY)) || 0
  } catch {
    return 0
  }
}

function writeDemo(value) {
  try {
    localStorage.setItem(DEMO_KEY, String(value))
  } catch {
    // Demo value is simply not remembered.
  }
}

/*
  Shared counter stored in Supabase.
  status: 'demo'        no Supabase settings, counts in this browser only
          'connecting'  loading the current number
          'online'      number loaded, live updates not (yet) running
          'live'        live updates from other visitors are arriving
          'offline'     Supabase could not be reached
*/
export function useWorldCounter() {
  const [value, setValue] = useState(() => (WORLD_COUNTER_CONFIGURED ? null : readDemo()))
  const [status, setStatus] = useState(WORLD_COUNTER_CONFIGURED ? 'connecting' : 'demo')
  const clientRef = useRef(null)

  useEffect(() => {
    if (!WORLD_COUNTER_CONFIGURED) return

    let cancelled = false
    let channel = null

    async function connect() {
      try {
        // Loaded only when needed, so the demo build stays small.
        const { createClient } = await import('@supabase/supabase-js')
        if (cancelled) return
        const client = createClient(URL, KEY)
        clientRef.current = client

        const { data, error } = await client.from('world_counter').select('value').eq('id', 1).single()
        if (error) throw error
        if (cancelled) return
        setValue(data.value)
        setStatus('online')

        channel = client
          .channel('world-counter')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'world_counter', filter: 'id=eq.1' },
            (payload) => setValue((current) => Math.max(current ?? 0, payload.new.value)),
          )
          .subscribe((state) => {
            if (cancelled) return
            if (state === 'SUBSCRIBED') setStatus('live')
            else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT' || state === 'CLOSED') setStatus('online')
          })
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    connect()
    return () => {
      cancelled = true
      if (channel) clientRef.current?.removeChannel(channel)
    }
  }, [])

  const increment = useCallback(async () => {
    if (!WORLD_COUNTER_CONFIGURED) {
      setValue((current) => {
        const next = (current ?? 0) + 1
        writeDemo(next)
        return next
      })
      return
    }

    const client = clientRef.current
    if (!client) return
    setValue((current) => (current ?? 0) + 1) // show it straight away
    const { data, error } = await client.rpc('increment_world_counter')
    if (error) {
      setValue((current) => (current ?? 1) - 1) // undo
      setStatus('offline')
      return
    }
    setValue((current) => Math.max(current ?? 0, data))
  }, [])

  return { value, status, increment }
}
