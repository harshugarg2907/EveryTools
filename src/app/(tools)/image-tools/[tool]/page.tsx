
'use client';

import { ImageConverter, ImageCompressor } from '@/components/tools/image-tools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ImageToolsPage({ params }: { params: { tool: string } }) {
    const pathname = usePathname();

    const getToolFromPath = () => {
        if (pathname.includes('convert')) return 'convert';
        if (pathname.includes('compress')) return 'compress';
        return 'convert';
    }

    return (
        <Tabs defaultValue={getToolFromPath()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="convert" asChild>
                    <Link href="/image-tools/convert">Convert</Link>
                </TabsTrigger>
                <TabsTrigger value="compress" asChild>
                    <Link href="/image-tools/compress">Compress</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="convert">
                <ImageConverter />
            </TabsContent>
            <TabsContent value="compress">
                <ImageCompressor />
            </TabsContent>
        </Tabs>
    );
}
