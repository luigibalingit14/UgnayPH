import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function callNvidia(prompt: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY not set (check .env.local)");
  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const job_type = searchParams.get("job_type");

    let query = supabase
      .from("job_listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (region) query = query.eq("region", region);
    if (job_type) query = query.eq("job_type", job_type);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, jobs: data || [] });
  } catch (err) {
    console.error("jobs GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // AI Skill Matcher
    if (body.ai_match) {
      const prompt = `You are a career advisor for the Philippine job market.
A Filipino job seeker has the following skills: ${body.skills}

Based on these skills, provide:
1. Top 5 most suitable job roles in the Philippines (with brief explanation)
2. Industries they should target
3. 2-3 specific tips to improve their employability in the Philippine market
4. One in-demand skill they should consider learning

Write in a motivating, friendly tone mixing Tagalog and English. Be specific to the Philippine context.`;
      const result = await callNvidia(prompt);
      return NextResponse.json({ success: true, ai_result: result });
    }

    // Post a job listing
    const { title, company, location, job_type, salary_min, salary_max, description, requirements, skills, region, contact_email } = body;
    if (!title?.trim() || !company?.trim() || !description?.trim() || !location?.trim()) {
      return NextResponse.json({ success: false, error: "Required fields missing" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("job_listings")
      .insert({
        title, company, location, job_type: job_type || "full_time",
        salary_min: salary_min || null, salary_max: salary_max || null,
        description, requirements: requirements || null,
        skills: Array.isArray(skills) ? skills : (skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
        region: region || "NCR",
        contact_email: contact_email || null,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, job: data });
  } catch (err) {
    console.error("jobs POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}
