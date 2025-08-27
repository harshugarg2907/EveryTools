
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Archive, ArchiveRestore, RefreshCw, Loader2, Download, FileUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import JSZip from 'jszip';
import type { JSZipObject } from 'jszip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FileUploader = ({ onFileSelect, multiple = false, accept }: { onFileSelect: (files: FileList) => void, multiple?: boolean, accept?: string }) => (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
        <input type="file" id="file-conv-upload" className="hidden" multiple={multiple} accept={accept} onChange={(e) => e.target.files && onFileSelect(e.target.files)} />
        <Label htmlFor="file-conv-upload" className="cursor-pointer">
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

export const ZipTool = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleZip = async () => {
        if (files.length === 0) {
            toast({ title: "Error", description: "Please select files to zip.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const zip = new JSZip();
            files.forEach(file => {
                zip.file(file.name, file);
            });
            const blob = await zip.generateAsync({ type: 'blob' });
            downloadFile(blob, 'archive.zip');
            toast({ title: "Success!", description: "Files zipped and downloaded." });
        } catch (error) {
            console.error("Zip error:", error);
            toast({ title: "Error", description: "Could not zip files.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>ZIP Files</CardTitle>
                <CardDescription>Compress multiple files into a single ZIP archive.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUploader onFileSelect={(selected) => setFiles(Array.from(selected))} multiple />
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
                <Button onClick={handleZip} disabled={isLoading || files.length === 0}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
                    ZIP Files & Download
                </Button>
            </CardFooter>
        </Card>
    );
};

export const UnzipTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [unzippedFiles, setUnzippedFiles] = useState<JSZipObject[]>([]);
    const { toast } = useToast();

    const handleFileSelect = (files: FileList) => {
        const selectedFile = files[0];
        setFile(selectedFile);
        setUnzippedFiles([]);
        if (selectedFile) {
            handlePreview(selectedFile);
        }
    };

    const handlePreview = async (selectedFile: File) => {
        if (!selectedFile) {
            toast({ title: "Error", description: "Please select a ZIP file.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const zip = await JSZip.loadAsync(selectedFile);
            const filesInZip = Object.values(zip.files).filter(f => !f.dir);
            setUnzippedFiles(filesInZip);
            if (filesInZip.length === 0) {
                 toast({ title: "Info", description: "This ZIP file is empty or contains only folders." });
            }
        } catch (error) {
            console.error("Unzip preview error:", error);
            setUnzippedFiles([]);
            toast({ title: "Error", description: "Could not read ZIP file. Make sure it's a valid archive.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const downloadSingleFile = async (zipObject: JSZipObject) => {
        try {
            const blob = await zipObject.async('blob');
            downloadFile(blob, zipObject.name);
            toast({ title: "Success!", description: `Downloaded ${zipObject.name}.` });
        } catch (error) {
            console.error("Download error:", error);
            toast({ title: "Error", description: `Could not download ${zipObject.name}.`, variant: "destructive" });
        }
    };

    const downloadAllFiles = async () => {
        if (unzippedFiles.length === 0) return;
        toast({ title: "Starting Download", description: "Your files are being prepared for download." });
        for (const zipObject of unzippedFiles) {
            try {
                const blob = await zipObject.async('blob');
                downloadFile(blob, zipObject.name);
            } catch (error) {
                 console.error(`Failed to download ${zipObject.name}`, error);
                 toast({ title: "Download Error", description: `Skipped ${zipObject.name} due to an error.`, variant: "destructive" });
            }
        }
        toast({ title: "Complete!", description: "All files have been downloaded." });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Unzip Files</CardTitle>
                <CardDescription>Extract files from a ZIP archive. Preview contents and download what you need.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUploader onFileSelect={handleFileSelect} accept=".zip" />
                {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span className="text-muted-foreground">Reading archive...</span>
                    </div>
                )}
                {unzippedFiles.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold">Files in Archive ({unzippedFiles.length})</h4>
                            <Button onClick={downloadAllFiles} size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download All
                            </Button>
                        </div>
                        <div className="border rounded-md max-h-60 overflow-y-auto">
                            <ul className="divide-y">
                                {unzippedFiles.map(item => (
                                    <li key={item.name} className="flex justify-between items-center p-3">
                                        <span className="text-sm text-muted-foreground truncate pr-4">{item.name}</span>
                                        <Button variant="outline" size="sm" onClick={() => downloadSingleFile(item)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
             <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    {file ? `Selected file: ${file.name}`: "Please select a ZIP file to see its contents."}
                </p>
            </CardFooter>
        </Card>
    );
};


export const CsvJsonConverter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [conversion, setConversion] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
    const { toast } = useToast();
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<string[][]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handleFileSelect = (files: FileList) => {
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setInput(text);
                toast({ title: "File loaded", description: `${file.name} has been loaded.` });
            };
            reader.readAsText(file);
        }
    };

    const handleConvert = () => {
        setOutput('');
        setTableHeaders([]);
        setTableRows([]);
        if (!input.trim()) {
            toast({ title: "Error", description: "Input cannot be empty.", variant: "destructive" });
            return;
        }
        try {
            if (conversion === 'csv-to-json') {
                const lines = input.trim().split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) {
                    setOutput('[]');
                    return;
                }
                const headerLine = lines[0];
                const commaCount = (headerLine.match(/,/g) || []).length;
                const semicolonCount = (headerLine.match(/;/g) || []).length;
                
                const delimiter = semicolonCount > commaCount ? ';' : ',';

                const header = lines[0].split(delimiter).map(h => h.trim());
                const rows = lines.slice(1).map(line => line.split(delimiter).map(d => d.trim()));
                
                setTableHeaders(header);
                setTableRows(rows);
                setCurrentPage(1);

                const result = rows.map(row => {
                    return header.reduce((obj, nextKey, index) => {
                        (obj as any)[nextKey] = row[index];
                        return obj;
                    }, {});
                });
                setOutput(JSON.stringify(result, null, 2));
            } else {
                let data;
                try {
                    // Handle line-delimited JSON
                    const jsonObjects = `[${input.trim().replace(/}\s*{/g, '},{')}]`;
                    data = JSON.parse(jsonObjects);
                } catch (e) {
                     // Fallback for standard JSON
                    try {
                        data = JSON.parse(input);
                    } catch (jsonError) {
                        throw new Error('Invalid JSON format. Please check your input.');
                    }
                }

                if (!Array.isArray(data) || data.length === 0) {
                     setOutput('');
                     throw new Error('JSON must be a non-empty array of objects.');
                }
                const header = Object.keys(data[0]);
                const csv = [
                    header.join(','),
                    ...data.map(row => header.map(fieldName => row[fieldName]).join(','))
                ].join('\n');
                setOutput(csv);
            }
             toast({ title: "Success!", description: "Conversion successful."});
        } catch (error: any) {
            console.error("Conversion error:", error);
            setOutput('');
            toast({ title: "Conversion Error", description: `Could not convert data. ${error.message}`, variant: "destructive" });
        }
    };

    const totalPages = Math.ceil(tableRows.length / rowsPerPage);
    const paginatedRows = tableRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const resetState = () => {
        setInput('');
        setOutput('');
        setTableHeaders([]);
        setTableRows([]);
        setCurrentPage(1);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>CSV &lt;&gt; JSON Converter</CardTitle>
                <CardDescription>Convert data between CSV and JSON formats by pasting text or uploading a file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>{conversion === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</Label>
                        <Textarea value={input} onChange={e => setInput(e.target.value)} rows={10} placeholder="Paste your data here, or upload a file below." />
                    </div>
                     <div>
                        <Label>{conversion === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</Label>
                        <Textarea value={output} readOnly rows={10} placeholder="Conversion result will appear here." className="bg-secondary" />
                    </div>
                </div>
                 <div className="pt-2">
                    <input type="file" id="text-file-upload" className="hidden" accept=".csv, .json, .txt" onChange={(e) => e.target.files && handleFileSelect(e.target.files)} />
                    <Button variant="outline" asChild>
                         <Label htmlFor="text-file-upload" className="cursor-pointer">
                            <FileUp className="mr-2 h-4 w-4" />
                            Upload File
                        </Label>
                    </Button>
                </div>
                 {conversion === 'csv-to-json' && tableHeaders.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold">CSV Data Preview</h4>
                        <div className="border rounded-md">
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableHead key={index}>{header}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRows.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}>{cell}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                    <Button onClick={handleConvert}><RefreshCw className="mr-2 h-4 w-4" /> Convert</Button>
                    <Button variant="outline" onClick={() => {
                        const currentOutput = output;
                        resetState();
                        setInput(currentOutput);
                        setConversion(c => c === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
                    }}>
                        Swap
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Mode: {conversion === 'csv-to-json' ? 'CSV to JSON' : 'JSON to CSV'}
                </p>
            </CardFooter>
        </Card>
    );
};
