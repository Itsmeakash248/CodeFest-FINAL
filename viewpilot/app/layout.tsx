import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';
import { InterviewProvider } from '@/lib/interview-context';
import { Navbar } from '@/components/Navbar';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ViewPilot — AI-Powered Interactive Interview Coach',
  description:
    'Prepare for high-stakes interviews with realistic AI-driven conversations, structured 4-dimension rubrics, and evidence-backed feedback. Built by Team MoonCraft for CodeFest 2026.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoFlex.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>
          <InterviewProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </InterviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
