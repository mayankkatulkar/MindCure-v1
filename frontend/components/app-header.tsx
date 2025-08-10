'use client';

import Link from 'next/link';
import { FileUp, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">
              MindCure AI
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Chat</span>
            </Link>
            
            <Link
              href="/file-upload"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/file-upload" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <FileUp className="h-4 w-4" />
              <span>Upload Documents</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
