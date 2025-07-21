'use server';
/**
 * @fileOverview An AI agent that determines whether to display grammar explanations for a translation.
 *
 * - shouldDisplayGrammarExplanation - A function that determines if grammar explanations should be displayed.
 * - GrammarExplanationInput - The input type for the shouldDisplayGrammarExplanation function.
 * - GrammarExplanationOutput - The return type for the shouldDisplayGrammarExplanation function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const GrammarExplanationInputSchema = z.object({
  germanText: z.string().describe('The German text to be translated.'),
  arabicTranslation: z.string().describe('The Arabic translation of the German text.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GrammarExplanationInput = z.infer<typeof GrammarExplanationInputSchema>;

const GrammarExplanationOutputSchema = z.object({
  shouldDisplay: z.boolean().describe('Whether or not to display the grammar explanation.'),
  reason: z.string().describe('The reason for the decision.'),
});
export type GrammarExplanationOutput = z.infer<typeof GrammarExplanationOutputSchema>;

export async function shouldDisplayGrammarExplanation(input: GrammarExplanationInput): Promise<GrammarExplanationOutput> {
  return shouldDisplayGrammarExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'grammarExplanationPrompt',
  input: {schema: GrammarExplanationInputSchema},
  output: {schema: GrammarExplanationOutputSchema},
  prompt: `You are an AI assistant that determines whether to display a grammar explanation for a given German to Arabic translation.

  Consider the following factors:
  - Is the translation accurate and fluent?
  - Is there a specific grammatical concept that is relevant to the translation?
  - Would a grammar explanation enhance the user's understanding of the translation?

  Based on these factors, determine whether to display the grammar explanation.

  German Text: {{{germanText}}}
  Arabic Translation: {{{arabicTranslation}}}

  Return a JSON object with the following fields:
  - shouldDisplay: true if the grammar explanation should be displayed, false otherwise.
  - reason: A brief explanation for the decision.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const shouldDisplayGrammarExplanationFlow = ai.defineFlow(
  {
    name: 'shouldDisplayGrammarExplanationFlow',
    inputSchema: GrammarExplanationInputSchema,
    outputSchema: GrammarExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
        plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
