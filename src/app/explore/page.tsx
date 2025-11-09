'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import {
  ExploreLocationOutput,
} from '@/ai/flows/explore-location';
import {
  PersonalizedRecommendationsOutput,
} from '@/ai/flows/get-personalized-recommendations';
import { exploreLocationAction, getRecommendationsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Compass, Loader2, MapPin, Hotel, Utensils, Sparkles, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const exploreSchema = z.object({
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
});

const recommendSchema = z.object({
  preferences: z.string().min(10, { message: 'Preferences must be at least 10 characters.' }),
});

function ResultItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Star className="h-4 w-4 mt-1 shrink-0 text-accent" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function LoadingSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex-row items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function ExplorePage() {
  const [exploreResults, setExploreResults] = useState<ExploreLocationOutput | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isLoadingExplore, setIsLoadingExplore] = useState(false);
  const [isLoadingRecommend, setIsLoadingRecommend] = useState(false);
  const [exploredLocation, setExploredLocation] = useState('');
  const { toast } = useToast();
  
  const attractionImage = PlaceHolderImages.find((img) => img.id === 'attraction-placeholder');

  const exploreForm = useForm<z.infer<typeof exploreSchema>>({
    resolver: zodResolver(exploreSchema),
    defaultValues: { location: '' },
  });

  const recommendForm = useForm<z.infer<typeof recommendSchema>>({
    resolver: zodResolver(recommendSchema),
    defaultValues: { preferences: '' },
  });

  const handleExplore = async (values: z.infer<typeof exploreSchema>) => {
    setIsLoadingExplore(true);
    setExploreResults(null);
    setRecommendations(null);
    setExploredLocation(values.location);

    const result = await exploreLocationAction({ location: values.location });
    setIsLoadingExplore(false);

    if (result.success && result.data) {
      setExploreResults(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Exploration Failed', description: result.error });
    }
  };

  const handleRecommend = async (values: z.infer<typeof recommendSchema>) => {
    if (!exploredLocation) {
        toast({ variant: 'destructive', title: 'No Location', description: 'Please explore a location first.' });
        return;
    }
    setIsLoadingRecommend(true);
    setRecommendations(null);

    const result = await getRecommendationsAction({
      location: exploredLocation,
      preferences: values.preferences,
    });
    setIsLoadingRecommend(false);

    if (result.success && result.data) {
      setRecommendations(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Recommendation Failed', description: result.error });
    }
  };

  const renderList = (data: string | undefined) => {
    if (!data) return <p className="text-muted-foreground">No information available.</p>;
    const items = data.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean);
    return (
        <div className="space-y-3">
            {items.map((item, index) => <ResultItem key={index} text={item} />)}
        </div>
    );
  };

  return (
    <main className="flex-1">
      <section className="py-12 md:py-16 text-center bg-card">
        <div className="container">
          <h1 className="font-headline text-4xl md:text-5xl">Explore a Destination</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
            Get to know a city before you go. Discover top attractions, restaurants, hotels, and more.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-4xl space-y-12">
          {/* Explore Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Compass className="h-6 w-6 text-primary" />
                1. Explore a Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...exploreForm}>
                <form onSubmit={exploreForm.handleSubmit(handleExplore)} className="flex items-start gap-4">
                  <FormField
                    control={exploreForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel className="sr-only">Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tokyo, Japan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoadingExplore}>
                    {isLoadingExplore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Explore
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Explore Results */}
          {(isLoadingExplore || exploreResults) && (
            <div className="space-y-8">
              <Separator />
               <h2 className="text-3xl font-headline text-center">Discovering {exploredLocation}</h2>
              {isLoadingExplore ? <LoadingSkeleton /> : (
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader className="flex-row items-center gap-4"><MapPin className="h-6 w-6 text-primary shrink-0" /><CardTitle>Popular Attractions</CardTitle></CardHeader>
                    <CardContent>{renderList(exploreResults?.popularAttractions)}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex-row items-center gap-4"><Star className="h-6 w-6 text-primary shrink-0" /><CardTitle>Points of Interest</CardTitle></CardHeader>
                    <CardContent>{renderList(exploreResults?.pointsOfInterest)}</CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex-row items-center gap-4"><Utensils className="h-6 w-6 text-primary shrink-0" /><CardTitle>Restaurants</CardTitle></CardHeader>
                    <CardContent>{renderList(exploreResults?.restaurants)}</CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex-row items-center gap-4"><Hotel className="h-6 w-6 text-primary shrink-0" /><CardTitle>Hotels</CardTitle></CardHeader>
                    <CardContent>{renderList(exploreResults?.hotels)}</CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Form */}
          {exploreResults && (
            <div className="space-y-12">
            <Separator />
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Sparkles className="h-6 w-6 text-accent" />
                    2. Get Personalized Recommendations
                </CardTitle>
                <CardDescription>Now, tell us what you like, and we'll suggest activities, restaurants, and places to stay.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...recommendForm}>
                    <form onSubmit={recommendForm.handleSubmit(handleRecommend)} className="space-y-4">
                    <FormField
                        control={recommendForm.control}
                        name="preferences"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Preferences</FormLabel>
                            <FormControl>
                            <Textarea placeholder="e.g., Love trying street food, enjoy modern art, and looking for budget-friendly hotels." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoadingRecommend} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        {isLoadingRecommend && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Recommendations
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
            </div>
          )}

          {/* Recommendations Results */}
          {(isLoadingRecommend || recommendations) && (
             <div className="space-y-8">
              <Separator />
               <h2 className="text-3xl font-headline text-center">Your Personal Picks for {exploredLocation}</h2>
              {isLoadingRecommend ? <LoadingSkeleton /> : (
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader><CardTitle>Recommended Activities</CardTitle></CardHeader>
                    <CardContent>{renderList(recommendations?.activities.join('\n'))}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Recommended Restaurants</CardTitle></CardHeader>
                    <CardContent>{renderList(recommendations?.restaurants.join('\n'))}</CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle>Recommended Accommodations</CardTitle></CardHeader>
                    <CardContent>{renderList(recommendations?.accommodations.join('\n'))}</CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
