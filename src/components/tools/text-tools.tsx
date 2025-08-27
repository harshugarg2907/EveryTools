
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const WordCounter = () => {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        const words = text.trim().split(/\s+/).filter(Boolean);
        const characters = text.length;
        const sentences = text.split(/[.?!]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n+/).filter(Boolean).length;
        return {
            words: words.length,
            characters,
            sentences,
            paragraphs,
        };
    }, [text]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Word Counter</CardTitle>
                <CardDescription>Count words, characters, sentences, and paragraphs in your text.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Paste your text here..."
                    rows={10}
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-primary">{stats.words}</p>
                        <p className="text-sm text-muted-foreground">Words</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-primary">{stats.characters}</p>
                        <p className="text-sm text-muted-foreground">Characters</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-primary">{stats.sentences}</p>
                        <p className="text-sm text-muted-foreground">Sentences</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-primary">{stats.paragraphs}</p>
                        <p className="text-sm text-muted-foreground">Paragraphs</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const CaseConverter = () => {
    const [text, setText] = useState('');

    const toUpperCase = () => setText(text.toUpperCase());
    const toLowerCase = () => setText(text.toLowerCase());
    const toTitleCase = () => setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
    const clearText = () => setText('');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Case Converter</CardTitle>
                <CardDescription>Convert text to uppercase, lowercase, or title case.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Paste your text here..."
                    rows={10}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={toUpperCase}>UPPER CASE</Button>
                    <Button onClick={toLowerCase}>lower case</Button>
                    <Button onClick={toTitleCase}>Title Case</Button>
                    <Button variant="outline" onClick={clearText}>Clear</Button>
                </div>
            </CardContent>
        </Card>
    );
};
