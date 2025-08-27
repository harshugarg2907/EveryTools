import { type Metadata } from 'next';
import { AiSummarizer } from '@/components/tools/ai-summarizer';

export const metadata: Metadata = {
  title: 'Free AI Text Summarizer | Condense Articles Instantly | EvryTools',
  description: 'Use our free AI-powered text summarizer to quickly get the key points from long articles, documents, or reports. Save time and read smarter.',
  keywords: 'ai summarizer, text summarizer, summarize text, article summarizer, free ai tool',
};

export default function AiSummarizerPage() {
  return (
    <div>
      <AiSummarizer />
    </div>
  );
}
