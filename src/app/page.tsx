"use client";

import { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SearchCard } from '@/components/search-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { translateText, type TranslateTextOutput } from '@/ai/flows/translate-text-flow';
import { Loader2 } from 'lucide-react';
import { useApiKey } from '@/context/api-key-context';
import { Skeleton } from '@/components/ui/skeleton';

const TranslationResult = dynamic(() => import('@/components/translation-result').then(mod => mod.TranslationResult), {
  loading: () => <Skeleton className="w-full h-64" />,
  ssr: false,
});

const TextToSpeechForm = dynamic(() => import('@/components/text-to-speech-form').then(mod => mod.TextToSpeechForm), {
  ssr: false
});


const allWords = [
  { german: 'Freundschaft', arabic: 'صداقة' },
  { german: 'Abenteuer', arabic: 'مغامرة' },
  { german: 'Bibliothek', arabic: 'مكتبة' },
  { german: 'Wissenschaft', arabic: 'علم' },
  { german: 'Technologie', arabic: 'تكنولوجيا' },
  { german: 'Kaffee', arabic: 'قهوة' },
  { german: 'Schule', arabic: 'مدرسة' },
  { german: 'Universität', arabic: 'جامعة' },
  { german: 'Liebe', arabic: 'حب' },
  { german: 'Familie', arabic: 'عائلة' },
  { german: 'Reise', arabic: 'رحلة' },
  { german: 'Musik', arabic: 'موسيقى' },
  { german: 'Kunst', arabic: 'فن' },
  { german: 'Essen', arabic: 'طعام' },
  { german: 'Wasser', arabic: 'ماء' },
  { german: 'Sonne', arabic: 'شمس' },
  { german: 'Mond', arabic: 'قمر' },
  { german: 'Stern', arabic: 'نجم' },
  { german: 'Himmel', arabic: 'سماء' },
  { german: 'Erde', arabic: 'أرض' },
];

const shuffleWords = () => {
  return allWords.sort(() => 0.5 - Math.random()).slice(0, 5);
}

export default function Home() {
  const [translation, setTranslation] = useState<TranslateTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordsToTranslate, setWordsToTranslate] = useState(shuffleWords());
  const { apiKey, setIsModalOpen } = useApiKey();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWordsToTranslate(shuffleWords());
    }, 60000); // 1 minute in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async (term: string) => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslation(null);
    try {
      const result = await translateText({ text: term, apiKey });
      setTranslation(result);
    } catch (err) {
      console.error(err);
      setError('Sorry, we could not translate that word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <SearchCard onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Translating...</span>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {translation && <TranslationResult result={translation} key={translation.german + translation.arabic} />}
      
      <Suspense fallback={<Skeleton className="w-full h-64" />}>
        <TextToSpeechForm />
      </Suspense>

      <Card className="bg-primary/10 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center gap-2">
            <Badge variant="default" className="bg-primary/80">New</Badge>
            Text Translation in Different Dialects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Explore the richness of the Arabic language. Our new feature allows you to see translations in various dialects, providing a more comprehensive understanding. This feature is currently in beta.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Help us improve ArabDe!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Contribute to our dictionary by helping us translate the following words. Your knowledge helps everyone.
          </p>
          <Separator className="my-4" />
          <ul className="space-y-2">
            {wordsToTranslate.map((word, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-semibold">{word.german}</span>
                <span className="text-muted-foreground" dir="rtl">{word.arabic}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
