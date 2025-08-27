
'use client';

import { WordCounter, CaseConverter } from '@/components/tools/text-tools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TextToolsPage({ params }: { params: { tool: string } }) {
    const pathname = usePathname();

    const getToolFromPath = () => {
        if (pathname.includes('word-counter')) return 'word-counter';
        if (pathname.includes('case-converter')) return 'case-converter';
        return 'word-counter';
    }

    return (
        <Tabs defaultValue={getToolFromPath()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="word-counter" asChild>
                    <Link href="/text-tools/word-counter">Word Counter</Link>
                </TabsTrigger>
                <TabsTrigger value="case-converter" asChild>
                    <Link href="/text-tools/case-converter">Case Converter</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="word-counter">
                <WordCounter />
            </TabsContent>
            <TabsContent value="case-converter">
                <CaseConverter />
            </TabsContent>
        </Tabs>
    );
}
