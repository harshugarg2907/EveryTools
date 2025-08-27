
'use client';

import { PdfMergeTool, PdfSplitTool, PdfToWordTool } from '@/components/tools/pdf-tools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PdfToolsPage({ params }: { params: { tool: string } }) {
    const pathname = usePathname();

    const getToolFromPath = () => {
        if (pathname.includes('merge')) return 'merge';
        if (pathname.includes('split')) return 'split';
        if (pathname.includes('pdf-to-word')) return 'pdf-to-word';
        return 'merge';
    }

    return (
        <Tabs defaultValue={getToolFromPath()} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="merge" asChild>
                    <Link href="/pdf-tools/merge">Merge PDF</Link>
                </TabsTrigger>
                <TabsTrigger value="split" asChild>
                    <Link href="/pdf-tools/split">Split PDF</Link>
                </TabsTrigger>
                <TabsTrigger value="pdf-to-word" asChild>
                     <Link href="/pdf-tools/pdf-to-word">PDF to Word</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="merge">
                <PdfMergeTool />
            </TabsContent>
            <TabsContent value="split">
                <PdfSplitTool />
            </TabsContent>
            <TabsContent value="pdf-to-word">
                <PdfToWordTool />
            </TabsContent>
        </Tabs>
    );
}

