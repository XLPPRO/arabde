import {genkit, GenkitMiddleware } from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { z } from 'zod';

const ApiKeySchema = z.string().optional();

export const apiKeyMiddleware: GenkitMiddleware = async (req, next) => {
  const apiKey = ApiKeySchema.parse(req.params.data);
  if (apiKey) {
    req.plugins = [{
      name: 'custom-google-ai',
      plugin: googleAI({ apiKey }),
    }];
  }
  return next(req);
};

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
