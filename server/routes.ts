// API routes with Stripe and ConvertKit integrations
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertTestimonialSchema, insertAnalyticsEventSchema, insertEmailLeadSchema, insertPurchaseSchema, purchases } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Stripe setup with automatic tax
if (!process.env.TESTING_STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: TESTING_STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

// ConvertKit setup
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

// Note: You'll need to set these in your environment variables
// Get CONVERTKIT_FORM_ID from your ConvertKit dashboard under Forms
// Get CONVERTKIT_PURCHASE_TAG_ID by creating a tag in ConvertKit and copying its ID
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || "";
const CONVERTKIT_PURCHASE_TAG_ID = process.env.CONVERTKIT_PURCHASE_TAG_ID || "";

async function sendToConvertKit(email: string, name?: string) {
  if (!CONVERTKIT_API_KEY) {
    console.warn("ConvertKit API key not configured");
    return;
  }

  if (!CONVERTKIT_FORM_ID) {
    console.warn("ConvertKit Form ID not configured - skipping lead capture");
    return;
  }

  try {
    // Proper ConvertKit API endpoint with form ID
    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        first_name: name,
        tags: ["From King Jesus body part form"],
      }),
    });

    if (!response.ok) {
      console.error("ConvertKit API error:", await response.text());
    } else {
      const data = await response.json();
      console.log("Successfully added to ConvertKit with tag 'From King Jesus body part form':", data);
    }
  } catch (error) {
    console.error("Failed to send to ConvertKit:", error);
  }
}

async function sendProductDeliveryEmail(email: string, name?: string) {
  if (!CONVERTKIT_API_SECRET) {
    console.warn("ConvertKit API secret not configured - skipping product delivery email");
    return false;
  }

  if (!CONVERTKIT_PURCHASE_TAG_ID) {
    console.warn("ConvertKit Purchase Tag ID not configured - skipping product delivery email");
    console.warn("Please create a tag in ConvertKit called 'Product Purchased - King Jesus Meditation' and add the Tag ID as CONVERTKIT_PURCHASE_TAG_ID environment variable");
    return false;
  }

  try {
    // Tag the subscriber with the purchase tag to trigger automation
    const tagResponse = await fetch(`https://api.convertkit.com/v3/tags/${CONVERTKIT_PURCHASE_TAG_ID}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        email,
        first_name: name,
        tags: ["Purchase King Jesus Body Part Meditation"],
      }),
    });

    if (!tagResponse.ok) {
      const errorText = await tagResponse.text();
      console.error(`ConvertKit tag subscription failed for ${email}:`, errorText);
      return false;
    }

    const tagData = await tagResponse.json();
    console.log(`Successfully tagged ${email} with "Purchase King Jesus Body Part Meditation":`, tagData);
    return true;
    
  } catch (error) {
    console.error(`Failed to tag subscriber ${email} for product delivery:`, error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes

  // Track analytics event
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const validated = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.trackEvent(validated);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get visible testimonials (public)
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getVisibleTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Create email lead
  app.post("/api/email-leads", async (req, res) => {
    try {
      const validated = insertEmailLeadSchema.parse(req.body);
      const lead = await storage.createEmailLead(validated);
      
      // Send to ConvertKit
      await sendToConvertKit(validated.email, validated.name || undefined);
      
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe payment route for one-time payment
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      // Validate and parse request body
      const purchaseData = insertPurchaseSchema.parse({
        email: req.body.email || "",
        name: req.body.name || "",
        amount: req.body.amount,
        currency: "usd",
        status: "pending",
      });
      
      // Create purchase record
      const purchase = await storage.createPurchase(purchaseData);

      // Create payment intent (card only)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(purchaseData.amount * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          purchaseId: purchase.id,
          email: purchaseData.email,
        },
      });

      // Update purchase with Stripe payment intent ID
      await db.update(purchases)
        .set({ stripePaymentIntentId: paymentIntent.id })
        .where(eq(purchases.id, purchase.id));

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Update payment intent with donation upsell
  app.post("/api/update-payment-intent", async (req, res) => {
    try {
      const { paymentIntentId, donationAmount } = req.body;
      
      // Validate donation amount - must be one of the preset values
      const validDonationAmounts = [5, 10, 15, 25, 100, 200];
      if (!validDonationAmounts.includes(donationAmount)) {
        return res.status(400).json({ 
          message: "Invalid donation amount. Please select a valid option.",
          type: "validation_error"
        });
      }
      
      // Find the purchase record
      const purchase = await storage.getPurchaseByPaymentIntent(paymentIntentId);
      
      if (!purchase) {
        return res.status(404).json({ 
          message: "Purchase not found",
          type: "not_found"
        });
      }

      // Check if donation already added (prevent duplicate donations)
      if (purchase.donationAmount && purchase.donationAmount > 0) {
        return res.status(400).json({ 
          message: "Donation already added to this purchase",
          type: "duplicate_donation"
        });
      }

      // Calculate new total amount (base price + donation)
      const newTotalAmount = purchase.amount + donationAmount;

      // Update the payment intent amount
      try {
        const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
          amount: Math.round(newTotalAmount * 100), // Convert to cents
        });

        // Update purchase record with donation amount only (keep original amount)
        await db.update(purchases)
          .set({ 
            donationAmount: donationAmount,
          })
          .where(eq(purchases.id, purchase.id));

        res.json({ 
          success: true, 
          newTotal: newTotalAmount,
          clientSecret: updatedPaymentIntent.client_secret 
        });
      } catch (stripeError: any) {
        // Handle Stripe-specific errors
        if (stripeError.type === 'StripeInvalidRequestError') {
          return res.status(400).json({ 
            message: "Unable to update payment. Please start checkout again.",
            type: "stripe_error"
          });
        }
        throw stripeError;
      }
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error updating payment intent: " + error.message,
        type: "server_error"
      });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      
      if (!sig) {
        return res.status(400).send('Missing stripe-signature header');
      }

      const event = req.body;

      // Handle the event
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Find purchase by payment intent ID
        const purchase = await storage.getPurchaseByPaymentIntent(paymentIntent.id);
        
        if (purchase) {
          // Update purchase status
          await storage.updatePurchaseStatus(purchase.id, "completed");
          
          // Send delivery email via ConvertKit (tag subscriber to trigger automation)
          const deliverySuccess = await sendProductDeliveryEmail(purchase.email, purchase.name || undefined);
          
          if (!deliverySuccess) {
            console.error(`CRITICAL: Product delivery failed for purchase ${purchase.id}, email: ${purchase.email}`);
            console.error("Customer paid but did not receive product delivery email!");
            console.error("Manual action required: Send products to", purchase.email);
          }
          
          // Add to email list (separate from delivery)
          await sendToConvertKit(purchase.email, purchase.name || undefined);
          
          // Track purchase event
          await storage.trackEvent({
            eventType: "purchase",
            eventData: { 
              purchaseId: purchase.id, 
              amount: purchase.amount,
              deliverySuccess,
            },
          });
        } else {
          console.error(`Purchase not found for payment intent: ${paymentIntent.id}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  // Admin API routes (protected)

  // Get analytics summary
  app.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });

  // Get all testimonials (admin)
  app.get("/api/admin/testimonials", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Create testimonial (admin)
  app.post("/api/admin/testimonials", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validated);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update testimonial visibility (admin)
  app.patch("/api/admin/testimonials/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isVisible } = req.body;
      const testimonial = await storage.updateTestimonialVisibility(id, isVisible);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete testimonial (admin)
  app.delete("/api/admin/testimonials/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTestimonial(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
