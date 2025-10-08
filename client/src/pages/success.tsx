import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Mail, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Success() {
  useEffect(() => {
    // Track successful purchase
    apiRequest("POST", "/api/analytics/track", {
      eventType: "purchase",
      eventData: { status: "success" },
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-primary">
          Welcome to Your Journey!
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          Your payment was successful. Divine transformation awaits you.
        </p>

        <div className="bg-accent/50 border border-primary/20 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-lg mb-2">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent you an email with access to all your digital products:
              </p>
            </div>
          </div>
          <ul className="space-y-2 ml-9 text-muted-foreground">
            <li>• King Jesus Body Part Meditation Video</li>
            <li>• Money-Related Podcast Episodes</li>
            <li>• Gospel of Thomas - Volume I PDF</li>
            <li>• Reader's Notebook PDF</li>
            <li>• Meditation Journal Template</li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-lg font-semibold">
            Share your experience with{" "}
            <span className="text-secondary">#KingJesusMeditation</span>
          </p>
          <p className="text-muted-foreground">
            Post on Instagram and tag @claytoncuteri - I'll share your story with my 110K+ followers!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.open("https://instagram.com/claytoncuteri", "_blank")}
            data-testid="button-share-instagram"
          >
            Share on Instagram
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" data-testid="button-home">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Didn't receive the email? Check your spam folder or contact us at support@travelingtoconciousness.com
        </p>
      </Card>
    </div>
  );
}
