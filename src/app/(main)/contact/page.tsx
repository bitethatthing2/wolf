import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactMethod {
  title: string;
  value: string;
  icon: string;
  link?: string;
  subtext?: string;
}

const contactMethods: ContactMethod[] = [
  {
    title: "Email",
    value: "hello@sidehustle.com",
    icon: "📧",
    link: "mailto:hello@sidehustle.com"
  },
  {
    title: "Phone",
    value: "(503) 391-9977",
    icon: "📞",
    link: "tel:+15033919977"
  },
  {
    title: "Address",
    value: "145 Liberty St NE Suite #101, Salem, OR 97301",
    icon: "📍",
    link: "https://maps.google.com/?q=145+Liberty+St+NE+Suite+101+Salem+OR+97301",
    subtext: "Order online: order.online"
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {contactMethods.map((method) => (
              <div key={method.title} className="bg-black dark:bg-white rounded-lg p-6">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-white dark:text-black mb-2">
                  {method.title}
                </h3>
                {method.link ? (
                  <a 
                    href={method.link}
                    className="text-gray-400 dark:text-gray-600 hover:text-gray-300 dark:hover:text-gray-500 transition-colors"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-gray-400 dark:text-gray-600">
                    {method.value}
                  </p>
                )}
                {method.subtext && (
                  <p className="text-gray-400 dark:text-gray-600 mt-2 text-sm">
                    {method.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-black dark:bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white dark:text-black mb-6">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white dark:text-black">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Your name"
                    className="mt-1 bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white dark:text-black">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1 bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white dark:text-black">Subject</Label>
                  <Input 
                    id="subject"
                    placeholder="What's this about?"
                    className="mt-1 bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white dark:text-black">Message</Label>
                  <Textarea 
                    id="message"
                    placeholder="Your message here..."
                    className="mt-1 h-32 bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-white text-black dark:bg-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Business Hours */}
            <div className="bg-black dark:bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white dark:text-black mb-6">
                Business Hours
              </h2>
              <div className="space-y-3">
                {[
                  { day: "Monday", hours: "10:00 AM - 11:00 PM" },
                  { day: "Tuesday", hours: "10:00 AM - 11:00 PM" },
                  { day: "Wednesday", hours: "10:00 AM - 11:00 PM" },
                  { day: "Thursday", hours: "10:00 AM - 12:00 AM" },
                  { day: "Friday", hours: "10:00 AM - 2:00 AM" },
                  { day: "Saturday", hours: "10:00 AM - 2:00 AM" },
                  { day: "Sunday", hours: "10:00 AM - 11:00 PM" }
                ].map((schedule) => (
                  <div 
                    key={schedule.day}
                    className="flex justify-between items-center border-b border-gray-700 dark:border-gray-300 pb-2"
                  >
                    <span className="text-white dark:text-black font-medium">
                      {schedule.day}
                    </span>
                    <span className="text-gray-400 dark:text-gray-600">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}