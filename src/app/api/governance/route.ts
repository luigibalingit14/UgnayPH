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
    const category = searchParams.get("category");

    let query = supabase
      .from("governance_complaints")
      .select("*")
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, complaints: data || [] });
  } catch (err) {
    console.error("governance GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Upvote
    if (body.upvote && body.complaint_id) {
      const supabase = await createClient();
      const { data: current } = await supabase
        .from("governance_complaints")
        .select("upvotes")
        .eq("id", body.complaint_id)
        .single();
      await supabase
        .from("governance_complaints")
        .update({ upvotes: (current?.upvotes || 0) + 1 })
        .eq("id", body.complaint_id);
      return NextResponse.json({ success: true });
    }

    // AI Draft
    if (body.ai_draft) {
      const prompt = `You are a civic engagement assistant helping Filipino citizens file formal complaints to government agencies.
Write a clear, professional, and polite complaint letter body (3 paragraphs, in English) about the following issue:
Category: ${body.category || "infrastructure"}
Issue title: ${body.title}
The complaint should be formal yet accessible, cite the citizen's right to good governance under Philippine law, and request specific action. Keep it under 200 words.`;
      const draft = await callGemini(prompt);
      return NextResponse.json({ success: true, ai_draft: draft });
    }

    // Submit complaint
    const { title, description, category, location, agency, is_anonymous } = body;
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("governance_complaints")
      .insert({ title, description, category: category || "other", location: location || null, agency: agency || null, is_anonymous: is_anonymous || false })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, complaint: data });
  } catch (err) {
    console.error("governance POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to submit complaint" }, { status: 500 });
  }
}
