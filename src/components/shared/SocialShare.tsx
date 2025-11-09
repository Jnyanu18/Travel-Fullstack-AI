'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Facebook } from 'lucide-react';

export function SocialShare() {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const text = encodeURIComponent('Check out my awesome travel plan from TravelWise!');

  return (
    <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <Button
        variant="outline"
        size="icon"
        asChild
      >
        <a 
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="icon"
        asChild
      >
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
