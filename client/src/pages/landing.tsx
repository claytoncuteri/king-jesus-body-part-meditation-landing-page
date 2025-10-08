import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, Instagram, Check, Sparkles } from "lucide-react";
import kingJesusImage from "@assets/kingjesusthrone_1759948082173.jpg";
import mahavatarImage from "@assets/mahavatarbabaji_1759948082174.jpg";

// 5-pointed star SVG component
function FivePointedStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

export default function Landing() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Track page view analytics
  useQuery({
    queryKey: ["/api/analytics/track"],
    queryFn: async () => {
      await apiRequest("POST", "/api/analytics/track", {
        eventType: "page_view",
        eventData: { page: "landing" },
      });
      return null;
    },
  });

  // Get testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  // Email capture mutation
  const emailCaptureMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/email-leads", { email, name });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You're on the list! Check your email for updates.",
      });
      setEmail("");
      setName("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmailCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    emailCaptureMutation.mutate();
  };

  const handleCheckout = async () => {
    // Track click
    await apiRequest("POST", "/api/analytics/track", {
      eventType: "link_click",
      eventData: { button: "checkout" },
    });
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/10">
        {/* Decorative stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {[...Array(20)].map((_, i) => (
            <FivePointedStar
              key={i}
              className={`absolute text-primary w-4 h-4`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left: Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-foreground leading-tight">
                Unlock Divine Peace and Prosperity with{" "}
                <span className="text-primary">King Jesus</span> Meditation
              </h1>
              <p className="text-2xl md:text-3xl font-cinzel text-primary font-bold">
                Just $4.95!
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Transform your life with ancient meditation secrets. Connect to divine energies and manifest abundance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                  onClick={handleCheckout}
                  data-testid="button-get-started"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => document.getElementById('value')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right: Images with stars */}
            <div className="space-y-6">
              {/* Mahavatar Babaji */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute -top-3 -right-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute -bottom-3 -left-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute -bottom-3 -right-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" />
                </div>
                <img
                  src={mahavatarImage}
                  alt="Mahavatar Babaji"
                  className="rounded-lg border-4 border-primary shadow-2xl w-full max-w-md mx-auto"
                  data-testid="img-mahavatar"
                />
              </div>

              {/* King Jesus on Throne */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute -top-3 -right-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute -bottom-3 -left-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute -bottom-3 -right-3 z-10">
                  <FivePointedStar className="text-primary w-8 h-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <img
                  src={kingJesusImage}
                  alt="King Jesus on Throne"
                  className="rounded-lg border-4 border-primary shadow-2xl w-full max-w-md mx-auto"
                  data-testid="img-king-jesus"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 border-primary/20 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-6xl text-primary">"</div>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-card-foreground">
                    I'm <span className="font-bold text-primary">Clayton Cuteri</span>. From{" "}
                    <span className="font-cinzel font-bold text-destructive">-$10,000</span> net worth in Jan 2024 to over{" "}
                    <span className="font-cinzel font-bold text-primary">$1.1M</span> in Oct 2025 – this meditation sparked my millionaire momentum.
                  </p>
                  <p className="text-lg md:text-xl mt-6 text-muted-foreground">
                    Elites know: Everyone has 24 hours; the difference is knowledge like this. Start your journey today!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-primary/20">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">CC</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Clayton Cuteri</p>
                  <p className="text-muted-foreground">Creator & Meditation Guide</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Value Breakdown Section */}
      <section id="value" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
              What You'll Receive
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Complete spiritual transformation package
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { name: "King Jesus Body Part Meditation Video", value: 19.99 },
                { name: "Money-Related Podcast Episodes", value: 14.99 },
                { name: "Revealing The Secret Teachings of Jesus: Gospel of Thomas - Volume I, Verses 1-10", value: 9.99 },
                { name: "Reader's Notebook for Gospel of Thomas - Volume I, Verses 1-10", value: 5.31 },
                { name: "Meditation Journal Template", value: 9.99 },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover-elevate transition-all" data-testid={`card-product-${idx}`}>
                  <div className="flex items-start gap-3">
                    <Check className="text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-through font-cinzel">
                        ${item.value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Total Value Card */}
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-2xl">
              <div className="text-center space-y-4">
                <p className="text-2xl font-semibold text-foreground">Total Value</p>
                <p className="text-4xl md:text-5xl font-cinzel font-bold text-muted-foreground line-through">
                  $60.27
                </p>
                <p className="text-xl text-foreground">Your Price Today:</p>
                <p className="text-6xl md:text-7xl font-cinzel font-bold text-primary">
                  $4.95
                </p>
                <p className="text-lg text-muted-foreground">
                  That's <span className="font-bold text-primary">92% OFF</span> the regular price!
                </p>
                <Button
                  size="lg"
                  className="mt-6 text-xl px-12 py-7 shadow-2xl hover:shadow-primary/50 transition-all"
                  onClick={handleCheckout}
                  data-testid="button-buy-now"
                >
                  <Sparkles className="mr-2 h-6 w-6" />
                  Buy Now - $4.95
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-foreground">
              Our Sacred Mission
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-foreground">
              Connect to divine energies upon purchase.{" "}
              <span className="font-bold text-primary border-b-2 border-primary">
                100% of proceeds
              </span>{" "}
              support building the Church of King Jesus for global peace initiatives.
            </p>
            <p className="text-lg text-muted-foreground">
              Join us in creating a more peaceful world through spiritual awakening and divine connection.
            </p>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-12">
              How to Use Your Meditation Package
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Meditate in Peace",
                  description: "Do the meditation in a quiet space (e.g., a comfortable chair or bed). Allow divine energies to flow through you.",
                },
                {
                  step: 2,
                  title: "Listen & Learn",
                  description: "Listen to a money podcast for deeper cellular understanding. Absorb the wisdom at a profound level.",
                },
                {
                  step: 3,
                  title: "Reflect & Journal",
                  description: "Reflect on the Gospel of Thomas materials and journal your insights. Document your spiritual journey.",
                },
              ].map((item) => (
                <Card key={item.step} className="p-8 text-center hover-elevate transition-all" data-testid={`card-step-${item.step}`}>
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-cinzel font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
                Transformation Stories
              </h2>
              <p className="text-xl text-center text-muted-foreground mb-12">
                See what others are experiencing with #KingJesusMeditation
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial: any) => (
                  <Card key={testimonial.id} className="p-6 hover-elevate transition-all" data-testid={`testimonial-${testimonial.id}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">Verified Practitioner</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{testimonial.content}</p>
                    <p className="text-xs text-secondary font-semibold">#KingJesusMeditation</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Sharing Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold font-serif">
              Share Your Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Post your meditation experience on Instagram with{" "}
              <span className="font-bold text-secondary">#KingJesusMeditation</span>
            </p>
            <Card className="p-8 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Instagram className="w-12 h-12 text-secondary" />
                <div className="text-left">
                  <p className="text-xl font-bold">@claytoncuteri</p>
                  <p className="text-muted-foreground">110,000+ followers</p>
                </div>
              </div>
              <p className="text-lg mb-6">
                I'll repost your transformation story to my community!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={async () => {
                  await apiRequest("POST", "/api/analytics/track", {
                    eventType: "link_click",
                    eventData: { button: "instagram" },
                  });
                  window.open("https://instagram.com/claytoncuteri", "_blank");
                }}
                data-testid="button-instagram"
              >
                <Instagram className="h-5 w-5" />
                Follow @claytoncuteri
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 md:p-12 border-primary/30 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-4">
              Stay Connected
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Get updates on new meditations, teachings, and exclusive offers
            </p>
            <form onSubmit={handleEmailCapture} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg p-6"
                data-testid="input-name"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg p-6"
                data-testid="input-email"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6"
                disabled={emailCaptureMutation.isPending}
                data-testid="button-subscribe"
              >
                {emailCaptureMutation.isPending ? "Subscribing..." : "Join Our Community"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-12 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">Legal</h3>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-sm hover:text-primary transition-colors" data-testid="link-privacy">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-sm hover:text-primary transition-colors" data-testid="link-terms">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">Connect</h3>
                <a
                  href="https://instagram.com/claytoncuteri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  data-testid="link-instagram-footer"
                >
                  <Instagram className="h-4 w-4" />
                  @claytoncuteri
                </a>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">Admin</h3>
                <Link href="/admin" className="block text-sm hover:text-primary transition-colors" data-testid="link-admin">
                  Dashboard Login
                </Link>
              </div>
            </div>
            <div className="border-t border-primary/20 pt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Disclaimer:</strong> Results vary. This is a spiritual practice, not financial advice.
              </p>
              <p>
                © {new Date().getFullYear()} King Jesus Meditation. 100% of proceeds support building the Church of King Jesus for global peace initiatives.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
