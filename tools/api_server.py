"""FastAPI server for the Dallas AI Logo Generator."""

import io
import json
import sys
import os

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# Add tools directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from gemini_logo_gen import generate_logo_variants

app = FastAPI(title="Dallas AI Logo Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/generate-logo")
async def generate_logo(
    input_mode: str = Form(...),
    company_name: str = Form(...),
    colors: str = Form(...),
    text_description: str = Form(None),
    image_file: UploadFile = File(None),
):
    """Generate 4 logo variants from user input.

    Args:
        input_mode: "sketch", "upload", or "text"
        company_name: Brand/company name (required)
        colors: JSON array of hex color strings, e.g. '["#FF5733","#1A1A2E"]'
        text_description: Optional text description of desired logo
        image_file: Optional image file (sketch or reference photo)
    """
    # Parse colors
    try:
        color_list = json.loads(colors)
        if not isinstance(color_list, list) or len(color_list) < 1:
            raise ValueError("Need at least one color")
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid colors: {e}")

    if not company_name.strip():
        raise HTTPException(status_code=400, detail="Company name is required")

    # Process reference image if provided
    reference_image = None
    if image_file and input_mode in ("sketch", "upload"):
        try:
            image_data = await image_file.read()
            reference_image = Image.open(io.BytesIO(image_data)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    # Generate logos
    try:
        variants = await generate_logo_variants(
            company_name=company_name.strip(),
            colors=color_list,
            text_description=text_description,
            reference_image=reference_image,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "variants": [
            {"format": "square", "background": "light", "image_b64": variants["square_light"]},
            {"format": "square", "background": "dark", "image_b64": variants["square_dark"]},
            {"format": "rectangular", "background": "light", "image_b64": variants["rectangular_light"]},
            {"format": "rectangular", "background": "dark", "image_b64": variants["rectangular_dark"]},
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
