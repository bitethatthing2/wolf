"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import PageHeader from '@/components/common/PageHeader';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { format, parseISO, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time: string;
  description: string;
  image: string;
  ticketUrl: string;
  capacity?: string;
  location?: string;
  category: string;
  featured?: boolean;
}

// Extended event data with more events and categories
const events: Event[] = [
  {
    id: "summer-jam-2025",
    title: "Side Hustle Summer Jam 2025",
    date: "2025-07-25",
    time: "6:00 PM - 11:00 PM",
    description: "Our biggest event of the year featuring top local bands and special guest performers. Food and drink specials all night!",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-summer-jam",
    capacity: "350 people",
    location: "Main Bar Area",
    category: "Music",
    featured: true
  },
  {
    id: "jazz-night-april",
    title: "Jazz Night Special",
    date: "2025-04-20",
    time: "7:00 PM - 10:00 PM",
    description: "Experience an unforgettable evening of smooth jazz with our featured artists. Limited seating available.",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-jazz",
    capacity: "120 people",
    location: "Lounge Area",
    category: "Music"
  },
  {
    id: "comedy-showcase",
    title: "Comedy Showcase",
    date: "2025-05-15",
    time: "8:00 PM - 11:00 PM",
    description: "Laugh the night away with our lineup of hilarious local comedians. Drink minimum applies.",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-comedy",
    capacity: "150 people",
    location: "Main Stage",
    category: "Comedy"
  },
  {
    id: "indie-band-night",
    title: "Indie Band Night",
    date: "2025-06-05",
    time: "7:30 PM - 12:00 AM",
    description: "Discover the best up-and-coming indie bands in the area. Three bands, one unforgettable night.",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-indie",
    capacity: "200 people",
    location: "Main Bar Area",
    category: "Music"
  },
  {
    id: "wine-tasting",
    title: "Premium Wine Tasting",
    date: "2025-05-10",
    time: "5:00 PM - 7:00 PM",
    description: "Sample our selection of premium wines paired with artisanal cheeses. Includes guided tasting from our sommelier.",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-wine",
    capacity: "40 people",
    location: "Private Dining Room",
    category: "Tasting"
  },
  {
    id: "karaoke-night",
    title: "Karaoke Night",
    date: "2025-06-12",
    time: "8:00 PM - 1:00 AM",
    description: "Show off your vocal skills at our monthly karaoke night. Over 10,000 songs to choose from!",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-karaoke",
    capacity: "100 people",
    location: "Lounge Area",
    category: "Music"
  },
  {
    id: "cocktail-masterclass",
    title: "Cocktail Masterclass",
    date: "2025-05-22",
    time: "6:00 PM - 8:00 PM",
    description: "Learn to mix three signature cocktails with our master mixologist. Includes all ingredients and equipment.",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-cocktails",
    capacity: "30 people",
    location: "Bar Area",
    category: "Workshop"
  },
  {
    id: "trivia-night",
    title: "Trivia Night Challenge",
    date: "2025-06-18",
    time: "7:30 PM - 10:00 PM",
    description: "Put your knowledge to the test with our themed trivia night. Form teams of up to 6 people and compete for prizes!",
    image: "/assets/images/img_placeholder_event_default.jpg",
    ticketUrl: "https://ticketing-platform.com/sidehustle-trivia",
    capacity: "120 people",
    location: "Main Bar Area",
    category: "Games"
  }
];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique event categories
  const categories = [...new Set(events.map(event => event.category))];

  // Filter events based on selected date and category
  const filteredEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    const dateMatches = !date || isSameDay(eventDate, date);
    const categoryMatches = !selectedCategory || event.category === selectedCategory;
    return dateMatches && categoryMatches;
  });

  // Get dates that have events for the calendar
  const eventDates = events.map(event => parseISO(event.date));

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCalendarMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCalendarMonth(prev => addMonths(prev, 1));
  };

  // Get events for the current month to show in sidebar
  const currentMonthEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return isSameMonth(eventDate, calendarMonth);
  }).sort((a, b) => {
    // Sort by date
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    // Also set the date to match the event date
    setDate(parseISO(event.date));
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Event Calendar" 
        description="Find and book your spot at our upcoming events" 
      />
      
      {/* Mobile Filters Toggle */}
      <div className="md:hidden mb-6">
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          {showFilters ? "Hide Calendar & Filters" : "Show Calendar & Filters"}
        </Button>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Calendar and Filters Section */}
        <AnimatePresence>
          {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 768) && (
            <motion.div 
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 0.3}}
              className="md:w-1/3 lg:w-1/4 space-y-6 overflow-hidden"
            >
              {/* Calendar Component */}
              <div className="bg-white dark:bg-black p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {format(calendarMonth, 'MMMM yyyy')}
                  </h2>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  className="rounded-md"
                  modifiers={{
                    hasEvent: eventDates,
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      backgroundColor: 'hsl(var(--primary) / 0.2)',
                      color: 'hsl(var(--primary))',
                      fontWeight: 'bold',
                    }
                  }}
                />
              </div>
              
              {/* Category Filters */}
              <div className="bg-white dark:bg-black p-4 rounded-xl border border-border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    All Events
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* This Month's Events */}
              <div className="bg-white dark:bg-black p-4 rounded-xl border border-border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">{format(calendarMonth, 'MMMM')} Events</h2>
                
                {currentMonthEvents.length > 0 ? (
                  <div className="space-y-3">
                    {currentMonthEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                          selectedEvent?.id === event.id 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(event.date), 'EEE, MMM d')} • {event.time}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No events this month</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Events Display */}
        <div className="flex-1">
          {/* Date Display for Selected Day */}
          {date && (
            <motion.div 
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.3}}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                {format(date, 'EEEE, MMMM d, yyyy')}
              </h2>
              {filteredEvents.length === 0 && (
                <p className="text-muted-foreground mt-2">No events scheduled for this day</p>
              )}
            </motion.div>
          )}
          
          {/* Featured Events (show only if no date is selected) */}
          {!date && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
              <div className="grid grid-cols-1 gap-6">
                {events.filter(event => event.featured).map(event => (
                  <motion.div
            key={event.id} 
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="relative overflow-hidden rounded-xl border border-border transition-all hover:shadow-lg bg-white dark:bg-black"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-2/5">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:bg-gradient-to-t" />
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      
                      <div className="relative p-6 flex-1">
                        <h2 className="text-2xl font-bold">{event.title}</h2>
                        
                        <div className="flex flex-wrap gap-4 my-4">
                          <div className="flex items-center gap-1.5 text-sm">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{event.time}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-6">{event.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <Tag className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{event.category}</span>
                          </div>
                          
                          <Button 
                            variant="hustle" 
                            className="group/btn flex items-center gap-2"
                            onClick={() => window.open(event.ticketUrl, '_blank')}
                          >
                            <span>Get Tickets</span>
                            <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Event Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredEvents.map((event) => (
              <motion.div 
                key={event.id}
                variants={itemVariants}
                layout
                className="group overflow-hidden rounded-xl border border-border transition-all hover:shadow-md bg-white dark:bg-black"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-black/80 dark:bg-white/80 backdrop-blur-sm text-white dark:text-black text-xs px-3 py-1 rounded-full">
                    {event.category}
                  </div>
            </div>
            
                <div className="relative -mt-16 pt-16 px-6 pb-6 bg-gradient-to-t from-white dark:from-black via-white/95 dark:via-black/95 to-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold tracking-tight flex-1">{event.title}</h2>
                    <div className="hidden md:flex items-center justify-center rounded-full w-10 h-10 bg-black/5 dark:bg-white/5">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(parseISO(event.date), 'EEE, MMM d')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                    {event.capacity && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.capacity}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
              </div>
              
                  <p className="text-muted-foreground line-clamp-2 mb-6">{event.description}</p>
              
              <div className="flex justify-end">
                <Button 
                  variant="hustle" 
                  className="group/btn flex items-center gap-2"
                  onClick={() => window.open(event.ticketUrl, '_blank')}
                >
                      <span>Reserve Now</span>
                  <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </div>
            </div>
              </motion.div>
        ))}
          </motion.div>
      
          {/* Event Inquiry Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 rounded-xl border border-border bg-primary/5 p-8 text-center"
          >
            <h3 className="text-2xl font-semibold mb-2">Want to perform at Side Hustle?</h3>
            <p className="mb-6 text-muted-foreground">We're always looking for talented performers to join our lineup</p>
            <div className="flex justify-center gap-4">
              <Button variant="hustle">
          Contact Us
        </Button>
              <Button variant="outline">
                View Requirements
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}