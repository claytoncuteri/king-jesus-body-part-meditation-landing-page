import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Star, 
  Instagram, 
  Check, 
  Menu, 
  X, 
  Users, 
  Music, 
  Heart, 
  ArrowRight, 
  Download, 
  BookOpen, 
  Play,
  Sparkles,
  Award,
  DollarSign
} from "lucide-react";
import kingJesusImage from "@assets/kingjesusthrone_1759948082173.jpg";
import claytonRedCarpet from "@assets/clayton-photos/clayton-red-carpet.png";
import claytonAward from "@assets/clayton-photos/clayton-award-ceremony.png";
import claytonProfile from "@assets/clayton-photos/clayton-profile.jpeg";

export default function Landing() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const { data: testimonials = [] } = useQuery<any[]>({
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
    await apiRequest("POST", "/api/analytics/track", {
      eventType: "link_click",
      eventData: { button: "checkout" },
    });
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER - Simple Copy Posse Style */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <img
                src={kingJesusImage}
                alt="King Jesus Meditation"
                className="h-10 w-10 object-cover rounded-md"
                data-testid="img-logo"
              />
              <span className="font-bold text-lg hidden sm:inline">King Jesus Meditation</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#mission" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-mission">Mission</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-about">About</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-testimonials">Testimonials</a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-faq">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                size="lg"
                className="hidden sm:flex"
                onClick={handleCheckout}
                data-testid="button-header-cta"
              >
                Get Started - $4.95
              </Button>
              <Button
                variant="destructive"
                size="default"
                className="sm:hidden"
                onClick={handleCheckout}
                data-testid="button-header-cta-mobile"
              >
                Buy Now
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t mt-4 pt-4">
              <nav className="flex flex-col gap-3">
                <a href="#mission" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)} data-testid="nav-mission-mobile">Mission</a>
                <a href="#about" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)} data-testid="nav-about-mobile">About</a>
                <a href="#testimonials" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)} data-testid="nav-testimonials-mobile">Testimonials</a>
                <a href="#faq" className="px-4 py-2 hover:bg-accent rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)} data-testid="nav-faq-mobile">FAQ</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 1. HERO SECTION - Copy Posse Style with LARGE text */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Pre-headline tagline - small, uppercase */}
            <p className="text-sm font-semibold tracking-wide uppercase text-primary" data-testid="text-tagline">
              The Ancient Secret That Changed Everything
            </p>

            {/* Main headline - HUGE like Copy Posse */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight" data-testid="text-main-headline">
              Transform Your<br />Relationship With<br />Abundance
            </h1>

            {/* Descriptive words - LISTED VERTICALLY with line breaks */}
            <div className="space-y-3 text-lg md:text-xl font-semibold text-muted-foreground">
              <p data-testid="text-descriptor-ancient">Ancient</p>
              <p data-testid="text-descriptor-powerful">Powerful</p>
              <p data-testid="text-descriptor-transformative">Transformative</p>
              <p data-testid="text-descriptor-proven">Proven</p>
              <p data-testid="text-descriptor-sacred">Sacred</p>
              <p data-testid="text-descriptor-prosperity">Prosperity-Focused</p>
            </div>

            {/* Authority indicators in a row */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
              <div className="text-center" data-testid="stat-instagram">
                <Instagram className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">210K+ Followers</p>
              </div>
              <div className="text-center" data-testid="stat-podcast">
                <Music className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">4 Podcast Episodes</p>
              </div>
              <div className="text-center" data-testid="stat-students">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">45+ Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. START HERE SECTION - Copy Posse "Get Your Guide" style */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold" data-testid="heading-start-here">
              Ready To Start Your Transformation?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join 45+ students who've activated divine prosperity and transformed their financial reality through the King Jesus Meditation.
            </p>
            <Button
              size="lg"
              variant="destructive"
              className="text-lg px-12 py-6"
              onClick={handleCheckout}
              data-testid="button-start-transformation"
            >
              Get Instant Access - $4.95
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. MISSION SECTION - "Who We Are" equivalent with 3 value props */}
      <section id="mission" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-mission">
                We're Here To Help You Activate<br />Divine Prosperity
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The King Jesus Meditation isn't just about money — it's about aligning your entire being with divine abundance and spiritual truth.
              </p>
            </div>

            {/* 3 Value Props in Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center" data-testid="card-value-prop-1">
                <CardContent className="p-0 space-y-4">
                  <Sparkles className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Activate Divine Prosperity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dissolve financial blocks at the cellular level and open yourself to unlimited abundance flowing through King Jesus energy.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 text-center" data-testid="card-value-prop-2">
                <CardContent className="p-0 space-y-4">
                  <Heart className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Connect With Sacred Energy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Experience the ancient meditation practice that rewires your consciousness for wealth, health, and spiritual alignment.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 text-center" data-testid="card-value-prop-3">
                <CardContent className="p-0 space-y-4">
                  <Award className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Build Lasting Abundance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create sustainable wealth while staying aligned with your spiritual path and highest values.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DE-DOUCHIFY CALLOUT - Single stat callout */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold" data-testid="heading-transformation-stat">
              From -$10K Debt To $1.1M Net Worth
            </h2>
            <p className="text-2xl font-semibold">
              In Just 22 Months Through Divine Alignment
            </p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              This isn't theory. This is the exact meditation practice that transformed Clayton's entire relationship with money and prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* 5. STATS GRID - 2x3 grid like Copy Posse */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="heading-stats">
              The Numbers Don't Lie
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="p-8 text-center" data-testid="stat-card-net-worth">
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-3">$1.1M</div>
                <p className="text-lg font-semibold">Net Worth Achieved</p>
                <p className="text-sm text-muted-foreground mt-2">From -$10K debt</p>
              </Card>

              <Card className="p-8 text-center" data-testid="stat-card-followers">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">210K+</div>
                <p className="text-lg font-semibold">Instagram Followers</p>
                <p className="text-sm text-muted-foreground mt-2">Spiritual community</p>
              </Card>

              <Card className="p-8 text-center" data-testid="stat-card-businesses">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">4</div>
                <p className="text-lg font-semibold">Businesses Built</p>
                <p className="text-sm text-muted-foreground mt-2">From alignment</p>
              </Card>

              <Card className="p-8 text-center" data-testid="stat-card-transformation">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">22</div>
                <p className="text-lg font-semibold">Months</p>
                <p className="text-sm text-muted-foreground mt-2">Total transformation</p>
              </Card>

              <Card className="p-8 text-center" data-testid="stat-card-students">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">45+</div>
                <p className="text-lg font-semibold">Students Transformed</p>
                <p className="text-sm text-muted-foreground mt-2">Lives changed</p>
              </Card>

              <Card className="p-8 text-center" data-testid="stat-card-satisfaction">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-3">99.4%</div>
                <p className="text-lg font-semibold">Satisfaction Rate</p>
                <p className="text-sm text-muted-foreground mt-2">Happy students</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEET CLAYTON - Alex Cattoni list style */}
      <section id="about" className="py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-4" data-testid="text-meet-label">
                MEET OUR FOUNDER
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" data-testid="heading-meet-clayton">
                Clayton Cuteri
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              {/* Credentials List - Copy Posse style */}
              <div className="space-y-4">
                <div className="flex items-start gap-3" data-testid="bio-item-1">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">Instagram Influencer</p>
                    <p className="text-muted-foreground">210K+ followers in spiritual community</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-2">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">-$10K Debt → $1.1M Net Worth</p>
                    <p className="text-muted-foreground">Complete transformation in 22 months</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">Spiritual Teacher</p>
                    <p className="text-muted-foreground">Ancient wisdom for modern abundance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">Meditation Guide</p>
                    <p className="text-muted-foreground">Teaching King Jesus body part meditation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-5">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">4x Business Builder</p>
                    <p className="text-muted-foreground">Creating aligned, profitable ventures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-6">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-bold">Gospel of Thomas Scholar</p>
                    <p className="text-muted-foreground">Revealing secret teachings of Jesus</p>
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={claytonRedCarpet}
                  alt="Clayton on Red Carpet"
                  className="w-full h-64 object-cover rounded-md"
                  data-testid="img-clayton-red-carpet"
                />
                <img
                  src={claytonAward}
                  alt="Clayton at Award Ceremony"
                  className="w-full h-64 object-cover rounded-md"
                  data-testid="img-clayton-award"
                />
                <div className="col-span-2">
                  <img
                    src={claytonProfile}
                    alt="Clayton Cuteri"
                    className="w-full h-80 object-cover rounded-md"
                    data-testid="img-clayton-profile"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="destructive"
                className="text-lg px-12 py-6"
                onClick={handleCheckout}
                data-testid="button-about-cta"
              >
                Learn Clayton's Method - $4.95
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS - "Posse Love" style */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-testimonials">
                  Student Love ❤️
                </h2>
                <p className="text-xl text-muted-foreground">
                  Real people, real results, real abundance
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any) => (
                  <Card key={testimonial.id} className="p-6" data-testid={`testimonial-${testimonial.id}`}>
                    <CardContent className="p-0 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-lg leading-relaxed">
                        "{testimonial.testimonial}"
                      </p>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        {testimonial.result && (
                          <p className="text-sm text-primary font-medium">{testimonial.result}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. OFFER/PACKAGE SECTION - "Explore THE Posseverse" equivalent */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-package">
                The King Jesus Meditation<br />Package
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to activate divine prosperity
              </p>
            </div>

            <Card className="p-12">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4" data-testid="package-item-1">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">Complete King Jesus Body Part Meditation video guide</p>
                  </div>

                  <div className="flex items-start gap-4" data-testid="package-item-2">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">4 Podcast Episodes via Spotify Playlist (money/prosperity focused)</p>
                  </div>

                  <div className="flex items-start gap-4" data-testid="package-item-3">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">Gospel of Thomas Volume I sacred text (Verses 1-10)</p>
                  </div>

                  <div className="flex items-start gap-4" data-testid="package-item-4">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">Reader's Notebook for spiritual insights and reflections</p>
                  </div>

                  <div className="flex items-start gap-4" data-testid="package-item-5">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">Jesus Body Part Meditation journal template</p>
                  </div>

                  <div className="flex items-start gap-4" data-testid="package-item-6">
                    <Check className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                    <p className="text-xl">BONUS: King Jesus on His Throne sacred image</p>
                  </div>
                </div>

                <div className="border-t pt-8 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-3xl text-muted-foreground line-through" data-testid="text-old-price">$60.27</span>
                      <span className="text-7xl font-bold text-primary" data-testid="text-new-price">$4.95</span>
                    </div>
                    <p className="text-2xl text-destructive font-bold" data-testid="text-discount">
                      92% OFF — Limited Time Only
                    </p>
                  </div>

                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full text-2xl py-8"
                    onClick={handleCheckout}
                    data-testid="button-package-cta"
                  >
                    YES! Give Me Access For $4.95
                  </Button>

                  <p className="text-center text-muted-foreground">
                    ⏰ Join 45+ students transforming their relationship with money and spirituality
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. FREEBIES - 3-item grid like Copy Posse */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="heading-freebies">
              Free Resources To Get Started
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center" data-testid="freebie-meditation">
                <CardContent className="p-0 space-y-6">
                  <Play className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Free Meditation Preview</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Experience a 5-minute sample of the King Jesus Meditation
                  </p>
                  <Button variant="outline" size="lg" className="w-full" data-testid="button-freebie-meditation">
                    <Download className="mr-2 h-5 w-5" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-8 text-center" data-testid="freebie-guide">
                <CardContent className="p-0 space-y-6">
                  <BookOpen className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Prosperity Activation Guide</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    7 simple steps to activate divine abundance in your life
                  </p>
                  <Button variant="outline" size="lg" className="w-full" data-testid="button-freebie-guide">
                    <Download className="mr-2 h-5 w-5" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-8 text-center" data-testid="freebie-teachings">
                <CardContent className="p-0 space-y-6">
                  <Sparkles className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold">Sacred Teachings Excerpt</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    First chapter of the Gospel of Thomas Volume I
                  </p>
                  <Button variant="outline" size="lg" className="w-full" data-testid="button-freebie-teachings">
                    <Download className="mr-2 h-5 w-5" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONTENT/SOCIAL SECTION - "YouTube" equivalent */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-follow">
                Follow The Abundance Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Daily spiritual insights and ancient wisdom for modern prosperity
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8" data-testid="card-instagram">
                <CardContent className="p-0 space-y-6 text-center">
                  <Instagram className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-3xl font-bold">@claytoncuteri</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Join 210K+ followers receiving daily spiritual insights, abundance tips, and meditation practices
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full text-lg"
                    onClick={async () => {
                      await apiRequest("POST", "/api/analytics/track", {
                        eventType: "link_click",
                        eventData: { button: "instagram" },
                      });
                      window.open("https://instagram.com/claytoncuteri", "_blank");
                    }}
                    data-testid="button-instagram"
                  >
                    Follow on Instagram
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-8" data-testid="card-podcast">
                <CardContent className="p-0 space-y-6 text-center">
                  <Music className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-3xl font-bold">Spiritual Podcast</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    4 powerful episodes via Spotify playlist sharing ancient wisdom and prosperity consciousness
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full text-lg"
                    onClick={async () => {
                      await apiRequest("POST", "/api/analytics/track", {
                        eventType: "link_click",
                        eventData: { button: "spotify" },
                      });
                    }}
                    data-testid="button-podcast"
                  >
                    Listen on Spotify
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 11. EMAIL OPT-IN - Newsletter signup */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-newsletter">
              Get My Spiritual Abundance<br />Tips Every Week
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join thousands receiving weekly insights on meditation, prosperity consciousness, and divine alignment.
            </p>

            <form onSubmit={handleEmailCapture} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg py-6"
                  data-testid="input-name"
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg py-6"
                  required
                  data-testid="input-email"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="destructive"
                className="w-full text-xl py-6"
                disabled={emailCaptureMutation.isPending}
                data-testid="button-subscribe"
              >
                {emailCaptureMutation.isPending ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </form>

            <p className="text-muted-foreground mt-6">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="heading-faq">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" data-testid="faq-item-1">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  How is this different from regular meditation?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  The King Jesus Body Part Meditation is a specific ancient practice that activates divine energies within each part of your body. Unlike general meditation, this technique directly addresses your cellular-level relationship with prosperity and abundance through sacred energy work.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" data-testid="faq-item-2">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Do I need prior meditation experience?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  Not at all! The guided meditation walks you through every step. Whether you're a complete beginner or experienced meditator, you'll be able to follow along and experience the transformative power of this practice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" data-testid="faq-item-3">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  What if this doesn't work for me?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  This practice has transformed the lives of 45+ students with a 99.4% satisfaction rate. However, transformation requires commitment and consistent practice. Give yourself at least 30 days of daily practice to experience the full effects.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" data-testid="faq-item-4">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  How quickly will I see results?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  Results vary by individual. Some students report immediate shifts in consciousness and abundance mindset within the first week. Clayton's complete transformation took 22 months of dedicated practice, but the journey begins with your very first meditation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" data-testid="faq-item-5">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Is this compatible with my faith tradition?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  The King Jesus Meditation draws from ancient Christian mystical traditions and the secret teachings found in the Gospel of Thomas. While rooted in Christian spirituality, the principles of divine abundance and sacred energy work are universal and can complement many spiritual paths.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" data-testid="faq-item-6">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Why only $4.95 instead of $60.27?
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground leading-relaxed">
                  Clayton's mission is to make spiritual abundance accessible to everyone, regardless of current financial circumstances. 100% of proceeds support building churches honoring King Jesus for global peace initiatives. This special pricing allows more people to access these life-changing teachings.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* 12. FOOTER - Simple Copy Posse style */}
      <footer className="py-16 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={kingJesusImage}
                    alt="King Jesus Meditation"
                    className="h-10 w-10 object-cover rounded-md"
                  />
                  <span className="font-bold text-lg">King Jesus Meditation</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Transform your relationship with abundance through ancient spiritual practices.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  <a href="#mission" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-mission">Mission</a>
                  <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-about">About Clayton</a>
                  <a href="#testimonials" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-testimonials">Testimonials</a>
                  <a href="#faq" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-faq">FAQ</a>
                </nav>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <nav className="space-y-2">
                  <a href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-privacy">Privacy Policy</a>
                  <a href="/terms" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-terms">Terms of Service</a>
                </nav>
                <div className="mt-6">
                  <h4 className="font-bold mb-3">Follow Clayton</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await apiRequest("POST", "/api/analytics/track", {
                        eventType: "link_click",
                        eventData: { button: "footer_instagram" },
                      });
                      window.open("https://instagram.com/claytoncuteri", "_blank");
                    }}
                    data-testid="footer-button-instagram"
                  >
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t text-center text-muted-foreground">
              <p>© {new Date().getFullYear()} King Jesus Meditation. All rights reserved.</p>
              <p className="mt-2 text-sm">100% of proceeds support building churches honoring King Jesus for global peace initiatives.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
