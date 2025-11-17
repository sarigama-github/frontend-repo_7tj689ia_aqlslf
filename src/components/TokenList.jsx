import { useEffect, useState } from 'react'

export default function TokenList() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/tokens?limit=100&only_active=${onlyActive}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setTokens(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [onlyActive])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Recent tokens</h3>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={onlyActive} onChange={e=>setOnlyActive(e.target.checked)} />
          Only active
        </label>
      </div>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="border rounded divide-y bg-white">
        {tokens.length === 0 && !loading ? (
          <p className="p-4 text-sm text-gray-500">No tokens yet</p>
        ) : (
          tokens.map(t => (
            <div key={t.code} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-mono font-semibold text-gray-900">{t.code}</p>
                <p className="text-xs text-gray-500">{t.purpose || 'No purpose'} • {t.value} {t.currency}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${t.redeemed ? 'text-red-600' : 'text-green-600'}`}>{t.redeemed ? 'Redeemed' : 'Active'}</p>
                {t.expires_at && <p className="text-xs text-gray-500">Exp: {new Date(t.expires_at).toLocaleDateString()}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
