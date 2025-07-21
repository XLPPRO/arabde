import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ApiKeyProvider } from '@/context/api-key-context';
import { ApiKeyModal } from '@/components/api-key-modal';
import { Poppins, PT_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'ArabDe Translate',
  description: 'German-Arabic dictionary and translator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased min-h-screen flex flex-col', poppins.variable, ptSans.variable)}>
        <ApiKeyProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <AppHeader />
              <SidebarInset className='flex-1 flex flex-col'>
                <main className="flex-1">
                  {children}
                </main>
                <AppFooter />
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
          <ApiKeyModal />
        </ApiKeyProvider>
      </body>
    </html>
  );
}
