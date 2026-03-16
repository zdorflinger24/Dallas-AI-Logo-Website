import { useState } from 'react'
import { generateLogos } from '../api/logoApi'

export default function useLogoGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const generate = async (params) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const data = await generateLogos(params)
      setResults(data.variants)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, results, generate }
}
