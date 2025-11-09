import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl drop-shadow-lg">
          Travel Smarter, Not Harder
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Your personal AI travel genie for crafting unforgettable journeys.
          Tell us your dreams, and we'll handle the details.
        </p>
        <Button asChild size="lg" className="mt-8" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          <Link href="#planner">
            Start Planning
            <ArrowDown className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
