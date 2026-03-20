import { NextRequest, NextResponse } from "next/server";
import { VibeAnalysis, RedFlag, ContentCategory } from "@/types";

// Base prompt for text analysis
const TEXT_ANALYSIS_PROMPT = `You are VibeCheck PH, an AI assistant specialized in detecting disinformation, fake news, and scams targeting Filipinos. Analyze the following content and provide a comprehensive assessment.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no additional text.

Content to analyze:
"""
{CONTENT}
"""

{FORMAT_INSTRUCTIONS}`;

// Prompt for image analysis
const IMAGE_ANALYSIS_PROMPT = `You are VibeCheck PH, an AI assistant specialized in detecting disinformation, fake news, and scams targeting Filipinos. Analyze the image provided and determine if it contains any suspicious, fake, or scam content.

IMPORTANT:
1. First, read and extract ALL text visible in the image
2. Analyze the visual elements, layout, and design
3. Look for signs of manipulation, fake documents, or scam patterns
4. Respond ONLY with valid JSON. No markdown, no code blocks, no additional text.

Things to look for in Philippine context:
- Fake government documents/IDs (fake letterheads, wrong logos)
- Suspicious GCash/Maya/bank screenshots (edited amounts, fake transactions)
- Fake news graphics (no source, sensationalized headlines)
- Scam messages/chats (asking for OTP, MPIN, personal info)
- Fake job postings or promo announcements
- Manipulated photos or deepfakes
- Fake celebrity endorsements
- Impersonation of government agencies (PAGASA, DOH, SSS, Pag-IBIG, etc.)

{FORMAT_INSTRUCTIONS}`;

// Shared format instructions
const FORMAT_INSTRUCTIONS = `Analyze this content and return a JSON object with these exact fields:
{
  "score": <number 0-100, where 0=completely trustworthy, 100=definitely fake/scam>,
  "label": "<English label: SUPER LEGIT, MOSTLY SAFE, NEEDS CHECKING, SUSPICIOUS, or FAKE/SCAM ALERT>",
  "labelTagalog": "<Tagalog-English slang label: CHILL NA CHILL!, OKAY LANG 'TO, HMMMM... VERIFY MO MUNA, MEDYO SUS 'TO!, or SUS NA SUS! INGAT!>",
  "explanation": "<3 sentences in casual Pinoy-English (Taglish) explaining why this is trustworthy or suspicious. Be specific about the red flags or trust signals found.>",
  "redFlags": [
    {
      "type": "<one of: clickbait, emotional_manipulation, unverified_source, suspicious_url, fake_urgency, missing_context, impersonation, scam_patterns, misinformation, outdated_info, edited_image, fake_document>",
      "description": "<specific description in Taglish>",
      "severity": "<low, medium, or high>"
    }
  ],
  "literacyTips": [
    "<Tip 1 in Taglish - specific to this content>",
    "<Tip 2 in Taglish - actionable advice>",
    "<Tip 3 in Taglish - general digital literacy>"
  ],
  "confidence": <number 0-100 indicating how confident you are in this analysis>,
  "category": "<one of: news, social_media, advertisement, government, scam, satire, opinion, document, unknown>"
}

Guidelines for scoring:
- 0-20: Official verified sources, legitimate documents, established news outlets with citations
- 21-40: Generally trustworthy but may have minor issues or be opinion-based
- 41-60: Needs verification, contains some red flags but not definitively fake
- 61-80: Multiple red flags, likely misleading, manipulated, or suspicious
- 81-100: Clear fake news, scam, manipulated image, or dangerous misinformation

Red flags to look for (Philippine context):
- Excessive use of emojis, caps, or urgency words
- Claims of "insider info" or "reliable source" without naming them
- Asking for personal info, MPIN, OTP, or fees
- Too-good-to-be-true offers (instant millions, guaranteed returns)
- Impersonating government agencies (PAGASA, DOH, DepEd, SSS, Pag-IBIG, etc.)
- Fake celebrity endorsements
- Chain message patterns ("Share para maligtas")
- Suspicious URLs (not .gov.ph, misspelled official sites)
- Edited screenshots or manipulated images
- Fake documents with wrong logos, fonts, or formatting
- Inconsistent visual elements in images

Remember: Your analysis helps protect Filipinos from disinformation. Be accurate and helpful!`;

