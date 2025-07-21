import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Terms of Use</CardTitle>
           <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="font-bold text-destructive">
            [This is a template. You must replace this content with your own Terms of Use.]
          </p>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
            <p>
              By using our application, ArabDe Translate ("Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">2. Use of the Service</h2>
            <p>
              You may use the Service for personal, non-commercial purposes. You agree not to misuse the Service or help anyone else to do so. You are responsible for any content you provide, including compliance with applicable laws, rules, and regulations.
            </p>
          </section>
           <section className="space-y-2">
            <h2 className="text-xl font-semibold">3. Disclaimers</h2>
            <p>
              The Service is provided "as-is" without any warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on the Service and neither adopt nor endorse, nor are responsible for, the accuracy or reliability of any opinion, advice, or statement made.
            </p>
          </section>
           <section className="space-y-2">
            <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
            <p>
             To the fullest extent permitted by law, ArabDe Translate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
