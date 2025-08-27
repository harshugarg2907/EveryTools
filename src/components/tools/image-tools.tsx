
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, RefreshCw, Minimize, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

const FileUploader = ({ onFileSelect, multiple = false, accept = "image/jpeg, image/png" }: { onFileSelect: (files: FileList) => void, multiple?: boolean, accept?: string }) => (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
        <input type="file" id="image-upload" className="hidden" multiple={multiple} accept={accept} onChange={(e) => e.target.files && onFileSelect(e.target.files)} />
        <Label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Drag & drop images here, or click to select files</p>
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

export const ImageConverter = () => {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState('png');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleConvert = async () => {
        if (!file) {
            toast({
                title: "Error",
                description: "Please select an image to convert.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        throw new Error('Could not get canvas context');
                    }
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                            downloadFile(blob, `${originalName}.${format}`);
                            toast({
                                title: "Success!",
                                description: `Your image has been converted to ${format.toUpperCase()}.`,
                            });
                        }
                        setIsLoading(false);
                    }, `image/${format}`);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Conversion error:", error);
            toast({
                title: "Error",
                description: "Failed to convert image. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Convert Image</CardTitle>
                <CardDescription>Convert images between JPG and PNG formats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FileUploader onFileSelect={(files) => setFile(files[0])} />
                {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                <div className="flex items-center space-x-4">
                    <Label>Convert to:</Label>
                    <Select onValueChange={setFormat} defaultValue={format}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPG</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleConvert} disabled={isLoading || !file}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Convert & Download
                </Button>
            </CardFooter>
        </Card>
    );
};

export const ImageCompressor = () => {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(75);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleCompress = async () => {
        if (!file) {
            toast({
                title: "Error",
                description: "Please select an image to compress.",
                variant: "destructive",
            });
            return;
        }
        if (!file.type.startsWith('image/jpeg')) {
            toast({
                title: "Info",
                description: "Compression is only supported for JPG/JPEG images currently.",
            });
            return;
        }
        setIsLoading(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        throw new Error('Could not get canvas context');
                    }
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                            downloadFile(blob, `${originalName}_compressed.jpg`);
                            toast({
                                title: "Success!",
                                description: `Image compressed to ${quality}% quality. Original size: ${(file.size / 1024).toFixed(2)} KB, New size: ${(blob.size / 1024).toFixed(2)} KB.`,
                            });
                        }
                        setIsLoading(false);
                    }, 'image/jpeg', quality / 100);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Compression error:", error);
            toast({
                title: "Error",
                description: "Failed to compress image.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compress Image</CardTitle>
                <CardDescription>Reduce the file size of your JPG/JPEG images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FileUploader onFileSelect={(files) => setFile(files[0])} accept="image/jpeg" />
                {file && <p className="mt-4 text-sm text-muted-foreground">Selected: {file.name}</p>}
                <div className="space-y-2">
                    <Label>Quality: {quality}%</Label>
                    <Slider defaultValue={[quality]} max={100} step={1} onValueChange={(value) => setQuality(value[0])} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleCompress} disabled={isLoading || !file}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Minimize className="mr-2 h-4 w-4" />}
                    Compress & Download
                </Button>
            </CardFooter>
        </Card>
    );
}
