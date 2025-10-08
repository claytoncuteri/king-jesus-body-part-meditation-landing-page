import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-privacy">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground">
            Privacy Policy
          </h1>

          <p className="text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Introduction</h2>
            <p className="text-foreground">
              King Jesus Meditation ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our digital products.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
            <p className="text-foreground">We collect information that you provide directly to us, including:</p>
            <ul className="text-foreground">
              <li>Name and email address (for product delivery and communications)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Purchase history and transaction details</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">Analytics Data</h3>
            <p className="text-foreground">We automatically collect certain information about your device and how you interact with our website:</p>
            <ul className="text-foreground">
              <li>Page views and navigation patterns</li>
              <li>Click data and button interactions</li>
              <li>Device type, browser type, and IP address</li>
              <li>Session duration and engagement metrics</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">How We Use Your Information</h2>
            <p className="text-foreground">We use the information we collect to:</p>
            <ul className="text-foreground">
              <li>Process your purchase and deliver digital products via email</li>
              <li>Send you important updates about your order</li>
              <li>Add you to our email list via ConvertKit (with your consent)</li>
              <li>Improve our website and user experience through analytics</li>
              <li>Prevent fraud and ensure transaction security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Third-Party Services</h2>
            <p className="text-foreground">We use the following third-party services that may collect and process your data:</p>
            <ul className="text-foreground">
              <li>
                <strong>Stripe:</strong> Payment processing (subject to{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Stripe's Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>ConvertKit:</strong> Email delivery and marketing (subject to{" "}
                <a href="https://convertkit.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ConvertKit's Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>Replit:</strong> Hosting and database services (subject to{" "}
                <a href="https://replit.com/site/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Replit's Privacy Policy
                </a>
                )
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Data Security</h2>
            <p className="text-foreground">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Your Rights</h2>
            <p className="text-foreground">You have the right to:</p>
            <ul className="text-foreground">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Unsubscribe from marketing emails at any time</li>
              <li>Object to processing of your personal data</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Children's Privacy</h2>
            <p className="text-foreground">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Changes to This Policy</h2>
            <p className="text-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Contact Us</h2>
            <p className="text-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-foreground">
              Email: privacy@travelingtoconciousness.com
            </p>
          </section>
        </article>

        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Link href="/">
            <Button size="lg" data-testid="button-home-privacy">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
