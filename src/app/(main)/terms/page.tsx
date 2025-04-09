import { BackButton } from "@/components/ui/back-button";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">Terms of Service</h1>
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-gray-900 dark:text-gray-300 font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              By accessing or using the Side Hustle Bar website and mobile application (collectively, our "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">2. Changes to Terms</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              We may revise these terms at any time by updating this page. Your continued use of our Services after any such changes constitutes your acceptance of the new Terms of Service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">3. Using Our Services</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">4. Account Registration</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">5. Ordering and Payment</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              When you place an order through our Services, you agree to provide current, complete, and accurate information. All prices are in US dollars and do not include applicable taxes, which will be added at checkout. We reserve the right to refuse or cancel any order for any reason, including errors in pricing or availability.
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Payment must be made at the time of ordering. We accept various payment methods as indicated on our Services. By providing a payment method, you represent that you are authorized to use the payment method and authorize us to charge your payment method for any orders you place.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">6. Delivery and Pickup</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Delivery times are estimates and may vary based on factors outside our control. We are not responsible for delays in delivery due to traffic, weather, or other circumstances beyond our reasonable control. For pickup orders, items will be held for a maximum of 30 minutes past the scheduled pickup time, after which they may be discarded, and no refund will be issued.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">7. Cancellations and Refunds</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Orders may be cancelled within 5 minutes of being placed. After this time, cancellations are at our discretion. Refunds may be issued for orders that are significantly delayed, incomplete, or of unsatisfactory quality. Refund requests must be submitted within 24 hours of the order being placed.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">8. Intellectual Property</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              The content, organization, graphics, design, and other matters related to our Services are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution, use, or publication of any such content or any part of our Services is prohibited without our express permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">9. Limitation of Liability</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              To the maximum extent permitted by law, Side Hustle Bar shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our Services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">10. Governing Law</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              These Terms of Service shall be governed by and construed in accordance with the laws of the State of Oregon, without regard to its conflict of law provisions. Any dispute arising from or relating to these terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Multnomah County, Oregon.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black dark:text-white">11. Contact Information</h2>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-900 dark:text-gray-300 font-medium">
              Email: terms@sidehustlebar.com<br />
              Phone: (503) 555-1234<br />
              Address: 123 Main Street, Portland, OR 97201
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
