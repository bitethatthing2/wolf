"use client";

import Image from 'next/image';
import Link from 'next/link';
import { defaultLocationData } from '@/contexts/LocationContext';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  instagram?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "James Mullins",
    role: "Founder & Owner",
    bio: "James Mullins founded Side Hustle Bar in 2022, bringing his entrepreneurial spirit and vision to Salem. With a background in sales and auto dealership management across Portland for over a decade, James took a leap into the hospitality industry to create a high-energy bar and nightclub experience unlike any other in Salem.",
    instagram: "https://www.instagram.com/themr.hustles/"
  },
  {
    name: "Rebeckah Sanchez",
    role: "Executive Chef & Co-Owner",
    bio: "Chef Rebeckah 'Becky' Sanchez is the culinary mastermind behind Side Hustle Bar's acclaimed Mexican food menu. Her innovative approach to traditional recipes and commitment to authentic flavors has made Side Hustle's food some of the most sought-after in Salem. Becky also owns Chef A Sauce, showcasing her entrepreneurial spirit alongside her culinary expertise.",
    instagram: "https://www.instagram.com/becks_sanchez/"
  }
];

interface Value {
  title: string;
  description: string;
  icon: string;
}

const values: Value[] = [
  {
    title: "High Energy Experience",
    description: "Side Hustle Bar delivers an electric atmosphere with a perfect blend of sports bar, lounge, and nightclub vibes. We're known for our energetic environment and unforgettable nights.",
    icon: "⚡"
  },
  {
    title: "Authentic Mexican Cuisine",
    description: "Our menu features some of the best Mexican food in Salem, with Chef Rebeckah Sanchez bringing her culinary expertise to every dish. From our famous tacos to our creative cocktails, quality and flavor are always our priority.",
    icon: "🌮"
  },
  {
    title: "Community Connection",
    description: "We're proud to be part of both the Salem and Portland communities, hosting events, fundraisers, and creating spaces where people can come together to celebrate and enjoy great food, drinks, and company.",
    icon: "🤝"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">About Side Hustle Bar</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome to Side Hustle Bar, where high energy meets exceptional food and drinks. We're more than just a bar - we're a destination for unforgettable experiences in both Salem and Portland.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-black dark:bg-white rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white dark:text-black mb-4">Our Story</h2>
              <p className="text-gray-400 dark:text-gray-600 mb-4">
                Side Hustle Bar opened its doors in early 2022 in downtown Salem, Oregon, in the former Brown's Towne space on Liberty Street. Founded by James Mullins and with Chef Rebeckah Sanchez overseeing the food and drink operations, Side Hustle quickly established itself as a premier destination for great food, drinks, and entertainment.
              </p>
              <p className="text-gray-400 dark:text-gray-600 mb-4">
                What makes Side Hustle truly special is the eclectic atmosphere created by its founders. Despite not having previous bar experience, James and Becky brought their unique vision to life, combining James' business acumen from years in auto dealership management with Becky's culinary expertise to create something truly unique in Salem's downtown scene.
              </p>
              <p className="text-gray-400 dark:text-gray-600">
                After tremendous success in Salem, Side Hustle expanded to Portland in 2025, bringing its signature high-energy environment, exceptional Mexican cuisine, and vibrant nightlife to a second location. Today, Side Hustle Bar continues to be a beloved establishment in both cities, known for its sleek interior, amazing food, and unforgettable events.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">What We're About</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((value, index) => (
              <div key={index} className="bg-black dark:bg-white rounded-lg p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white dark:text-black mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 dark:text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black dark:bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-white dark:text-black mb-2">Salem</h3>
              <p className="text-gray-400 dark:text-gray-600 mb-4">
                Our original location in downtown Salem features a sleek interior, full bar, and our complete menu of Mexican-inspired dishes.
              </p>
              <div className="mt-4">
                <Link href="/locations" className="text-primary hover:underline">
                  View Location Details
                </Link>
              </div>
            </div>
            <div className="bg-black dark:bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-white dark:text-black mb-2">Portland</h3>
              <p className="text-gray-400 dark:text-gray-600 mb-4">
                Our newest location brings the Side Hustle experience to Portland with the same high-energy atmosphere, exceptional food, and unforgettable events that made our Salem location famous.
              </p>
              <div className="mt-4">
                <Link href="/locations" className="text-primary hover:underline">
                  View Location Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Meet Our Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-black dark:bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white dark:text-black">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-600 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-400 dark:text-gray-600 mb-3">
                    {member.bio}
                  </p>
                  {member.instagram && (
                    <a 
                      href={member.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white dark:text-black hover:underline"
                    >
                      <span className="mr-1">Follow on Instagram</span>
                      <span>📸</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
