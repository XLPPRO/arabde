
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Layers, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-flow';
import { useApiKey } from '@/context/api-key-context';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';
import './flashcard.css';
import { Badge } from './ui/badge';

type Flashcard = {
  german: string;
  arabic: string;
};

const domains = ["Travel", "Food", "Business", "Family", "Weather", "Shopping"];

export function FlashcardViewer() {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const handleGenerateCards = async () => {
    if (!topic.trim()) {
        setError("Please enter or select a topic first.");
        return;
    }
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const result = await generateFlashcards({ domain: topic, apiKey });
      setCards(result.cards);
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't generate flash cards for that topic. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentCardIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Flash Card Practice</CardTitle>
        <CardDescription>Enter a topic or choose a suggestion to generate flash cards.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter a topic, e.g., 'Colors'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button onClick={handleGenerateCards} disabled={isLoading || !topic.trim()} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="animate-spin" /> : <Layers />}
              <span className="ml-2">{isLoading ? 'Generating...' : 'Generate Cards'}</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">Suggestions:</span>
            {domains.map((d) => (
              <Badge 
                key={d} 
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setTopic(d)}
              >
                {d}
              </Badge>
            ))}
          </div>
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
            {isLoading ? (
                 <div className="flex flex-col items-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2"/>
                    <p>Generating flash cards...</p>
                 </div>
            ) : cards.length > 0 ? (
                <div 
                    className="w-full h-48 perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div 
                        className={cn(
                            "relative w-full h-full text-center transform-style-3d transition-transform duration-700",
                            isFlipped ? 'rotate-y-180' : ''
                        )}
                    >
                        {/* Front of card */}
                        <div className="absolute w-full h-full backface-hidden rounded-lg bg-secondary flex items-center justify-center p-4">
                            <span className="text-3xl font-bold">{currentCard.german}</span>
                        </div>
                        {/* Back of card */}
                        <div className="absolute w-full h-full backface-hidden rounded-lg bg-primary text-primary-foreground flex items-center justify-center p-4 rotate-y-180">
                            <span className="text-3xl font-bold" dir="rtl">{currentCard.arabic}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-muted-foreground">
                    <p>Enter a topic and click "Generate Cards" to start learning!</p>
                </div>
            )}
        </div>

      </CardContent>
       {cards.length > 0 && !isLoading && (
        <CardFooter className="flex justify-between items-center">
            <Button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
                <ArrowLeft className="mr-2" /> Previous
            </Button>
            <div className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {cards.length}
            </div>
            <Button onClick={handleNextCard} disabled={currentCardIndex === cards.length - 1}>
                Next <ArrowRight className="ml-2" />
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
