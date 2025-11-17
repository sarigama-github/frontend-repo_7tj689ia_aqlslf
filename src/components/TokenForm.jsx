import { useState } from 'react'

export default function TokenForm({ onGenerated }) {
  const [count, setCount] = useState(5)
  const [value, setValue] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [purpose, setPurpose] = useState('')
  const [length, setLength] = useState(10)
  const [prefix, setPrefix] = useState('')
  const [days, setDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      let expires_at = null
      if (days && !isNaN(Number(days))) {
        const d = new Date()
        d.setDate(d.getDate() + Number(days))
        expires_at = d.toISOString()
      }
      const payload = {
        count: Number(count),
        value: Number(value),
        currency,
        purpose: purpose || null,
        length: Number(length),
        prefix: prefix || null,
        expires_at,
      }
      const res = await fetch(`${baseUrl}/api/tokens/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      onGenerated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">Count
          <input type="number" min="1" max="500" value={count} onChange={e=>setCount(e.target.value)} className="mt-1 border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col text-sm">Code length
          <input type="number" min="6" max="32" value={length} onChange={e=>setLength(e.target.value)} className="mt-1 border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col text-sm">Value
          <input type="number" min="0" step="0.01" value={value} onChange={e=>setValue(e.target.value)} className="mt-1 border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col text-sm">Currency
          <input value={currency} onChange={e=>setCurrency(e.target.value)} className="mt-1 border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col text-sm">Prefix (optional)
          <input value={prefix} onChange={e=>setPrefix(e.target.value)} placeholder="PROMO-" className="mt-1 border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col text-sm">Expires in (days)
          <input type="number" min="0" value={days} onChange={e=>setDays(e.target.value)} placeholder="e.g. 30" className="mt-1 border rounded px-3 py-2" />
        </label>
      </div>
      <label className="flex flex-col text-sm">Purpose
        <input value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="Campaign, referral, etc." className="mt-1 border rounded px-3 py-2" />
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50">
        {loading ? 'Generating...' : 'Generate tokens'}
      </button>
    </form>
  )
}
