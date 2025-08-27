
'use client';

import { ZipTool, UnzipTool, CsvJsonConverter } from '@/components/tools/file-conversion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FileConversionPage({ params }: { params: { tool: string } }) {
    const pathname = usePathname();

    const getToolFromPath = () => {
        if (pathname.includes('zip')) return 'zip';
        if (pathname.includes('unzip')) return 'unzip';
        if (pathname.includes('csv-json')) return 'csv-json';
        return 'zip';
    }

    return (
        <Tabs defaultValue={getToolFromPath()} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="zip" asChild>
                    <Link href="/file-conversion/zip">ZIP Files</Link>
                </TabsTrigger>
                <TabsTrigger value="unzip" asChild>
                    <Link href="/file-conversion/unzip">Unzip Files</Link>
                </TabsTrigger>
                <TabsTrigger value="csv-json" asChild>
                     <Link href="/file-conversion/csv-json">CSV &lt;&gt; JSON</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="zip">
                <ZipTool />
            </TabsContent>
            <TabsContent value="unzip">
                <UnzipTool />
            </TabsContent>
            <TabsContent value="csv-json">
                <CsvJsonConverter />
            </TabsContent>
        </Tabs>
    );
}
