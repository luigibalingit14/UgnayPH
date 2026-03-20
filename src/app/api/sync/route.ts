import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Parser from "rss-parser";

async function callGeminiRaw(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function POST(request: NextRequest) {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://www.gmanetwork.com/news/rss/news/nation');
    
    // Take top 15 news items
    const recentNews = feed.items.slice(0, 15).map(item => `Title: ${item.title}\nDescription: ${item.contentSnippet || item.content}`).join("\n\n---\n\n");
    
    if (!recentNews) return NextResponse.json({ success: true, message: "No news found" });

    const prompt = `Here are the latest news headlines from the Philippines:
${recentNews}

Analyze these and extract any incidents ONLY related to:
1. Traffic, transportation, severe accidents, road closures, or floods (For Smart Mobility)
2. Public infrastructure damage, water/power outages, or major systemic governance issues (For Governance Watch)

Return a strictly valid JSON array of objects with the following schema:
[{
  "module": "mobility" | "governance",
  "location": "Specific location mentioned (e.g. EDSA, Quezon City) or 'Philippines' if general",
  "city": "Extract city name if available or 'Unknown'",
  "title": "Short title of the incident",
  "description": "Short explanation (Start with [AI Automated Report] )",
  "severity": "low" | "medium" | "high",
  "category": "traffic_jam" | "accident" | "road_closure" | "flooding" | "other" (for mobility) OR "infrastructure" | "corruption" | "public_service" | "environment" | "other" (for governance)
}]

If no relevant incidents are found, return an empty array [].
CRITICAL: Respond ONLY with raw valid JSON. Do not wrap in markdown or backticks.`;

    const rawResponse = await callGeminiRaw(prompt);
    
    // Clean up potential markdown formatting just in case
    const jsonString = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    let incidents = [];
    try {
      incidents = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", jsonString);
      return NextResponse.json({ success: false, error: "AI Parsing Error", raw: jsonString }, { status: 500 });
    }

    if (!Array.isArray(incidents) || incidents.length === 0) {
      return NextResponse.json({ success: true, message: "No relevant civic incidents found in current news." });
    }

    const supabase = await createClient();
    let inserted = 0;

    for (const incident of incidents) {
      if (incident.module === "mobility") {
        await supabase.from("mobility_reports").insert({
          location: incident.location,
          city: incident.city,
          incident_type: incident.category,
          severity: incident.severity,
          description: incident.description + ` (Source: GMA News RSS)`
        });
        inserted++;
      } else if (incident.module === "governance") {
        await supabase.from("governance_complaints").insert({
          title: incident.title,
          description: incident.description + ` (Source: GMA News RSS)`,
          category: incident.category,
          location: incident.location,
          agency: "Public News Alert",
          is_anonymous: true
        });
        inserted++;
      }
    }

    return NextResponse.json({ success: true, message: `Successfully synced ${inserted} real-time incidents from news.` });
  } catch (err) {
    console.error("Sync POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to sync real-time data" }, { status: 500 });
  }
}
