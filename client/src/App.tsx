import { useEffect, useState } from 'react'
import { fetchHealth } from './api'
import type { HealthResponse } from './api'
import './App.css'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        setHealth(data)
        setError(null)
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to connect to backend')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>Todo API Client</h1>
      <div className="status-container">
        <h2>Backend Status:</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {health && (
          <pre data-testid="health-response">
            {JSON.stringify(health, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default App
