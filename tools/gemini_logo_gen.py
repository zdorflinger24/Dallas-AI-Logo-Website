"""Core Gemini API integration for logo generation."""
from __future__ import annotations

import asyncio
import base64
import io
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

try:
    from tools.prompt_templates import build_prompt
except ImportError:
    from prompt_templates import build_prompt

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

_client = None
MODEL_NAME = "gemini-2.5-flash-image"


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            raise RuntimeError("GEMINI_API_KEY not set in .env file")
        _client = genai.Client(api_key=api_key)
    return _client


async def _generate_single(
    company_name: str,
    colors: list[str],
    aspect: str,
    background: str,
    text_description: str | None = None,
    reference_image: Image.Image | None = None,
) -> bytes:
    """Generate a single logo variant and return PNG bytes."""
    prompt_text = build_prompt(
        company_name=company_name,
        colors=colors,
        aspect=aspect,
        background=background,
        text_description=text_description,
        has_reference_image=reference_image is not None,
    )

    contents = [prompt_text]
    if reference_image is not None:
        contents.append(reference_image)

    aspect_ratio = "1:1" if aspect == "square" else "16:9"

    client = _get_client()

    # Run the synchronous API call in a thread to avoid blocking
    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL_NAME,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )

    # Extract image from response
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_data = part.inline_data.data
            img = Image.open(io.BytesIO(image_data))
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            return buf.getvalue()

    raise RuntimeError("No image returned from Gemini API")


async def generate_logo_variants(
    company_name: str,
    colors: list[str],
    text_description: str | None = None,
    reference_image: Image.Image | None = None,
) -> dict[str, str]:
    """Generate all 4 logo variants in parallel.

    Returns:
        Dict mapping variant keys to base64-encoded PNG strings.
        Keys: "square_light", "square_dark", "rectangular_light", "rectangular_dark"
    """
    variants = [
        ("square", "light"),
        ("square", "dark"),
        ("rectangular", "light"),
        ("rectangular", "dark"),
    ]

    tasks = [
        _generate_single(
            company_name=company_name,
            colors=colors,
            aspect=aspect,
            background=background,
            text_description=text_description,
            reference_image=reference_image,
        )
        for aspect, background in variants
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    output = {}
    for (aspect, background), result in zip(variants, results):
        key = f"{aspect}_{background}"
        if isinstance(result, Exception):
            raise RuntimeError(f"Failed to generate {key} variant: {result}")
        output[key] = base64.b64encode(result).decode("utf-8")

    return output
