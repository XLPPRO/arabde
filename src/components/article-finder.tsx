
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { getArticleAndPlural, type GetArticleAndPluralOutput } from '@/ai/flows/article-game-flow';
import { useApiKey } from '@/context/api-key-context';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function ArticleFinder() {
  const [noun, setNoun] = useState('');
  const [result, setResult] = useState<GetArticleAndPluralOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noun.trim()) return;
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getArticleAndPlural({ noun, apiKey });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Could not find the article for that word. Please check the spelling and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Article &amp; Plural Finder</CardTitle>
        <CardDescription>Enter a German noun to find its article and plural form.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., Haus"
            value={noun}
            onChange={(e) => setNoun(e.target.value)}
            className="flex-grow text-lg p-6"
            aria-label="German noun"
            disabled={isLoading}
          />
          <Button type="submit" size="lg" className="p-6" disabled={isLoading || !noun.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="ml-2">{isLoading ? 'Finding...' : 'Find'}</span>
          </Button>
        </form>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {result && (
            <div className="pt-4 animate-in fade-in-50 duration-500">
                <Alert>
                    <AlertTitle className="font-headline text-xl">Result for "{noun}"</AlertTitle>
                    <AlertDescription className="text-lg space-y-2 mt-2">
                        <p><strong>Article:</strong> <span className="font-bold text-primary">{result.article}</span></p>
                        <p><strong>Plural:</strong> <span className="font-bold text-primary">{result.plural}</span></p>
                    </AlertDescription>
                </Alert>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
