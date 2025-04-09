import { BackButton } from "@/components/ui/back-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">Accessibility Statement</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-gray-900 dark:text-gray-300 font-medium">Last Updated: April 7, 2025</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Our Commitment</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Conformance Status</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar's website and mobile application strive to conform to WCAG 2.1 level AA standards. We monitor our site regularly to maintain this conformance level and are committed to addressing accessibility issues that are brought to our attention.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Accessibility Features</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Our website and mobile application include the following accessibility features:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Keyboard navigation for all interactive elements</li>
              <li>Proper heading structure for screen reader navigation</li>
              <li>Alt text for all informative images</li>
              <li>Sufficient color contrast for text and interactive elements</li>
              <li>Resizable text without loss of functionality</li>
              <li>Clear and consistent navigation</li>
              <li>Form labels and error messages that are programmatically associated with their controls</li>
              <li>ARIA landmarks to identify regions of the page</li>
              <li>Dark mode option for users with light sensitivity</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">In-Restaurant Accessibility</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar is committed to providing an accessible dining experience for all guests. Our physical locations include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Wheelchair accessible entrances and dining areas</li>
              <li>Accessible restrooms</li>
              <li>Braille and large print menus (available upon request)</li>
              <li>Staff trained to assist guests with disabilities</li>
              <li>Service animal friendly policy</li>
              <li>Accessible parking spaces</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Feedback</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We welcome your feedback on the accessibility of Side Hustle Bar's digital and physical spaces. Please let us know if you encounter accessibility barriers:
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Email: accessibility@sidehustlebar.com<br />
              Phone: (503) 555-1234<br />
              Address: 123 Main Street, Portland, OR 97201
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We try to respond to feedback within 3 business days.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Assessment Methods</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar assesses the accessibility of our digital properties by the following methods:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Self-evaluation using automated accessibility testing tools</li>
              <li>External evaluation by accessibility experts</li>
              <li>User testing with assistive technologies</li>
              <li>Regular review of accessibility feedback from users</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Compatibility with Assistive Technologies</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar's website and mobile application are designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">Technical Specifications</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Accessibility of Side Hustle Bar's website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>WAI-ARIA</li>
            </ul>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              These technologies are relied upon for conformance with the accessibility standards used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
