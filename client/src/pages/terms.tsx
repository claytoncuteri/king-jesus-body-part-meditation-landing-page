import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-terms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground">
            Terms and Conditions
          </h1>

          <p className="text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Agreement to Terms</h2>
            <p className="text-foreground">
              By accessing and purchasing from King Jesus Meditation, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Digital Product Purchase</h2>
            <h3 className="text-xl font-semibold text-foreground">What You Receive</h3>
            <p className="text-foreground">Your $4.95 purchase includes instant digital delivery of:</p>
            <ul className="text-foreground">
              <li>King Jesus Body Part Meditation Video</li>
              <li>Money-Related Podcast Episodes</li>
              <li>Revealing The Secret Teachings of Jesus: The Gospel of Thomas - Volume I, Verses 1-10 (PDF)</li>
              <li>Reader's Notebook for Gospel of Thomas - Volume I, Verses 1-10 (PDF)</li>
              <li>Meditation Journal Template (PDF)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">Delivery</h3>
            <p className="text-foreground">
              All digital products will be delivered via email to the address provided during checkout within 24 hours of purchase. Please check your spam folder if you do not receive the email.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">Sales Tax</h3>
            <p className="text-foreground">
              Sales tax will be automatically calculated and added to your purchase based on your location through Stripe Tax. The final amount charged to your payment method will include any applicable taxes.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Refund Policy</h2>
            <p className="text-foreground">
              Due to the digital nature of our products, all sales are final. We do not offer refunds once the digital products have been delivered to your email. If you experience technical issues accessing your products, please contact us at support@travelingtoconsciousness.com and we will assist you.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">License and Usage Rights</h2>
            <p className="text-foreground">
              Upon purchase, you are granted a personal, non-transferable, non-exclusive license to use the digital products for your personal spiritual practice. You may not:
            </p>
            <ul className="text-foreground">
              <li>Resell, distribute, or share the digital products with others</li>
              <li>Use the content for commercial purposes</li>
              <li>Modify, copy, or create derivative works</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Disclaimers</h2>
            <h3 className="text-xl font-semibold text-foreground">Not Financial Advice</h3>
            <p className="text-foreground">
              The content provided, including meditation practices and podcast episodes, is for spiritual and educational purposes only. This is not financial, investment, or professional advice. Results vary, and individual outcomes depend on numerous factors. Any financial information shared is based on personal experience and should not be considered a guarantee of results.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">Spiritual Practice</h3>
            <p className="text-foreground">
              This meditation is a spiritual practice designed to promote peace, mindfulness, and personal growth. It is not a substitute for professional medical, psychological, or therapeutic treatment. If you have any health concerns, please consult with a qualified healthcare provider.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">Results May Vary</h3>
            <p className="text-foreground">
              While we share personal testimonials and experiences, individual results will vary based on commitment, practice, and personal circumstances. We make no guarantees regarding specific outcomes, financial or otherwise.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Mission and Use of Proceeds</h2>
            <p className="text-foreground">
              100% of proceeds from this offering support building the Church of King Jesus for global peace initiatives. By purchasing, you are contributing to this mission. We are committed to transparency in how these funds are used to promote peace and spiritual awakening worldwide.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Future Courses and Bonuses</h2>
            <p className="text-foreground">
              Purchasers may receive special discounts on future courses (such as the Fire Ritual course) after a specified period (e.g., 30 days). These bonuses are subject to change and are not guaranteed. We will communicate any special offers via email.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Intellectual Property</h2>
            <p className="text-foreground">
              All content, including but not limited to meditation videos, audio files, PDFs, and written materials, is the intellectual property of King Jesus Meditation and Clayton Cuteri. Unauthorized use, reproduction, or distribution is prohibited and may result in legal action.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">User-Generated Content</h2>
            <p className="text-foreground">
              By sharing your meditation experience on social media using #KingJesusMeditation and tagging @claytoncuteri, you grant us permission to reshare your content on our Instagram and other social media platforms. You retain all rights to your content.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Limitation of Liability</h2>
            <p className="text-foreground">
              To the fullest extent permitted by law, King Jesus Meditation and Clayton Cuteri shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the digital products or services.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Governing Law</h2>
            <p className="text-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Changes to Terms</h2>
            <p className="text-foreground">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-foreground">Contact Information</h2>
            <p className="text-foreground">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-foreground">
              Email: support@travelingtoconsciousness.com
            </p>
          </section>
        </article>

        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Link href="/">
            <Button size="lg" data-testid="button-home-terms">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
