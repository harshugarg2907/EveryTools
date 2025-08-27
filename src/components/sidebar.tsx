
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BrainCircuit,
  Calculator,
  FileCog,
  FileText,
  Image,
  Type,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const toolCategories = [
  {
    name: 'AI Tools',
    icon: BrainCircuit,
    href: '/ai-summarizer',
    subItems: [
      { name: 'AI Summarizer', href: '/ai-summarizer' },
    ]
  },
  {
    name: 'PDF Tools',
    icon: FileText,
    href: '/pdf-tools',
    subItems: [
      { name: 'Merge PDF', href: '/pdf-tools/merge' },
      { name: 'Split PDF', href: '/pdf-tools/split' },
      { name: 'PDF to Word', href: '/pdf-tools/pdf-to-word' },
    ],
  },
  {
    name: 'Image Tools',
    icon: Image,
    href: '/image-tools',
    subItems: [
      { name: 'Convert Image', href: '/image-tools/convert' },
      { name: 'Compress Image', href: '/image-tools/compress' },
    ],
  },
  {
    name: 'Text Tools',
    icon: Type,
    href: '/text-tools',
    subItems: [
      { name: 'Word Counter', href: '/text-tools/word-counter' },
      { name: 'Case Converter', href: '/text-tools/case-converter' },
    ],
  },
  {
    name: 'File Conversion',
    icon: FileCog,
    href: '/file-conversion',
    subItems: [
      { name: 'ZIP Files', href: '/file-conversion/zip' },
      { name: 'Unzip Files', href: '/file-conversion/unzip' },
      { name: 'CSV <> JSON', href: '/file-conversion/csv-json' },
    ],
  },
  {
    name: 'Calculators',
    icon: Calculator,
    href: '/utility-calculators',
    subItems: [
      { name: 'Age Calculator', href: '/utility-calculators/age-calculator' },
      { name: 'BMI Calculator', href: '/utility-calculators/bmi-calculator' },
    ],
  },
];

export function SidebarContent() {
  const pathname = usePathname();
  
  const activeCategory = toolCategories.find(category => pathname.startsWith(category.href));
  const defaultValue = activeCategory ? [activeCategory.name] : [];

  return (
    <>
       <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl">EvryTools</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Accordion type="multiple" defaultValue={defaultValue} className="w-full">
                {toolCategories.map((category) => (
                    <AccordionItem key={category.name} value={category.name} className="border-b-0">
                        <AccordionTrigger className="text-base py-3 hover:no-underline justify-start gap-3 [&[data-state=open]>svg]:rotate-90">
                          <category.icon className="h-5 w-5" />
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pb-0">
                            <div className="flex flex-col gap-1">
                                {category.subItems.map((item) => (
                                    <Button
                                      key={item.name}
                                      variant={pathname === item.href ? 'secondary' : 'ghost'}
                                      className="w-full justify-start"
                                      asChild
                                    >
                                      <Link href={item.href}>
                                        {item.name}
                                      </Link>
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </nav>
      </div>
    </>
  );
}

export function Sidebar() {
    return (
        <aside className="hidden border-r bg-muted/40 md:block">
            <SidebarContent />
        </aside>
    );
}
