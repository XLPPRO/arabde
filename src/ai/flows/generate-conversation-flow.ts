'use server';
/**
 * @fileOverview An AI agent that generates a practice conversation.
 *
 * - generateConversation - A function that generates a conversation based on a topic.
 * - GenerateConversationInput - The input type for the generateConversation function.
 * - GenerateConversationOutput - The return type for the generateConversation function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const ConversationTurnSchema = z.object({
  speaker: z.enum(['A', 'B']).describe('The speaker of this turn.'),
  german: z.string().describe('The line spoken in German.'),
  arabic: z.string().describe('The line spoken in Arabic.'),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;

const GenerateConversationInputSchema = z.object({
  topic: z.string().describe('The topic for the conversation (e.g., "Ordering coffee", "At the airport").'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GenerateConversationInput = z.infer<typeof GenerateConversationInputSchema>;

const GenerateConversationOutputSchema = z.object({
  topic: z.string().describe('The topic of the generated conversation.'),
  dialogue: z.array(ConversationTurnSchema).describe('An array of conversation turns, consisting of 4 to 6 turns.'),
});
export type GenerateConversationOutput = z.infer<typeof GenerateConversationOutputSchema>;

export async function generateConversation(input: GenerateConversationInput): Promise<GenerateConversationOutput> {
  return generateConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationPrompt',
  input: {schema: GenerateConversationInputSchema},
  output: {schema: GenerateConversationOutputSchema},
  prompt: `You are an AI assistant for a language learning app. Your task is to generate a simple, realistic dialogue between two speakers (A and B) in both German and Arabic.

  The user has requested a conversation about the following topic: {{topic}}

  Please generate a short dialogue with 4 to 6 turns. Each turn should include the speaker, the German sentence, and the corresponding Arabic translation.
  The dialogue should be practical and suitable for a beginner to intermediate language learner.
  
  Make sure the 'topic' in the output matches the user's requested topic.

  Return the result as a JSON object.`,
});

const generateConversationFlow = ai.defineFlow(
  {
    name: 'generateConversationFlow',
    inputSchema: GenerateConversationInputSchema,
    outputSchema: GenerateConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      plugins: input.apiKey ? [googleAI({ apiKey: input.apiKey })] : undefined,
    });
    return output!;
  }
);
