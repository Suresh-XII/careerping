import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { JobCategory } from '../types/job';

export interface AIArticleInput {
  title: string;
  company: string;
  category: JobCategory;
  location?: string;
  qualification?: string;
  experience?: string;
  salary?: string;
  source_notes?: string;
}

export interface AIArticleOutput {
  description: string;
  responsibilities: string[];
  required_skills: string[];
  eligibility: string[];
  selection_process: string[];
  source: 'gemini-api' | 'local-fallback';
}

/**
 * High-quality deterministic editorial template engine for when Gemini API key is not yet configured
 */
export const generateLocalFallbackArticle = (input: AIArticleInput): AIArticleOutput => {
  const isCyber = input.category === 'Cybersecurity';
  const isFresher = input.category === 'Freshers' || (input.experience || '').toLowerCase().includes('fresher') || (input.experience || '').includes('0 -');
  const isIntern = input.category === 'Internships';
  const isGovt = input.category === 'Government Jobs';

  let description = `${input.company} has announced an official recruitment notification for the position of ${input.title} based in ${input.location || 'India'}. Careerping has verified this notice against official corporate career channels.\n\n`;

  if (isCyber) {
    description += `As part of the cybersecurity team, the selected candidate will play a critical role in threat monitoring, vulnerability triage, incident remediation, and defending enterprise digital assets against emerging cyber attack vectors.`;
  } else if (isFresher) {
    description += `This role offers early-career engineers and graduates an intensive learning curve with structured mentorship, enterprise software development cycles, and exposure to production-grade architectures.`;
  } else if (isIntern) {
    description += `This internship is designed for enrolled undergraduate and postgraduate students seeking immersive hands-on industry experience, collaborative project ownership, and potential pre-placement offer (PPO) opportunities.`;
  } else if (isGovt) {
    description += `This opening represents a prestigious opportunity within the public sector to contribute toward high-reliability engineering, national missions, and public service infrastructure.`;
  } else {
    description += `The successful candidate will collaborate closely with cross-functional engineering, infrastructure, and product management teams to deliver resilient, scalable software systems.`;
  }

  let responsibilities: string[] = [];
  if (isCyber) {
    responsibilities = [
      `Monitor and analyze security telemetry across SIEM, EDR, and network firewall logs.`,
      `Investigate verified suspicious alerts, unauthorized access anomalies, and phishing attempts.`,
      `Execute standard incident response playbooks and escalate confirmed breaches to Tier-2/Tier-3 engineers.`,
      `Perform periodic vulnerability scans and track patch remediation across client endpoints.`,
      `Document forensic observations, investigation timelines, and post-incident remediation reports.`
    ];
  } else if (isFresher) {
    responsibilities = [
      `Develop, test, and maintain software components according to enterprise coding standards.`,
      `Participate actively in sprint planning, code reviews, and defect triage sessions.`,
      `Write clean, well-documented unit tests and assist in deployment pipeline maintenance.`,
      `Collaborate with senior technical leads to troubleshoot and resolve production issues.`,
      `Complete scheduled onboarding modules and domain-specific technical certifications.`
    ];
  } else {
    responsibilities = [
      `Design and implement scalable software services aligned with enterprise architecture guidelines.`,
      `Analyze business requirements and translate them into modular, high-performance code.`,
      `Optimize existing systems for high availability, low latency, and robust error handling.`,
      `Collaborate across engineering squads to maintain rigorous automated testing coverage.`,
      `Provide technical documentation and support during major production release cycles.`
    ];
  }

  let required_skills: string[] = [];
  if (isCyber) {
    required_skills = ['SIEM (Splunk / Sentinel)', 'TCP/IP & OSI Protocols', 'Wireshark Log Analysis', 'Incident Response', 'Python / PowerShell Scripting', 'MITRE ATT&CK Framework'];
  } else if (isFresher) {
    required_skills = ['Java or Python or C++', 'Data Structures & Algorithms', 'Relational Database (SQL)', 'Git Version Control', 'Object-Oriented Programming (OOP)', 'Basic Linux Commands'];
  } else {
    required_skills = ['TypeScript / JavaScript', 'React / Modern Frontend Framework', 'RESTful API Architecture', 'Cloud Fundamentals (AWS / Azure)', 'Automated Unit Testing', 'CI/CD Pipelines'];
  }

  const eligibility = [
    `Degree requirement: ${input.qualification || 'B.Tech / B.E / BCA / MCA / B.Sc in CS or relevant discipline'}.`,
    `Experience: ${input.experience || 'As specified in the official notification'}.`,
    `Minimum 60% aggregate or equivalent CGPA throughout academic career with zero active backlogs.`
  ];

  const selection_process = isGovt
    ? [
        `Round 1: Written Examination / National Screening Score Evaluation`,
        `Round 2: Technical Subject Interview & Document Verification`,
        `Round 3: Medical Fitness & Final Merit Allocation`
      ]
    : [
        `Round 1: Online Cognitive & Domain Assessment (MCQ + Coding/Technical)`,
        `Round 2: Technical Interview - Hands-on Problem Solving & System Fundamentals`,
        `Round 3: HR Discussion, Background Check, and Offer Formulation`
      ];

  return {
    description,
    responsibilities,
    required_skills,
    eligibility,
    selection_process,
    source: 'local-fallback'
  };
};

/**
 * Primary Generator: Attempts Supabase Edge Function (Gemini), falls back gracefully if not configured
 */
export const generateJobArticleWithAI = async (input: AIArticleInput): Promise<AIArticleOutput> => {
  if (!isSupabaseConfigured) {
    // If Supabase credentials are not live, use local fallback
    return generateLocalFallbackArticle(input);
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-job-article', {
      body: input
    });

    if (error || !data || !data.success || !data.data) {
      console.warn('Edge Function returned non-success, falling back to local generator:', error || data?.error);
      return generateLocalFallbackArticle(input);
    }

    const aiData = data.data;
    return {
      description: aiData.description || '',
      responsibilities: Array.isArray(aiData.responsibilities) ? aiData.responsibilities : [],
      required_skills: Array.isArray(aiData.required_skills) ? aiData.required_skills : [],
      eligibility: Array.isArray(aiData.eligibility) ? aiData.eligibility : [],
      selection_process: Array.isArray(aiData.selection_process) ? aiData.selection_process : [],
      source: 'gemini-api'
    };
  } catch (err) {
    console.warn('Supabase Edge Function invocation failed, falling back:', err);
    return generateLocalFallbackArticle(input);
  }
};
