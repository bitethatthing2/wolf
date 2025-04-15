// Enforces global design system: navy bg, card/panel uses bg-card with glassmorphism, text uses text-foreground, strict button/icon rules, no hardcoded colors
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { defaultLocationData } from '@/contexts/LocationContext';
import LightningIcon from '@/assets/icons/LightningIcon';
import TacoIcon from '@/assets/icons/TacoIcon';
import HandshakeIcon from '@/assets/icons/HandshakeIcon';

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
  icon: React.ReactNode;
}

const values: Value[] = [
  {
    title: "High Energy Experience",
    description: "Side Hustle Bar delivers an electric atmosphere with a perfect blend of sports bar, lounge, and nightclub vibes. We're known for our energetic environment and unforgettable nights.",
    icon: <LightningIcon className="w-10 h-10" />
  },
  {
    title: "Authentic Mexican Cuisine",
    description: "Our menu features some of the best Mexican food in Salem, with Chef Rebeckah Sanchez bringing her culinary expertise to every dish. From our famous tacos to our creative cocktails, quality and flavor are always our priority.",
    icon: <TacoIcon className="w-10 h-10" />
  },
  {
    title: "Community Connection",
    description: "We're proud to be part of both the Salem and Portland communities, hosting events, fundraisers, and creating spaces where people can come together to celebrate and enjoy great food, drinks, and company.",
    icon: <HandshakeIcon className="w-10 h-10" />
  }
];

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-foreground tracking-tight">About Side Hustle Bar</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to Side Hustle Bar, where high energy meets exceptional food and drinks. We're more than just a bar - we're a destination for unforgettable experiences in both Salem and Portland.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <GlassCard className="overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Side Hustle Bar opened its doors in early 2022 in downtown Salem, Oregon, in the former Brown's Towne space on Liberty Street. Founded by James Mullins and with Chef Rebeckah Sanchez overseeing the food and drink operations, Side Hustle quickly established itself as a premier destination for great food, drinks, and entertainment.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                What makes Side Hustle truly special is the eclectic atmosphere created by its founders. Despite not having previous bar experience, James and Becky brought their unique vision to life, combining James' business acumen from years in auto dealership management with Becky's culinary expertise to create something truly unique in Salem's downtown scene.
              </p>
              <p className="text-lg text-muted-foreground">
                After tremendous success in Salem, Side Hustle expanded to Portland in 2025, bringing its signature high-energy environment, exceptional Mexican cuisine, and vibrant nightlife to a second location. Today, Side Hustle Bar continues to be a beloved establishment in both cities, known for its sleek interior, amazing food, and unforgettable events.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Values Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <GlassCard key={value.title} className="flex flex-col items-center p-8 text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-lg">{value.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Salem</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Our original location in downtown Salem features a sleek interior, full bar, and our complete menu of Mexican-inspired dishes.
              </p>
              <Link href="https://maps.google.com/?q=145+Liberty+St+NE+Suite+101+Salem+OR+97301" target="_blank" rel="noopener noreferrer" className="text-primary underline">145 Liberty St NE Suite #101, Salem, OR 97301</Link>
            </GlassCard>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-2">Portland</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Our newest location brings the Side Hustle experience to Portland with the same high-energy atmosphere, exceptional food, and unforgettable events that made our Salem location famous.
              </p>
              <Link href="https://maps.google.com/?q=730+SW+10th+Ave+Portland+OR+97205" target="_blank" rel="noopener noreferrer" className="text-primary underline">730 SW 10th Ave, Portland, OR 97205</Link>
            </GlassCard>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Meet Our Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <GlassCard key={member.name} className="flex flex-col items-center p-8">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} width={112} height={112} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-5xl flex items-center justify-center w-full h-full text-muted-foreground">👤</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-1">{member.name}</h3>
                <p className="text-base text-muted-foreground mb-2">{member.role}</p>
                <p className="text-muted-foreground text-center mb-2">{member.bio}</p>
                {member.instagram && (
                  <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary underline">
                    <span className="mr-1">Instagram</span>
                  </Link>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
