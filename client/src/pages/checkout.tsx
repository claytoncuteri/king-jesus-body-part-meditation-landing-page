// Stripe checkout page for one-time payment - based on javascript_stripe blueprint
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { UpsellDialog } from "@/components/upsell-dialog";

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

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, confirmEmail, name, paymentIntentId }: { email: string; confirmEmail: string; name: string; paymentIntentId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [currentTotal, setCurrentTotal] = useState(4.95);
  const [isDonationProcessing, setIsDonationProcessing] = useState(false);
  const [hasConfirmedPayment, setHasConfirmedPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace for validation
    const trimmedEmail = email.trim();
    const trimmedConfirmEmail = confirmEmail.trim();

    if (!trimmedEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email to continue",
        variant: "destructive",
      });
      return;
    }

    if (trimmedEmail !== trimmedConfirmEmail) {
      toast({
        title: "Emails do not match",
        description: "Please make sure both email fields match",
        variant: "destructive",
      });
      return;
    }

    if (!stripe || !elements || isProcessing) {
      return;
    }

    // Validate payment element before showing upsell
    const { error: submitError } = await elements.submit();
    
    if (submitError) {
      // Stripe will automatically show the error in the payment element
      // No need to show a toast - the error is already displayed inline
      return;
    }

    // If validation passes, show upsell dialog
    setShowUpsell(true);
  };

  const handleDonationSelected = async (donationAmount: number) => {
    if (isDonationProcessing || hasConfirmedPayment) {
      return; // Prevent duplicate processing
    }

    setIsDonationProcessing(true);
    setShowUpsell(false);
    setIsProcessing(true);

    try {
      // Update payment intent with donation amount
      const response = await apiRequest("POST", "/api/update-payment-intent", {
        paymentIntentId,
        donationAmount,
      });

      const data = await response.json() as { newTotal: number; type?: string };

      setCurrentTotal(data.newTotal);

      toast({
        title: "Thank you!",
        description: `$${donationAmount} donation added to King Jesus Church`,
      });

      // Proceed with payment confirmation
      await confirmPayment();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to add donation";
      const errorType = error.type;

      // Handle specific error types
      if (errorType === "duplicate_donation") {
        toast({
          title: "Donation Already Added",
          description: "Your donation has already been added. Proceeding with payment.",
        });
        await confirmPayment();
      } else if (errorType === "stripe_error") {
        toast({
          title: "Payment Update Failed",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        setIsDonationProcessing(false);
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsProcessing(false);
        setIsDonationProcessing(false);
      }
    }
  };

  const handleDecline = async () => {
    if (hasConfirmedPayment) {
      return; // Prevent duplicate confirmation
    }

    setShowUpsell(false);
    setIsProcessing(true);
    await confirmPayment();
  };

  const confirmPayment = async () => {
    if (!stripe || !elements || hasConfirmedPayment) {
      return;
    }

    setHasConfirmedPayment(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing your payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setIsDonationProcessing(false);
      setHasConfirmedPayment(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button
          type="submit"
          size="lg"
          variant="destructive"
          className="w-full text-lg py-6"
          disabled={!stripe || isProcessing || !email || !confirmEmail || email.trim() !== confirmEmail.trim()}
          data-testid="button-complete-purchase"
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              <ButtonStar className="mr-2 h-5 w-5" />
              Complete Purchase - ${currentTotal.toFixed(2)}
            </>
          )}
        </Button>
      </form>
      
      <UpsellDialog 
        open={showUpsell}
        onSelectDonation={handleDonationSelected}
        onDecline={handleDecline}
        isProcessing={isDonationProcessing}
      />
    </>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Auto-create payment intent on page load
  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsCreating(true);
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount: 4.95,
          email: "",
          name: "",
        });
        
        const data = await response.json() as { clientSecret: string };
        
        if (!data || !data.clientSecret) {
          throw new Error("Failed to create payment intent");
        }
        
        setClientSecret(data.clientSecret);
        // Extract payment intent ID from client secret (format: pi_xxx_secret_yyy)
        const piId = data.clientSecret.split('_secret_')[0];
        setPaymentIntentId(piId);
      } catch (error: any) {
        console.error("Payment initialization error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      } finally {
        setIsCreating(false);
      }
    };
    
    createPaymentIntent();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-center">
            Complete Your Purchase
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            You're moments away from divine transformation
          </p>

          {/* Order Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 text-center border-b border-primary/20 pb-2">Order Summary</h3>
            
            {/* Itemized List */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">King Jesus Body Part Meditation Video</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-chalk line-through decoration-green-600">$19.99</span>
                  <span className="text-primary font-chalk text-sm font-bold">$4.95</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Money-Related Podcast Episodes</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-chalk line-through decoration-green-600">$14.99</span>
                  <span className="text-green-600 font-chalk text-sm font-bold -rotate-2">FREE</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gospel of Thomas - Volume I (Verses 1-10)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-chalk line-through decoration-green-600">$9.99</span>
                  <span className="text-green-600 font-chalk text-sm font-bold -rotate-2">FREE</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reader's Notebook for Gospel of Thomas</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-chalk line-through decoration-green-600">$5.31</span>
                  <span className="text-green-600 font-chalk text-sm font-bold -rotate-2">FREE</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Meditation Journal Template</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-chalk line-through decoration-green-600">$9.99</span>
                  <span className="text-green-600 font-chalk text-sm font-bold -rotate-2">FREE</span>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="border-t border-primary/20 pt-3 mb-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Subtotal (Regular Price):</span>
                <span>$60.27</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="font-semibold">Discount:</span>
                <span className="text-green-600 font-bold">-$55.32</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-primary/30 pt-3">
              <div className="flex justify-between items-center text-2xl font-cinzel font-bold text-primary">
                <span>Total Today:</span>
                <span>$4.95</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Sales tax calculated automatically based on your location
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg p-6"
                data-testid="input-checkout-email"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Digital products will be sent to this email
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Email *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className="text-lg p-6"
                data-testid="input-checkout-confirm-email"
              />
              {confirmEmail && email.trim() !== confirmEmail.trim() && (
                <p className="text-sm text-destructive mt-1">
                  Emails do not match
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name (optional)</label>
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg p-6"
                data-testid="input-checkout-name"
              />
            </div>
          </div>

          {/* Payment Element */}
          {!clientSecret || isCreating ? (
            <div className="space-y-6">
              <div className="h-32 bg-muted/20 border border-muted rounded-lg flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading payment form...</p>
                </div>
              </div>
              <Button
                type="button"
                size="lg"
                variant="destructive"
                className="w-full text-lg py-6"
                disabled
                data-testid="button-complete-purchase"
              >
                Complete Purchase - $4.95
              </Button>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                email={email} 
                confirmEmail={confirmEmail}
                name={name} 
                paymentIntentId={paymentIntentId} 
              />
            </Elements>
          )}

          <p className="text-xs text-center text-muted-foreground mt-6">
            Secure payment processed by Stripe. Your information is encrypted and safe.
          </p>
        </Card>
      </div>
    </div>
  );
}
