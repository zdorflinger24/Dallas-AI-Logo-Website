import JSZip from 'jszip'

function downloadImage(b64, filename) {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${b64}`
  link.download = filename
  link.click()
}

async function downloadAll(variants, companyName) {
  const zip = new JSZip()
  const safeName = companyName.replace(/[^a-zA-Z0-9]/g, '_')

  variants.forEach((v) => {
    const filename = `${safeName}_${v.format}_${v.background}.png`
    const binaryStr = atob(v.image_b64)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    zip.file(filename, bytes)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${safeName}_logos.zip`
  link.click()
  URL.revokeObjectURL(link.href)
}

const LABELS = {
  square: 'Square',
  rectangular: 'Rectangular',
  light: 'Light BG',
  dark: 'Dark BG',
}

export default function LogoResults({ variants, companyName }) {
  if (!variants || variants.length === 0) return null

  const square = variants.filter((v) => v.format === 'square')
  const rectangular = variants.filter((v) => v.format === 'rectangular')

  return (
    <div className="logo-results">
      <div className="results-header">
        <h2>Your Logos</h2>
        <button
          type="button"
          className="btn-download-all"
          onClick={() => downloadAll(variants, companyName)}
        >
          Download All (ZIP)
        </button>
      </div>

      <div className="results-section">
        <h3>Square Format</h3>
        <div className="results-row">
          {square.map((v) => (
            <div key={`${v.format}_${v.background}`} className={`result-card bg-${v.background}`}>
              <span className="result-label">{LABELS[v.background]}</span>
              <img
                src={`data:image/png;base64,${v.image_b64}`}
                alt={`${v.format} logo on ${v.background} background`}
              />
              <button
                type="button"
                className="btn-download"
                onClick={() =>
                  downloadImage(v.image_b64, `${companyName}_${v.format}_${v.background}.png`)
                }
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="results-section">
        <h3>Rectangular / Horizontal Format</h3>
        <div className="results-row">
          {rectangular.map((v) => (
            <div key={`${v.format}_${v.background}`} className={`result-card bg-${v.background}`}>
              <span className="result-label">{LABELS[v.background]}</span>
              <img
                src={`data:image/png;base64,${v.image_b64}`}
                alt={`${v.format} logo on ${v.background} background`}
              />
              <button
                type="button"
                className="btn-download"
                onClick={() =>
                  downloadImage(v.image_b64, `${companyName}_${v.format}_${v.background}.png`)
                }
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
