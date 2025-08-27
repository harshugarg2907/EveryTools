import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'EvryTools - Free Online Toolkit for Everyday Tasks',
  description: 'EvryTools offers a free online toolkit for file conversions, text editing, and productivity. Merge PDFs, convert images, count words, and much more. Fast, secure, and easy to use.',
  keywords: 'online tools, free tools, pdf tools, image converter, text utilities, file conversion, productivity tools',
  openGraph: {
    title: 'EvryTools - Free Online Toolkit for Everyday Tasks',
    description: 'Your all-in-one hub for everyday digital tasks. Convert files, edit text, and use handy calculators for free.',
    url: 'https://evry.tools', // Placeholder URL
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>" /> */}
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d91aff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'/%3E%3Cpath d='M12 22V12'/%3E%3Cpolyline points='3.29 7 12 12 20.71 7'/%3E%3Cpath d='m7.5 4.27 9 5.15'/%3E%3C/svg%3E" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-1478565523616324"></meta>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
