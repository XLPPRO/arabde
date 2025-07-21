"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, User, AlertCircle } from 'lucide-react';
import { generateConversation, type GenerateConversationOutput, type ConversationTurn } from '@/ai/flows/generate-conversation-flow';
import { useApiKey } from '@/context/api-key-context';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';

export function ConversationGenerator() {
  const [topic, setTopic] = useState('');
  const [conversation, setConversation] = useState<GenerateConversationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, setIsModalOpen } = useApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setConversation(null);

    try {
      const response = await generateConversation({ topic, apiKey });
      setConversation(response);
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't generate a conversation on that topic. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTurn = (turn: ConversationTurn, index: number) => {
    const isSpeakerA = turn.speaker === 'A';
    return (
      <div key={index} className={`flex flex-col ${isSpeakerA ? 'items-start' : 'items-end'}`}>
        <div className={`max-w-[80%] p-3 rounded-lg ${isSpeakerA ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
           <p className="font-bold text-sm mb-1 flex items-center gap-2">
             <User className="h-4 w-4" />
             Speaker {turn.speaker}
           </p>
          <p className="text-lg">{turn.german}</p>
          <Separator className={`my-2 ${isSpeakerA ? 'bg-muted-foreground/20' : 'bg-primary-foreground/20'}`} />
          <p className="text-lg" dir="rtl">{turn.arabic}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">AI Conversation Generator</CardTitle>
        <CardDescription>Enter a topic to generate a practice conversation in German and Arabic.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., Ordering coffee"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow text-lg p-6"
            aria-label="Conversation topic"
            disabled={isLoading}
          />
          <Button type="submit" size="lg" className="p-6" disabled={isLoading || !topic.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            <span className="ml-2">{isLoading ? 'Generating...' : 'Generate'}</span>
          </Button>
        </form>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center pt-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>The AI is writing, please wait a moment...</p>
            </div>
        )}

        {conversation && (
            <div className="pt-4 animate-in fade-in-50 duration-500">
                <Alert>
                    <AlertTitle className="font-headline text-xl">Conversation: {conversation.topic}</AlertTitle>
                    <AlertDescription className="mt-4 space-y-4">
                        {conversation.dialogue.map(renderTurn)}
                    </AlertDescription>
                </Alert>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
