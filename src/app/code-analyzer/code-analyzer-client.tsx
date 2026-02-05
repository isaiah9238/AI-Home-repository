'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { performCodeAnalysis, type CodeAnalysisState } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const languages = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'TypeScript',
  'Go',
  'Rust',
  'SQL',
  'Other'
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : 'Analyze Code'}
    </Button>
  );
}

export function CodeAnalyzerClient() {
  const { toast } = useToast();
  const initialState: CodeAnalysisState = { message: null, errors: {}, data: null };
  const [state, dispatch] = useFormState(performCodeAnalysis, initialState);

  useEffect(() => {
    if (state.message && state.message !== 'Validation failed. Please check your input.' && state.message !== 'Analysis successful.') {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.message,
      });
    }
  }, [state.message, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Code</CardTitle>
          <CardDescription>Select a language and paste your code to be analyzed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select name="language" required>
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {state.errors?.language && (
                <p className="text-sm font-medium text-destructive mt-2">{state.errors.language[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="code">Code Snippet</Label>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code here..."
                className="min-h-[300px] font-mono text-sm"
                required
              />
              {state.errors?.code && (
                <p className="text-sm font-medium text-destructive mt-2">{state.errors.code[0]}</p>
              )}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <CardDescription>The AI's feedback on your code will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.data ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">Complexity</h3>
                <p className="text-muted-foreground text-sm">{state.data.complexity}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Potential Bugs</h3>
                <p className="text-muted-foreground text-sm">{state.data.bugs}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Security Vulnerabilities</h3>
                <p className="text-muted-foreground text-sm">{state.data.vulnerabilities}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Suggested Fixes</h3>
                <p className="text-muted-foreground text-sm">{state.data.suggestedFixes}</p>
              </div>
            </div>
          ) : (
             <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Awaiting Analysis</AlertTitle>
              <AlertDescription>
                Submit a code snippet to see the analysis results here.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
