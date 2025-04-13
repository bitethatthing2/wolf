"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Utensils, Users, CalendarCheck, Music, Cake } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const ReservationSection = () => {
  const [formType, setFormType] = useState<'table' | 'catering' | 'birthday'>('table');
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="pt-0 pb-12 sm:py-16 w-full">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            Reserve Your Experience
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Book a table, plan a special event, or arrange catering for your next occasion. 
            Let us bring the Side Hustle experience to you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left side - Reservation options */}
          <div className="lg:col-span-2 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-opacity-20 shadow-lg bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              Choose Your Reservation Type
            </h3>
            
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'table' 
                    ? isDark ? 'bg-gray-800 border-2 border-white' : 'bg-white border-2 border-black'
                    : isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/50 hover:bg-white'
                } shadow`}
                onClick={() => setFormType('table')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formType === 'table' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Table Reservation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Reserve a table for your group
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'catering' 
                    ? isDark ? 'bg-gray-800 border-2 border-white' : 'bg-white border-2 border-black'
                    : isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/50 hover:bg-white'
                } shadow`}
                onClick={() => setFormType('catering')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formType === 'catering' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Catering</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let us cater your next event
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  formType === 'birthday' 
                    ? isDark ? 'bg-gray-800 border-2 border-white' : 'bg-white border-2 border-black'
                    : isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/50 hover:bg-white'
                } shadow`}
                onClick={() => setFormType('birthday')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formType === 'birthday' 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Birthday/Event</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Book a birthday or special event
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-opacity-50 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-black'} mb-2`}>Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Contact us directly to discuss special arrangements or large parties.
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="tel:+15033919123" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (503) 391-9123
                </a>
                <a 
                  href="mailto:info@sidehustlebar.com" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@sidehustlebar.com
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 border-opacity-20 shadow-lg bg-opacity-80 backdrop-blur-sm">
              <motion.div
                key={formType}
                initial="hidden"
                animate="visible"
                variants={formVariants}
                className="space-y-4"
              >
                {formType === 'table' && (
                  <>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                      Table Reservation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Your phone number" />
                      </div>
                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                          <Users className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <Input id="guests" type="number" min="1" placeholder="Number of guests" className="border-0" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                          <Calendar className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <Input id="date" type="date" className="border-0" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <select 
                        id="location" 
                        className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                      >
                        <option value="portland">Portland</option>
                        <option value="salem">Salem</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Special Requests</Label>
                      <Textarea id="notes" placeholder="Any special requests or notes" rows={3} />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the reservation <a href="#" className="underline">terms and conditions</a>
                      </Label>
                    </div>
                    
                    <Button className="w-full mt-2">
                      Request Reservation
                    </Button>
                  </>
                )}

                {formType === 'catering' && (
                  <>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                      Catering Request
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Your phone number" />
                      </div>
                      <div>
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input id="company" placeholder="Company name (if applicable)" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-date">Event Date</Label>
                        <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                          <Calendar className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <Input id="event-date" type="date" className="border-0" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="event-time">Event Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="event-location">Event Location</Label>
                      <Input id="event-location" placeholder="Address where catering is needed" />
                    </div>
                    
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                        <Users className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <Input id="guests" type="number" min="1" placeholder="Estimated number of guests" className="border-0" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="catering-notes">Event Details & Menu Preferences</Label>
                      <Textarea 
                        id="catering-notes" 
                        placeholder="Please describe your event and any specific food preferences or requirements" 
                        rows={4} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the catering <a href="#" className="underline">terms and conditions</a>
                      </Label>
                    </div>
                    
                    <Button className="w-full mt-2">
                      Submit Catering Request
                    </Button>
                  </>
                )}

                {formType === 'birthday' && (
                  <>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                      Birthday / Special Event
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Your phone number" />
                      </div>
                      <div>
                        <Label htmlFor="event-type">Event Type</Label>
                        <select 
                          id="event-type" 
                          className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                        >
                          <option value="birthday">Birthday Party</option>
                          <option value="anniversary">Anniversary</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="other">Other Celebration</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-date">Event Date</Label>
                        <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                          <Calendar className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <Input id="event-date" type="date" className="border-0" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="event-time">Event Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <div className="flex items-center border rounded-md overflow-hidden bg-white dark:bg-gray-800">
                          <Users className="ml-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <Input id="guests" type="number" min="1" placeholder="Estimated number of guests" className="border-0" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location">Location Preference</Label>
                        <select 
                          id="location" 
                          className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                        >
                          <option value="portland">Portland</option>
                          <option value="salem">Salem</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="event-details">Event Details</Label>
                      <Textarea 
                        id="event-details" 
                        placeholder="Please describe your event, including any special requests or requirements" 
                        rows={4} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the event booking <a href="#" className="underline">terms and conditions</a>
                      </Label>
                    </div>
                    
                    <Button className="w-full mt-2">
                      Request Event Booking
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;