import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
}

const events: Event[] = [
  {
    title: "Side Hustle Summer Jam 2025",
    date: "July 25, 2025",
    time: "6:00 PM - 11:00 PM",
    description: "Tickets on sale soon. Artist lineup to be announced soon!",
    image: "/event-placeholder-default.jpg"
  },
  {
    title: "Live Music Night",
    date: "April 15, 2025",
    time: "7:00 PM - 10:00 PM",
    description: "Join us for a night of live music featuring local artists. Food and drink specials all night!",
    image: "/event-placeholder-default.jpg"
  },
  {
    title: "Taco Tuesday Special",
    date: "Every Tuesday",
    time: "4:00 PM - 9:00 PM",
    description: "Get your fill with our famous street tacos at special prices. Different varieties each week!",
    image: "/event-placeholder-default.jpg"
  },
  {
    title: "Weekend Brunch",
    date: "Every Saturday & Sunday",
    time: "10:00 AM - 2:00 PM",
    description: "Start your weekend right with our special brunch menu featuring classic favorites and unique twists.",
    image: "/event-placeholder-default.jpg"
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
            <div key={index} className="p-4 mb-4 bg-black dark:bg-white rounded-lg">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white dark:text-black uppercase">
                    {event.title}
                  </h2>
                  <div className="flex gap-2 mt-1 mb-2">
                    <p className="text-gray-400 dark:text-gray-600">{event.date}</p>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <p className="text-gray-400 dark:text-gray-600">{event.time}</p>
                  </div>
                  <p className="text-gray-400 dark:text-gray-600">
                    {event.description}
                  </p>
                </div>
                {event.image && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
              {/* Add tickets button */}
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="hustle" 
                  className="flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-black flex items-center justify-center">
                    <svg className="w-3 h-3 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
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