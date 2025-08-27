
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FilePlus, Scissors, FileCode, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from 'pdf-lib';
import { pdfToWord } from '@/ai/flows/pdf-to-word';

const FileUploader = ({ onFileChange, multiple = false, accept = "application/pdf" }: { onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, multiple?: boolean, accept?: string }) => (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
        <input type="file" id="file-upload" className="hidden" multiple={multiple} accept={accept} onChange={onFileChange} />
        <Label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Drag & drop files here, or click to select files</p>
        </Label>
    </div>
);

const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const PdfMergeTool = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            toast({
                title: "Error",
                description: "Please select at least two PDF files to merge.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const mergedPdfBytes = await mergedPdf.save();
            
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            downloadFile(blob, 'merged.pdf');

            toast({
                title: "Success!",
                description: "Your files have been merged and downloaded.",
            });

        } catch (error) {
            console.error("Merge error:", error);
            toast({
                title: "Error",
                description: "Failed to merge PDFs. Please ensure you are uploading valid PDF files.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Merge PDFs</CardTitle>
                <CardDescription>Combine multiple PDFs into a single document.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUploader onFileChange={handleFileChange} multiple />
                {files.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Selected Files:</h4>
                        <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                            {files.map(file => <li key={file.name}>{file.name}</li>)}
                        </ul>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleMerge} disabled={isLoading || files.length < 2}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus className="mr-2 h-4 w-4" />}
                    Merge PDFs
                </Button>
            </CardFooter>
        </Card>
    )
}

export const PdfSplitTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSplit = async () => {
        if (!file) {
            toast({ title: "Error", description: "Please select a PDF file to split.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            const originalPdfBytes = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(originalPdfBytes);
            const pageCount = originalPdf.getPageCount();

            const start = parseInt(startPage, 10);
            const end = parseInt(endPage, 10);

            if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
                toast({ title: "Error", description: `Invalid page range. Please enter numbers between 1 and ${pageCount}.`, variant: "destructive" });
                setIsLoading(false);
                return;
            }

            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
            copiedPages.forEach((page) => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            downloadFile(blob, `${file.name.replace('.pdf', '')}_split_${start}-${end}.pdf`);

            toast({ title: "Success!", description: "Your PDF has been split and downloaded." });

        } catch (error) {
            console.error("Split error:", error);
            toast({ title: "Error", description: "Failed to split PDF. Please ensure you are uploading a valid PDF file.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Split PDF</CardTitle>
                <CardDescription>Extract a range of pages from a PDF into a new file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FileUploader onFileChange={handleFileChange} />
                {file && <p className="mt-4 text-sm text-muted-foreground">Selected: {file.name}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="start-page">From Page</Label>
                        <Input id="start-page" type="number" placeholder="e.g., 1" value={startPage} onChange={(e) => setStartPage(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="end-page">To Page</Label>
                        <Input id="end-page" type="number" placeholder="e.g., 5" value={endPage} onChange={(e) => setEndPage(e.target.value)} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSplit} disabled={isLoading || !file || !startPage || !endPage}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scissors className="mr-2 h-4 w-4" />}
                    Split PDF
                </Button>
            </CardFooter>
        </Card>
    );
}

export const PdfToWordTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else if (selectedFile) {
            toast({ title: "Invalid File", description: "Please select a valid PDF file.", variant: "destructive" });
            setFile(null);
            e.target.value = ''; // Reset file input
        }
    };

    const fileToDataUri = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handleConvert = async () => {
        if (!file) {
            toast({
                title: "Error",
                description: "Please select a PDF file to convert.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        
        try {
            const pdfDataUri = await fileToDataUri(file);
            const result = await pdfToWord({ pdfDataUri });

            const blob = new Blob([result.textContent], { type: 'text/plain' });
            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
            downloadFile(blob, `${originalName}.txt`);
            
            toast({
                title: "Success!",
                description: "Your PDF has been converted and downloaded as a text file.",
            });

        } catch (error: any) {
            console.error("Conversion error:", error);
            toast({
                title: "Conversion Failed",
                description: error.message || "An unexpected error occurred during conversion.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>PDF to Word (Text)</CardTitle>
                <CardDescription>Extract text from your PDF files and download as a .txt file.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUploader onFileChange={handleFileChange} />
                {file && <p className="mt-4 text-sm text-muted-foreground">Selected: {file.name}</p>}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleConvert} disabled={isLoading || !file}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
                    Convert to Text & Download
                </Button>
            </CardFooter>
        </Card>
    );
}
