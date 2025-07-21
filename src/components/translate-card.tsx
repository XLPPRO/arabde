"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { translateText, type TranslateTextOutput } from '@/ai/flows/translate-text-flow';
import { Loader2, Languages, Volume2, XCircle } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useApiKey } from '@/context/api-key-context';

type AudioState = {
  loading: boolean;
  error: string | null;
};

export function TranslateCard() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<TranslateTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [germanAudio, setGermanAudio] = useState<AudioState>({ loading: false, error: null });
  const [arabicAudio, setArabicAudio] = useState<AudioState>({ loading: false, error: null });

  const germanAudioRef = useRef<HTMLAudioElement>(null);
  const arabicAudioRef = useRef<HTMLAudioElement>(null);
  const { apiKey, setIsModalOpen } = useApiKey();


  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslation(null);
    try {
      const result = await translateText({ text: inputText, apiKey });
      setTranslation(result);
    } catch (err) {
      console.error(err);
      setError('Sorry, we could not translate that. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePronounce = async (text: string, language: 'german' | 'arabic') => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    const setAudioState = language === 'german' ? setGermanAudio : setArabicAudio;
    const audioRef = language === 'german' ? germanAudioRef : arabicAudioRef;
    
    setAudioState({ loading: true, error: null });

    try {
      const response = await textToSpeech({ text, apiKey });
      if (audioRef.current) {
        audioRef.current.src = response.audioDataUri;
        audioRef.current.play();
      }
      setAudioState({ loading: false, error: null });
    } catch (e) {
      console.error(e);
      setAudioState({ loading: false, error: `Failed to generate audio.` });
    }
  };


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Translate Text</CardTitle>
        <CardDescription>Enter text in German or Arabic to get a translation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="text-lg p-4 min-h-[150px] resize-y"
              disabled={isLoading}
            />
            {translation?.german && (
              <Button
                variant="ghost"
                onClick={() => handlePronounce(translation.german, 'german')}
                disabled={germanAudio.loading}
                aria-label={`Pronounce German text`}
                className="w-full"
              >
                {germanAudio.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                <span className="ml-2">Pronounce German</span>
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Translation will appear here..."
              value={translation?.arabic || ''}
              readOnly
              className="text-lg p-4 min-h-[150px] resize-y bg-secondary/50"
              dir="rtl"
            />
             {translation?.arabic && (
              <Button
                variant="ghost"
                onClick={() => handlePronounce(translation.arabic, 'arabic')}
                disabled={arabicAudio.loading}
                aria-label={`Pronounce Arabic text`}
                className="w-full"
              >
                {arabicAudio.loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                <span className="ml-2">Pronounce Arabic</span>
              </Button>
            )}
          </div>
        </div>

        <Button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="w-full text-lg p-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Translating...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-6 w-6" /> Translate
            </>
          )}
        </Button>
        
        {error && (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Translation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {(germanAudio.error || arabicAudio.error) && (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Audio Error</AlertTitle>
                <AlertDescription>{germanAudio.error || arabicAudio.error}</AlertDescription>
            </Alert>
        )}

        <audio ref={germanAudioRef} className="hidden" />
        <audio ref={arabicAudioRef} className="hidden" />

      </CardContent>
    </Card>
  );
}
