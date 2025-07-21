"use client";

import { useState, useRef } from 'react';
import { shouldDisplayGrammarExplanation, type GrammarExplanationOutput } from '@/ai/flows/grammar-explanation-logic';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Sparkles, AlertCircle, CheckCircle, Volume2, Info } from 'lucide-react';
import type { TranslateTextOutput } from '@/ai/flows/translate-text-flow';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useApiKey } from '@/context/api-key-context';

interface TranslationResultProps {
  result: TranslateTextOutput;
}

type AudioState = {
  loading: boolean;
  error: string | null;
  dataUri: string | null;
};

export function TranslationResult({ result }: TranslationResultProps) {
  const [grammarInfo, setGrammarInfo] = useState<{
    loading: boolean;
    data: GrammarExplanationOutput | null;
    error: string | null;
  }>({ loading: false, data: null, error: null });

  const [germanAudio, setGermanAudio] = useState<AudioState>({ loading: false, error: null, dataUri: null });
  const [arabicAudio, setArabicAudio] = useState<AudioState>({ loading: false, error: null, dataUri: null });

  const germanAudioRef = useRef<HTMLAudioElement>(null);
  const arabicAudioRef = useRef<HTMLAudioElement>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const handleShowGrammar = async () => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    setGrammarInfo({ loading: true, data: null, error: null });
    try {
      const response = await shouldDisplayGrammarExplanation({
        germanText: result.german,
        arabicTranslation: result.arabic,
        apiKey,
      });
      setGrammarInfo({ loading: false, data: response, error: null });
    } catch (e) {
      console.error(e);
      setGrammarInfo({ loading: false, data: null, error: 'Failed to get grammar explanation.' });
    }
  };

  const handlePronounce = async (text: string, language: 'german' | 'arabic') => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    const setAudioState = language === 'german' ? setGermanAudio : setArabicAudio;
    const audioRef = language === 'german' ? germanAudioRef : arabicAudioRef;
    
    // If audio is already loaded, just play it
    if (audioRef.current?.src) {
      audioRef.current.play();
      return;
    }
    
    setAudioState({ loading: true, error: null, dataUri: null });

    try {
      const response = await textToSpeech({ text, apiKey });
      setAudioState({ loading: false, error: null, dataUri: response.audioDataUri });
      // Use a timeout to allow the audio element to update its src and play
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    } catch (e) {
      console.error(e);
      setAudioState({ loading: false, error: `Failed to generate audio for ${text}.`, dataUri: null });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{result.german}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePronounce(result.german, 'german')}
              disabled={germanAudio.loading}
              aria-label={`Pronounce ${result.german}`}
            >
              {germanAudio.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
            </Button>
             {germanAudio.dataUri && <audio ref={germanAudioRef} src={germanAudio.dataUri} />}
          </div>
          <div className="flex items-center gap-2" dir="rtl">
            <span>{result.arabic}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePronounce(result.arabic, 'arabic')}
              disabled={arabicAudio.loading}
              aria-label={`Pronounce ${result.arabic}`}
            >
              {arabicAudio.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            {arabicAudio.dataUri && <audio ref={arabicAudioRef} src={arabicAudio.dataUri} />}
          </div>
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
            <Badge variant="outline">{result.germanType}</Badge>
            <Badge variant="outline">{result.arabicType}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-muted-foreground mb-2">Example Sentences</h4>
          <p className="italic text-gray-500">(Example sentences feature coming soon)</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        {(germanAudio.error || arabicAudio.error) && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Audio Error</AlertTitle>
                <AlertDescription>{germanAudio.error || arabicAudio.error}</AlertDescription>
            </Alert>
        )}
        {!grammarInfo.data && !grammarInfo.error && (
            <Button onClick={handleShowGrammar} disabled={grammarInfo.loading} variant="outline">
              {grammarInfo.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
              )}
              {grammarInfo.loading ? 'Analyzing...' : 'Show AI Grammar Explanation'}
            </Button>
        )}
        {grammarInfo.loading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading explanation...</span>
          </div>
        )}
        {grammarInfo.error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{grammarInfo.error}</AlertDescription>
            </Alert>
        )}
        {grammarInfo.data && (
            <Alert variant={grammarInfo.data.shouldDisplay ? "default" : "secondary"} className="bg-card">
                {grammarInfo.data.shouldDisplay ? <CheckCircle className="h-4 w-4 text-primary" /> : <Info className="h-4 w-4" />}
                <AlertTitle className="font-headline">
                    {grammarInfo.data.shouldDisplay ? "Grammar Explanation" : "Grammar Note"}
                </AlertTitle>
                <AlertDescription>
                    {grammarInfo.data.reason}
                </AlertDescription>
            </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
