const feedbackSchema = `
interface Feedback {
  overallScore: number;
  jobMatch: {
    score: number;
    summary: string;
  };
  skillsGap: {
    matched: string[];
    missing: string[];
  };
  ATS: {
    score: number;
    tips: { type: "good" | "improve"; tip: string }[];
  };
  toneAndStyle: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  content: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  structure: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  skills: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  improvements: string[];
}`;

export function buildAnalysisPrompt({
  jobTitle,
  jobDescription,
  companyName,
  resumeText,
}) {
  const jobContext = [
    companyName && `Company: ${companyName}`,
    jobTitle && `Role: ${jobTitle}`,
    jobDescription && `Job description:\n${jobDescription}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are an experienced recruiter and ATS specialist.

Analyze the resume text below against the target role when provided.
Be direct and specific. Low scores are fine when warranted.

${jobContext || "No target job was provided — evaluate for general professional quality and ATS readiness."}

Resume text:
---
${resumeText.slice(0, 12000)}
---

Return ONE JSON object matching this TypeScript shape (no markdown, no extra text):
${feedbackSchema}

Rules:
- Scores are 0–100 integers.
- Include 3–4 tips per section where tips are listed.
- skillsGap.matched and skillsGap.missing should be short skill phrases (max 8 each).
- improvements: 4–6 concise, actionable bullets for the candidate.
- jobMatch.summary: 2–3 sentences on fit for the role.`;
}
