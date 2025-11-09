import { Hero } from '@/components/landing/Hero';
import { TripPlanningForm } from '@/components/forms/TripPlanningForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <section id="planner" className="py-16 md:py-24 bg-background">
        <div className="container">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-accent" />
              <CardTitle className="font-headline text-3xl md:text-4xl mt-4">
                Design Your Dream Getaway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tell us about your perfect trip. Our AI will craft a personalized
                itinerary just for you, from hidden gems to popular landmarks.
              </p>
              <TripPlanningForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
