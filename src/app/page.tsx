
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, Image, Type, Calculator, FileCog, BrainCircuit, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const toolCategories = [
  {
    name: 'PDF Tools',
    description: 'Merge, split, and convert your PDF files.',
    icon: <FileText className="w-8 h-8 text-primary" />,
    href: '/pdf-tools/merge',
    tools: ['Merge PDF', 'Split PDF', 'PDF to Word'],
  },
  {
    name: 'Image Tools',
    description: 'Convert, compress, and edit your images.',
    icon: <Image className="w-8 h-8 text-primary" />,
    href: '/image-tools/convert',
    tools: ['JPG <> PNG', 'Compress Images'],
  },
  {
    name: 'Text Tools',
    description: 'Analyze and manipulate your text with ease.',
    icon: <Type className="w-8 h-8 text-primary" />,
    href: '/text-tools/word-counter',
    tools: ['Word Counter', 'Case Converter'],
  },
  {
    name: 'Utility Calculators',
    description: 'Handy calculators for everyday use.',
    icon: <Calculator className="w-8 h-8 text-primary" />,
    href: '/utility-calculators/age-calculator',
    tools: ['Age Calculator', 'BMI Calculator'],
  },
  {
    name: 'File Conversion',
    description: 'Convert files between different formats.',
    icon: <FileCog className="w-8 h-8 text-primary" />,
    href: '/file-conversion/zip',
    tools: ['ZIP/Unzip', 'CSV <> JSON'],
  },
  {
    name: 'AI Text Summarizer',
    description: 'Intelligently summarize long texts.',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    href: '/ai-summarizer',
    tools: ['Summarize Text'],
    isNew: true,
  },
];

export default function Home() {
  return (
    <>
      <header className="py-16 text-center">
        <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter">
          All The Tools You Need, in One Place
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          <span className="text-primary font-semibold">EvryTools</span> is your free online toolkit for file conversions, image editing, text manipulation, and much more. Simple, fast, and secure.
        </p>
         <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/pdf-tools/merge">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#tools">Explore Tools</Link>
          </Button>
        </div>
      </header>
      
      <div id="tools" className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolCategories.map((category) => (
            <Card key={category.name} className="flex flex-col hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                  {category.icon}
                  <CardTitle className="font-headline text-2xl">{category.name}</CardTitle>
                </div>
                {category.isNew && <Badge>New</Badge>}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardDescription className="mb-4">{category.description}</CardDescription>
                <div className="flex-grow space-y-2 mb-4">
                  {category.tools.map(tool => (
                    <div key={tool} className="flex items-center text-sm text-muted-foreground">
                       <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-auto w-full group" variant="secondary">
                  <Link href={category.href}>
                    Go to Tools
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
