'use server';
/**
 * @fileOverview AI agent for a German article (der, die, das) finder.
 *
 * - getArticleAndPlural - A function that returns the article and plural for a German noun.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

// Schema for getting article and plural
const GetArticleAndPluralInputSchema = z.object({
  noun: z.string().describe('A German noun in its singular form.'),
   apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GetArticleAndPluralInput = z.infer<typeof GetArticleAndPluralInputSchema>;

const GetArticleAndPluralOutputSchema = z.object({
  article: z.enum(['der', 'die', 'das']).describe('The correct article for the noun.'),
  plural: z.string().describe('The plural form of the noun.'),
});
export type GetArticleAndPluralOutput = z.infer<typeof GetArticleAndPluralOutputSchema>;


// Exportable functions
export async function getArticleAndPlural(input: GetArticleAndPluralInput): Promise<GetArticleAndPluralOutput> {
    return getArticleAndPluralFlow(input);
}

// Get Article and Plural Flow
const getArticleAndPluralPrompt = ai.definePrompt({
    name: 'getArticleAndPluralPrompt',
    input: { schema: GetArticleAndPluralInputSchema },
    output: { schema: GetArticleAndPluralOutputSchema },
    prompt: `You are a German language expert.
    For the given German noun "{{noun}}", provide its definite article (der, die, or das) and its plural form.
    Return the result as a JSON object.`
});

const getArticleAndPluralFlow = ai.defineFlow(
    {
        name: 'getArticleAndPluralFlow',
        inputSchema: GetArticleAndPluralInputSchema,
        outputSchema: GetArticleAndPluralOutputSchema,
    },
    async (input) => {
        const { output } = await getArticleAndPluralPrompt(input, {
            plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
        });
        return output!;
    }
);
