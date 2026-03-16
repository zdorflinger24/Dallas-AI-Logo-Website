import { useState, useRef } from 'react'
import BrandingInputs from './BrandingInputs'
import TextInput from './TextInput'
import FileUpload from './FileUpload'
import SketchCanvas from './SketchCanvas'

const MODES = [
  { key: 'sketch', label: 'Sketch', icon: '&#9998;' },
  { key: 'upload', label: 'Upload', icon: '&#128206;' },
  { key: 'text', label: 'Describe', icon: '&#128172;' },
]

export default function InputPanel({ onGenerate, loading }) {
  const [mode, setMode] = useState('text')
  const [companyName, setCompanyName] = useState('')
  const [colors, setColors] = useState(['#2563eb', '#1e293b'])
  const [textDescription, setTextDescription] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const canvasRef = useRef(null)

  const canSubmit = companyName.trim().length > 0 && !loading && (
    mode === 'text' ? textDescription.trim().length >= 10 :
    mode === 'upload' ? uploadFile !== null :
    true // sketch mode — canvas may or may not have content
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageFile = null

    if (mode === 'sketch' && canvasRef.current) {
      const dataUrl = await canvasRef.current.exportImage('png')
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      imageFile = new File([blob], 'sketch.png', { type: 'image/png' })
    } else if (mode === 'upload' && uploadFile) {
      imageFile = uploadFile
    }

    onGenerate({
      inputMode: mode,
      companyName: companyName.trim(),
      colors,
      textDescription: textDescription.trim() || null,
      imageFile,
    })
  }

  return (
    <form className="input-panel" onSubmit={handleSubmit}>
      <h2>Create Your Logo</h2>

      <BrandingInputs
        companyName={companyName}
        setCompanyName={setCompanyName}
        colors={colors}
        setColors={setColors}
      />

      <div className="mode-tabs">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            className={`mode-tab ${mode === key ? 'active' : ''}`}
            onClick={() => setMode(key)}
          >
            <span dangerouslySetInnerHTML={{ __html: icon }} />{' '}
            {label}
          </button>
        ))}
      </div>

      <div className="mode-content">
        {mode === 'sketch' && <SketchCanvas canvasRef={canvasRef} />}
        {mode === 'upload' && <FileUpload file={uploadFile} setFile={setUploadFile} />}
        {mode === 'text' && <TextInput value={textDescription} onChange={setTextDescription} />}
      </div>

      {/* Additional description for sketch/upload modes */}
      {mode !== 'text' && (
        <div className="form-group">
          <label htmlFor="supplemental-desc">Additional Description (optional)</label>
          <textarea
            id="supplemental-desc"
            value={textDescription}
            onChange={(e) => setTextDescription(e.target.value)}
            placeholder="Add any extra details about the logo style you want..."
            rows={3}
          />
        </div>
      )}

      <button type="submit" className="btn-generate" disabled={!canSubmit}>
        {loading ? (
          <>
            <span className="spinner" /> Generating Logos...
          </>
        ) : (
          'Generate Logos'
        )}
      </button>
    </form>
  )
}
