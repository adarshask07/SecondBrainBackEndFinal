// main.js
import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { preinfo } from "./prompts.js";

dotenv.config();

const groq = new Groq({ apiKey: "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" });

export async function main(prompt) {
  const stream = await getGroqChatStream(prompt);
  let response = ""; // To accumulate the response content

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    response += content; // Append each chunk to the response
  }

  // Return the final response after the stream is complete
  return JSON.parse(response);
}

async function getGroqChatStream(prompt) {
  const user_query = prompt.query;

  // Convert the brain array to a single string with all details
  const brain = prompt.brain
    .map(
      (item) =>
        `Title: ${item.title}\nContent: ${item.content}\nCreated At: ${item.createdAt}\nUpdated At: ${item.updatedAt}\nScore: ${item.score}`
    )
    .join("\n\n");

  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: preinfo,
      },
      {
        role: "system",
        content: brain,
      },
      {
        role: "user",
        content: user_query,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true,
  });
}
