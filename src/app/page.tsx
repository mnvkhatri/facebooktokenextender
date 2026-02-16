'use client'

import { useState, useEffect } from 'react'

interface FormData {
  clientId: string
  clientSecret: string
  userAccessToken: string
  appScopedUserId: string
}

interface TokenResult {
  userToken?: {
    access_token: string
    token_type: string
    expires_in?: number
  }
  pageTokens?: Array<{
    access_token: string
    category: string
    category_list: Array<{ id: string; name: string }>
    name: string
    id: string
    tasks: string[]
  }>
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [showInputToken, setShowInputToken] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    clientId: '',
    clientSecret: '',
    userAccessToken: '',
    appScopedUserId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TokenResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [clearLoading, setClearLoading] = useState(false)
  const [clearResult, setClearResult] = useState<string | null>(null)

  async function handleClearCache() {
    setClearLoading(true)
    setClearResult(null)
    try {
      const res = await fetch('/api/clear-cache', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setClearResult('Cache/data cleared successfully!')
      } else {
        setClearResult('Failed to clear cache/data.')
      }
    } catch (e) {
      setClearResult('Error clearing cache/data.')
    }
    setClearLoading(false)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/facebook-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReveal = (key: string) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const maskToken = (token: string) => {
    if (!token) return ''
    const len = token.length
    if (len <= 10) return '\u2022'.repeat(len)
    const half = Math.floor(len / 2)
    const start = Math.ceil((len - half) / 2)
    const end = len - start
    return token.slice(0, start) + '\u2022'.repeat(half) + token.slice(end)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Get Long-lived Facebook Tokens</h2>
            <p className="text-gray-600 mt-1">Quickly exchange a short-lived user token for a long-lived token and retrieve page tokens.</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded">
            <h3 className="font-medium text-blue-900">Instructions</h3>
            <ol className="mt-2 ml-4 list-decimal list-inside text-sm text-blue-800">
              <li>Enter your Facebook App credentials and the short-lived user access token.</li>
              <li>Provide the app-scoped user ID for the user whose token you're exchanging.</li>
              <li>Click "Get Long-lived Tokens" and review the returned tokens below.</li>
            </ol>
            <p className="mt-3 text-xs text-blue-700">Note: This app does not persist your tokens; they are handled transiently and only shown in your browser session.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook App Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your Facebook App Client ID"
                />
              </div>

              <div>
                <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook App Client Secret
                </label>
                <input
                  type="password"
                  id="clientSecret"
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your Facebook App Client Secret"
                />
              </div>
            </div>

              <div>
                <label htmlFor="userAccessToken" className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Short-lived User Access Token</span>
                  <button
                    type="button"
                    onClick={() => setShowInputToken(s => !s)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {showInputToken ? 'Hide' : 'Show'}
                  </button>
                </label>
                <textarea
                  id="userAccessToken"
                  name="userAccessToken"
                  value={formData.userAccessToken}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  style={showInputToken ? undefined : ({ WebkitTextSecurity: 'disc' } as React.CSSProperties)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono break-all"
                  placeholder="Enter your short-lived Facebook user access token"
                />
              </div>

            <div>
              <label htmlFor="appScopedUserId" className="block text-sm font-medium text-gray-700 mb-2">
                App-Scoped User ID
              </label>
              <input
                type="text"
                id="appScopedUserId"
                name="appScopedUserId"
                value={formData.appScopedUserId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the app-scoped user ID"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? 'Processing...' : 'Get Long-lived Tokens'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              {result.userToken && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Long-lived User Token</h3>
                  <div className="space-y-2">
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-green-700">Access Token:</span>
                          <button
                            type="button"
                            onClick={() => toggleReveal('user')}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {revealed['user'] ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      <div className="mt-1 p-2 bg-white border rounded text-sm font-mono break-all">
                        {revealed['user'] ? result.userToken.access_token : maskToken(result.userToken.access_token)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Token Type:</span> {result.userToken.token_type}
                      </div>
                      {result.userToken.expires_in && (
                        <div>
                          <span className="font-medium text-green-700">Expires In:</span> {result.userToken.expires_in} seconds
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {result.pageTokens && result.pageTokens.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">Page Tokens</h3>
                  <div className="space-y-4">
                    {result.pageTokens.map((page, index) => (
                      <div key={page.id} className="bg-white border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-blue-900">{page.name}</h4>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            ID: {page.id}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">Access Token:</span>
                            <div className="mt-1 p-2 bg-gray-50 border rounded text-xs font-mono break-all flex items-center justify-between">
                              <div className="break-words">
                                {revealed[page.id] ? page.access_token : maskToken(page.access_token)}
                              </div>
                              <div className="ml-3 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleReveal(page.id)}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {revealed[page.id] ? 'Hide' : 'Show'}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">Category:</span> {page.category}
                          </div>
                          {page.tasks && page.tasks.length > 0 && (
                            <div>
                              <span className="font-medium text-blue-700">Available Tasks:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {page.tasks.map((task, taskIndex) => (
                                  <span key={taskIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {task}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    {/* Clear Cache Button - placed at the bottom inside main container */}
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={handleClearCache}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        disabled={clearLoading}
      >
        {clearLoading ? 'Clearing...' : 'Clear All Cache/Data'}
      </button>
      {clearResult && (
        <div className="mt-2 text-sm text-gray-700">{clearResult}</div>
      )}
    </div>
    </div>
  );
}
