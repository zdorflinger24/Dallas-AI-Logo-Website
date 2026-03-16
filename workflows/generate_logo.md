# Logo Generation Workflow

## Objective
Generate professional branded logos from user input (sketch, file upload, or text description) in 4 variants: square/rectangular x light/dark backgrounds.

## Required Inputs
- **Input mode**: One of `sketch`, `upload`, or `text`
- **Company name**: Required string
- **Brand colors**: Array of hex color strings (2-5 colors)
- **Image file** (optional): PNG/JPG sketch or reference image (for sketch/upload modes)
- **Text description** (optional): Natural language description of desired logo

## Tools Used
1. `tools/prompt_templates.py` - Constructs variant-specific prompts
2. `tools/gemini_logo_gen.py` - Calls Gemini API to generate images
3. `tools/api_server.py` - Exposes HTTP endpoint for the frontend

## Process
1. Frontend collects user input and sends multipart form data to `/api/generate-logo`
2. Backend parses input and builds 4 variant-specific prompts
3. 4 parallel Gemini API calls generate images (square light, square dark, rectangular light, rectangular dark)
4. Backend returns base64-encoded PNGs to frontend
5. Frontend displays 2x2 grid with download options

## Expected Output
JSON response with 4 logo variants, each as a base64 PNG string.

## Edge Cases
- **Gemini content filter**: If a prompt is rejected, return a descriptive error to the user
- **Rate limiting**: Retry with exponential backoff (max 3 retries)
- **Text rendering**: AI may misspell company names — noted as a known limitation
- **Color accuracy**: Colors are approximate; prompt emphasizes "use ONLY these colors"
