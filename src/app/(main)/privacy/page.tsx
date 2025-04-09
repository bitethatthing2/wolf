import { BackButton } from "@/components/ui/back-button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">Privacy Policy</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-gray-900 dark:text-gray-300 font-medium">Last Updated: April 7, 2025</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">1. Introduction</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Side Hustle Bar ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you use our website and mobile application (collectively, our "Services") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">2. Information We Collect</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We collect several types of information from and about users of our Services, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Personal information such as name, email address, phone number, and delivery address when you create an account, place an order, or sign up for our newsletter</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Location information when you use location-based features</li>
              <li>Device information and usage data</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">3. How We Use Your Information</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Process and fulfill your orders</li>
              <li>Provide you with information about our menu, events, and promotions</li>
              <li>Improve our Services and develop new features</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about your orders, account, or customer service inquiries</li>
              <li>Protect the security and integrity of our Services</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">4. Sharing Your Information</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Service providers who perform services on our behalf (such as payment processors, delivery services, and analytics providers)</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Law enforcement or other governmental authorities as required by law</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">5. Your Choices</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              You can control your information in the following ways:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-900 dark:text-gray-300 font-medium">
              <li>Update or correct your account information through your profile settings</li>
              <li>Opt out of marketing communications by following the unsubscribe instructions in our emails</li>
              <li>Disable location services through your device settings</li>
              <li>Request deletion of your account by contacting us</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">6. Security</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">7. Children's Privacy</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Our Services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">8. Changes to Our Privacy Policy</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We may update our privacy policy from time to time. If we make material changes, we will notify you by email or through a notice on our Services prior to the change becoming effective.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">9. Contact Information</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              If you have any questions or concerns about our privacy policy, please contact us at:
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Email: privacy@sidehustlebar.com<br />
              Phone: (503) 555-1234<br />
              Address: 123 Main Street, Portland, OR 97201
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
