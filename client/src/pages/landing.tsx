import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, Instagram, Check, Menu, X, TrendingUp, Users, Award, Sparkles } from "lucide-react";
import kingJesusImage from "@assets/kingjesusthrone_1759948082173.jpg";
import mahavatarImage from "@assets/mahavatarbabaji_1759948082174.jpg";
import claytonRedCarpet from "@assets/clayton-photos/clayton-red-carpet.png";
import claytonAward from "@assets/clayton-photos/clayton-award-ceremony.png";
import claytonProfile from "@assets/clayton-photos/clayton-profile.jpeg";
import goldenSacredBg from "@assets/stock_images/abstract_golden_sacr_148906f0.jpg";
import divineBlueBg from "@assets/stock_images/divine_blue_mystical_0fc3d49a.jpg";
import navyBlueBg from "@assets/stock_images/navy_blue_sacred_geo_335d6ad2.jpg";

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

  // Split testimonials into 3 groups
  const firstTestimonials = testimonials.slice(0, 3);
  const secondTestimonials = testimonials.slice(3, 6);
  const thirdTestimonials = testimonials.slice(6);

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
                  const el = document.getElementById('about');
                  if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-about"
              >
                About Clayton
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
                    const el = document.getElementById('about');
                    if (el) {
                      const offset = 100;
                      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  data-testid="nav-about-mobile"
                >
                  About Clayton
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

      {/* Hero Section - Bold Emphasized Headline */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/10 pt-8 pb-12 md:pt-12 md:pb-16">
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
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight">
              From <span className="text-destructive font-extrabold">-$10K Debt</span> to{" "}
              <span className="text-green-600 font-extrabold">$1.1M Net Worth</span> in{" "}
              <span className="text-primary font-extrabold">22 Months</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              The Ancient <span className="text-primary font-bold">King Jesus Meditation</span> That{" "}
              <span className="font-bold text-foreground">Rewired My Prosperity Consciousness</span> — Now Yours for Just{" "}
              <span className="text-destructive font-extrabold text-3xl">$4.95</span>
            </p>
            
            {/* Price and CTA */}
            <div className="bg-card border-2 border-primary/30 rounded-lg p-6 md:p-8 shadow-2xl max-w-2xl mx-auto mt-8">
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-bold text-foreground">Complete Spiritual Prosperity Package</p>
                <div className="flex items-baseline justify-center gap-4">
                  <span className="text-3xl md:text-4xl font-cinzel font-bold text-muted-foreground line-through">$60.27</span>
                  <span className="text-6xl md:text-7xl font-cinzel font-extrabold text-primary">$4.95</span>
                </div>
                <p className="text-2xl md:text-3xl text-destructive font-bold">
                  92% OFF — Limited Time
                </p>
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full text-lg md:text-2xl px-8 py-8 md:py-10 shadow-2xl hover:shadow-primary/50 transition-all animate-pulse font-bold"
                  onClick={handleCheckout}
                  data-testid="button-hero-cta"
                >
                  <ButtonStar className="mr-2 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  <span className="whitespace-nowrap">YES! Give Me Access for $4.95</span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  ⏰ <span className="font-semibold">Join 45+ students</span> transforming their relationship with money and spirituality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof/Stats Section - Gold Background */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'hsl(var(--section-gold))' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12 text-foreground">
              The Numbers Don't Lie
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover-elevate transition-all" data-testid="stat-net-worth">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-5xl font-bold text-green-600 mb-2">$1.1M</div>
                <p className="text-lg font-semibold text-foreground mb-2">Net Worth Achieved</p>
                <p className="text-sm text-muted-foreground">In just 22 months from -$10K debt</p>
              </Card>

              <Card className="p-8 text-center hover-elevate transition-all" data-testid="stat-followers">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-5xl font-bold text-primary mb-2">210K+</div>
                <p className="text-lg font-semibold text-foreground mb-2">Followers</p>
                <p className="text-sm text-muted-foreground">Building a spiritual community</p>
              </Card>

              <Card className="p-8 text-center hover-elevate transition-all" data-testid="stat-businesses">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-5xl font-bold text-primary mb-2">4</div>
                <p className="text-lg font-semibold text-foreground mb-2">Businesses Built</p>
                <p className="text-sm text-muted-foreground">From spiritual alignment to abundance</p>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-xl md:text-2xl font-serif italic text-foreground">
                "This meditation didn't just change my bank account — it transformed my <span className="font-bold text-primary">soul's relationship</span> with prosperity."
              </p>
              <p className="text-lg text-muted-foreground mt-4">— Clayton Cuteri</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Clayton Section - Divine Blue Background with Photos */}
      <section id="about" className="py-16 md:py-20 relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--section-divine-blue))' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${divineBlueBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-6 text-foreground">
              About Clayton Cuteri
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Entrepreneur, Influencer, Politician, and Spiritual Guide
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-foreground">
                  Clayton Cuteri went from <span className="font-bold text-destructive">-$10,000 in debt</span> to a{" "}
                  <span className="font-bold text-green-600">$1.1 million net worth</span> in just{" "}
                  <span className="font-bold text-primary">22 months</span>.
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  But this wasn't achieved through hustle culture or traditional business tactics alone. The secret? An ancient{" "}
                  <span className="font-bold text-primary">King Jesus meditation</span> that rewired his cellular relationship with money, dissolved financial blocks, and aligned him with divine abundance.
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  Today, Clayton runs <span className="font-bold">4 successful businesses</span>, has grown a following of{" "}
                  <span className="font-bold">210K+ people</span>, and hosts <span className="font-bold">4 podcast episodes delivered via Spotify playlist</span> sharing spiritual wisdom with seekers worldwide.
                </p>
                <p className="text-lg leading-relaxed text-primary font-semibold">
                  Now, he's making the same meditation that transformed his life available to you for less than a coffee.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <img
                    src={claytonRedCarpet}
                    alt="Clayton on Red Carpet"
                    className="w-full h-64 object-cover rounded-lg border-4 border-primary shadow-xl hover:scale-105 transition-transform"
                    data-testid="img-clayton-red-carpet"
                  />
                  <div className="absolute -top-2 -right-2">
                    <FivePointedStar className="text-primary w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <div className="relative group">
                  <img
                    src={claytonAward}
                    alt="Clayton Award Ceremony"
                    className="w-full h-64 object-cover rounded-lg border-4 border-primary shadow-xl hover:scale-105 transition-transform"
                    data-testid="img-clayton-award"
                  />
                  <div className="absolute -top-2 -right-2">
                    <FivePointedStar className="text-primary w-8 h-8 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
                <div className="col-span-2 relative group">
                  <img
                    src={claytonProfile}
                    alt="Clayton Cuteri Profile"
                    className="w-full h-80 object-cover rounded-lg border-4 border-primary shadow-xl hover:scale-105 transition-transform"
                    data-testid="img-clayton-profile-large"
                  />
                  <div className="absolute -top-2 -left-2">
                    <FivePointedStar className="text-primary w-10 h-10 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="destructive"
                className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-2xl hover:shadow-primary/50 transition-all font-bold"
                onClick={handleCheckout}
                data-testid="button-about-cta"
              >
                <ButtonStar className="mr-2 h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Start Your Transformation — $4.95</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* First Testimonials Section */}
      {firstTestimonials.length > 0 && (
        <section id="testimonials" className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
                Real Transformations
              </h2>
              <p className="text-xl text-center text-muted-foreground mb-12">
                See what others are experiencing with #KingJesusMeditation
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {firstTestimonials.map((testimonial: any, idx: number) => {
                  const rating = idx === 2 ? 4 : 5;
                  return (
                    <Card key={testimonial.id} className="p-6 hover-elevate transition-all" data-testid={`testimonial-${testimonial.id}`}>
                      <div className="mb-3">
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.gender && testimonial.age ? `${testimonial.gender}, ${testimonial.age}` : 
                           testimonial.gender ? testimonial.gender : 
                           testimonial.age ? `Age ${testimonial.age}` : ''}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed mb-4">{testimonial.content}</p>
                      
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

              <div className="text-center">
                <Button
                  size="lg"
                  variant="destructive"
                  className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-xl font-bold"
                  onClick={handleCheckout}
                  data-testid="button-testimonials-1-cta"
                >
                  <ButtonStar className="mr-2 h-5 w-5 flex-shrink-0" />
                  Join Them for $4.95
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What You'll Get Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'hsl(var(--section-gold))' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
              What You'll Get for <span className="text-destructive">$4.95</span>
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Everything you need to transform your prosperity consciousness
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 hover-elevate transition-all" data-testid="package-meditation">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Guided King Jesus Meditation</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The exact ancient practice that helped Clayton dissolve financial blocks and align with divine abundance at the cellular level
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate transition-all" data-testid="package-journal">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Prosperity Journal</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Track your spiritual journey and witness the transformation as you shift from scarcity to abundance consciousness
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate transition-all" data-testid="package-teachings">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Gospel of Thomas Teachings</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Sacred wisdom and esoteric knowledge to deepen your understanding of prosperity from a spiritual perspective
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate transition-all" data-testid="package-podcast">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">4 Podcast Episodes via Spotify</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Deep-dive audio teachings on spiritual prosperity, abundance mindset, and King Jesus consciousness delivered through Spotify playlist
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate transition-all" data-testid="package-bonus">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Bonus: King Jesus on His Throne Image</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Sacred artwork to support your meditation practice and anchor the divine presence in your space
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover-elevate transition-all" data-testid="package-reader">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-3 flex-shrink-0">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Reader's Notebook</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Comprehensive workbook to integrate the teachings and track your spiritual and financial transformation
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-8 text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Total Value: <span className="line-through text-muted-foreground">$60.27</span>
              </p>
              <p className="text-4xl md:text-5xl font-extrabold text-destructive mb-6">
                Your Price Today: $4.95
              </p>
              <Button
                size="lg"
                variant="destructive"
                className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-2xl hover:shadow-primary/50 transition-all font-bold"
                onClick={handleCheckout}
                data-testid="button-package-cta"
              >
                <ButtonStar className="mr-2 h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Claim Your Package — $4.95</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3-Step Process */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
              How It Works
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Your path to prosperity consciousness in 3 simple steps
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover-elevate transition-all relative" data-testid="step-1">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold border-4 border-background">
                    1
                  </div>
                </div>
                <div className="mt-8">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Get Instant Access</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Purchase for <span className="font-bold text-destructive">$4.95</span> and receive immediate access to all materials, meditations, and teachings
                  </p>
                </div>
              </Card>

              <Card className="p-8 text-center hover-elevate transition-all relative" data-testid="step-2">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold border-4 border-background">
                    2
                  </div>
                </div>
                <div className="mt-8">
                  <FivePointedStar className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Practice Daily</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dedicate just 15-20 minutes per day to the King Jesus meditation and prosperity teachings
                  </p>
                </div>
              </Card>

              <Card className="p-8 text-center hover-elevate transition-all relative" data-testid="step-3">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold border-4 border-background">
                    3
                  </div>
                </div>
                <div className="mt-8">
                  <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Transform & Prosper</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Watch as your relationship with money shifts, blocks dissolve, and divine abundance flows into your life
                  </p>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="destructive"
                className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-xl font-bold"
                onClick={handleCheckout}
                data-testid="button-how-it-works-cta"
              >
                <ButtonStar className="mr-2 h-5 w-5 flex-shrink-0" />
                Begin Your Journey — $4.95
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Second Testimonials Section */}
      {secondTestimonials.length > 0 && (
        <section className="py-16 md:py-20" style={{ backgroundColor: 'hsl(var(--section-divine-blue))' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-12">
                More Success Stories
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {secondTestimonials.map((testimonial: any, idx: number) => {
                  const rating = 5;
                  return (
                    <Card key={testimonial.id} className="p-6 hover-elevate transition-all" data-testid={`testimonial-${testimonial.id}`}>
                      <div className="mb-3">
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.gender && testimonial.age ? `${testimonial.gender}, ${testimonial.age}` : 
                           testimonial.gender ? testimonial.gender : 
                           testimonial.age ? `Age ${testimonial.age}` : ''}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed mb-4">{testimonial.content}</p>
                      
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

              <div className="text-center">
                <Button
                  size="lg"
                  variant="destructive"
                  className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-xl font-bold"
                  onClick={handleCheckout}
                  data-testid="button-testimonials-2-cta"
                >
                  <ButtonStar className="mr-2 h-5 w-5 flex-shrink-0" />
                  Start Your Story — $4.95
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8">
              A Sacred Mission
            </h2>
            <Card className="p-8 md:p-12 border-primary/30">
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground mb-6">
                Every purchase directly supports building churches honoring King Jesus for global peace initiatives.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When you invest in your spiritual prosperity, you're also contributing to a larger movement of divine consciousness and peace on Earth. Together, we're creating sacred spaces where humanity can reconnect with the divine presence of King Jesus.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Third Testimonials Section */}
      {thirdTestimonials.length > 0 && (
        <section className="py-16 md:py-20" style={{ backgroundColor: 'hsl(var(--section-gold))' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
                Join The Movement
              </h2>
              
              <div className="flex flex-col items-center gap-3 py-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">4.91</span>
                  <span className="text-xl text-muted-foreground">/5</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative w-6 h-6">
                      <Star className="absolute inset-0 w-6 h-6 text-muted-foreground/30" />
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
                  Rated by <span className="font-semibold text-foreground">45+ students</span>
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {thirdTestimonials.map((testimonial: any) => {
                  const rating = 5;
                  return (
                    <Card key={testimonial.id} className="p-6 hover-elevate transition-all" data-testid={`testimonial-${testimonial.id}`}>
                      <div className="mb-3">
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.gender && testimonial.age ? `${testimonial.gender}, ${testimonial.age}` : 
                           testimonial.gender ? testimonial.gender : 
                           testimonial.age ? `Age ${testimonial.age}` : ''}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed mb-4">{testimonial.content}</p>
                      
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

              <div className="text-center">
                <Button
                  size="lg"
                  variant="destructive"
                  className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 shadow-xl font-bold"
                  onClick={handleCheckout}
                  data-testid="button-testimonials-3-cta"
                >
                  <ButtonStar className="mr-2 h-5 w-5 flex-shrink-0" />
                  Transform for $4.95
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Everything you need to know about your <span className="text-destructive font-bold">$4.95</span> investment
            </p>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-primary/20 rounded-lg px-6" data-testid="faq-what-is-this">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  What exactly is this meditation package?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  This is a complete spiritual prosperity transformation package featuring the ancient King Jesus meditation that helped Clayton go from -$10K debt to $1.1M net worth in 22 months. You'll receive guided meditations, prosperity teachings, a meditation journal, Gospel of Thomas wisdom, 4 podcast episodes via Spotify playlist, and sacred artwork — everything you need to rewire your consciousness for abundance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-primary/20 rounded-lg px-6" data-testid="faq-guarantee">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Is this really just $4.95? Are there hidden costs?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, it's genuinely $4.95 with no hidden fees or recurring charges. This is a one-time payment for lifetime access to all materials. Clayton believes in making spiritual wisdom accessible to everyone, regardless of financial status. The regular value is $60.27, but this limited-time offer gives you 92% off.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-primary/20 rounded-lg px-6" data-testid="faq-results">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Will this meditation really help me with money?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  This meditation works at the level of consciousness and energy. Results vary by individual. While Clayton experienced profound financial transformation, this is a spiritual practice, not a financial guarantee. The meditation helps dissolve limiting beliefs, align with abundance consciousness, and open channels for prosperity — but it requires consistent practice and inner work.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-primary/20 rounded-lg px-6" data-testid="faq-time">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  How much time do I need to commit?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The meditation practice takes just 15-20 minutes per day. Consistency matters more than duration. Many students report shifts in consciousness within the first week, though deeper transformation unfolds over weeks and months of regular practice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-primary/20 rounded-lg px-6" data-testid="faq-beginner">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Do I need meditation experience?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Not at all! The guided meditation is designed for complete beginners while remaining powerful for experienced practitioners. Clayton provides clear, step-by-step guidance that makes the practice accessible to anyone, regardless of prior experience with meditation or spirituality.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-primary/20 rounded-lg px-6" data-testid="faq-religious">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Is this compatible with my religious beliefs?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  This meditation honors King Jesus and draws from esoteric Christian mysticism. While rooted in the teachings of Jesus, it's a spiritual practice focused on consciousness and divine connection. Many students from various backgrounds find it complements their existing spiritual path. Trust your intuition about whether this resonates with you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-primary/20 rounded-lg px-6" data-testid="faq-access">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  How do I access the materials after purchase?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Immediately after your $4.95 purchase, you'll receive a download link via email with instant access to all meditation audios, PDFs, journals, teachings, and the Spotify playlist link for the 4 podcast episodes. Everything is digital, so you can start your transformation right away.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border border-primary/20 rounded-lg px-6" data-testid="faq-mission">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  Where do proceeds go?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  100% of proceeds support building churches honoring King Jesus for global peace initiatives. Your investment in spiritual prosperity contributes to creating sacred spaces where humanity can reconnect with divine consciousness and work toward planetary peace.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'hsl(var(--section-divine-blue))' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 text-foreground">
              Ready to Transform Your Relationship with Prosperity?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Join 45+ students who are experiencing spiritual and financial breakthroughs with the King Jesus meditation
            </p>
            
            <Card className="p-8 md:p-12 border-primary/30 mb-8">
              <div className="space-y-6">
                <div className="flex items-baseline justify-center gap-4">
                  <span className="text-3xl md:text-4xl font-cinzel font-bold text-muted-foreground line-through">$60.27</span>
                  <span className="text-6xl md:text-7xl font-cinzel font-extrabold text-primary">$4.95</span>
                </div>
                <p className="text-2xl md:text-3xl text-destructive font-bold">
                  92% OFF — Don't Miss This
                </p>
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full text-lg md:text-2xl px-8 py-8 md:py-10 shadow-2xl hover:shadow-primary/50 transition-all animate-pulse font-bold"
                  onClick={handleCheckout}
                  data-testid="button-final-cta"
                >
                  <ButtonStar className="mr-2 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  <span className="whitespace-nowrap">YES! Transform My Life for $4.95</span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Instant access • Lifetime materials • Support global peace
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  <strong>Disclaimer:</strong> Results vary. This is a spiritual practice, not a financial guarantee.
                </p>
              </div>
            </Card>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>✓ Instant digital delivery</p>
              <p>✓ Complete meditation system</p>
              <p>✓ 4 podcast episodes via Spotify</p>
              <p>✓ Supporting global peace initiatives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
                    Privacy Policy
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Connect</h3>
                <a
                  href="https://instagram.com/claytoncuteri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-instagram"
                >
                  <Instagram className="w-5 h-5" />
                  @claytoncuteri
                </a>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
                <form onSubmit={handleEmailCapture} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    data-testid="input-footer-email"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={emailCaptureMutation.isPending}
                    data-testid="button-footer-subscribe"
                  >
                    {emailCaptureMutation.isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="text-center pt-8 border-t border-primary/20">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Clayton Cuteri. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                100% of proceeds support building churches honoring King Jesus for global peace initiatives
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
