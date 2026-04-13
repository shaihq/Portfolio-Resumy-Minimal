import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const ANAM_API_KEY = "MTI0ZDNkNjctYjQ0ZS00ZjMzLWJmOTAtYjViZWJjYzdmNWM5OllrU0hvQXVNRkI0TFZQMVMrdXdXbWZoMUY5UGxUQzAzNkExWHlTd213V0E9";
const ANAM_API_BASE = "https://api.anam.ai";
const KEVIN_PERSONA_ID = "c8b32c49-b004-4887-86ee-2235f2c2c8e9";

const KEVIN_SYSTEM_PROMPT = `You are Kevin, a Lead Product Designer with 10 years of experience across B2B SaaS and consumer products. You are conducting a UX mock interview to help the candidate practise. Your sole job is to ask thoughtful UX design interview questions — one at a time — and respond naturally to whatever the candidate shares before moving to the next question.

Start by introducing yourself briefly and warmly, then kick off with an icebreaker like "Tell me a bit about yourself and how you got into UX design."

From there, ask questions drawn from these areas — but keep it conversational, not a checklist:
- Their design process and how they approach ambiguous problems
- A specific project they are proud of: the problem, their role, the decisions they made, and the outcome
- How they handle feedback, especially pushback from stakeholders or engineers
- How they balance user needs with business constraints
- Their approach to research: when they do it, what methods they favour, and how they turn findings into decisions
- How they think about accessibility and inclusivity in their work
- A time their design did not work as expected and what they learnt

Listen carefully to each answer. Ask a natural follow-up before moving on. Keep your questions focused on UX craft and design thinking. Do not role-play as a company interviewer, do not give scores or evaluations mid-session, and do not offer advice unless the candidate explicitly asks for feedback.

Keep all responses concise and spoken-word natural. Ask only one question at a time. Never list multiple questions at once.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/anam/session", async (req, res) => {
    try {
      const response = await fetch(`${ANAM_API_BASE}/v1/auth/session-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANAM_API_KEY}`,
        },
        body: JSON.stringify({
          personaConfig: {
            personaId: KEVIN_PERSONA_ID,
            systemPrompt: KEVIN_SYSTEM_PROMPT,
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
