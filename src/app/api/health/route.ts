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
    const search = searchParams.get("search");

    let query = supabase
      .from("health_centers")
      .select("*")
      .order("name", { ascending: true })
      .limit(50);

    if (region) query = query.eq("region", region);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, centers: data || [] });
  } catch (err) {
    console.error("health GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch health centers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Appointment booking
    if (body.appointment) {
      const { patient_name, contact_number, concern, preferred_date, health_center_id } = body;
      if (!patient_name?.trim() || !contact_number?.trim() || !concern?.trim() || !preferred_date) {
        return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
      }
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("health_appointments")
        .insert({ patient_name, contact_number, concern, preferred_date, health_center_id: health_center_id || null, user_id: user?.id || null })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, appointment: data });
    }

    // AI Symptom Checker
    const { symptoms } = body;
    if (!symptoms?.trim()) {
      return NextResponse.json({ success: false, error: "Symptoms required" }, { status: 400 });
    }

    const prompt = `You are a Filipino healthcare information assistant (NOT a doctor). 
A patient describes these symptoms: "${symptoms}"

Provide a helpful, responsible response that includes:
1. Possible common conditions that match these symptoms (in the Philippine context)
2. Home care tips that are generally safe
3. Clear advice on when to seek immediate medical attention (emergency signs)
4. Which type of healthcare facility to visit (barangay health center, RHU, or hospital)
5. A reminder that this is informational only and not medical advice

Write in Taglish (Filipino + English mix), warm and empathetic tone. Keep under 250 words.
⚠️ Always start with a clear disclaimer that this is not a substitute for professional medical advice.`;

    const result = await callNvidia(prompt);
    return NextResponse.json({ success: true, ai_result: result });
  } catch (err) {
    console.error("health POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}
