import { useRef, useState } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'

export default function SketchCanvas({ canvasRef }) {
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [eraseMode, setEraseMode] = useState(false)

  const toggleEraser = () => {
    const next = !eraseMode
    setEraseMode(next)
    canvasRef.current?.eraseMode(next)
  }

  return (
    <div className="sketch-panel">
      <div className="sketch-toolbar">
        <div className="toolbar-group">
          <label>Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
          />
        </div>
        <div className="toolbar-group">
          <label>Size</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </div>
        <button
          type="button"
          className={`btn-tool ${eraseMode ? 'active' : ''}`}
          onClick={toggleEraser}
        >
          Eraser
        </button>
        <button
          type="button"
          className="btn-tool"
          onClick={() => canvasRef.current?.undo()}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn-tool"
          onClick={() => canvasRef.current?.redo()}
        >
          Redo
        </button>
        <button
          type="button"
          className="btn-tool"
          onClick={() => canvasRef.current?.clearCanvas()}
        >
          Clear
        </button>
      </div>
      <div className="sketch-canvas-wrapper">
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="400px"
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          canvasColor="#ffffff"
          style={{ border: '2px solid #e0e0e0', borderRadius: '8px' }}
        />
      </div>
    </div>
  )
}
