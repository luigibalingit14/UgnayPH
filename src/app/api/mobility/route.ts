import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function callGemini(prompt: string): Promise<string> {
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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    let query = supabase
      .from("mobility_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (city) query = query.eq("city", city);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, reports: data || [] });
  } catch (err) {
    console.error("mobility GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Upvote action
    if (body.upvote && body.report_id) {
      const supabase = await createClient();
      const { data: current } = await supabase
        .from("mobility_reports")
        .select("upvotes")
        .eq("id", body.report_id)
        .single();
      await supabase
        .from("mobility_reports")
        .update({ upvotes: (current?.upvotes || 0) + 1 })
        .eq("id", body.report_id);
      return NextResponse.json({ success: true });
    }

    // AI Route Advisory
    if (body.ai_advice) {
      const prompt = `You are a traffic and route advisor for the Philippines. 
A traffic ${body.incident_type || "incident"} has been reported in ${body.city || "Metro Manila"}.
Provide 3-4 practical, specific alternate route suggestions and general commuter tips for Filipinos affected by this situation.
Write in a friendly, helpful tone mixing Tagalog and English. Keep it concise under 150 words.
Format as numbered list.`;
      const suggestion = await callGemini(prompt);
      return NextResponse.json({ success: true, ai_suggestion: suggestion });
    }

    // Submit report
    const { location, city, incident_type, severity, description } = body;
    if (!location || !incident_type || !severity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mobility_reports")
      .insert({ location, city: city || "Unknown", incident_type, severity, description: description || null })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, report: data });
  } catch (err) {
    console.error("mobility POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 });
  }
}
