'use server';
/**
 * @fileOverview An AI agent that evaluates a user's translation of a sentence.
 *
 * - evaluateTranslation - A function that evaluates the user's translation.
 * - EvaluateTranslationInput - The input type for the evaluateTranslation function.
 * - EvaluateTranslationOutput - The return type for the evaluateTranslation function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const EvaluateTranslationInputSchema = z.object({
  originalSentence: z.string().describe('The original sentence that was given to the user to translate.'),
  userTranslation: z.string().describe("The user's translation of the sentence."),
  sourceLanguage: z.enum(['German', 'Arabic']).describe('The language of the original sentence.'),
  targetLanguage: z.enum(['German', 'Arabic']).describe('The language of the user\'s translation.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type EvaluateTranslationInput = z.infer<typeof EvaluateTranslationInputSchema>;

const EvaluateTranslationOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the user\'s translation is correct.'),
  correctTranslation: z.string().describe('The correct translation of the sentence.'),
  explanation: z.string().describe('An explanation of any mistakes in the user\'s translation. If the translation is correct, this should be a brief message of encouragement.'),
});
export type EvaluateTranslationOutput = z.infer<typeof EvaluateTranslationOutputSchema>;

export async function evaluateTranslation(input: EvaluateTranslationInput): Promise<EvaluateTranslationOutput> {
  return evaluateTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateTranslationPrompt',
  input: {schema: EvaluateTranslationInputSchema},
  output: {schema: EvaluateTranslationOutputSchema},
  prompt: `You are a language teacher. A student has translated a sentence from {{sourceLanguage}} to {{targetLanguage}}.
  Your task is to evaluate their translation.

  Original {{sourceLanguage}} Sentence: {{{originalSentence}}}
  Student's {{targetLanguage}} Translation: {{{userTranslation}}}

  1.  Determine if the student's translation is correct. It doesn't have to be a word-for-word match, but it should be grammatically correct and convey the same meaning.
  2.  Provide the ideal, correct translation.
  3.  Provide a clear and concise explanation.
      - If the translation is incorrect, explain the mistakes (e.g., grammar, vocabulary, word order).
      - If the translation is correct, provide a short, encouraging feedback message.

  Return the evaluation as a JSON object.`,
});

const evaluateTranslationFlow = ai.defineFlow(
  {
    name: 'evaluateTranslationFlow',
    inputSchema: EvaluateTranslationInputSchema,
    outputSchema: EvaluateTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
        plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
