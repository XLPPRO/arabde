"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface SearchCardProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
}

export function SearchCard({ onSearch, isLoading = false }: SearchCardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">German-Arabic Dictionary</CardTitle>
        <CardDescription>Enter a word in German or Arabic to get the translation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="e.g., Haus or بيت"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow text-lg p-6"
            aria-label="Search term"
            disabled={isLoading}
          />
          <Button type="submit" size="lg" className="p-6" disabled={isLoading || !searchTerm.trim()}>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
            <span className="ml-2">{isLoading ? 'Translating...' : 'Translate'}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
