import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataPrivacyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Data Privacy Policy</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-bold text-destructive">
            [This is a template. You must replace this content with your own Data Privacy Policy.]
          </p>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to ArabDe Translate. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this policy carefully.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Usage Data:</strong> We may automatically collect usage data (such as search queries and translated texts) to improve our AI models and service functionality. This data is handled anonymously where possible.</li>
              <li><strong>Contact Information:</strong> If you contact us directly, we may receive additional information about you such as your name, email address, and the contents of the message.</li>
            </ul>
          </section>
           <section className="space-y-2">
            <h2 className="text-xl font-semibold">3. Use of Your Information</h2>
            <p>
              Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
            </p>
             <ul className="list-disc pl-6 space-y-1">
              <li>Improve our website and services.</li>
              <li>Respond to your comments and questions.</li>
              <li>Monitor and analyze usage and trends to improve your experience.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">4. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us using the form on our contact page.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
