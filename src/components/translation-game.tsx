"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { generateSentence } from '@/ai/flows/generate-sentence-flow';
import { evaluateTranslation, type EvaluateTranslationOutput } from '@/ai/flows/evaluate-translation-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VirtualKeyboard } from './virtual-keyboard';
import { useApiKey } from '@/context/api-key-context';

type LanguageDirection = 'de-ar' | 'ar-de';

export function TranslationGame() {
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'playing' | 'evaluating' | 'finished'>('idle');
  const [direction, setDirection] = useState<LanguageDirection>('de-ar');
  const [sentence, setSentence] = useState('');
  const [userTranslation, setUserTranslation] = useState('');
  const [feedback, setFeedback] = useState<EvaluateTranslationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const sourceLanguage = direction === 'de-ar' ? 'German' : 'Arabic';
  const targetLanguage = direction === 'de-ar' ? 'Arabic' : 'German';

  const handleStartGame = async () => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    setGameState('loading');
    setError(null);
    setFeedback(null);
    setUserTranslation('');
    try {
      const result = await generateSentence({ language: sourceLanguage, apiKey });
      setSentence(result.sentence);
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setError('Could not start the game. Please try again.');
      setGameState('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTranslation.trim()) return;
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    setGameState('evaluating');
    setError(null);
    try {
      const result = await evaluateTranslation({
        originalSentence: sentence,
        userTranslation,
        sourceLanguage,
        targetLanguage,
        apiKey,
      });
      setFeedback(result);
      setGameState('finished');
    } catch (err) {
      console.error(err);
      setError('Could not evaluate your translation. Please try again.');
      setGameState('playing');
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setUserTranslation((prev) => prev.slice(0, -1));
    } else {
      setUserTranslation((prev) => prev + key);
    }
  };

  const keyboardLanguage = targetLanguage === 'German' ? 'de' : 'ar';

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Translation Challenge</CardTitle>
        <CardDescription>Test your language skills by translating the sentence.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {gameState === 'idle' && (
          <div className="text-center space-y-4">
            <p>Select the translation direction and start the game!</p>
            <div className="flex justify-center items-center gap-4">
                <Select value={direction} onValueChange={(value) => setDirection(value as LanguageDirection)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Translation Direction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="de-ar">German to Arabic</SelectItem>
                        <SelectItem value="ar-de">Arabic to German</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleStartGame}>Start Game</Button>
            </div>
          </div>
        )}

        {(gameState === 'loading' || gameState === 'evaluating') && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>{gameState === 'loading' ? 'Generating sentence...' : 'Checking your translation...'}</span>
            </div>
        )}

        {(gameState === 'playing' || gameState === 'finished') && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Translate this sentence from {sourceLanguage}:</label>
              <p className="text-xl font-semibold p-4 bg-secondary rounded-md" dir={sourceLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                {sentence}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder={`Your ${targetLanguage} translation...`}
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
                className="text-lg p-4"
                rows={3}
                disabled={gameState !== 'playing'}
                dir={targetLanguage === 'Arabic' ? 'rtl' : 'ltr'}
              />
               {gameState === 'playing' && (
                <VirtualKeyboard
                  language={keyboardLanguage}
                  onKeyPress={handleKeyPress}
                />
              )}
              <Button type="submit" disabled={gameState !== 'playing' || !userTranslation.trim()} className="w-full">
                Check my translation
              </Button>
            </form>
          </div>
        )}

        {gameState === 'finished' && feedback && (
          <div className="space-y-4 pt-4 animate-in fade-in-50 duration-500">
             <Alert variant={feedback.isCorrect ? "default" : "destructive"} className={feedback.isCorrect ? "border-green-500/50" : ""}>
                {feedback.isCorrect ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle className="font-headline">
                    {feedback.isCorrect ? "Correct!" : "Needs Improvement"}
                </AlertTitle>
                <AlertDescription>
                   {feedback.explanation}
                </AlertDescription>
            </Alert>
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-headline">Correct Translation</AlertTitle>
                <AlertDescription dir={targetLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                   {feedback.correctTranslation}
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {(gameState === 'playing' || gameState === 'finished') && (
            <Button onClick={handleStartGame} variant="outline" className="w-full">
                {gameState === 'playing' ? 'Get a different sentence' : 'Play again'}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
