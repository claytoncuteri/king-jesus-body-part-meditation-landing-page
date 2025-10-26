import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Star, Instagram, Check, Menu, X, TrendingUp, Users, Award, Sparkles, Music, Heart, ArrowRight, Download, BookOpen, Play } from "lucide-react";
import kingJesusImage from "@assets/kingjesusthrone_1759948082173.jpg";
import mahavatarImage from "@assets/mahavatarbabaji_1759948082174.jpg";
import claytonRedCarpet from "@assets/clayton-photos/clayton-red-carpet.png";
import claytonAward from "@assets/clayton-photos/clayton-award-ceremony.png";
import claytonProfile from "@assets/clayton-photos/clayton-profile.jpeg";

// 5-pointed star SVG component (gold fill with black border for images)
function FivePointedStar({ className = "w-6 h-6", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill="currentColor"
        stroke="black" 
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 5-pointed star SVG component for buttons (white outline, no fill)
function ButtonStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill="none"
        stroke="white" 
        strokeWidth="2"
      />
    </svg>
  );
}

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
      {/* Simple Header - Copy Posse Style */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <img
                src={kingJesusImage}
                alt="King Jesus Meditation"
                className="h-10 w-10 object-cover rounded-md"
                data-testid="img-logo"
              />
              <span className="font-bold text-lg hidden sm:inline">King Jesus Meditation</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#mission" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-mission">Mission</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-about">About</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-testimonials">Testimonials</a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-faq">FAQ</a>
            </nav>

            {/* CTA Button */}
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

          {/* Mobile Navigation Menu */}
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

      {/* 1. HERO SECTION - Copy Posse Style */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Pre-headline hook - 14pt */}
            <p className="text-sm md:text-base text-primary font-semibold tracking-wide uppercase" data-testid="text-pre-headline">
              The Ancient Secret That Changed Everything
            </p>

            {/* Main headline - Short, punchy - 24-32pt */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight" data-testid="text-main-headline">
              Spiritual Abundance<br />For Conscious Leaders
            </h1>

            {/* Bold descriptive words - 16pt */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-base md:text-lg font-semibold text-muted-foreground">
              <span data-testid="text-descriptor-ancient">Ancient</span>
              <span>•</span>
              <span data-testid="text-descriptor-powerful">Powerful</span>
              <span>•</span>
              <span data-testid="text-descriptor-transformative">Transformative</span>
              <span>•</span>
              <span data-testid="text-descriptor-proven">Proven</span>
            </div>

            {/* Authority indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 pt-6">
              <div className="flex items-center gap-2" data-testid="stat-instagram">
                <Instagram className="w-6 h-6 text-primary" />
                <span className="text-sm md:text-base font-semibold">210K+ Followers</span>
              </div>
              <div className="flex items-center gap-2" data-testid="stat-podcast">
                <Music className="w-6 h-6 text-primary" />
                <span className="text-sm md:text-base font-semibold">4 Podcast Episodes</span>
              </div>
              <div className="flex items-center gap-2" data-testid="stat-students">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-sm md:text-base font-semibold">45+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. START HERE SECTION */}
      <section className="py-16 md:py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-start-here">
              Ready To Start Your Transformation?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Join 45+ students who've activated divine prosperity and transformed their financial reality through the King Jesus Meditation.
            </p>
            <Button
              size="lg"
              variant="destructive"
              className="text-lg px-8 py-6"
              onClick={handleCheckout}
              data-testid="button-start-transformation"
            >
              Get Instant Access - $4.95
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. MISSION SECTION - "Who We Are" equivalent */}
      <section id="mission" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" data-testid="heading-mission">
              Transform Your Relationship With Abundance
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
              The King Jesus Meditation isn't just about money — it's about aligning your entire being with divine prosperity.
            </p>

            {/* Three value propositions */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8" data-testid="card-value-prop-1">
                <CardHeader className="p-0 mb-4">
                  <Sparkles className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold">Activate Divine Prosperity</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Dissolve financial blocks at the cellular level and open yourself to unlimited abundance flowing through King Jesus energy.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8" data-testid="card-value-prop-2">
                <CardHeader className="p-0 mb-4">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold">Connect With King Jesus Energy</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Experience the ancient meditation practice that rewires your consciousness for wealth, health, and spiritual alignment.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8" data-testid="card-value-prop-3">
                <CardHeader className="p-0 mb-4">
                  <Award className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold">Transform Your Financial Reality</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Build sustainable wealth while staying aligned with your spiritual path and highest values.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS BANNER SECTION - Copy Posse Grid Format */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="heading-stats">
              Real Results, Real Numbers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-net-worth">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">$1.1M</div>
                <p className="font-semibold mb-1">Net Worth Achieved</p>
                <p className="text-sm text-muted-foreground">From -$10K debt</p>
              </Card>

              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-followers">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">210K+</div>
                <p className="font-semibold mb-1">Followers</p>
                <p className="text-sm text-muted-foreground">Spiritual community</p>
              </Card>

              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-businesses">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4</div>
                <p className="font-semibold mb-1">Businesses Built</p>
                <p className="text-sm text-muted-foreground">From alignment</p>
              </Card>

              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-transformation">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">22</div>
                <p className="font-semibold mb-1">Months</p>
                <p className="text-sm text-muted-foreground">Total transformation</p>
              </Card>

              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-students">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">45+</div>
                <p className="font-semibold mb-1">Students Transformed</p>
                <p className="text-sm text-muted-foreground">Lives changed</p>
              </Card>

              <Card className="p-6 text-center hover-elevate" data-testid="stat-card-satisfaction">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.4%</div>
                <p className="font-semibold mb-1">Satisfaction Rate</p>
                <p className="text-sm text-muted-foreground">Happy students</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEET CLAYTON SECTION - Alex Cattoni Style */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" data-testid="heading-meet-clayton">
              Meet Clayton Cuteri
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Your Guide To Spiritual Abundance
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              {/* Bio List - Alex Cattoni style */}
              <div className="space-y-6">
                <div className="flex items-start gap-3" data-testid="bio-item-1">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">Instagram Influencer</p>
                    <p className="text-muted-foreground">Building a conscious community of 210K+ followers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-2">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">Former -$10K Debt → $1.1M Net Worth</p>
                    <p className="text-muted-foreground">Total financial transformation in 22 months</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">Spiritual Teacher</p>
                    <p className="text-muted-foreground">Sharing ancient wisdom for modern abundance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">Meditation Guide</p>
                    <p className="text-muted-foreground">Teaching transformative King Jesus meditation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-5">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">4x Business Builder</p>
                    <p className="text-muted-foreground">Creating aligned, profitable ventures</p>
                  </div>
                </div>

                <div className="flex items-start gap-3" data-testid="bio-item-6">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-lg">Adventure Seeker & Conscious Creator</p>
                    <p className="text-muted-foreground">Living life fully aligned with purpose</p>
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={claytonRedCarpet}
                  alt="Clayton on Red Carpet"
                  className="w-full h-64 object-cover rounded-lg"
                  data-testid="img-clayton-red-carpet"
                />
                <img
                  src={claytonAward}
                  alt="Clayton at Award Ceremony"
                  className="w-full h-64 object-cover rounded-lg"
                  data-testid="img-clayton-award"
                />
                <div className="col-span-2">
                  <img
                    src={claytonProfile}
                    alt="Clayton Cuteri"
                    className="w-full h-80 object-cover rounded-lg"
                    data-testid="img-clayton-profile"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="destructive"
                className="text-lg px-8 py-6"
                onClick={handleCheckout}
                data-testid="button-about-cta"
              >
                Learn Clayton's Method - $4.95
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION - "Posse Love" style */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-16 md:py-24 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" data-testid="heading-testimonials">
                Student Transformations
              </h2>
              <p className="text-xl text-center text-muted-foreground mb-12">
                Real people, real results, real abundance
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial: any) => (
                  <Card key={testimonial.id} className="p-6 hover-elevate" data-testid={`testimonial-${testimonial.id}`}>
                    <CardContent className="p-0 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-lg font-medium leading-relaxed">
                        "{testimonial.testimonial}"
                      </p>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
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

      {/* 7. PRODUCT/OFFER SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" data-testid="heading-package">
              The King Jesus Meditation Package
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Everything you need to activate divine prosperity
            </p>

            <Card className="p-8 md:p-12">
              <div className="space-y-8">
                {/* What's Included */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-6">What's Included:</h3>
                  
                  <div className="flex items-start gap-3" data-testid="package-item-1">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Complete King Jesus Meditation audio guide</p>
                  </div>

                  <div className="flex items-start gap-3" data-testid="package-item-2">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Sacred prosperity activation journal</p>
                  </div>

                  <div className="flex items-start gap-3" data-testid="package-item-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Gospel of Thomas Volume I sacred text</p>
                  </div>

                  <div className="flex items-start gap-3" data-testid="package-item-4">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Reader's notebook for spiritual insights</p>
                  </div>

                  <div className="flex items-start gap-3" data-testid="package-item-5">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Jesus Body Part Meditation journal</p>
                  </div>

                  <div className="flex items-start gap-3" data-testid="package-item-6">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">Instant digital access to all materials</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-3xl text-muted-foreground line-through" data-testid="text-old-price">$60.27</span>
                    <span className="text-6xl font-bold text-primary" data-testid="text-new-price">$4.95</span>
                  </div>
                  <p className="text-2xl text-destructive font-bold text-center mb-8" data-testid="text-discount">
                    92% OFF — Limited Time Only
                  </p>

                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full text-xl py-8"
                    onClick={handleCheckout}
                    data-testid="button-package-cta"
                  >
                    Yes! Give Me Access For $4.95
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    ⏰ Join 45+ students transforming their relationship with money and spirituality
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FREEBIES SECTION - 3-item grid */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="heading-freebies">
              Free Resources To Get Started
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center" data-testid="freebie-meditation">
                <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Free Meditation Preview</h3>
                <p className="text-muted-foreground mb-6">
                  Experience a 5-minute sample of the King Jesus Meditation
                </p>
                <Button variant="outline" className="w-full" data-testid="button-freebie-meditation">
                  <Download className="mr-2 h-4 w-4" />
                  Get It Now
                </Button>
              </Card>

              <Card className="p-8 text-center" data-testid="freebie-guide">
                <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Free Prosperity Guide</h3>
                <p className="text-muted-foreground mb-6">
                  7 simple steps to activate divine abundance in your life
                </p>
                <Button variant="outline" className="w-full" data-testid="button-freebie-guide">
                  <Download className="mr-2 h-4 w-4" />
                  Get It Now
                </Button>
              </Card>

              <Card className="p-8 text-center" data-testid="freebie-teachings">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sacred Teachings Excerpt</h3>
                <p className="text-muted-foreground mb-6">
                  First chapter of the Gospel of Thomas Volume I
                </p>
                <Button variant="outline" className="w-full" data-testid="button-freebie-teachings">
                  <Download className="mr-2 h-4 w-4" />
                  Get It Now
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTENT SHOWCASE SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="heading-follow">
              Follow The Journey
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join 210K+ followers on Instagram and tune into spiritual wisdom via 4 podcast episodes on Spotify
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Instagram */}
              <Card className="p-8 hover-elevate" data-testid="card-instagram">
                <Instagram className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">@claytoncuteri</h3>
                <p className="text-muted-foreground mb-6">
                  Daily spiritual insights, abundance tips, and meditation practices
                </p>
                <Button
                  variant="default"
                  className="w-full"
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
              </Card>

              {/* Podcast */}
              <Card className="p-8 hover-elevate" data-testid="card-podcast">
                <Music className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Spiritual Podcast</h3>
                <p className="text-muted-foreground mb-6">
                  4 powerful episodes via Spotify playlist sharing ancient wisdom
                </p>
                <Button
                  variant="default"
                  className="w-full"
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
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EMAIL OPT-IN - Copy Posse Style */}
      <section className="py-16 md:py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-newsletter">
              Get My Spiritual Abundance Tips Every Week
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands receiving weekly insights on meditation, prosperity consciousness, and divine alignment.
            </p>

            <form onSubmit={handleEmailCapture} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
                data-testid="input-name"
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
                data-testid="input-email"
              />
              <Button
                type="submit"
                size="lg"
                variant="destructive"
                disabled={emailCaptureMutation.isPending}
                data-testid="button-subscribe"
              >
                {emailCaptureMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION - Clean Copy Posse Accordion */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" data-testid="heading-faq">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Everything you need to know
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6" data-testid="faq-item-1">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What is the King Jesus Meditation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The King Jesus Meditation is an ancient spiritual practice that helps you connect with divine energy to transform your relationship with abundance. It works at the cellular level to dissolve financial blocks and align you with prosperity consciousness.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6" data-testid="faq-item-2">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How quickly will I see results?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Results vary by individual, but many students report shifts in their prosperity consciousness within the first week. Clayton himself went from -$10K debt to $1.1M net worth in 22 months using this practice combined with aligned action.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6" data-testid="faq-item-3">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What's included in the $4.95 package?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You get instant digital access to: the complete King Jesus Meditation audio guide, sacred prosperity activation journal, Gospel of Thomas Volume I, reader's notebook, Jesus Body Part Meditation journal, and all supporting materials. Everything you need to begin your transformation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6" data-testid="faq-item-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Is this religious or spiritual?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This is a spiritual practice rooted in ancient wisdom. While it references King Jesus energy, it's about connecting with divine consciousness and abundance. Students from various faith backgrounds have found value in this practice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6" data-testid="faq-item-5">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How long is the meditation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The complete meditation is designed to fit into your daily routine. You can practice it in as little as 10-15 minutes per day, though deeper sessions are encouraged as you deepen your practice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6" data-testid="faq-item-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Is there a money-back guarantee?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  At only $4.95, this is less than a coffee. We're confident you'll find immense value in these teachings. If you have any concerns, please reach out to our support team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="destructive"
                className="text-lg px-8 py-6"
                onClick={handleCheckout}
                data-testid="button-faq-cta"
              >
                Start Your Journey - $4.95
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={kingJesusImage}
                    alt="King Jesus Meditation"
                    className="h-10 w-10 object-cover rounded-md"
                    data-testid="img-footer-logo"
                  />
                  <span className="font-bold text-lg">King Jesus Meditation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ancient wisdom for modern abundance. Transform your relationship with prosperity through divine alignment.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <div className="space-y-2">
                  <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="font-bold mb-4">Connect</h3>
                <div className="flex gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={async () => {
                      await apiRequest("POST", "/api/analytics/track", {
                        eventType: "link_click",
                        eventData: { button: "footer-instagram" },
                      });
                      window.open("https://instagram.com/claytoncuteri", "_blank");
                    }}
                    data-testid="button-footer-instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={async () => {
                      await apiRequest("POST", "/api/analytics/track", {
                        eventType: "link_click",
                        eventData: { button: "footer-spotify" },
                      });
                    }}
                    data-testid="button-footer-spotify"
                  >
                    <Music className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} King Jesus Meditation. All rights reserved.</p>
              <p className="mt-2">Built with love for conscious leaders seeking divine prosperity</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
