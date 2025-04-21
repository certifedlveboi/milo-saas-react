// functions/src/index.ts
import * as functions from "firebase-functions";
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const helloFlow = ai.defineFlow('helloFlow', async (name: string) => {
  const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
  return text;
});

export const helloGenkit = functions.https.onRequest(async (req, res) => {
  const name = req.query.name as string || 'Guest';

  try {
    const greeting = await helloFlow(name);
    res.send(`Greeting from Genkit: ${greeting}`);
  } catch (error) {
    console.error("Error in helloGenkit function:", error);
    res.status(500).send("Error generating greeting");
  }
});