import { useState } from 'react'

export default function BrandingInputs({ companyName, setCompanyName, colors, setColors }) {
  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#3366cc'])
    }
  }

  const removeColor = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index))
    }
  }

  const updateColor = (index, value) => {
    const updated = [...colors]
    updated[index] = value
    setColors(updated)
  }

  return (
    <div className="branding-inputs">
      <div className="form-group">
        <label htmlFor="company-name">Company / Brand Name *</label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          required
        />
      </div>

      <div className="form-group">
        <label>Brand Colors</label>
        <div className="color-palette">
          {colors.map((color, index) => (
            <div key={index} className="color-slot">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
              />
              <span className="color-hex">{color}</span>
              {colors.length > 1 && (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => removeColor(index)}
                  title="Remove color"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {colors.length < 5 && (
            <button type="button" className="btn-add-color" onClick={addColor}>
              + Add Color
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
