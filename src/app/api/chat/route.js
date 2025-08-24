import OpenAI from "openai";
import { aj } from "@/lib/arcjet";
import { hiteshSirPersonaString } from "@/lib/personas";
import { piyushSirPersonaString } from "@/lib/personas";
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request) {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return new Response(
        JSON.stringify({ error: "Too many requests, try again in a minute" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, persona } = await request.json();

    let personaString =
      persona === "hiteshSir" ? hiteshSirPersonaString : piyushSirPersonaString;

    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: personaString,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
