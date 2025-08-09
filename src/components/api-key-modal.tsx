"use client";

import { useState, useEffect } from 'react';
import { useApiKey } from '@/context/api-key-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

export function ApiKeyModal() {
  const { isModalOpen, setIsModalOpen, setApiKey } = useApiKey();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(null);

  // Use useEffect to load the key from local storage when the modal opens
  useEffect(() => {
    if (isModalOpen) {
      const storedKey = localStorage.getItem('geminiAPIKey');
      if (storedKey) {
        setKey(storedKey);
      } else {
        setKey('');
      }
      setError(null);
      setShowKey(false);
    }
  }, [isModalOpen]);

  const handleSave = () => {
    if (key.trim() === '') {
      setError('API key cannot be empty.');
      return;
    }
    setError(null);
    setApiKey(key);
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Gemini API Key Required</DialogTitle>
          <DialogDescription>
            Please enter your Google Gemini API key to use the AI features of this application. Your key is stored only in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right col-span-4 text-left">
              Gemini API Key
            </Label>
            <div className="relative col-span-4">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="pr-10"
                placeholder="Enter your API key"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
            <Button variant="link">Get an API Key</Button>
          </a>
          <Button type="button" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
