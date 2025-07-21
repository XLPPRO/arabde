import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Gamepad2, Languages, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">About ArabDe Translate</CardTitle>
          <p className="text-muted-foreground">Your Modern German-Arabic Language Companion</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg">
              ArabDe Translate was born from a passion for language and a desire to bridge the communication gap between German and Arabic speakers. We believe that learning a new language should be an intuitive, engaging, and enriching experience. Our mission is to provide a clean, fast, and user-friendly tool that serves not just as a dictionary, but as a comprehensive learning companion.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-2xl font-headline font-semibold text-center">Our Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <BookOpen className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">Comprehensive Dictionary</h4>
                  <p className="text-muted-foreground">Instantly search for German or Arabic words and phrases with high accuracy and get grammatical context.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Languages className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">Full-Text Translation</h4>
                  <p className="text-muted-foreground">Translate longer sentences and paragraphs with ease, and listen to the pronunciation to perfect your accent.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Gamepad2 className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">Interactive Translation Game</h4>
                  <p className="text-muted-foreground">Test your skills with our translation challenge, where you get instant AI-powered feedback on your answers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Sparkles className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">AI Grammar Explanations</h4>
                  <p className="text-muted-foreground">Understand the "why" behind the translation with smart grammar insights powered by generative AI.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          <div className="text-center">
             <h3 className="text-2xl font-headline font-semibold">Our Commitment</h3>
             <p className="text-muted-foreground mt-2">
                This project is proudly built with Next.js, Genkit, and ShadCN UI, showcasing modern web and AI technologies. We are continuously working to improve and expand our features to make ArabDe Translate the best German-Arabic language tool available.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
