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

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Events</h1>
          <p className="text-gray-600 dark:text-gray-400">Join us for special events and promotions</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {events.map((event, index) => (
            <div key={index} className="p-5 mb-6 bg-black dark:bg-white rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white dark:text-black uppercase">
                    {event.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 mt-2 mb-3">
                    <div className="flex items-center text-gray-400 dark:text-gray-600">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <p>{event.date}</p>
                    </div>
                    
                    <div className="flex items-center text-gray-400 dark:text-gray-600">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <p>{event.time}</p>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-gray-400 dark:text-gray-600">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <p>{event.location}</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-400 dark:text-gray-600">
                    {event.description}
                  </p>
                </div>
                
                {event.image && (
                  <div className="relative w-full md:w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-700 dark:border-gray-300">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Add tickets button */}
              <div className="mt-4 flex justify-end">
                <Button 
                  className="bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <Ticket className="w-3 h-3 text-white dark:text-black" />
                  </div>
                  Get Your Tickets Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}