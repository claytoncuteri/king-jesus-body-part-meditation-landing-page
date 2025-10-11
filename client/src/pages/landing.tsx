import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, Instagram, Check, Menu, X } from "lucide-react";
import kingJesusImage from "@assets/kingjesusthrone_1759948082173.jpg";
import mahavatarImage from "@assets/mahavatarbabaji_1759948082174.jpg";
import claytonProfileImage from "@assets/A3EAA35F-FDED-40A9-A1FD-04AF9F7150D6_1760146685893.jpeg";

// 5-pointed star SVG component (gold fill with black border for images)
function FivePointedStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
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
      {/* Header with Images */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
            {/* Left: Images */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <FivePointedStar className="absolute -top-1 -left-1 text-primary w-4 h-4 z-10 animate-pulse" />
                <FivePointedStar className="absolute -top-1 -right-1 text-primary w-4 h-4 z-10 animate-pulse" />
                <FivePointedStar className="absolute -bottom-1 -left-1 text-primary w-4 h-4 z-10 animate-pulse" />
                <FivePointedStar className="absolute -bottom-1 -right-1 text-primary w-4 h-4 z-10 animate-pulse" />
                <img
                  src={mahavatarImage}
                  alt="Mahavatar Babaji"
                  className="h-16 md:h-20 w-16 md:w-20 object-contain rounded-md border-2 border-primary p-1"
                  data-testid="img-mahavatar-header"
                />
              </div>
              <div className="relative">
                <FivePointedStar className="absolute -top-1 -left-1 text-primary w-4 h-4 z-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <FivePointedStar className="absolute -top-1 -right-1 text-primary w-4 h-4 z-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <FivePointedStar className="absolute -bottom-1 -left-1 text-primary w-4 h-4 z-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <FivePointedStar className="absolute -bottom-1 -right-1 text-primary w-4 h-4 z-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <img
                  src={kingJesusImage}
                  alt="King Jesus"
                  className="h-16 md:h-20 w-16 md:w-20 object-contain rounded-md border-2 border-primary p-1"
                  data-testid="img-king-jesus-header"
                />
              </div>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-home"
              >
                Home
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('story');
                  if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-story"
              >
                Story
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('testimonials');
                  if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-testimonials"
              >
                Testimonials
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('value');
                  if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-value"
              >
                What's Included
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('faq');
                  if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-faq"
              >
                FAQ
              </button>
            </nav>

            {/* Right: CTA Button and Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                variant="destructive"
                className="shadow-lg hover:shadow-xl transition-all hidden sm:flex"
                onClick={handleCheckout}
                data-testid="button-header-purchase"
              >
                <ButtonStar className="mr-2 h-4 w-4" />
                Buy Now - $4.95
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="shadow-lg hover:shadow-xl transition-all sm:hidden"
                onClick={handleCheckout}
                data-testid="button-header-purchase-mobile"
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
            <div className="md:hidden border-t border-primary/20 py-4">
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-home-mobile"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('story');
                    if (el) {
                      const offset = 100;
                      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-story-mobile"
                >
                  Story
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('testimonials');
                    if (el) {
                      const offset = 100;
                      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-testimonials-mobile"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('value');
                    if (el) {
                      const offset = 100;
                      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-value-mobile"
                >
                  What's Included
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('faq');
                    if (el) {
                      const offset = 100;
                      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-faq-mobile"
                >
                  FAQ
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Above the Fold */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/10 pt-2 pb-6 md:pt-6 md:pb-10">
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight">
              Stuck in Financial Struggle? Break Free with the Same Meditation That Took My Net Worth from{" "}
              <span className="text-destructive">-$10K</span> to{" "}
              <span className="text-green-600">$1.1M</span>
            </h1>
            
            {/* Price and CTA */}
            <div className="bg-card border-2 border-primary/20 rounded-lg p-5 shadow-2xl max-w-2xl mx-auto">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">Complete Spiritual Prosperity Package</p>
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-3xl font-cinzel font-bold text-muted-foreground line-through">$60.27</span>
                  <span className="text-5xl md:text-6xl font-cinzel font-bold text-primary">$4.95</span>
                </div>
                <p className="text-xl text-muted-foreground">
                  <span className="font-bold text-primary">92% OFF</span> - Limited Time Offer
                </p>
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all animate-pulse"
                  onClick={handleCheckout}
                  data-testid="button-get-started"
                >
                  <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="whitespace-nowrap">Buy Now — $4.95</span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  ⏰ <span className="font-semibold">Join 500+ students</span> who've transformed their relationship with money and spirituality
                </p>
                <p className="text-xs text-muted-foreground italic">
                  100% of proceeds support building churches honoring King Jesus for global peace initiatives
                </p>
                <p className="text-xs text-muted-foreground/80 mt-2">
                  <strong>Disclaimer:</strong> Results vary. This is a spiritual practice, not a financial guarantee.
                </p>
              </div>
            </div>
            
            {/* Formula Section */}
            <div className="bg-[#1a3a1a] border-4 border-[#2d4a2d] rounded-lg p-6 shadow-xl overflow-x-auto mt-3">
              <div className="font-chalk text-2xl md:text-3xl text-white/90 transform -rotate-1 flex items-center justify-center gap-3 md:gap-4 flex-wrap min-w-max mx-auto">
                <span className="text-center leading-tight">
                  Ancient King Jesus<br />meditation
                </span>
                <span className="text-4xl md:text-5xl font-bold">+</span>
                <span className="text-center leading-tight">
                  Proven<br />prosperity teachings
                </span>
                <span className="text-4xl md:text-5xl font-bold">=</span>
                <span className="text-center leading-tight">
                  Your fastest path<br />to abundance
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section id="story" className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 border-primary/20 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-6xl text-primary">"</div>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-card-foreground">
                    I'm <span className="font-bold text-primary">Clayton Cuteri</span>. In just 22 months, this meditation helped me go from{" "}
                    <span className="font-cinzel font-bold text-destructive">-$10,000</span> in debt to a{" "}
                    <span className="font-cinzel font-bold text-green-600">$1.1M</span> net worth across 4 businesses, a podcast, and 210K+ followers.
                  </p>
                  <p className="text-lg md:text-xl mt-6 text-muted-foreground leading-relaxed">
                    But here's what most don't know: Before I made my first dollar, I had to transform my relationship with money at the cellular level. This meditation rewired my prosperity consciousness, dissolved financial blocks, and aligned me with divine abundance.
                  </p>
                  <p className="text-lg md:text-xl mt-4 text-muted-foreground leading-relaxed">
                    The same ancient technique that guided me from scarcity to overflow is now available to you for less than a coffee.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-primary/20">
                <img 
                  src={claytonProfileImage} 
                  alt="Clayton Cuteri" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  data-testid="img-clayton-profile"
                />
                <div>
                  <p className="font-semibold text-lg">Clayton Cuteri</p>
                  <p className="text-muted-foreground">Influencer, Politician, Entrepreneur, and Spiritual Guide</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* CTA after Story */}
          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="destructive"
              className="text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all"
              onClick={handleCheckout}
              data-testid="button-story-cta"
            >
              <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span className="whitespace-nowrap">Begin Transformation — $4.95</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              The same meditation that changed my life can change yours
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
                Transformation Stories
              </h2>
              <p className="text-xl text-center text-muted-foreground mb-8">
                See what others are experiencing with #KingJesusMeditation
              </p>
              
              {/* Rating Display */}
              <div className="flex flex-col items-center gap-3 py-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">4.98</span>
                  <span className="text-xl text-muted-foreground">/5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative w-6 h-6">
                      {/* Background star (empty) */}
                      <Star className="absolute inset-0 w-6 h-6 text-muted-foreground/30" />
                      {/* Filled star with partial fill */}
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ 
                          width: star <= 4 ? '100%' : star === 5 ? '98%' : '0%' 
                        }}
                      >
                        <Star className="w-6 h-6 text-primary fill-primary" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Rated by <span className="font-semibold text-foreground">180+ students</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial: any, idx: number) => {
                  const rating = idx === 2 ? 4 : 5;
                  return (
                    <Card key={testimonial.id} className="p-6 hover-elevate transition-all" data-testid={`testimonial-${testimonial.id}`}>
                      <div className="mb-3">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.gender && testimonial.age ? `${testimonial.gender}, ${testimonial.age}` : 
                           testimonial.gender ? testimonial.gender : 
                           testimonial.age ? `Age ${testimonial.age}` : ''}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed mb-3">{testimonial.content}</p>
                      
                      {/* Individual Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{rating}/5</span>
                      </div>
                      
                      <p className="text-xs text-secondary font-semibold">#KingJesusMeditation</p>
                    </Card>
                  );
                })}
              </div>
              
              {/* CTA after Testimonials */}
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  variant="destructive"
                  className="text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all"
                  onClick={handleCheckout}
                  data-testid="button-testimonials-cta"
                >
                  <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="whitespace-nowrap">Join 500+ Students — $4.95</span>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Experience the same transformation as our 4.98/5 rated community
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Value Breakdown Section */}
      <section id="value" className="py-20 bg-card">
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
                { 
                  name: "King Jesus Body Part Meditation Video", 
                  value: 19.99,
                  description: "Sacred meditation technique to activate divine energies within your body and manifest abundance."
                },
                { 
                  name: "Money-Related Podcast Episodes", 
                  value: 14.99,
                  description: "Cellular-level understanding of wealth consciousness and prosperity mindset transformation."
                },
                { 
                  name: "Revealing The Secret Teachings of Jesus: Gospel of Thomas - Volume I, Verses 1-10", 
                  value: 9.99,
                  description: "Ancient wisdom unlocking hidden teachings for spiritual enlightenment and divine connection."
                },
                { 
                  name: "Reader's Notebook for Gospel of Thomas - Volume I, Verses 1-10", 
                  value: 5.31,
                  description: "Guided reflection tool to deepen your understanding and integrate sacred teachings into daily life."
                },
                { 
                  name: "Meditation Journal Template", 
                  value: 9.99,
                  description: "Track your spiritual journey, manifestations, and divine insights for accelerated growth."
                },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover-elevate transition-all" data-testid={`card-product-${idx}`}>
                  <div className="flex items-start gap-3">
                    <Check className="text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-xl font-bold text-foreground font-chalk line-through decoration-2 decoration-green-600">
                          ${item.value.toFixed(2)}
                        </p>
                        <span className="text-green-600 font-chalk text-lg font-bold -rotate-2">
                          FREE
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Total Value Card */}
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-2xl">
              <div className="text-center space-y-4">
                <p className="text-2xl font-semibold text-foreground">Total Value</p>
                <p className="text-4xl md:text-5xl font-cinzel font-bold text-foreground line-through decoration-4 decoration-muted-foreground/60">
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
                  variant="destructive"
                  className="mt-6 text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all"
                  onClick={handleCheckout}
                  data-testid="button-buy-now"
                >
                  <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="whitespace-nowrap">Buy Now — $4.95</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain/FOMO Section - Cost of Inaction */}
      <section className="py-20 bg-destructive/10 border-y-2 border-destructive/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-8 text-foreground">
              The Cost of Waiting
            </h2>
            <div className="space-y-6 mb-10">
              <Card className="p-6 border-destructive/30 bg-card/50 backdrop-blur-sm">
                <p className="text-lg leading-relaxed text-foreground">
                  <span className="font-bold text-destructive">Every day you wait</span> is another day stuck in the same financial patterns. Another day watching opportunities pass by. Another day wondering why abundance seems to flow to others but not to you.
                </p>
              </Card>
              
              <Card className="p-6 border-destructive/30 bg-card/50 backdrop-blur-sm">
                <p className="text-lg leading-relaxed text-foreground">
                  <span className="font-bold text-destructive">While you hesitate,</span> 500+ students are already experiencing the transformation. They're manifesting abundance, connecting with divine energies, and building the prosperity consciousness you're searching for.
                </p>
              </Card>

              <Card className="p-6 border-destructive/30 bg-card/50 backdrop-blur-sm">
                <p className="text-lg leading-relaxed text-foreground">
                  <span className="font-bold text-destructive">Staying where you are</span> means more financial stress, more sleepless nights, more feeling like you're missing out on the life you deserve. The same struggles, month after month, year after year.
                </p>
              </Card>

              <Card className="p-6 border-destructive/30 bg-card/50 backdrop-blur-sm">
                <p className="text-lg leading-relaxed text-foreground">
                  <span className="font-bold text-destructive">This $4.95 investment</span> is less than your morning coffee, but the transformation it unlocks could change your entire financial trajectory. What's the real cost of NOT taking this step today?
                </p>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="destructive"
                className="text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all"
                onClick={handleCheckout}
                data-testid="button-cost-waiting-cta"
              >
                <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Break Free Now — $4.95</span>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Don't let another day pass stuck in the same patterns
              </p>
            </div>
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
              support building churches honoring King Jesus for global peace initiatives.
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
                  <p className="text-muted-foreground">210,000+ followers</p>
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

      {/* FAQ Section - Address Objections */}
      <section id="faq" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Everything you need to know before starting your transformation
            </p>
            <div className="space-y-6">
              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: How is this different from regular meditation?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  King Jesus Body Part Meditation is a specific ancient technique that activates divine energies in each part of your physical body. Unlike general mindfulness, this practice combines spiritual wisdom with practical prosperity principles - the same method that helped me go from -$10K in debt to <span className="text-green-600 font-bold">$1.1M</span> in revenue.
                </p>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: Do I need any prior meditation experience?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  No! This package is designed for complete beginners and experienced students alike. The step-by-step video guides you through every detail, and the journal helps you track your progress from day one.
                </p>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: What if this doesn't work for me?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your $4.95 investment is protected by our Satisfaction Promise. If you don't experience a shift in your spiritual connection and prosperity mindset, your investment automatically supports our mission to build churches honoring King Jesus for global peace. Either way, you contribute to something meaningful.
                </p>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: How quickly will I see results?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Many students report feeling a deeper sense of peace within the first session. Financial manifestations vary by individual commitment and practice, but the spiritual connection begins immediately. The included journal helps you track both subtle and significant shifts in your journey.
                </p>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: Is this compatible with my current faith tradition?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  This meditation honors the universal divine presence. Many students from various spiritual backgrounds find it enriches their existing practice. It's about connecting to the divine energy within you, regardless of your religious path.
                </p>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Q: Why is it only $4.95 instead of $60.27?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  My mission is to make this life-changing practice accessible to everyone, especially those in financial struggle who need it most. The special introductory price removes all barriers so you can start your transformation today. Plus, 100% of proceeds support building churches honoring King Jesus.
                </p>
              </Card>
            </div>

            {/* CTA after FAQ */}
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="destructive"
                className="text-sm sm:text-base md:text-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 md:py-7 shadow-2xl hover:shadow-primary/50 transition-all"
                onClick={handleCheckout}
                data-testid="button-faq-cta"
              >
                <ButtonStar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Start Transformation — $4.95</span>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Join the community of students experiencing divine abundance
              </p>
            </div>
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
                © {new Date().getFullYear()} King Jesus Meditation. 100% of proceeds support building churches honoring King Jesus for global peace initiatives.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
