import Image from 'next/image';

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
    image: "/img_placeholder_event_default.jpg"
  },
  {
    title: "Live Music Night",
    date: "April 15, 2025",
    time: "7:00 PM - 10:00 PM",
    description: "Join us for a night of live music featuring local artists. Food and drink specials all night!",
    image: "/img_placeholder_event_default.jpg"
  },
  {
    title: "Taco Tuesday Special",
    date: "Every Tuesday",
    time: "4:00 PM - 9:00 PM",
    description: "Get your fill with our famous street tacos at special prices. Different varieties each week!",
    image: "/img_placeholder_event_default.jpg"
  },
  {
    title: "Weekend Brunch",
    date: "Every Saturday & Sunday",
    time: "10:00 AM - 2:00 PM",
    description: "Start your weekend right with our special brunch menu featuring classic favorites and unique twists.",
    image: "/img_placeholder_event_default.jpg"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}