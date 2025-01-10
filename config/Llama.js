// main.js
import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { preinfoSearch } from "./prompts.js";

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
  const preInfo = prompt.preInfo

  // Convert the brain array to a single string with all details
  let brain;

  if (Array.isArray(prompt.brain)) {
    // Handle as an array (if provided as such)
    brain = prompt.brain
      .map(
        (item) =>
          `Title: ${item.title}\nContent: ${item.content}\nCreated At: ${item.createdAt}\nUpdated At: ${item.updatedAt}`
      )
      .join("\n\n");
  } else if (typeof prompt.brain === "object" && prompt.brain !== null) {
    // Handle as an object
    const item = prompt.brain; // Access the `data` field
    brain = `Title: ${item.title}\nContent: ${item.content}\nTags: ${item.tags.join(
      ", "
    )}\nCreated At: ${item.createdAt}\nUpdated At: ${item.updatedAt}`;
  } else {
    // Handle invalid input
    brain = "No valid brain data provided.";
  }
// console.log(brain);

  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: preInfo,
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
