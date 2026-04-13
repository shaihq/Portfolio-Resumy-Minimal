import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const ANAM_API_KEY = "MTI0ZDNkNjctYjQ0ZS00ZjMzLWJmOTAtYjViZWJjYzdmNWM5OllrU0hvQXVNRkI0TFZQMVMrdXdXbWZoMUY5UGxUQzAzNkExWHlTd213V0E9";
const ANAM_API_BASE = "https://api.anam.ai";
const KEVIN_PERSONA_ID = "c8b32c49-b004-4887-86ee-2235f2c2c8e9";

function buildSystemPrompt(company: string, role: string, description: string): string {
  return `You are Kevin, a hiring manager at ${company} interviewing a candidate for the ${role} position.

Here is the job description:
${description}

Your goal is to conduct a realistic, conversational mock interview tailored to this role and company. Ask 5–7 thoughtful interview questions, one at a time, based on what ${company} would care about for this ${role} position.

Start by introducing yourself warmly — say your name is Kevin and you are part of the ${company} hiring team — then ask the candidate to briefly introduce themselves.

After that, ask questions that directly connect to the job description above. Focus on:
- Portfolio work and past projects that relate to the responsibilities in this role
- Product thinking and how they approach the problems ${company} is working on
- Design process, decision-making, and how they handle ambiguity
- Collaboration with engineers, PMs, and stakeholders
- Any specific skills or tools called out in the job description

Listen carefully to each answer. Ask a natural follow-up or probe deeper before moving to the next question. Keep the conversation specific to this role — do not ask generic questions if the JD gives you something concrete to work with.

Do not give scores, evaluations, or feedback during the session unless the candidate explicitly asks. Keep your responses concise and natural for spoken conversation. Ask only one question at a time.`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/anam/session", async (req, res) => {
    try {
      const { company, role, description } = req.body as {
        company?: string;
        role?: string;
        description?: string;
      };

      if (!company || !role || !description) {
        return res.status(400).json({ error: "company, role, and description are required" });
      }

      const systemPrompt = buildSystemPrompt(company, role, description);

      const response = await fetch(`${ANAM_API_BASE}/v1/auth/session-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANAM_API_KEY}`,
        },
        body: JSON.stringify({
          personaConfig: {
            personaId: KEVIN_PERSONA_ID,
            systemPrompt,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Anam session token error:", response.status, errorText);
        return res.status(response.status).json({ error: "Failed to get Anam session token", detail: errorText });
      }

      const data = await response.json();
      return res.json({ sessionToken: data.sessionToken });
    } catch (err) {
      console.error("Anam session route error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
