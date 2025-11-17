import { useState } from 'react'
import TokenForm from './components/TokenForm'
import TokenList from './components/TokenList'
import RedeemWidget from './components/RedeemWidget'

function App() {
  const [generated, setGenerated] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50">
      <header className="px-6 py-4 border-b bg-white/70 backdrop-blur sticky top-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Reward Tokens</h1>
          <a href="/test" className="text-sm text-blue-600 hover:underline">Check backend</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Generate tokens</h2>
            <TokenForm onGenerated={setGenerated} />
            {generated.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">New tokens</h3>
                <div className="border rounded divide-y">
                  {generated.map(t => (
                    <div key={t.code} className="p-3 flex items-center justify-between">
                      <span className="font-mono text-sm">{t.code}</span>
                      <button className="text-blue-600 text-sm" onClick={() => navigator.clipboard.writeText(t.code)}>Copy</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <TokenList />
          </div>
        </section>

        <aside className="space-y-6">
          <RedeemWidget />
          <div className="bg-white rounded p-4 text-sm text-gray-600">
            <p>Use this tool to create unique codes you can share with clients as rewards or promotions. Codes can optionally expire and carry a value.</p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
