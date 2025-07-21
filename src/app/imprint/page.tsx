import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImprintPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Imprint (Impressum)</CardTitle>
          <CardDescription>Information according to § 5 TMG (German Telemedia Act)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section className="space-y-1">
            <h2 className="text-xl font-semibold">Company Name / Your Name</h2>
            <p className="text-muted-foreground">
              ArabDe Translate<br />
              Soufian MALIH<br />
              Morocco
            </p>
          </section>
          <section className="space-y-1">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              <strong>Email:</strong> malihsoufian17@gmail.com
            </p>
          </section>
          <section className="space-y-1">
            <h2 className="text-xl font-semibold">Represented by</h2>
            <p className="text-muted-foreground">
              Soufian MALIH
            </p>
          </section>
           <section className="space-y-1">
            <h2 className="text-xl font-semibold">Disclaimer</h2>
            <p className="text-muted-foreground">
              Accountability for content: The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
