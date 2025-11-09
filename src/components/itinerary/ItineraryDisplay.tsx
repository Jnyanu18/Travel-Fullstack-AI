'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SocialShare } from '@/components/shared/SocialShare';

interface ItineraryDisplayProps {
  itineraryData: {
    itinerary: string;
  };
}

// A simple parser to format the itinerary string
const parseItinerary = (itineraryString: string) => {
  const lines = itineraryString.split('\n').filter(line => line.trim() !== '');
  const structured: { day: string; activities: string[] }[] = [];
  let currentDay: { day: string; activities: string[] } | null = null;

  lines.forEach(line => {
    line = line.replace(/^- /, '').replace(/^\* /, '');
    if (line.toLowerCase().startsWith('day')) {
      if (currentDay) {
        structured.push(currentDay);
      }
      currentDay = { day: line, activities: [] };
    } else if (currentDay) {
      currentDay.activities.push(line);
    }
  });

  if (currentDay) {
    structured.push(currentDay);
  }
  
  // If parsing fails, return the raw string
  if (structured.length === 0 && itineraryString) {
    return [{ day: "Your Itinerary", activities: itineraryString.split('\n') }];
  }

  return structured;
};

export function ItineraryDisplay({ itineraryData }: ItineraryDisplayProps) {
  const structuredItinerary = parseItinerary(itineraryData.itinerary);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="font-headline text-3xl md:text-4xl">
            Your Personalized Itinerary
            </CardTitle>
            <SocialShare />
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-primary">
          {structuredItinerary.map((item, index) => (
            <div key={index} className="mb-8">
              <h2 className='text-2xl font-bold font-headline text-primary'>{item.day}</h2>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                {item.activities.map((activity, actIndex) => (
                  <li key={actIndex} className="text-foreground/80">{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
