"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from 'lucide-react';
import { summarizeText } from '@/ai/flows/summarize-text';
import { useToast } from "@/hooks/use-toast";

export function AiSummarizer() {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            toast({
                title: "Input required",
                description: "Please enter some text to summarize.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setSummary('');

        try {
            const result = await summarizeText({ text: inputText });
            setSummary(result.summary);
        } catch (error) {
            console.error("Summarization error:", error);
            toast({
                title: "Error",
                description: "Failed to summarize text. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>AI Text Summarizer</CardTitle>
                <CardDescription>Paste your text below and let our AI provide a concise summary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="input-text">Your Text</Label>
                        <Textarea
                            id="input-text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste a long article, report, or document here..."
                            rows={15}
                        />
                    </div>
                     <div>
                        <Label htmlFor="summary-text">AI Summary</Label>
                        <div className="relative">
                            <Textarea
                                id="summary-text"
                                value={summary}
                                readOnly
                                placeholder="Summary will appear here..."
                                rows={15}
                                className="bg-secondary"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSummarize} disabled={isLoading || !inputText}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Summarize
                </Button>
            </CardFooter>
        </Card>
    );
}
