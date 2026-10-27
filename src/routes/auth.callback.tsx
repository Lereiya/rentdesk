import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
          setError("No authorization code found in the URL.")
          return
        }

        // FORCE the exchange
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setError(`Exchange Error: ${exchangeError.message}`)
          return
        }

        if (data.session) {
          navigate({ to: '/auth', replace: true })
        } else {
          setError("Code exchanged, but no session was returned.")
        }
      } catch (err: any) {
        setError(`Unexpected Error: ${err.message}`)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-lg w-full">
          <h2 className="text-red-700 font-bold mb-2 text-lg">Authentication Failed</h2>
          <p className="text-red-600 font-mono text-sm">{error}</p>
        </div>
        <button onClick={() => window.location.href = '/auth'} className="mt-6 text-primary underline">
          Return to Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Exchanging code for session...</p>
    </div>
  )
}