"""Prompt construction for logo generation variants."""
from __future__ import annotations

# Common color name mappings for better prompt quality
HEX_TO_NAME = {
    "#000000": "black", "#ffffff": "white", "#ff0000": "red",
    "#00ff00": "green", "#0000ff": "blue", "#ffff00": "yellow",
    "#ff00ff": "magenta", "#00ffff": "cyan", "#808080": "gray",
    "#800000": "maroon", "#808000": "olive", "#008000": "dark green",
    "#800080": "purple", "#008080": "teal", "#000080": "navy",
    "#ffa500": "orange", "#ffc0cb": "pink", "#a52a2a": "brown",
    "#f5f5f5": "off-white", "#333333": "dark gray", "#666666": "medium gray",
    "#1a1a2e": "near-black", "#e0e0e0": "light gray",
}


def _color_description(hex_color: str) -> str:
    """Convert a hex color to a descriptive string like 'vibrant red (#FF0000)'."""
    normalized = hex_color.lower().strip()
    name = HEX_TO_NAME.get(normalized)
    if name:
        return f"{name} ({hex_color})"
    return hex_color


def build_prompt(
    company_name: str,
    colors: list[str],
    aspect: str,
    background: str,
    text_description: str | None = None,
    has_reference_image: bool = False,
) -> str:
    """Build a logo generation prompt for a specific variant.

    Args:
        company_name: The brand/company name to include in the logo.
        colors: List of hex color strings (e.g. ["#FF5733", "#1A1A2E"]).
        aspect: "square" or "rectangular".
        background: "light" or "dark".
        text_description: Optional user description of desired logo.
        has_reference_image: Whether a reference image is being provided.

    Returns:
        The prompt string for Gemini.
    """
    color_list = ", ".join(_color_description(c) for c in colors)

    if background == "light":
        bg_instruction = (
            "Use a clean white (#FFFFFF) background. "
            "Ensure all logo elements have strong contrast against the white background."
        )
    else:
        bg_instruction = (
            "Use a dark, near-black (#1A1A2E) background. "
            "Adjust logo element colors for strong contrast and readability against the dark background. "
            "Use lighter tints of the brand colors if needed for visibility."
        )

    if aspect == "square":
        format_instruction = (
            "The logo should be square (1:1 aspect ratio). "
            "Center the icon/symbol with the company name text below or integrated into the design. "
            "Balance all elements within a square frame."
        )
    else:
        format_instruction = (
            "The logo MUST be in a wide horizontal/landscape layout. "
            "The image should be roughly 3x wider than it is tall. "
            "Place a small icon/symbol on the left and the company name as large horizontal text to the right. "
            "Do NOT stack elements vertically — everything should flow left-to-right in a single horizontal row. "
            "This is a banner-style logo for a website header or letterhead."
        )

    user_desc = ""
    if text_description:
        user_desc = f"\nLogo concept from the user: {text_description}\n"

    ref_instruction = ""
    if has_reference_image:
        ref_instruction = (
            "\nA reference image is attached. Use it as inspiration for the logo design. "
            "Incorporate its key visual elements, shapes, or concept into a polished, professional logo.\n"
        )

    prompt = f"""Design a professional, clean logo for a company called "{company_name}".

Brand colors (use ONLY these colors in the design): {color_list}

Style requirements:
- Professional, modern logo suitable for business use
- Clean, flat, vector-style design (no photorealism, no gradients, no complex textures)
- The company name "{company_name}" MUST appear as legible text in the logo — spell it exactly
- Simple, scalable design that works at any size
- {bg_instruction}
- {format_instruction}
{user_desc}{ref_instruction}
Output ONLY the logo image with no extra text, borders, mockups, or watermarks."""

    return prompt
