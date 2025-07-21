'use server';
/**
 * @fileOverview An AI agent that generates flash cards for language learning.
 *
 * - generateFlashcards - A function that generates a set of flash cards.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const FlashcardSchema = z.object({
  german: z.string().describe('The word or phrase in German.'),
  arabic: z.string().describe('The translation of the word or phrase in Arabic.'),
});

const GenerateFlashcardsInputSchema = z.object({
  domain: z.string().describe('The topic or domain for which to generate flash cards (e.g., "Travel", "Food", "Business").'),
   apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  cards: z.array(FlashcardSchema).describe('An array of 10 unique and varied flash cards related to the specified domain.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are Lyra, an advanced AI language tutor. Your task is to generate a set of 10 unique and varied flash cards for learning German and Arabic vocabulary. You must ensure absolute non-repetition of previously generated content.

  The user has requested flash cards for the following topic: {{domain}}

  - Generate 10 pairs of words or short, common phrases.
  - For each pair, provide the German term and its corresponding Arabic translation.
  - The vocabulary should be suitable for beginner to intermediate learners.
  - **Crucially, the generated set must be novel and avoid common, repetitive examples. Be creative and diverse in your selections within the topic.**

  Return the result as a JSON object containing an array of cards.`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      model: googleAI.model('gemini-2.0-flash', { temperature: 0.9 }),
      plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
