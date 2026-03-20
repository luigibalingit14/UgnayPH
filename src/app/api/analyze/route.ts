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

// Gemini models - NO LONGER USED
// const GEMINI_VISION_MODELS = [...];
// const GEMINI_TEXT_MODELS = [...];

// Try Claude API (Anthropic)
async function tryClaude(prompt: string, apiKey: string, imageData?: string, mimeType?: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    console.log("Trying Claude API...");

    const messageContent: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [
      { type: "text", text: prompt }
    ];

    if (imageData && mimeType) {
      console.log("Claude: Adding image to request");
      messageContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType,
          data: imageData
        }
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [{ role: "user", content: messageContent }],
      }),
    });

    console.log(`Claude response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude error:", JSON.stringify(errorData, null, 2));
      return { success: false, error: errorData.error?.message || "Claude API error" };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (text) {
      console.log("✓ Success with Claude API");
      return { success: true, text };
    }

    return { success: false, error: "Empty response from Claude" };
  } catch (error) {
    console.error("Claude exception:", error);
    return { success: false, error: String(error) };
  }
}

// Try Groq API (fallback)
async function tryGroq(prompt: string, apiKey: string, imageData?: string, mimeType?: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    console.log("Trying Groq API as fallback...");

    let fullPrompt = prompt;
    if (imageData && mimeType) {
      console.log("Groq: Using image data in prompt");
      fullPrompt = `${prompt}\n\n[Image Data: ${mimeType}]\nBase64: ${imageData.substring(0, 100)}...`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    console.log(`Groq response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq error:", JSON.stringify(errorData, null, 2));
      return { success: false, error: errorData.error?.message || "Groq API error" };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (text) {
      console.log("✓ Success with Groq API");
      return { success: true, text };
    }

    return { success: false, error: "Empty response from Groq" };
  } catch (error) {
    console.error("Groq exception:", error);
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

    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!claudeKey && !groqKey) {
      return NextResponse.json(
        { success: false, error: "No API keys configured. Add ANTHROPIC_API_KEY or GROQ_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    let responseText: string | undefined;
    let provider = "";

    if (isImageAnalysis) {
      // Image analysis - try Claude first, then Groq as fallback
      const imagePrompt = IMAGE_ANALYSIS_PROMPT.replace("{FORMAT_INSTRUCTIONS}", FORMAT_INSTRUCTIONS);

      if (claudeKey) {
        console.log("Attempting image analysis with Claude...");
        const claudeResult = await tryClaude(imagePrompt, claudeKey, imageData, imageMimeType);
        if (claudeResult.success && claudeResult.text) {
          responseText = claudeResult.text;
          provider = "claude";
        }
      }

      // Fallback to Groq if Claude failed
      if (!responseText && groqKey) {
        console.log("Claude failed, trying Groq as fallback...");
        const groqResult = await tryGroq(imagePrompt, groqKey, imageData, imageMimeType);
        if (groqResult.success && groqResult.text) {
          responseText = groqResult.text;
          provider = "groq";
        }
      }
    } else {
      // Text analysis - try Claude first, then Groq as fallback
      const textPrompt = TEXT_ANALYSIS_PROMPT
        .replace("{CONTENT}", content)
        .replace("{FORMAT_INSTRUCTIONS}", FORMAT_INSTRUCTIONS);

      if (claudeKey) {
        const claudeResult = await tryClaude(textPrompt, claudeKey);
        if (claudeResult.success && claudeResult.text) {
          responseText = claudeResult.text;
          provider = "claude";
        }
      }

      // Fallback to Groq if Claude failed
      if (!responseText && groqKey) {
        console.log("Claude failed, trying Groq as fallback...");
        const groqResult = await tryGroq(textPrompt, groqKey);
        if (groqResult.success && groqResult.text) {
          responseText = groqResult.text;
          provider = "groq";
        }
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
