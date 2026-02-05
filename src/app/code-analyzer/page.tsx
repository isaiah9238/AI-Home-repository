import { CodeAnalyzerClient } from './code-analyzer-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Code Analyzer | AI Home',
    description: 'Analyze code snippets for bugs, vulnerabilities, and performance bottlenecks.',
};

export default function CodeAnalyzerPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Code Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Paste your code snippet below to get a detailed analysis from our AI.
        </p>
      </div>
      <CodeAnalyzerClient />
    </div>
  );
}
