import { useState } from 'react'
import InputPanel from './components/InputPanel'
import LogoResults from './components/LogoResults'
import useLogoGeneration from './hooks/useLogoGeneration'

export default function App() {
  const { loading, error, results, generate } = useLogoGeneration()
  const [companyName, setCompanyName] = useState('')

  const handleGenerate = (params) => {
    setCompanyName(params.companyName)
    generate(params)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <img src="/dallasailogo.png" alt="Dallas AI" className="header-logo" />
          <div>
            <h1>Dallas AI Logo Generator</h1>
            <p>Create professional branded logos with AI</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="panel-left">
          <InputPanel onGenerate={handleGenerate} loading={loading} />
        </div>

        <div className="panel-right">
          {error && (
            <div className="error-banner">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner-large" />
              <p>Generating 4 logo variants...</p>
              <p className="loading-hint">This may take 15-30 seconds</p>
            </div>
          )}

          {!loading && results && (
            <LogoResults variants={results} companyName={companyName} />
          )}

          {!loading && !results && !error && (
            <div className="empty-state">
              <div className="empty-icon">&#127912;</div>
              <h3>Your logos will appear here</h3>
              <p>Fill in your brand details and choose an input method to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