// NVIDIA API Integration
async function tryNvidia(prompt: string, apiKey: string, imageData?: string, mimeType?: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    console.log("Trying NVIDIA API...");

    // For image analysis, include image data in the message
    let messages;
    if (imageData && mimeType) {
      console.log("NVIDIA: Adding image to request");
      messages = [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageData}` } }
        ]
      }];
    } else {
      messages = [{ role: "user", content: prompt }];
    }

    // Use vision model for images, text model otherwise
    const model = imageData ? "nvidia/llama-3.2-nv-vision-instruct" : "meta/llama-3.1-8b-instruct";

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    console.log(`NVIDIA response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("NVIDIA error:", JSON.stringify(errorData, null, 2));
      return { success: false, error: errorData.error?.message || "NVIDIA API error" };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (text) {
      console.log("✓ Success with NVIDIA API");
      return { success: true, text };
    }

    return { success: false, error: "Empty response from NVIDIA" };
  } catch (error) {
    console.error("NVIDIA exception:", error);
    return { success: false, error: String(error) };
  }
}

// Parse AI response to VibeAnalysis
function parseResponse(text: string): VibeAnalysis {
  let cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Try to extract JSON from the text by finding the first { and last }
  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(cleanedText);

  return {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 50)),
    label: parsed.label || "NEEDS CHECKING",
    labelTagalog: parsed.labelTagalog || "HMMMM... VERIFY MO MUNA",
    explanation: parsed.explanation || "Analysis completed.",
    redFlags: Array.isArray(parsed.redFlags)
      ? parsed.redFlags.map((flag: RedFlag) => ({
          type: flag.type || "missing_context",
          description: flag.description || "",
          severity: flag.severity || "medium",
        }))
      : [],
    literacyTips: Array.isArray(parsed.literacyTips)
      ? parsed.literacyTips.slice(0, 3)
      : [
          "Always verify information from official sources.",
          "Check the URL carefully before clicking.",
          "Never share personal information online.",
        ],
    confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 70)),
    category: (parsed.category as ContentCategory) || "unknown",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, contentType, imageData, imageMimeType } = body;

    const isImageAnalysis = contentType === "image" && imageData && imageMimeType;

    // Validate request
    if (!isImageAnalysis && (!content || typeof content !== "string")) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    if (isImageAnalysis && (!imageData || !imageMimeType)) {
      return NextResponse.json(
        { success: false, error: "Image data and mime type are required for image analysis" },
        { status: 400 }
      );
    }

    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!nvidiaKey) {
      return NextResponse.json(
        { success: false, error: "No API key configured. Add NVIDIA_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    let responseText: string | undefined;
    let provider = "";

    if (isImageAnalysis) {
      // Image analysis with NVIDIA
      const imagePrompt = IMAGE_ANALYSIS_PROMPT.replace("{FORMAT_INSTRUCTIONS}", FORMAT_INSTRUCTIONS);

      console.log("Attempting image analysis with NVIDIA...");
      const nvidiaResult = await tryNvidia(imagePrompt, nvidiaKey, imageData, imageMimeType);
      if (nvidiaResult.success && nvidiaResult.text) {
        responseText = nvidiaResult.text;
        provider = "nvidia";
      }
    } else {
      // Text analysis with NVIDIA
      const textPrompt = TEXT_ANALYSIS_PROMPT
        .replace("{CONTENT}", content)
        .replace("{FORMAT_INSTRUCTIONS}", FORMAT_INSTRUCTIONS);

      const nvidiaResult = await tryNvidia(textPrompt, nvidiaKey);
      if (nvidiaResult.success && nvidiaResult.text) {
        responseText = nvidiaResult.text;
        provider = "nvidia";
      }
    }

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: "Failed to analyze content. Please check your API keys and try again." },
        { status: 503 }
      );
    }

    // Parse the response
    try {
      const analysis = parseResponse(responseText);
      return NextResponse.json({ success: true, analysis, provider });
    } catch (parseError) {
      console.error("Failed to parse AI response. Raw response:", responseText);
      console.error("Parse error details:", parseError);

      // Log more details for debugging
      if (isImageAnalysis) {
        console.error("Image analysis parse failed. Response length:", responseText.length);
        console.error("First 500 chars:", responseText.substring(0, 500));
      }

      return NextResponse.json(
        { success: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze content. Please try again." },
      { status: 500 }
    );
  }
}
