'use server';
/**
 * @fileOverview An AI agent that generates a sentence for a translation game.
 *
 * - generateSentence - A function that generates a sentence.
 * - GenerateSentenceInput - The input type for the generateSentence function.
 * - GenerateSentenceOutput - The return type for the generateSentence function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateSentenceInputSchema = z.object({
  language: z.enum(['German', 'Arabic']).describe('The language for the sentence to be generated.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GenerateSentenceInput = z.infer<typeof GenerateSentenceInputSchema>;

const GenerateSentenceOutputSchema = z.object({
  sentence: z.string().describe('A sentence in the specified language, suitable for a beginner to intermediate language learner to translate.'),
});
export type GenerateSentenceOutput = z.infer<typeof GenerateSentenceOutputSchema>;

export async function generateSentence(input: GenerateSentenceInput): Promise<GenerateSentenceOutput> {
  return generateSentenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSentencePrompt',
  input: {schema: GenerateSentenceInputSchema},
  output: {schema: GenerateSentenceOutputSchema},
  prompt: `You are an AI assistant for a language learning app.
  
  Generate one sentence in {{language}} that is suitable for a beginner or intermediate learner to translate.
  The sentence should be common and practical. Do not include any special characters or quotation marks.

  Return a JSON object with the generated sentence.`,
});

const generateSentenceFlow = ai.defineFlow(
  {
    name: 'generateSentenceFlow',
    inputSchema: GenerateSentenceInputSchema,
    outputSchema: GenerateSentenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
        plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
