export default function TextInput({ value, onChange }) {
  return (
    <div className="text-input-panel">
      <label htmlFor="logo-description">Describe Your Logo</label>
      <textarea
        id="logo-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your ideal logo: style, imagery, mood, symbols, themes...&#10;&#10;Example: A modern, minimalist logo with a mountain silhouette and a rising sun, conveying innovation and growth."
        rows={6}
      />
    </div>
  )
}
