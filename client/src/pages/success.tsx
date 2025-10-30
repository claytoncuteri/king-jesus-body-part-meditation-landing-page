import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Mail, Home, Receipt, Download } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Purchase } from "@shared/schema";

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
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Success() {
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const paymentIntentId = urlParams.get('payment_intent');

  // Confirm payment mutation
  const confirmPayment = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await apiRequest('POST', '/api/checkout/confirm-payment', { paymentIntentId });
      const data = await response.json() as { success: boolean; purchase: Purchase };
      return data;
    },
  });

  // Confirm payment when component mounts
  useEffect(() => {
    if (paymentIntentId && !confirmPayment.data && !confirmPayment.isPending) {
      confirmPayment.mutate(paymentIntentId);
    }
  }, [paymentIntentId]);

  // Get purchase from confirmation response
  const purchase = confirmPayment.data?.purchase;
  const isLoading = confirmPayment.isPending;

  useEffect(() => {
    // Track successful purchase
    if (purchase) {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "purchase",
          eventData: { status: "success", purchaseId: purchase.id },
        }),
      }).catch(console.error);
    }
  }, [purchase]);

  // Calculate totals
  const baseAmount = purchase?.amount || 4.95;
  const donationAmount = purchase?.donationAmount || 0;
  const totalAmount = baseAmount + donationAmount;
  const hasDonation = donationAmount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 md:p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" data-testid="icon-success" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-primary" data-testid="heading-success">
            Thank You for Your Purchase!
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Divine transformation begins now. Your spiritual journey awaits.
          </p>
        </div>

        {/* Download Link - Primary CTA */}
        {!isLoading && purchase?.downloadToken && (
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-6">
            <div className="text-center">
              <h2 className="font-bold text-2xl mb-3 text-primary">
                Access Your Meditation Package
              </h2>
              <p className="text-muted-foreground mb-6">
                Click below to download all your digital content now
              </p>
              <Link href={`/download/${purchase.downloadToken}`}>
                <Button
                  size="lg"
                  variant="default"
                  className="text-lg py-6 px-8"
                  data-testid="button-download-access"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download All Content
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                Save this link - you can download anytime!
              </p>
            </div>
          </div>
        )}

        {/* Email Confirmation */}
        <div className="bg-accent/50 border border-primary/20 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-bold text-lg mb-2">Check Your Email</h2>
              {isLoading ? (
                <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
              ) : purchase?.email ? (
                <p className="text-muted-foreground mb-3">
                  Download link also sent to:
                  <br />
                  <span className="font-semibold text-foreground" data-testid="text-delivery-email">
                    {purchase.email}
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground mb-3">
                  Download link will be emailed to you shortly.
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Your package includes:
              </p>
              <ul className="space-y-1 mt-2 text-sm text-muted-foreground">
                <li>• King Jesus Body Part Meditation Video</li>
                <li>• Money-Related Podcast Episodes</li>
                <li>• Gospel of Thomas - Volume I PDF</li>
                <li>• Reader's Notebook PDF</li>
                <li>• Meditation Journal Template</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="w-6 h-6 text-primary" />
            <h2 className="font-bold text-lg">Order Receipt</h2>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 bg-muted animate-pulse rounded" />
              <div className="h-5 bg-muted animate-pulse rounded" />
              <div className="h-6 bg-muted animate-pulse rounded mt-4" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Customer Information */}
              {(purchase?.name || purchase?.email) && (
                <div className="pb-3 mb-3 border-b border-border">
                  {purchase?.name && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium" data-testid="receipt-customer-name">{purchase.name}</span>
                    </div>
                  )}
                  {purchase?.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium" data-testid="receipt-customer-email">{purchase.email}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-border" data-testid="receipt-line-package">
                <div>
                  <p className="font-medium">King Jesus Meditation Package</p>
                  <p className="text-sm text-muted-foreground">Digital product bundle</p>
                </div>
                <span className="font-semibold">${baseAmount.toFixed(2)}</span>
              </div>

              {hasDonation && (
                <div className="flex justify-between items-center py-2 border-b border-border" data-testid="receipt-line-donation">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      Church of King Jesus Donation
                      <ButtonStar className="w-4 h-4 text-primary" />
                    </p>
                    <p className="text-sm text-muted-foreground">Supporting our mission</p>
                  </div>
                  <span className="font-semibold">${donationAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t-2 border-primary/30">
                <span className="text-lg font-bold">Total Paid</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-total-amount">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {hasDonation && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-center">
                    <span className="font-semibold">Thank you for your ${donationAmount.toFixed(2)} donation!</span>
                    <br />
                    <span className="text-muted-foreground">
                      100% of proceeds support building the Church of King Jesus
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social sharing */}
        <div className="space-y-4 text-center mb-8">
          <p className="text-lg font-semibold">
            Share your experience with{" "}
            <span className="text-secondary">#KingJesusMeditation</span>
          </p>
          <p className="text-muted-foreground">
            Post on Instagram and tag @claytoncuteri - I'll share your story with my 110K+ followers!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

        <p className="text-sm text-muted-foreground mt-8 text-center">
          Didn't receive the email? Check your spam folder or contact us at academyofindigoeducation@gmail.com
        </p>
      </Card>
    </div>
  );
}
