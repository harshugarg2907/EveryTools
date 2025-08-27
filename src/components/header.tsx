
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";
import { Input } from "./ui/input";
import { ThemeToggle } from "./theme-toggle";

const allTools = [
    { name: 'AI Summarizer', href: '/ai-summarizer', category: 'AI Tools' },
    { name: 'Merge PDF', href: '/pdf-tools/merge', category: 'PDF Tools' },
    { name: 'Split PDF', href: '/pdf-tools/split', category: 'PDF Tools' },
    { name: 'PDF to Word', href: '/pdf-tools/pdf-to-word', category: 'PDF Tools' },
    { name: 'Convert Image', href: '/image-tools/convert', category: 'Image Tools' },
    { name: 'Compress Image', href: '/image-tools/compress', category: 'Image Tools' },
    { name: 'Word Counter', href: '/text-tools/word-counter', category: 'Text Tools' },
    { name: 'Case Converter', href: '/text-tools/case-converter', category: 'Text Tools' },
    { name: 'ZIP Files', href: '/file-conversion/zip', category: 'File Conversion' },
    { name: 'Unzip Files', href: '/file-conversion/unzip', category: 'File Conversion' },
    { name: 'CSV <> JSON', href: '/file-conversion/csv-json', category: 'File Conversion' },
    { name: 'Age Calculator', href: '/utility-calculators/age-calculator', category: 'Calculators' },
    { name: 'BMI Calculator', href: '/utility-calculators/bmi-calculator', category: 'Calculators' },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(allTools);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery) {
      setFilteredTools(
        allTools.filter(tool =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredTools([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const onResultClick = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
           <SheetHeader className="sr-only">
             <SheetTitle>Menu</SheetTitle>
           </SheetHeader>
           <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1" ref={searchRef}>
        <form>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                 {isSearchFocused && searchQuery && (
                    <div className="absolute top-full mt-2 w-full md:w-2/3 lg:w-1/3 rounded-md border bg-background shadow-lg z-50">
                        {filteredTools.length > 0 ? (
                            <ul>
                                {filteredTools.map((tool) => (
                                    <li key={tool.href}>
                                        <Link
                                            href={tool.href}
                                            className="block px-4 py-2 text-sm hover:bg-accent"
                                            onClick={onResultClick}
                                        >
                                            {tool.name}
                                            <span className="text-xs text-muted-foreground ml-2">in {tool.category}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-4 text-sm text-muted-foreground">No tools found.</p>
                        )}
                    </div>
                )}
            </div>
        </form>
      </div>
      <ThemeToggle />
    </header>
  );
}
