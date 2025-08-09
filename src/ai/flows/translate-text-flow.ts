'use server';
/**
 * @fileOverview An AI agent that translates text between German and Arabic.
 *
 * - translateText - A function that handles the translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated, which can be German or Arabic.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  german: z.string().describe('The German version of the text.'),
  arabic: z.string().describe('The Arabic version of the text.'),
  germanType: z.string().describe('The grammatical type of the German word (e.g., "Substantiv, n", "Verb", "Adjektiv").'),
  arabicType: z.string().describe('The grammatical type of the Arabic word (e.g., "اسم", "فعل", "صفة").'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are an expert German-Arabic translator. Your task is to translate the given text.
  
  First, detect if the input text is German or Arabic.
  - If the input is German, translate it to Arabic.
  - If the input is Arabic, translate it to German.

  You must provide the grammatical type for both the German and Arabic words.
  - For German: Use terms like "Substantiv, n/m/f", "Verb", "Adjektiv", etc.
  - For Arabic: Use terms like "اسم", "فعل", "صفة", etc.

  The input text is: {{{text}}}

  Return a JSON object with the translation and grammatical types.
  `,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
        plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
