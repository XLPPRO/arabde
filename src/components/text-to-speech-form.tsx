"use client";

import { useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Volume2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useApiKey } from '@/context/api-key-context';

export function TextToSpeechForm() {
  const [text, setText] = useState('');
  const [audioState, setAudioState] = useState<{
    loading: boolean;
    error: string | null;
    dataUri: string | null;
  }>({ loading: false, error: null, dataUri: null });
  const audioRef = useRef<HTMLAudioElement>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const handleTextToSpeech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setAudioState({ loading: true, error: null, dataUri: null });
    try {
      const response = await textToSpeech({ text, apiKey });
      setAudioState({ loading: false, error: null, dataUri: response.audioDataUri });
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    } catch (err) {
      console.error(err);
      setAudioState({ loading: false, error: 'Failed to generate audio.', dataUri: null });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Voice Pronunciation</CardTitle>
        <CardDescription>Enter any text to hear it pronounced.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTextToSpeech} className="space-y-4">
          <Textarea
            placeholder="Enter German or Arabic text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-lg p-4"
            rows={3}
          />
          <Button type="submit" disabled={audioState.loading || !text.trim()} className="w-full">
            {audioState.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Pronounce
              </>
            )}
          </Button>
          {audioState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{audioState.error}</AlertDescription>
            </Alert>
          )}
          {audioState.dataUri && (
            <div className="flex justify-center pt-4">
              <audio controls ref={audioRef} src={audioState.dataUri} className="w-full" />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
