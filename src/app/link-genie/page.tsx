'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, Loader2, Link as LinkIcon } from "lucide-react";
import { model } from "@/lib/firebase"; // Using the default model from config

export default function LinkGeniePage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagic = async () => {
    if (!url) return;
    setLoading(true);
    try {
      // In 2026, Gemini 3 can often fetch/browse directly if configured, 
      // but for now, we'll ask it to summarize based on the provided link.
      const prompt = `Visit this URL and provide a 3-bullet point summary of the main content: ${url}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setSummary(response.text());
    } catch (error) {
      console.error("Link Genie Error:", error);
      setSummary("I couldn't fetch that link. Make sure it's a public URL!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader className="text-center">
          <Wand2 className="w-10 h-10 mx-auto text-purple-400 mb-2" />
          <CardTitle className="text-2xl font-bold">Link Genie</CardTitle>
          <p className="text-slate-400 text-sm text-center">
            Paste a link and let the genie summarize the magic.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="https://example.com/article" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button onClick={handleMagic} disabled={loading || !url} className="bg-purple-600 hover:bg-purple-700">
              {loading ? <Loader2 className="animate-spin" /> : "Summarize"}
            </Button>
          </div>
          {summary && (
            <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-purple-400 font-semibold mb-2">Genie's Summary:</h3>
              <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {summary}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}