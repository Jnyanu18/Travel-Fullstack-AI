'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { ItineraryDisplay } from '@/components/itinerary/ItineraryDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ItineraryLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-3/4" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { itinerary, isLoading, error } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !itinerary && !error) {
      router.replace('/');
    }
  }, [isLoading, itinerary, error, router]);

  return (
    <main className="flex-1 py-12 md:py-16">
      <div className="container max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/#planner">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planner
          </Link>
        </Button>
        {isLoading && <ItineraryLoadingSkeleton />}
        {error && !isLoading && (
          <div className="text-center py-16">
            <Frown className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-4 text-2xl font-headline font-semibold">
              Something went wrong
            </h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button asChild className="mt-6">
              <Link href="/">Try Again</Link>
            </Button>
          </div>
        )}
        {!isLoading && itinerary && <ItineraryDisplay itineraryData={itinerary} />}
      </div>
    </main>
  );
}
