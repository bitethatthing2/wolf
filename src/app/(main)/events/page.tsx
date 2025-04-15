// Enforces global design system: navy bg, glassmorphism cards, text-foreground, strict button/icon rules, no hardcoded colors
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
  location?: string;
}

const events: Event[] = [
  {
    title: "Side Hustle Summer Jam 2025",
    date: "July 25, 2025",
    time: "6:00 PM - 11:00 PM",
    description: "Join us for our annual summer celebration with live music, special menu items, and exclusive drinks. Tickets on sale soon. Artist lineup to be announced!",
    image: "/images/events/summer-jam.jpg",
    location: "Main Location - Portland"
  },
  {
    title: "Live Music Night",
    date: "April 15, 2025",
    time: "7:00 PM - 10:00 PM",
    description: "Join us for a night of live music featuring local artists. Food and drink specials all night!",
    image: "/images/events/live-music.jpg",
    location: "Portland Location"
  },
  {
    title: "Taco Tuesday Special",
    date: "Every Tuesday",
    time: "4:00 PM - 9:00 PM",
    description: "Get your fill with our famous street tacos at special prices. Different varieties each week!",
    image: "/images/events/taco-tuesday.jpg",
    location: "All Locations"
  },
  {
    title: "Weekend Brunch",
    date: "Every Saturday & Sunday",
    time: "10:00 AM - 2:00 PM",
    description: "Start your weekend right with our special brunch menu featuring classic favorites and unique twists.",
    image: "/images/events/weekend-brunch.jpg",
    location: "Portland & Salem Locations"
  }
];

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold mb-4 text-foreground tracking-tight">Events</h1>
          <p className="text-lg text-muted-foreground">Join us for special events and promotions</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {events.map((event, index) => (
            <GlassCard key={index} className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
              {event.image && (
                <div className="w-full md:w-48 h-40 md:h-48 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2 uppercase">{event.title}</h2>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>{event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{event.description}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button className="bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold px-6 py-2 shadow-sm flex items-center gap-2">
                    <span className="flex items-center justify-center rounded-full w-8 h-8 bg-white dark:bg-black border border-black dark:border-none">
                      <Ticket className="w-5 h-5 text-black dark:text-white" />
                    </span>
                    Get Tickets
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}