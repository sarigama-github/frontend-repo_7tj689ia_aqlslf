import { useState } from 'react'

export default function RedeemWidget() {
  const [code, setCode] = useState('')
  const [clientId, setClientId] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redeem = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/tokens/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), client_id: clientId.trim() || 'anonymous' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to redeem')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Redeem a token</h3>
      <form onSubmit={redeem} className="space-y-3">
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter token code" className="w-full border rounded px-3 py-2" />
        <input value={clientId} onChange={e=>setClientId(e.target.value)} placeholder="Your client id or email (optional)" className="w-full border rounded px-3 py-2" />
        <button disabled={loading || !code.trim()} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded disabled:opacity-50">
          {loading ? 'Redeeming...' : 'Redeem'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="text-sm bg-emerald-50 border border-emerald-200 rounded p-3">
          <p className="font-mono font-semibold text-emerald-800">{result.code}</p>
          <p className="text-emerald-700">Redeemed successfully for {result.value} {result.currency}</p>
        </div>
      )}
    </div>
  )
}
