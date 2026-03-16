import { useRef, useState } from 'react'

export default function FileUpload({ file, setFile }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const clear = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="file-upload-panel">
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="upload-preview">
            <img src={preview} alt="Uploaded reference" />
            <button type="button" className="btn-clear" onClick={(e) => { e.stopPropagation(); clear() }}>
              &times; Remove
            </button>
          </div>
        ) : (
          <div className="drop-zone-content">
            <span className="drop-icon">&#128206;</span>
            <p>Drop an image here or click to browse</p>
            <p className="drop-hint">PNG, JPG, SVG — sketches, photos, or references</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          hidden
        />
      </div>
    </div>
  )
}
