// Enforces global design system: navy bg, card/panel uses glassmorphism, text uses text-foreground, strict button/icon rules, no hardcoded colors
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import EmailIcon from '@/assets/icons/EmailIcon';
import PhoneIcon from '@/assets/icons/PhoneIcon';
import LocationIcon from '@/assets/icons/LocationIcon';

interface ContactMethod {
  title: string;
  value: string;
  icon: React.ReactNode;
  link?: string;
  subtext?: string;
}

const contactMethods: ContactMethod[] = [
  {
    title: "Email",
    value: "hello@sidehustle.com",
    icon: <EmailIcon className="w-10 h-10" />,
    link: "mailto:hello@sidehustle.com"
  },
  {
    title: "Phone",
    value: "(503) 391-9977",
    icon: <PhoneIcon className="w-10 h-10" />,
    link: "tel:+15033919977"
  },
  {
    title: "Address",
    value: "145 Liberty St NE Suite #101, Salem, OR 97301",
    icon: <LocationIcon className="w-10 h-10" />,
    link: "https://maps.google.com/?q=145+Liberty+St+NE+Suite+101+Salem+OR+97301",
    subtext: "Order online: order.online"
  }
];

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const inputBase =
    'mt-1 w-full rounded-lg px-3 py-2 bg-white/70 dark:bg-white/10 text-card-foreground border border-card/70 dark:border-card/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/70 transition-all shadow-inner';
  const dayCell =
    'text-left text-lg font-semibold text-card-foreground px-0 py-2 md:px-2';
  const hourCell =
    'text-right text-lg font-bold tracking-wide text-primary px-0 py-2 md:px-2';
  const rowClass =
    'flex justify-between items-center border-b border-card last:border-none';

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-foreground tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method) => (
              <GlassCard key={method.title} className="flex flex-col items-center p-8 text-center">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{method.title}</h3>
                {method.link ? (
                  <a 
                    href={method.link}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">
                    {method.value}
                  </p>
                )}
                {method.subtext && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {method.subtext}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-card-foreground">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Your name"
                    className={inputBase}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className={inputBase}
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-card-foreground">Subject</Label>
                  <Input 
                    id="subject"
                    placeholder="What's this about?"
                    className={inputBase}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-card-foreground">Message</Label>
                  <Textarea 
                    id="message"
                    placeholder="Your message here..."
                    className={clsx(inputBase, 'h-32')}
                  />
                </div>
                <Button 
                  className="w-full bg-background text-foreground hover:bg-muted-foreground transition-colors rounded-xl font-bold py-3"
                  type="submit"
                >
                  Send Message
                </Button>
              </form>
            </GlassCard>
            {/* Business Hours */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">
                Business Hours
              </h2>
              <div className="divide-y divide-border">
                {[
                  { day: "Monday", hours: "Closed" },
                  { day: "Tuesday", hours: "4pm - 12am" },
                  { day: "Wednesday", hours: "4pm - 12am" },
                  { day: "Thursday", hours: "4pm - 12am" },
                  { day: "Friday", hours: "4pm - 2am" },
                  { day: "Saturday", hours: "4pm - 2am" },
                  { day: "Sunday", hours: "4pm - 12am" },
                ].map((schedule) => (
                  <div 
                    key={schedule.day}
                    className={rowClass}
                  >
                    <span className={dayCell}>
                      {schedule.day}
                    </span>
                    <span className={hourCell}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground/80">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold tracking-wide shadow-sm">
                  Taco Tuesday: $2 tacos & drink specials all night!
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}