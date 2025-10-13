// API routes with Stripe and ConvertKit integrations
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupSimpleAuth, isAdminAuthenticated } from "./simpleAuth";
import { insertTestimonialSchema, insertAnalyticsEventSchema, insertEmailLeadSchema, insertPurchaseSchema, insertPackageItemSchema, purchases } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { ObjectStorageService } from "./objectStorage";

// Stripe setup with automatic tax
// ✅ PRODUCTION MODE: Using LIVE Stripe keys
// To test with test cards, switch back to TESTING_STRIPE_SECRET_KEY
const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.TESTING_STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY or TESTING_STRIPE_SECRET_KEY');
}
const stripe = new Stripe(stripeKey, {
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
  // Setup simple password-based admin auth
  setupSimpleAuth(app);

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
      const validDonationAmounts = [5, 9, 10, 15, 25, 100, 200];
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
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!sig) {
        return res.status(400).send('Missing stripe-signature header');
      }

      // CRITICAL SECURITY: Verify webhook signature to prevent fake payment events
      let event;
      if (webhookSecret) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err: any) {
          console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      } else {
        // Fallback for development (not recommended for production)
        console.warn('⚠️ WARNING: STRIPE_WEBHOOK_SECRET not set - webhook signature not verified!');
        event = req.body;
      }

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

  // Confirm payment and update purchase status (webhook-less flow for test mode)
  app.post("/api/checkout/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }
      
      const purchase = await storage.getPurchaseByPaymentIntent(paymentIntentId);
      
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      
      // If already completed, return success
      if (purchase.status === "completed") {
        return res.json({ success: true, purchase });
      }
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ 
          message: "Payment not yet completed",
          status: paymentIntent.status 
        });
      }
      
      // Update purchase status to completed
      await storage.updatePurchaseStatus(purchase.id, "completed");
      purchase.status = "completed";
      
      // Send delivery email via ConvertKit
      let deliverySuccess = false;
      if (purchase.email && purchase.downloadToken) {
        try {
          deliverySuccess = await sendProductDeliveryEmail(purchase.email, purchase.name || undefined);
          console.log(`✅ Tagged ${purchase.email} for automated delivery`);
        } catch (error) {
          console.error("Error tagging subscriber for delivery:", error);
          // Don't fail the request if tagging fails - purchase is still completed
        }
      }
      
      // Track purchase analytics
      await storage.trackEvent({
        eventType: "purchase",
        eventData: { 
          purchaseId: purchase.id, 
          amount: purchase.amount,
          deliverySuccess,
        },
      });
      
      res.json({ success: true, purchase, deliverySuccess });
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Get purchase details by payment intent ID (for receipt display)
  app.get("/api/purchase/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      const purchase = await storage.getPurchaseByPaymentIntent(paymentIntentId);
      
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching purchase details" });
    }
  });

  // Get purchase and package items by download token (for download page)
  app.get("/api/download/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const purchase = await storage.getPurchaseByDownloadToken(token);
      
      if (!purchase) {
        return res.status(404).json({ message: "Invalid download link" });
      }

      // Only allow access to completed purchases
      if (purchase.status !== "completed") {
        return res.status(403).json({ message: "Download not available yet" });
      }
      
      // Get all visible package items
      const packageItems = await storage.getVisiblePackageItems();
      
      res.json({
        purchase,
        packageItems,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching download details" });
    }
  });

  // Admin API routes (protected)

  // Get analytics summary
  app.get("/api/admin/analytics", isAdminAuthenticated, async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });

  // Get all testimonials (admin)
  app.get("/api/admin/testimonials", isAdminAuthenticated, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Create testimonial (admin)
  app.post("/api/admin/testimonials", isAdminAuthenticated, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validated);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update testimonial (admin)
  app.put("/api/admin/testimonials/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validated);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update testimonial visibility (admin)
  app.patch("/api/admin/testimonials/:id", isAdminAuthenticated, async (req, res) => {
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
  app.delete("/api/admin/testimonials/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTestimonial(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Package items routes (admin)
  
  // Get all package items (admin)
  app.get("/api/admin/package-items", isAdminAuthenticated, async (req, res) => {
    try {
      const items = await storage.getAllPackageItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching package items" });
    }
  });

  // Get package items upload URL (admin)
  app.post("/api/admin/package-items/upload-url", isAdminAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getPackageContentUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating upload URL: " + error.message });
    }
  });

  // Create package item (admin)
  app.post("/api/admin/package-items", isAdminAuthenticated, async (req, res) => {
    try {
      const validated = insertPackageItemSchema.parse(req.body);
      const item = await storage.createPackageItem(validated);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update package item (admin)
  app.put("/api/admin/package-items/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertPackageItemSchema.partial().parse(req.body);
      const item = await storage.updatePackageItem(id, validated);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete package item (admin)
  app.delete("/api/admin/package-items/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePackageItem(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Public route to serve package content files from attached_assets
  // Note: Changed from /assets/ to /attached-assets/ to avoid conflict with Vite build assets
  app.get("/attached-assets/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = `${import.meta.dirname}/../attached_assets/${filename}`;
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error serving file:", err);
        res.status(404).json({ error: "File not found" });
      }
    });
  });

  // Public route to serve package content files from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
