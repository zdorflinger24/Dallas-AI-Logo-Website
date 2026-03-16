export async function generateLogos({ inputMode, companyName, colors, textDescription, imageFile }) {
  const formData = new FormData()
  formData.append('input_mode', inputMode)
  formData.append('company_name', companyName)
  formData.append('colors', JSON.stringify(colors))
  if (textDescription) formData.append('text_description', textDescription)
  if (imageFile) formData.append('image_file', imageFile)

  const response = await fetch('/api/generate-logo', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `Server error: ${response.status}`)
  }

  return response.json()
}
