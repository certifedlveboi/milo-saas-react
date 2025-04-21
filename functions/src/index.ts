// functions/src/index.ts
import * as functions from "firebase-functions";
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, configureGenkit } from 'genkit';
import { defineFlow, runFlow } from '@genkit-ai/flow';
import { z } from 'zod';

// Initialize Genkit (consider moving API key to environment variables)
configureGenkit({
  plugins: [
    googleAI({
      // apiKey: process.env.GOOGLE_GENAI_API_KEY // Use environment variable
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

// --- Existing helloGenkit Function (keep or remove as needed) ---
const helloFlow = defineFlow({ name: 'helloFlow' }, async (name: string) => {
  const llmResponse = await genkit.generate({
    model: gemini15Flash,
    prompt: `Hello Gemini, my name is ${name}`,
  });
  return llmResponse.text();
});

export const helloGenkit = functions.https.onRequest(async (req, res) => {
  const name = req.query.name as string || 'Guest';
  try {
    const greeting = await runFlow(helloFlow, name);
    res.send(`Greeting from Genkit: ${greeting}`);
  } catch (error) {
    console.error("Error in helloGenkit function:", error);
    res.status(500).send("Error generating greeting");
  }
});

// --- New Voice Command Processing Function ---

// Define the expected JSON output structure using Zod for validation
const VoiceCommandResponseSchema = z.object({
  action: z.enum(["addNote", "addReminder", "unknown"]),
  data: z.object({
    text: z.string().optional().nullable(),
    time: z.string().optional().nullable(),      // e.g., "HH:mm"
    category: z.string().optional().nullable(), // e.g., "personal", "work"
  }),
});

// Define the Genkit flow for interpreting the voice command
const interpretCommandFlow = defineFlow({
  name: 'interpretCommandFlow',
  inputSchema: z.string(), // Expects the text transcript as input
  outputSchema: VoiceCommandResponseSchema, // Expects the structured JSON as output
}, async (transcript) => {

  const prompt = `Analyze the following user command obtained from voice input. Determine the user's intent (add a note, add a reminder, or unknown) and extract the relevant details.

Respond ONLY with a valid JSON object matching this structure:
{
  "action": "addNote" | "addReminder" | "unknown",
  "data": {
    "text": "<content of the note or reminder>" | null,
    "time": "<time in HH:mm format e.g., 14:30>" | null, 
    "category": "<category like personal, work, shopping>" | null
  }
}

If the intent is unclear or not related to adding notes or reminders, set action to "unknown" and data fields to null.
If adding a reminder but no specific time is mentioned, set time to null.
Extract the core text for the note or reminder.

User Command: "${transcript}"

JSON Response:`;

  const llmResponse = await genkit.generate({
    model: gemini15Flash,
    prompt: prompt,
    config: {
      temperature: 0.1, // Lower temperature for more predictable JSON output
    },
    output: {
        format: 'json', // Request JSON output directly
        schema: VoiceCommandResponseSchema // Provide the schema for validation
    }
  });

  const jsonOutput = llmResponse.output();
  if (!jsonOutput) {
    console.error("LLM did not return valid JSON output.");
     return { action: "unknown", data: { text: null, time: null, category: null } };
   }

  console.log("LLM JSON Output:", jsonOutput);
  // Zod schema validation happens automatically if output.schema is provided
  return jsonOutput;

});

// Define the HTTP Cloud Function
export const processVoiceCommand = functions.https.onRequest(async (req, res) => {
   // Allow CORS for requests from your frontend domain during development
  res.set('Access-Control-Allow-Origin', '*'); // Replace * with your frontend URL in production
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
      // Handle preflight request
      res.status(204).send('');
      return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const transcript = req.body.transcript as string;

  if (!transcript) {
    res.status(400).send({ error: "Missing 'transcript' in request body" });
    return;
  }

  console.log("Received transcript:", transcript);

  try {
    // Run the Genkit flow
    const result = await runFlow(interpretCommandFlow, transcript);
    console.log("Flow result:", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error processing voice command:", error);
    res.status(500).send({ error: "Failed to process command" });
  }
});
