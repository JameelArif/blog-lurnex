'use client'

import { useState } from 'react'

export default function GenerateSlugsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const generateSlugs = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-slugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to generate slugs')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Generate Slugs
          </h1>
          
          <p className="text-gray-600 mb-6">
            This will generate slugs for all sector, character, and topic documents that don&apos;t have slugs yet.
          </p>

          <button
            onClick={generateSlugs}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {loading ? 'Generating Slugs...' : 'Generate Slugs'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-medium mb-2">
                {result.message}
              </h3>
              <div className="text-green-700 text-sm mb-2">
                <p>Sectors updated: {result.summary.sectors}</p>
                <p>Characters updated: {result.summary.characters}</p>
                <p>Topics updated: {result.summary.topics}</p>
              </div>
              {result.results && result.results.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Details:</h4>
                  <ul className="text-sm space-y-1">
                    {result.results.map((item, index) => (
                      <li key={index} className="text-green-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 