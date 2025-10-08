// Stripe checkout page for one-time payment - based on javascript_stripe blueprint
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-purchase"
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Complete Purchase - $4.95
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to continue",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const data = await apiRequest("POST", "/api/create-payment-intent", {
        amount: 4.95,
        email,
        name,
      });
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!clientSecret) {
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
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-center">
              Complete Your Purchase
            </h1>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">King Jesus Meditation Package</span>
                <span className="text-muted-foreground line-through">$60.27</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-cinzel font-bold text-primary">
                <span>Total:</span>
                <span>$4.95</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Sales tax will be calculated automatically based on your location
              </p>
            </div>

            <div className="space-y-4">
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
              <Button
                size="lg"
                className="w-full text-lg py-6"
                onClick={createPaymentIntent}
                disabled={isCreating || !email}
                data-testid="button-proceed-payment"
              >
                {isCreating ? "Loading..." : "Proceed to Payment"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-payment">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="max-w-2xl mx-auto p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-center">
            Secure Payment
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            You're moments away from divine transformation
          </p>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">King Jesus Meditation Package</span>
              <span className="text-muted-foreground line-through">$60.27</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-cinzel font-bold text-primary">
              <span>Total:</span>
              <span>$4.95</span>
            </div>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Secure payment processed by Stripe. Your information is encrypted and safe.
          </p>
        </Card>
      </div>
    </div>
  );
}
