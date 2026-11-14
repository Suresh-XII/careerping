// Supabase Edge Function: generate-job-article
// Secure server-side invocation of Google Gemini API
// Authorizes incoming Supabase JWT token before executing AI generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface JobInputPayload {
  title: string;
  company: string;
  category?: string;
  location?: string;
  qualification?: string;
  experience?: string;
  salary?: string;
  source_notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify User Authorization via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header. Admin authentication required." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate the token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired administrator session." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if the user is in admin_users or has super_admin email
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAuthorized = adminRecord || user.email?.includes("admin") || user.email?.endsWith("@careerping.live") || user.email?.endsWith("@careerping.in");
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only authorized administrators can generate AI job content." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Parse Incoming Job Details
    const payload: JobInputPayload = await req.json();
    if (!payload.title || !payload.company) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title and company." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Retrieve Gemini API Key from Supabase Secret
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "GEMINI_API_KEY secret is not configured in Supabase. Please add it in Project Settings -> Edge Functions -> Secrets.",
          fallbackRequired: true
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Construct Prompt with Strict Anti-Hallucination Constraints
    const systemPrompt = `You are an expert technical recruiter and editorial writer for Careerping, India's verified job information portal.
Your task is to write a professional, highly readable, factual job announcement based ONLY on the verified inputs provided below.

STRICT EDITORIAL RULES:
1. Do NOT invent or hallucinate salary numbers, qualifications, application links, or interview rounds if they are not provided or verified.
2. If salary or qualification is missing or marked "Not disclosed", clearly write "Not disclosed" or reflect standard expectations honestly.
3. Target audience: Indian candidates (freshers and experienced tech professionals).
4. Do not fabricate company history or fake employee testimonials.
5. Produce the response strictly as valid, raw JSON (no markdown fences, no \`\`\`json wrappers) matching this schema:
{
  "description": "2-3 well-structured paragraphs explaining the role, team context, and work environment.",
  "responsibilities": ["List item 1", "List item 2", "List item 3", "List item 4", "List item 5"],
  "required_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "eligibility": ["Criteria 1", "Criteria 2", "Criteria 3"],
  "selection_process": ["Round 1 details", "Round 2 details", "Round 3 details"]
}`;

    const userPrompt = `Verified Vacancy Inputs:
- Job Title: ${payload.title}
- Company: ${payload.company}
- Category: ${payload.category || "IT & Software"}
- Location: ${payload.location || "Bengaluru / Hybrid"}
- Educational Qualification: ${payload.qualification || "Relevant degree"}
- Experience Level: ${payload.experience || "0 - 2 Years"}
- Salary / CTC: ${payload.salary || "Not disclosed"}
- Additional Notes: ${payload.source_notes || "None provided"}

Generate the structured JSON job article now.`;

    // 5. Call Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for high factual accuracy
          maxOutputTokens: 1500,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          error: `Gemini API error (${response.status}): ${errorText}`,
          fallbackRequired: true 
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await response.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: "Gemini returned empty content.", fallbackRequired: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean any potential markdown wrappers if returned
    let cleanJsonStr = generatedText.trim();
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const structuredArticle = JSON.parse(cleanJsonStr);

    return new Response(
      JSON.stringify({
        success: true,
        source: "gemini-1.5-flash",
        data: structuredArticle
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error during AI generation", fallbackRequired: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
